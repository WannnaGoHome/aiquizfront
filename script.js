// ==== Telegram WebApp и тема ====
const tg = window.Telegram?.WebApp;
tg?.expand();

function applyTheme() {
  document.documentElement.dataset.theme = tg?.colorScheme === 'dark' ? 'dark' : 'light';
}
applyTheme();
tg?.onEvent('themeChanged', applyTheme);

// ==== Пользователь Telegram ====
const telegramUser = tg?.initDataUnsafe?.user;
const telegramId = telegramUser?.id;

// ==== I18N словарь ====
const I18N = {
  ru: {
    app: { title: "🎯 Квиз-игра" },
    registration: {
      subtitle: "Зарегистрируйтесь для участия. Введите ваше имя и фамилию:",
      nickname_ph: "Введите никнейм",
      choose_lang: "Выберите язык / Select language",
      lang_ru: "Русский",
      lang_en: "English",
      join_btn: "Участвовать!"
    },
    waiting: {
      title: "Ожидаем начала игры",
      nickname_label: "Ваш никнейм:",
      wait_text: "Как только админ запустит игру, здесь появится первый вопрос. Оставайтесь на связи!"
    },
    waiting_results: {
      title: "Ожидаем…",
      nickname_label: "Ваш никнейм:",
      text: "Как только игра завершится, произойдёт подсчёт очков и объявление результатов этого этапа!"
    },
    common: {
      logout: "Выйти и сменить"
    },
    game: {
      question_label: "Вопрос",
      loading_question: "Текст текущего вопроса загружается...",
      answer_ph: "Введите ваш развернутый ответ здесь...",
      submit: "Отправить ответ"
    },
    between: {
      title: "Ответ принят!",
      next_in: "Следующий вопрос появится через <span id=\"between-timer\">5</span> секунд...",
      stay_tuned: "Оставайтесь с нами! Вы стали на шаг ближе к победе..."
    },
    finished: {
      title: "Игра завершена!",
      thanks: "Спасибо за ваши ответы и участие!",
      processing: "Сейчас наш ИИ-ассистент анализирует результаты. Итоги и список победителей будут опубликованы здесь позже."
    },
    winner: {
      title: "Поздравляем!",
      text: "Ваши ответы были одними из самых лучших! Вы вошли в число победителей!",
      prize_title: "Ваш приз:",
      prize_text: "Подойдите к стойке организаторов на первом этаже и назовите свой никнейм <strong id=\"winner-nickname\"></strong> для получения заслуженной награды.",
      thanks_again: "Еще раз спасибо за участие!"
    }
  },
  en: {
    app: { title: "🎯 Quiz Game" },
    registration: {
      subtitle: "Register to join. Enter your first and last name:",
      nickname_ph: "Enter nickname",
      choose_lang: "Select language / Выберите язык",
      lang_ru: "Русский",
      lang_en: "English",
      join_btn: "Join!"
    },
    waiting: {
      title: "Waiting to start",
      nickname_label: "Your nickname:",
      wait_text: "As soon as the admin starts the game, the first question will appear here. Stay tuned!"
    },
    waiting_results: {
      title: "Waiting…",
      nickname_label: "Your nickname:",
      text: "When the game ends, we'll count the points and announce the stage results!"
    },
    common: {
      logout: "Log out"
    },
    game: {
      question_label: "Question",
      loading_question: "Loading the current question...",
      answer_ph: "Type your detailed answer here...",
      submit: "Submit answer"
    },
    between: {
      title: "Answer received!",
      next_in: "Next question in <span id=\"between-timer\">5</span> sec...",
      stay_tuned: "Stay with us! You are one step closer to victory..."
    },
    finished: {
      title: "Game finished!",
      thanks: "Thanks for your answers and participation!",
      processing: "Our AI assistant is analyzing results. Winners will be published here soon."
    },
    winner: {
      title: "Congratulations!",
      text: "Your answers were among the best! You made it to the winners!",
      prize_title: "Your prize:",
      prize_text: "Please come to the organizers' desk on the first floor and say your nickname <strong id=\"winner-nickname\"></strong> to receive the prize.",
      thanks_again: "Thanks again for participating!"
    }
  }
};

// Утилиты i18n
const t = (keyPath, lang) => {
  const l = lang || (window.appState?.lang) || 'ru';
  return keyPath.split('.').reduce((acc, k) => acc?.[k], I18N[l]) ?? '';
};

// Применение переводов к DOM
function applyTranslations(root = document) {
  const lang = appState.lang || 'ru';

  // data-i18n (innerHTML)
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, lang);
    if (val) el.innerHTML = val;
  });

  // data-i18n-placeholder
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key, lang);
    if (val) el.setAttribute('placeholder', val);
  });

  // Заголовок страницы — всегда просто выставляем
  document.title = t('app.title', lang);

  // Строка "Вопрос X/Y" — строим заново на текущем экране
  updateQuestionProgressLabel();
}


// Отрисовка "Вопрос/Question X/Y"
function updateQuestionProgressLabel() {
  const container = document.querySelector(`#state-${appState.currentState} #question-progress`);
  const curEl = document.querySelector(`#state-${appState.currentState} #current-q`);
  const totEl = document.querySelector(`#state-${appState.currentState} #total-qs`);
  if (!container) return;

  const current = curEl ? curEl.textContent : '1';
  const total = totEl ? totEl.textContent : '1';
  container.innerHTML = `${t('game.question_label')} <span id="current-q">${current}</span>/<span id="total-qs">${total}</span>`;
}

// ==== Состояние приложения ====
let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
  lang: localStorage.getItem('lang') || (tg?.initDataUnsafe?.user?.language_code?.startsWith('ru') ? 'ru' : 'en'),
};

function syncHtmlLang() {
  const lang = appState.lang || 'ru';
  document.documentElement.lang = lang;
  document.documentElement.dir = ['ar','he','fa','ur'].includes(lang) ? 'rtl' : 'ltr';
}
syncHtmlLang();
applyTranslations(document); // первичное применение переводов

// ==== Элементы регистрации ====
const registrationForm = document.getElementById("registration-form");
const nicknameInput = document.getElementById("nickname-input");
const registrationError = document.getElementById("registration-error");

// Живое переключение языка до регистрации
document.addEventListener('change', (e) => {
  if (e.target && e.target.name === 'lang') {
    appState.lang = e.target.value.toLowerCase();
    localStorage.setItem('lang', appState.lang);
    syncHtmlLang();
    applyTranslations(document);
  }
});

// registrationForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const nickname = nicknameInput.value.trim();
//   const lang = (new FormData(registrationForm).get('lang') || appState.lang || 'ru').toLowerCase();
//   if (!nickname) return;

//   try {
//     registrationError.classList.add("hidden");
//     console.log("🚀 Начало процесса регистрации/авторизации...");

//     const userData = await ApiClient.registerOrGetUser(telegramId, nickname);

//     appState.userId = userData.userId;
//     appState.userNickname = userData.nickname;
//     appState.points = userData.points;
//     appState.lang = lang;
//     localStorage.setItem('lang', appState.lang);
//     syncHtmlLang();
//     applyTranslations(document);

//     console.log("✅ Пользователь вошёл:", appState);
//     showState('waiting');
//   } catch (err) {
//     console.error("❌ Ошибка входа:", err);
//     registrationError.textContent = err.message;
//     registrationError.classList.remove("hidden");
//   }
// });

// ==== Навигация по экранам ====

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  const lang = (new FormData(registrationForm).get('lang') || appState.lang || 'ru').toLowerCase();
  if (!nickname) return;

  try {
    registrationError.classList.add("hidden");
    console.log("🚀 Начало процесса регистрации/авторизации...");

    const userData = await ApiClient.registerOrGetUser(telegramId, nickname);

    appState.userId = userData.id;
    appState.userNickname = userData.nickname;
    appState.points = userData.points;
    appState.lang = lang;

    localStorage.setItem('lang', appState.lang);
    syncHtmlLang();
    applyTranslations(document);

    console.log("✅ Пользователь вошёл:", appState);

    showState('waiting');   // показываем ожидание только после успешной регистрации
    startPolling();         // запускаем авто-проверку статуса только для зарегистрированного
  } catch (err) {
    console.error("❌ Ошибка входа:", err);
    registrationError.textContent = err.message;
    registrationError.classList.remove("hidden");
  }
});

// function showState(state) {
//   document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));

//   const el = document.getElementById(`state-${state}`);
//   if (el) el.classList.remove("hidden");

//   const nicknameElements = el?.querySelectorAll("[id$='nickname']") || [];
//   nicknameElements.forEach(elm => { elm.textContent = appState.userNickname; });

//   appState.currentState = state;

//   // Применяем перевод к новому экрану
//   applyTranslations(el);
// }

// ==== Вспомогательные ====

function showState(state) {
  // Скрываем все экраны
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));

  // Показываем нужный экран
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");

  // Аккуратно подставляем ник (без "null"/"undefined")
  const nicknameElements = el?.querySelectorAll("[id$='nickname']") || [];
  nicknameElements.forEach(elm => {
    elm.textContent = appState.userNickname || '';
  });

  // Фиксируем текущее состояние
  appState.currentState = state;

  // Применяем переводы к новому экрану
  applyTranslations(el);
}

function shuffle(input) {
  const a = Array.isArray(input) ? input.slice() : [input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==== Завершение фазы ====
async function finishGamePhase() {
  try {
    const event_id = await getActiveEventId(telegramId);
    let phase = await ApiClient.getEventStatus(event_id, telegramId);
    if (phase.status === "finished") {
      showState("finished");
    } else if (phase.status === "registration") {
      showState("registration");
    } else {
      showState("waiting-results");
    }
  } catch (e) {
    console.error("Ошибка завершения фазы:", e);
    const adminEl = document.getElementById("admin-notification");
    if (adminEl) adminEl.textContent = "Ошибка завершения фазы: " + e.message;
  }
}

let gameStarted = false;
let questionIndex = 0;
let questions = [];
let intervalId = null;
let gameTimer = null;
let currentLang = appState.lang;
// === Пуллинг статуса игры (старт/стоп по факту регистрации) ===
let pollId = null;

function startPolling() {
  if (pollId) return;
  pollId = setInterval(() => {
    checkAndStartGame().catch(e => console.error("Ошибка проверки статуса игры:", e));
  }, 5000);
}

function stopPolling() {
  if (pollId) { clearInterval(pollId); pollId = null; }
}


async function checkAndStartGame() {
  if (!appState.userId) return;
  if (appState.currentState === 'waiting-results' || appState.currentState === 'finished') return;

  try {
    const event_id = await getActiveEventId(telegramId);
    const eventStatus = await ApiClient.getEventStatus(event_id, telegramId);

    // нормализуем статус
    const status = String(eventStatus?.status || '').trim().toLowerCase();

    const quizzes = await ApiClient.listQuizzes(event_id);
    // ищем активный квиз по нескольким признакам
    const activeQuiz = quizzes.find(q =>
      q?.is_active === true ||
      String(q?.is_active).trim() === '1' ||
      String(q?.status || '').trim().toLowerCase() === 'active' ||
      String(q?.state  || '').trim().toLowerCase() === 'active'
    );

    console.log('status=', status, 'activeQuiz=', activeQuiz);

    if (status === "started" && activeQuiz) {
      if (appState.currentState !== 'game' && appState.currentState !== 'game-open') {
        currentLang = appState.lang;

        const rawQuestions = await ApiClient.listQuestions(activeQuiz.id, currentLang, true, telegramId);
        // удаляем дубли по id
        const seen = new Set();
        const unique = [];
        for (const q of rawQuestions || []) {
          if (q && !seen.has(q.id)) { seen.add(q.id); unique.push(q); }
        }
        const preparedQuestions = unique.map(q => ({ ...q, quiz_id: activeQuiz.id }));

        questions = shuffle(preparedQuestions).slice(0, 10);
        questionIndex = 0;
        askedQuestionIds.clear();

        if (!questions.length) {
          console.warn('Нет вопросов для активного квиза');
          showState('waiting'); // или оставить текущий экран
          return;
        }

        const firstType = questions[0]?.type;
        showState(firstType === "open" ? "game-open" : "game");
        nextQuestion();
      }
    } else {
      if (appState.currentState !== 'waiting' && appState.currentState !== 'registration') {
        showState("waiting");
      }
    }
  } catch (e) {
    console.error("Ошибка при запуске игры:", e);
    const adminEl = document.getElementById("admin-notification");
    if (adminEl) adminEl.textContent = "Ошибка: " + e.message;
  }
}



// ==== Получение текста/опций вопроса с учетом локали ====
function qText(q) {
  const lang = appState.lang || 'ru';
  return q?.text_i18n?.[lang] ?? q?.text ?? "";
}
function qOptions(q) {
  const lang = appState.lang || 'ru';
  return Array.isArray(q?.options_i18n?.[lang])
    ? q.options_i18n[lang]
    : Array.isArray(q?.options) ? q.options : [];
}
function qCorrect(q) { return []; } // заглушка

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

    const active = events.find(e => String(e?.status || '').trim().toLowerCase() === "started");
    if (active) return active.id;

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
      q.id,
      q.quiz_id ?? 1,
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

// какие вопросы уже показывали (для защиты от повторов)
const askedQuestionIds = new Set();


// ==== Переход к следующему вопросу ====
function nextQuestion() {
  // пропускаем уже показанные вопросы (на всякий случай)
  while (questionIndex < questions.length && askedQuestionIds.has(questions[questionIndex]?.id)) {
    questionIndex++;
  }

  if (questionIndex >= questions.length) {
    if (gameTimer) clearTimeout(gameTimer);
    if (intervalId) clearInterval(intervalId);
    finishGamePhase();
    return;
  }

  const q = questions[questionIndex];
  // помечаем текущий вопрос как показанный
  if (q?.id != null) askedQuestionIds.add(q.id);

  const qTextEl = qs("question-text");
  const curEl   = qs("current-q");
  const totEl   = qs("total-qs");
  const timerEl = qs("question-timer");
  if (!qTextEl || !curEl || !totEl || !timerEl) return;

  // Заголовок/строка «Вопрос X/Y» на текущем языке
  curEl.textContent = String(questionIndex + 1);
  totEl.textContent = String(questions.length);
  updateQuestionProgressLabel();

  qTextEl.textContent = qText(q, currentLang);

  // 25 секунд на вопрос
  let timer = Number(q?.duration_seconds) > 0 ? Number(q.duration_seconds) : 25;
  const fmt = s => `00:${s < 10 ? '0' + s : s}`;
  timerEl.textContent = fmt(timer);

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = fmt(timer);
    if (timer <= 0) {
      clearInterval(intervalId);
      questionIndex++;
      nextQuestion();
    }
  }, 1000);

  if (q.type === "single") {
    renderOptions(qOptions(q, currentLang));
  } else { // open
    const textarea = qs("answer-textarea");
    const submitBtn = qs("submit-answer-btn");
    if (textarea && submitBtn) {
      textarea.setAttribute('placeholder', t('game.answer_ph'));
      submitBtn.textContent = t('game.submit');

      submitBtn.disabled = false;
      submitBtn.onclick = async () => {
        submitBtn.disabled = true;
        await ApiClient.sendAnswer(telegramId, q.id, q.quiz_id, [textarea.value], currentLang);
        setTimeout(() => { questionIndex++; nextQuestion(); }, 1000);
      };
    }
  }
}


// ==== Выход ====
function logout() {
  stopPolling();                 // останавливаем авто-пуллинг
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');     // возвращаем на регистрацию
}


document.addEventListener("DOMContentLoaded", () => {
  const ru = document.getElementById('lang-ru');
  const en = document.getElementById('lang-en');
  if (ru && en) {
    (appState.lang === 'ru' ? ru : en).checked = true;
  }

  // Применяем переводы
  applyTranslations(document);

  // ✅ Всегда запускаем пуллинг при старте приложения.
  // Для незарегистрированных он безопасно ничего не делает (см. guard в checkAndStartGame).
  startPolling();

  // ✅ И сразу делаем моментальную проверку без ожидания 5 сек.
  checkAndStartGame().catch(e => console.error("Стартовая проверка игры:", e));
});
