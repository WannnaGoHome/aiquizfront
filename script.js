
let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
};

// const ADMIN_IDS = [707309709, 1046929828]; 

const tg = window.Telegram?.WebApp;
tg?.expand();
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

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length -1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ----------------- Функция перехода к следующей фазе события -----------------
async function finishGamePhase() {
  try {
    //const events = await ApiClient.listEvents();
    let phase= await ApiClient.getEventStatus(event_id);
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

let questionIndex = 0;
let questions = [];
let intervalId = null;
let gameTimer = null;            
let currentLang = 'ru'; 
let event_id = 1; //TODO 

// ----------------- Автоматическая проверка статуса и старт игры -----------------
async function checkAndStartGame() {
  try {
    const events = await ApiClient.listEvents();
    if (!events.length) return showState("waiting");

    // const event = events.reduce((a,b) => a.id > b.id ? a : b); TODO
    const eventStatus = await ApiClient.getEventStatus(event_id);
    const quizzes = await ApiClient.listQuizzes(event_id);
    const activeQuiz = quizzes.find(q => q.is_active);

    if (eventStatus.game_status === "started" && activeQuiz) {
      showState("game");
      const raw = await ApiClient.listQuestions(activeQuiz.id);
      questions = shuffle(raw);
      questionIndex = 0;
      nextQuestion();
      
    } else {
      showState("waiting");
    }
  } catch (e) {
    console.error("Произошла ошибка при запуске игры:", e);
    document.getElementById("admin-notification").textContent = "Ошибка: " + e.message;
  }
}

function qText(q, lang) {
  //q.text = {ru: "...", en: "..."};
  if (q?.text?.[lang]) return q.text[lang];
  if (q?.text?.ru) return q.text.ru;
  const any = q && q.text && Object.values(q.text)[0];
  return any ?? "";
}

function qOptions(q, lang) {
  //q.options = {ru: ["..."], en: ["..."]};
  if (q?.options?.[lang]) return q.options[lang];
  if (q?.options?.ru) return q.options.ru;
  const any = q && q.options && Object.values(q.options)[0];
  return Array.isArray(any) ? any : [];
}

function qCorrect(q, lang) {
  // q.correct_answers = {ru: ["..."], en: ["..."]}
  if (q?.correct_answers?.[lang]) return q.correct_answers[lang];
  if (q?.correct_answers?.ru) return q.correct_answers.ru;
  const any = q && q.correct_answers && Object.values(q.correct_answers)[0];
  return Array.isArray(any) ? any : [];
}

function renderOptions(options) {
  const container = document.getElementById("options");
  container.innerHTML = "";
  options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.index = i;
    btn.textContent = opt;
    btn.onclick = () => handleOptionClick(i);
    container.appendChild(btn);
  });
}

function handleOptionClick(index) {
  const q = questions[questionIndex];
  const options = qOptions(q, currentLang);
  const chosen = options[index]; // выбранный вариант

  const selectedBtn = document.querySelector(`.option[data-index="${index}"]`);
  document.querySelectorAll(".option").forEach(btn => btn.disabled = true);

  // Отправляем ответ на бэк
  ApiClient.sendAnswer(
    telegramId,     // ID пользователя
    q.id,           // ID вопроса
    q.quiz_id,      // ID викторины
    [chosen],       // массив выбранных ответов
    currentLang     // локаль (ru/en)
  )
    .then(res => {
      console.log("Ответ отправлен:", res);

      // Подсветка выбранного ответа
      if (res.is_correct) {
        selectedBtn.classList.add("correct"); // зелёный, если правильно
      } else {
        selectedBtn.classList.add("wrong");   // красный, если неправильно
      }

      // Переход к следующему вопросу через 1.5 секунды
      setTimeout(() => {
        questionIndex++;
        nextQuestion();
      }, 1500);
    })
    .catch(err => {
      console.error("Ошибка при отправке ответа:", err);
      selectedBtn.classList.add("wrong"); // красный при ошибке
    });
}



function nextQuestion() {
  if (questionIndex >= questions.length) {
    if (gameTimer) clearTimeout(gameTimer);
    if (intervalId) clearInterval(intervalId);
    finishGamePhase(event_id);
    return;
  }

  const q = questions[questionIndex];
  document.getElementById("question-text").textContent = qText(q, currentLang);
  document.getElementById("current-q").textContent = String(questionIndex + 1);
  document.getElementById("total-qs").textContent = String(questions.length);

  const options = qOptions(q, currentLang);
  renderOptions(options);

  const correct = qCorrect(q, currentLang);

  let timer = Number(q.duration_seconds) > 0 ? Number(q.duration_seconds) : 15;

  const timerEl = document.getElementById("question-timer");
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
}

const defaultQuestions = [
  {
    id: 1,
    question: 'Какой элемент называется "красным" из-за своей окраски и названия?',
    options: ['Водород', 'Железо', 'Кислород', 'Уран'],
    correctAnswer: 'Железо',
  },
  {
    id: 2,
    question: 'Как называется сила, которая притягивает предметы к Земле?',
    options: ['Магнитное поле', 'Гравитация', 'Трение', 'Электрический ток'],
    correctAnswer: 'Гравитация',
  },
  {
    id: 3,
    question: 'Какой орган человека отвечает за перекачку крови по всему телу?',
    options: ['Легкие', 'Мозг', 'Печень', 'Сердце'],
    correctAnswer: 'Сердце',
  },
  {
    id: 4,
    question: 'Что такое молекула воды?',
    options: [
      'Один атом водорода и один атом кислорода',
      'Два атома водорода и один атом кислорода',
      'Один атом водорода и два атома кислорода',
      'Два атома водорода и два атома кислорода',
    ],
    correctAnswer: 'Два атома водорода и один атом кислорода',
  },
  {
    id: 5,
    question: 'Какое животное является самым крупным млекопитающим на Земле?',
    options: ['Слон', 'Синий кит', 'Бегемот', 'Жираф'],
    correctAnswer: 'Синий кит',
  },
  {
    id: 6,
    question: 'В каком году человек впервые высадился на Луне?',
    options: ['1959', '1969', '1979', '1989'],
    correctAnswer: '1969',
  },
  {
    id: 7,
    question: 'Как называется процесс преобразования солнечного света в химическую энергию растениями?',
    options: ['Дыхание', 'Фотосинтез', 'Ферментация', 'Транспирация'],
    correctAnswer: 'Фотосинтез',
  },
  {
    id: 8,
    question: 'Что изучает наука геология?',
    options: [
      'Звезды и планеты',
      'Животных и растения',
      'Земную кору, ее строение и историю',
      'Человеческий организм',
    ],
    correctAnswer: 'Земную кору, ее строение и историю',
  },
  {
    id: 9,
    question: 'Какая планета Солнечной системы известна своими кольцами?',
    options: ['Марс', 'Юпитер', 'Сатурн', 'Нептун'],
    correctAnswer: 'Сатурн',
  },
  {
    id: 10,
    question: 'К какой форме жизни относится плесень, например, та, что появляется на хлебе?',
    options: ['Бактерии', 'Вирусы', 'Грибы', 'Простейшие'],
    correctAnswer: 'Грибы',
  },
];

function logout() {
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');
}


document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    try {
      checkAndStartGame();
    } catch (e) {
      console.error("Ошибка проверки статуса игры:", e);
    }
  }, 5000);
});
