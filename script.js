
let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
  lang: localStorage.getItem('lang') || (tg?.initDataUnsafe?.user?.language_code?.startsWith('ru') ? 'ru' : 'en'),
};

// const ADMIN_IDS = [707309709, 1046929828]; 

const tg = window.Telegram?.WebApp;
tg?.expand();
document.documentElement.dataset.theme = tg?.colorScheme === 'dark' ? 'dark' : 'light';
tg?.onEvent('themeChanged', () => {
  document.documentElement.dataset.theme = tg?.colorScheme === 'dark' ? 'dark' : 'light';
});
const telegramUser = tg?.initDataUnsafe?.user;
const telegramId = telegramUser?.id;
const registrationForm = document.getElementById("registration-form");
const nicknameInput = document.getElementById("nickname-input");
const registrationError = document.getElementById("registration-error");

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  try {
    registrationError.classList.add("hidden");
    console.log("🚀 Начало процесса регистрации/авторизации...");
    const userData = await ApiClient.registerOrGetUser(telegramId, nickname);
    appState.userId=userData.userId;
    appState.userNickname=userData.nickname;
    appState.points=userData.points;
    console.log("✅ Пользователь вошёл:", appState);
    showState('waiting');
  } catch (err) {
    console.error("❌ Ошибка входа:", err);
    registrationError.textContent = err.message;
    registrationError.classList.remove("hidden");
  }
});

function showState(state) {
  // 1. Сначала скрываем все экраны
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  
  // 2. Находим элемент (экран) по id, например state-registration, state-admin, state-waiting
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");

  // 3. Ищем внутри выбранного экрана все элементы, у которых id заканчивается на "nickname"
  const nicknameElements = el.querySelectorAll("[id$='nickname']");
  nicknameElements.forEach(elm => {
    // Записываем в них nickname из текущего состояния приложения
    elm.textContent = appState.userNickname;
  });
  
  // 4. Обновляем текущее состояние приложения
  appState.currentState = state;
}

function shuffle(input) {
  const a = Array.isArray(input) ? input.slice() : [input]; // защита
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----------------- Функция перехода к следующей фазе события -----------------
async function finishGamePhase() {
  try {
    const event_id = await getActiveEventId(telegramId);
    let phase= await ApiClient.getEventStatus(event_id, telegramId);
    if (phase.game_status === "finished") {
      showState("finished");
    } else if (phase.game_status === "registration") {
      showState("registration");
    } else {
      showState("waiting-results");
    }
  } catch (e) {
    console.error("Ошибка завершения фазы:", e);
    document.getElementById("admin-notification").textContent = "Ошибка завершения фазы: " + e.message;
  }
}

let gameStarted = false; // 🧠 глобальный флаг


let questionIndex = 0;
let questions = [];
let intervalId = null;
let gameTimer = null;     
let currentLang = appState.lang;

// ----------------- Автоматическая проверка статуса и старт игры -----------------
async function checkAndStartGame() {
  // если мы ждём результаты или уже всё завершено — ничего не делаем
  if (appState.currentState === 'waiting-results' || appState.currentState === 'finished') return;

  try {
    const event_id = await getActiveEventId(telegramId);
    const eventStatus = await ApiClient.getEventStatus(event_id, telegramId);
    const quizzes = await ApiClient.listQuizzes(event_id);
    const activeQuiz = quizzes.find(q => q.is_active);

    if (eventStatus.game_status === "started" && activeQuiz) {
      if (appState.currentState !== 'game' && appState.currentState !== 'game-open') {
        console.log("🎯 Активный квиз:", activeQuiz);

        // 🔹 Загружаем вопросы с бэка
        const rawQuestions = await ApiClient.listQuestions(activeQuiz.id, currentLang, true, telegramId);
        const preparedQuestions = rawQuestions.map(q => ({
          ...q,
          quiz_id: activeQuiz.id
        }));
        
        questions = shuffle(preparedQuestions).slice(0, 10);
        questionIndex = 0;

        const firstType = questions[0]?.type;
        showState(firstType === "open" ? "game-open" : "game");
        nextQuestion();
      }
    } else {
      if (appState.currentState !== 'waiting') showState("waiting");
    }
  } catch (e) {
    console.error("Ошибка при запуске игры:", e);
    const adminEl = document.getElementById("admin-notification");
    if (adminEl) adminEl.textContent = "Ошибка: " + e.message;
  }
}

function qText(q) {
  return q?.text || "";
}

function qOptions(q) {
  return Array.isArray(q?.options) ? q.options : [];
}

// Пока бекенд не отдаёт is_correct
function qCorrect(q) {
  return [];
}


function renderOptions(options) {
  const container = qs("options");
  if (!container) return;
  container.innerHTML = "";
  options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "answer-option";
    btn.dataset.index = i;
    btn.textContent = opt;
    btn.onclick = () => handleOptionClick(i);
    container.appendChild(btn);
  });
}

async function getActiveEventId(telegramId) {
  try {
    const events = await ApiClient.listEvents(telegramId);
    if (!events || !events.length) throw new Error("Нет доступных событий");

    // 🔹 1. Сначала пробуем найти начатое
    const active = events.find(e => e.game_status === "started");
    if (active) return active.id;

    // 🔹 2. Если нет начатых — возвращаем с максимальным id
    const latest = events.reduce((max, e) => e.id > max.id ? e : max, events[0]);
    return latest.id;
  } catch (err) {
    console.error("❌ Ошибка при получении event_id:", err);
    return 1; // fallback
  }
}


async function handleOptionClick(index) {
  const q = questions[questionIndex];
  const options = qOptions(q);
  const chosen = options[index];
  const selectedBtn = document.querySelector(`.answer-option[data-index="${index}"]`);

  document.querySelectorAll(".answer-option").forEach(btn => btn.classList.add("disabled"));

  try {
    const res = await ApiClient.sendAnswer(
      telegramId,
      q.id,         // question_id
      q.quiz_id ?? 1,  // quiz_id — если нет в вопросе, подставь 1
      [chosen],
      currentLang
    );
    console.log("✅ Ответ отправлен:", res);
    selectedBtn.classList.add("correct");
  } catch (err) {
    console.error("Ошибка при отправке:", err);
    selectedBtn.classList.add("correct");
  }

  setTimeout(() => {
    questionIndex++;
    nextQuestion();
  }, 1500);
}


function qs(id) {
  return document.querySelector(`#state-${appState.currentState} #${id}`);
}
function qsa(sel) {
  return document.querySelectorAll(`#state-${appState.currentState} ${sel}`);
}

function nextQuestion() {
  if (questionIndex >= questions.length) {
    if (gameTimer) clearTimeout(gameTimer);
    if (intervalId) clearInterval(intervalId);
    finishGamePhase(event_id);
    return;
  }

  const q = questions[questionIndex];

  const qTextEl = qs("question-text");
  const curEl   = qs("current-q");
  const totEl   = qs("total-qs");
  const timerEl = qs("question-timer");
  if (!qTextEl || !curEl || !totEl || !timerEl) return;

  qTextEl.textContent = qText(q, currentLang);
  curEl.textContent = String(questionIndex + 1);
  totEl.textContent = String(questions.length);

  let timer = Number(q.duration_seconds) > 0 ? Number(q.duration_seconds) : 15;
  const fmt = s => `00:${s < 10 ? '0' + s : s}`;
  timerEl.textContent = fmt(timer);

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = fmt(timer);
    if (timer <= 0) { clearInterval(intervalId); questionIndex++; nextQuestion(); }
  }, 1000);

  if (q.type === "single") {
    renderOptions(qOptions(q, currentLang));
  } else { // open
    const textarea = qs("answer-textarea");
    const submitBtn = qs("submit-answer-btn");
    if (textarea && submitBtn) {
      submitBtn.disabled = false;
      submitBtn.onclick = async () => {
        submitBtn.disabled = true;
        await ApiClient.sendAnswer(telegramId, q.id, q.quiz_id, [textarea.value], currentLang);
        setTimeout(() => { questionIndex++; nextQuestion(); }, 1000);
      };
    }
  }
}

function logout() {
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');
}

document.addEventListener("DOMContentLoaded", () => {
  const ru = document.getElementById('lang-ru');
  const en = document.getElementById('lang-en');
  if (ru && en) {
    (appState.lang === 'ru' ? ru : en).checked = true;
  }

  setInterval(async () => {
    try {
      checkAndStartGame();
    } catch (e) {
      console.error("Ошибка проверки статуса игры:", e);
    }
  }, 5000);
});

