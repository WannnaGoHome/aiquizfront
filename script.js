// const { act } = require("react");

// let appState = {
//   currentState: 'registration',
//   userId: null,
//   userNickname: '',
//   points: null,
// };

// // const ADMIN_IDS = [707309709, 1046929828]; 

// const tg = window.Telegram?.WebApp;
// tg?.expand();
// const telegramUser = tg?.initDataUnsafe?.user;
// const telegramId = telegramUser?.id;

// const registrationForm = document.getElementById("registration-form");
// const nicknameInput = document.getElementById("nickname-input");
// const registrationError = document.getElementById("registration-error");

// registrationForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const nickname = nicknameInput.value.trim();
//   if (!nickname) return;

//   try {
//     registrationError.classList.add("hidden");
//     console.log("🚀 Начало процесса регистрации/авторизации...");
//     const userData = await ApiClient.registerOrGetUser(telegramId, nickname);
//     appState.userId=userData.userId;
//     appState.userNickname=userData.nickname;
//     appState.points=userData.points;
//     console.log("✅ Пользователь вошёл:", appState);
//     showState('waiting');
//   } catch (err) {
//     console.error("❌ Ошибка входа:", err);
//     registrationError.textContent = err.message;
//     registrationError.classList.remove("hidden");
//   }
// });


// function showState(state) {
//   // 1. Сначала скрываем все экраны
//   document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  
//   // 2. Находим элемент (экран) по id, например state-registration, state-admin, state-waiting
//   const el = document.getElementById(`state-${state}`);
//   if (el) el.classList.remove("hidden");

//   // 3. Ищем внутри выбранного экрана все элементы, у которых id заканчивается на "nickname"
//   const nicknameElements = el.querySelectorAll("[id$='nickname']");
//   nicknameElements.forEach(elm => {
//     // Записываем в них nickname из текущего состояния приложения
//     elm.textContent = appState.userNickname;
//   });
  
//   // 4. Обновляем текущее состояние приложения
//   appState.currentState = state;
// }

// function shuffle(array) {
//   for (let i = array.length -1; i>0; i--) {
//     const j = Math.floor(Math.random() * (i+1));
//     [array [i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }


// let gameTimer = null;


// // ----------------- Функция перехода к следующей фазе события -----------------
// async function finishGamePhase() {
//   try {
//     const events = await ApiClient.listEvents();
//     const lastEvent = 
//     let phase= await ApiClient.getEventStatus();
//     if (phase.game_status === "finished") {
//       showState("finished");
//     } else if (phase.game_status === "registration") {
//       showState("registration");
//     } else {
//       showState("waiting-results");
//     }
//   } catch (e) {
//     console.error("Ошибка завершения фазы:", e);
//     document.getElementById("admin-notification").textContent = "Ошибка завершения фазы: " + e.message;
//   }
// }

// let questionIndex = 0;
// let questions = [];
// let intervalId = null;

// // ----------------- Автоматическая проверка статуса и старт игры -----------------
// async function checkAndStartGame() {
//   try {
//     const events = await ApiClient.listEvents();
//     if (!events.length) return showState("waiting");

//     const event = events.reduce((a,b) => a.id > b.id ? a : b);
//     const eventStatus = await ApiClient.getEventStatus(event.id);

//     const quizzes = await ApiClient.listQuizzes();
//     const activeQuiz = quizzes.find(q => q.status ==="started");

    
//     if (eventStatus.game_status === "started" && activeQuiz) {
//       showState("game");

//       questions = shuffle(await ApiClient.listQuestions(activeQuiz.id));
//       questionIndex = 0;
//       nextQuestion();
      
//     } else {
//       showState("waiting");
//     }
//   } catch (e) {
//     console.error("Произошла ошибка при запуске игры:", e);
//     document.getElementById("admin-notification").textContent = "Ошибка: " + e.message;
//   }
// }

// function nextQuestion() {
//   if (questionIndex >= questions.length) {
//     clearTimeout(gameTimer);
//     finishGamePhase(eventId);
//     clearTimeout(gameTimer);
//     clearInterval(intervalId);
//     return;
//   }

//   const q = questions[questionIndex];
//   document.getElementById("question-text").textContent = q.text;
//   document.getElementById("current-q").textContent = questionIndex + 1;
//   document.getElementById("total-qs").textContent = totalQuestions.length;

//   let timer = 15;

//   document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
//   clearInterval(intervalId);

//   intervalId = setInterval(() => {
//     timer--;
//     document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
//     if (timer <= 0){
//       clearInterval(intervalId);
//       questionIndex++;
//       nextQuestion();
//     }
//   }, 1000);
// }

// const defaultQuestions = [
//   {
//     id: 1,
//     question: 'Какой элемент называется "красным" из-за своей окраски и названия?',
//     options: ['Водород', 'Железо', 'Кислород', 'Уран'],
//     correctAnswer: 'Железо',
//   },
//   {
//     id: 2,
//     question: 'Как называется сила, которая притягивает предметы к Земле?',
//     options: ['Магнитное поле', 'Гравитация', 'Трение', 'Электрический ток'],
//     correctAnswer: 'Гравитация',
//   },
//   {
//     id: 3,
//     question: 'Какой орган человека отвечает за перекачку крови по всему телу?',
//     options: ['Легкие', 'Мозг', 'Печень', 'Сердце'],
//     correctAnswer: 'Сердце',
//   },
//   {
//     id: 4,
//     question: 'Что такое молекула воды?',
//     options: [
//       'Один атом водорода и один атом кислорода',
//       'Два атома водорода и один атом кислорода',
//       'Один атом водорода и два атома кислорода',
//       'Два атома водорода и два атома кислорода',
//     ],
//     correctAnswer: 'Два атома водорода и один атом кислорода',
//   },
//   {
//     id: 5,
//     question: 'Какое животное является самым крупным млекопитающим на Земле?',
//     options: ['Слон', 'Синий кит', 'Бегемот', 'Жираф'],
//     correctAnswer: 'Синий кит',
//   },
//   {
//     id: 6,
//     question: 'В каком году человек впервые высадился на Луне?',
//     options: ['1959', '1969', '1979', '1989'],
//     correctAnswer: '1969',
//   },
//   {
//     id: 7,
//     question: 'Как называется процесс преобразования солнечного света в химическую энергию растениями?',
//     options: ['Дыхание', 'Фотосинтез', 'Ферментация', 'Транспирация'],
//     correctAnswer: 'Фотосинтез',
//   },
//   {
//     id: 8,
//     question: 'Что изучает наука геология?',
//     options: [
//       'Звезды и планеты',
//       'Животных и растения',
//       'Земную кору, ее строение и историю',
//       'Человеческий организм',
//     ],
//     correctAnswer: 'Земную кору, ее строение и историю',
//   },
//   {
//     id: 9,
//     question: 'Какая планета Солнечной системы известна своими кольцами?',
//     options: ['Марс', 'Юпитер', 'Сатурн', 'Нептун'],
//     correctAnswer: 'Сатурн',
//   },
//   {
//     id: 10,
//     question: 'К какой форме жизни относится плесень, например, та, что появляется на хлебе?',
//     options: ['Бактерии', 'Вирусы', 'Грибы', 'Простейшие'],
//     correctAnswer: 'Грибы',
//   },
// ];

// function logout() {
//   appState.userId = null;
//   appState.userNickname = '';
//   nicknameInput.value = '';
//   showState('registration');
// }


// // document.addEventListener("DOMContentLoaded", () => {
// //   setInterval(async () => {
// //     try {
// //       checkAndStartGame();
// //     } catch (e) {
// //       console.error("Ошибка проверки статуса игры:", e);
// //     }
// //   }, 2000);
// // });
4
const { act } = require("react");

let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
};

const tg = window.Telegram?.WebApp;
tg?.expand();
const telegramUser = tg?.initDataUnsafe?.user;
const telegramId = telegramUser?.id;

const registrationForm = document.getElementById("registration-form");
const nicknameInput = document.getElementById("nickname-input");
const registrationError = document.getElementById("registration-error");

// ==================== ЗАГЛУШКИ API ====================

const MockApiClient = {
  // Заглушка регистрации
  registerOrGetUser: async (telegramId, nickname) => {
    console.log("🔧 Mock: Регистрация пользователя", { telegramId, nickname });
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    
    return {
      userId: Math.floor(Math.random() * 1000),
      nickname: nickname,
      points: 0
    };
  },

  // Заглушка получения статуса события
  getEventStatus: async () => {
    console.log("🔧 Mock: Получение статуса события");
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Случайным образом меняем статус для демонстрации
    const statuses = ["registration", "started", "finished"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      game_status: randomStatus,
      event_id: 1
    };
  },

  // Заглушка списка событий
  listEvents: async () => {
    console.log("🔧 Mock: Получение списка событий");
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [{
      id: 1,
      name: "Тестовая викторина",
      status: "active"
    }];
  },

  // Заглушка списка квизов
  listQuizzes: async () => {
    console.log("🔧 Mock: Получение списка квизов");
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [{
      id: 1,
      name: "Научная викторина",
      status: "started"
    }];
  },

  // Заглушка списка вопросов
  listQuestions: async (quizId) => {
    console.log("🔧 Mock: Получение вопросов для квиза", quizId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        text: "Какой элемент называется 'красным' из-за своей окраски и названия?",
        type: "text"
      },
      {
        id: 2,
        text: "Как называется сила, которая притягивает предметы к Земле?",
        type: "text"
      },
      {
        id: 3,
        text: "Какой орган человека отвечает за перекачку крови по всему телу?",
        type: "text"
      },
      {
        id: 4,
        text: "Что такое молекула воды?",
        type: "text"
      },
      {
        id: 5,
        text: "Какое животное является самым крупным млекопитающим на Земле?",
        type: "text"
      }
    ];
  },

  // Заглушка отправки ответа
  submitAnswer: async (userId, questionId, answer) => {
    console.log("🔧 Mock: Отправка ответа", { userId, questionId, answer });
    await new Promise(resolve => setTimeout(resolve, 800)); // Имитация обработки
    
    // Случайное начисление очков для демонстрации
    const pointsEarned = Math.floor(Math.random() * 10) + 1;
    appState.points += pointsEarned;
    
    return {
      success: true,
      points: pointsEarned,
      total_points: appState.points
    };
  }
};

// Используем заглушки вместо реального API
const ApiClient = MockApiClient;

// ==================== ОСНОВНАЯ ЛОГИКА ====================

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  try {
    registrationError.classList.add("hidden");
    console.log("🚀 Начало процесса регистрации...");
    
    const userData = await ApiClient.registerOrGetUser(telegramId, nickname);
    appState.userId = userData.userId;
    appState.userNickname = userData.nickname;
    appState.points = userData.points;
    
    console.log("✅ Пользователь зарегистрирован:", appState);
    showState('waiting');
    
    // Запускаем проверку статуса игры
    startGameStatusChecker();
    
  } catch (err) {
    console.error("❌ Ошибка регистрации:", err);
    registrationError.textContent = err.message || "Ошибка регистрации";
    registrationError.classList.remove("hidden");
  }
});

function showState(state) {
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");

  const nicknameElements = el.querySelectorAll("[id$='nickname']");
  nicknameElements.forEach(elm => {
    elm.textContent = appState.userNickname;
  });
  
  appState.currentState = state;
  console.log(`📱 Переход на экран: ${state}`);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let gameTimer = null;
let questionIndex = 0;
let questions = [];
let intervalId = null;

// ==================== ЗАГЛУШКИ ИГРОВОЙ ЛОГИКИ ====================

async function finishGamePhase() {
  try {
    console.log("🔧 Mock: Завершение игровой фазы");
    const phase = await ApiClient.getEventStatus();
    
    if (phase.game_status === "finished") {
      showState("finished");
    } else if (phase.game_status === "registration") {
      showState("registration");
    } else {
      showState("waiting-results");
    }
  } catch (e) {
    console.error("Ошибка завершения фазы:", e);
  }
}

async function checkAndStartGame() {
  try {
    console.log("🔍 Проверка статуса игры...");
    const events = await ApiClient.listEvents();
    if (!events.length) return showState("waiting");

    const eventStatus = await ApiClient.getEventStatus();
    const quizzes = await ApiClient.listQuizzes();
    const activeQuiz = quizzes.find(q => q.status === "started");

    if (eventStatus.game_status === "started" && activeQuiz) {
      console.log("🎮 Начинаем игру!");
      showState("game");

      questions = shuffle(await ApiClient.listQuestions(activeQuiz.id));
      questionIndex = 0;
      startQuestionSequence();
      
    } else {
      console.log("⏳ Ожидаем начала игры...");
      showState("waiting");
    }
  } catch (e) {
    console.error("Ошибка при запуске игры:", e);
  }
}

function startQuestionSequence() {
  if (questionIndex >= questions.length) {
    console.log("🏁 Все вопросы завершены!");
    finishGamePhase();
    clearInterval(intervalId);
    return;
  }

  const question = questions[questionIndex];
  document.getElementById("question-text").textContent = question.text;
  document.getElementById("current-q").textContent = questionIndex + 1;
  document.getElementById("total-qs").textContent = questions.length;

  // Сброс текстового поля ответа
  document.getElementById("answer-textarea").value = "";
  document.getElementById("submit-answer-btn").disabled = false;
  document.getElementById("answer-status").innerHTML = "";

  let timer = 20; // 20 секунд на ответ
  updateTimerDisplay(timer);

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer--;
    updateTimerDisplay(timer);
    
    if (timer <= 0) {
      clearInterval(intervalId);
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("question-timer").textContent = 
    `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  // Визуальные эффекты таймера
  const timerElement = document.getElementById("question-timer");
  timerElement.classList.remove("timer-warning", "timer-critical");
  
  if (seconds <= 10) {
    timerElement.classList.add("timer-critical");
  } else if (seconds <= 30) {
    timerElement.classList.add("timer-warning");
  }
}

function handleTimeUp() {
  console.log("⏰ Время вышло!");
  document.getElementById("answer-status").innerHTML = 
    '<div class="notification error">⏰ Время вышло! Переход к следующему вопросу...</div>';
  
  document.getElementById("submit-answer-btn").disabled = true;
  
  setTimeout(() => {
    questionIndex++;
    startQuestionSequence();
  }, 2000);
}

// Обработчик отправки ответа
document.getElementById("submit-answer-btn").addEventListener("click", async () => {
  const answerText = document.getElementById("answer-textarea").value.trim();
  if (!answerText) return;

  const button = document.getElementById("submit-answer-btn");
  const statusElement = document.getElementById("answer-status");
  
  try {
    button.disabled = true;
    button.innerHTML = '<div class="btn-loading">⏳ Отправка...</div>';
    
    const result = await ApiClient.submitAnswer(
      appState.userId, 
      questions[questionIndex].id, 
      answerText
    );
    
    statusElement.innerHTML = 
      `<div class="notification success">
         ✅ Ответ принят! +${result.points} очков (Всего: ${result.total_points})
       </div>`;
    
    // Переход к следующему вопросу через 2 секунды
    setTimeout(() => {
      questionIndex++;
      startQuestionSequence();
    }, 2000);
    
  } catch (error) {
    console.error("Ошибка отправки ответа:", error);
    statusElement.innerHTML = 
      `<div class="notification error">
         ❌ Ошибка отправки ответа
       </div>`;
    button.disabled = false;
    button.textContent = "Отправить ответ";
  }
});

// Авто-проверка статуса игры
let statusCheckerInterval = null;

function startGameStatusChecker() {
  if (statusCheckerInterval) {
    clearInterval(statusCheckerInterval);
  }
  
  statusCheckerInterval = setInterval(async () => {
    if (appState.currentState === 'waiting' || appState.currentState === 'waiting-results') {
      await checkAndStartGame();
    }
  }, 3000); // Проверка каждые 3 секунды
}

function logout() {
  appState.userId = null;
  appState.userNickname = '';
  appState.points = null;
  nicknameInput.value = '';
  
  if (statusCheckerInterval) {
    clearInterval(statusCheckerInterval);
    statusCheckerInterval = null;
  }
  
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  
  showState('registration');
  console.log("🚪 Пользователь вышел из системы");
}

// Обработчики для кнопки выхода
document.querySelectorAll('button[onclick="logout()"]').forEach(button => {
  button.addEventListener('click', logout);
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 Викторина инициализирована (режим заглушек)");
  
  // Показываем экран регистрации по умолчанию
  showState('registration');
  
  // Если есть данные пользователя в localStorage, пытаемся восстановить сессию
  const savedUser = localStorage.getItem('quizUser');
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      appState = { ...appState, ...userData };
      showState('waiting');
      startGameStatusChecker();
    } catch (e) {
      localStorage.removeItem('quizUser');
    }
  }
});

// Сохраняем состояние при выходе
window.addEventListener('beforeunload', () => {
  if (appState.userId) {
    localStorage.setItem('quizUser', JSON.stringify(appState));
  }
});