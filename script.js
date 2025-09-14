let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
};

const ADMIN_IDS = [707309709, 1046929828]; 

const tg = window.Telegram?.WebApp;
tg?.expand();
const telegramUser = tg?.initDataUnsafe?.user;
const telegramId = telegramUser?.id;
const registrationForm = document.getElementById("registration-form");
const nicknameInput = document.getElementById("nickname-input");
const registrationSuccess = document.getElementById("registration-success");
const registrationError = document.getElementById("registration-error");
const registeredNickname = document.getElementById("registered-nickname");

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  try {
    registrationError.classList.add("hidden");
    await ApiClient.registerUser(telegramId, nickname);
    appState.userId = telegramId;
    appState.userNickname = nickname;

    const isAdmin = await ApiClient.checkAdmin(telegramId);
    if (isAdmin.is_admin) {
        showState("admin");
        updateAdminStats();
    } else {
        showState("waiting");
    }

  } catch (err) {
    registrationError.textContent = err.message;
    registrationError.classList.remove("hidden");
  }
});

// registrationForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const nickname = nicknameInput.value.trim();
//   if (!nickname) return;

//   try {
//     registrationError.classList.add("hidden");
    
//     // Проверяем существование пользователя с улучшенной обработкой ошибок
//     let existingUser;
//     try {
//       existingUser = await ApiClient.getUser(telegramId);
//       console.log('User found:', existingUser);
//     } catch (error) {
//       console.log('User not found or error:', error.message);
//       // Если пользователь не найден (404), продолжаем регистрацию
//       if (!error.message.includes('404') && !error.message.includes('Not Found')) {
//         throw error;
//       }
//     }

//     if (existingUser) {
//       appState.userId = telegramId;
//       appState.userNickname = existingUser.nickname || nickname;
//       console.log('Existing user, checking admin status...');

//       const isAdmin = await ApiClient.checkAdmin(telegramId);
//       if (isAdmin.is_admin) {
//         showState("admin");
//         updateAdminStats();
//       } else {
//         showState("waiting");
//       }
//       return;
//     }

//     // Регистрация нового пользователя
//     console.log('Registering new user...');
//     await ApiClient.registerUser(telegramId, nickname);
//     appState.userId = telegramId;
//     appState.userNickname = nickname;

//     const isAdmin = await ApiClient.checkAdmin(telegramId);
//     if (isAdmin.is_admin) {
//       showState("admin");
//       updateAdminStats();
//     } else {
//       showState("waiting");
//     }

//   } catch (err) {
//     console.error('Registration error:', err);
//     registrationError.textContent = `Ошибка: ${err.message}`;
//     registrationError.classList.remove("hidden");
//   }
// });


// Функция для переключения экранов
function showState(state) {
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");

  const nicknameElements = el.querySelectorAll("[id$='nickname']");
  nicknameElements.forEach(elm => {
    elm.textContent = appState.userNickname;
  });
  
  appState.currentState = state;
}


// Выход/смена никнейма
function logout() {
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');
}

// ------------------- Админка -------------------
async function updateAdminStats(eventId = null) {
  try {
    if (!eventId) {
      const events = await ApiClient.listEvents();
      if (events.length > 0) {
        eventId = events[events.length - 1].id; // последний созданный
      }
    }
    if (!eventId) return;
    const status = await ApiClient.getEventStatus(eventId);
    document.getElementById("admin-game-status").textContent = status.game_status || "Не начата";
    document.getElementById("admin-current-question").textContent = `${status.current_question_index || 0}/${status.total_questions || 0}`;
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка обновления админ-статистики: " + e.message;
  }
}

// ------------------- USER -------------------
async function adminListUsers() {
  try {
    const users = await ApiClient.listUsers();
    document.getElementById("admin-notification").textContent = JSON.stringify(users, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения пользователей: " + e.message;
  }
}

async function adminGetUser() {
  try {
    const telegramId = Number(prompt("Введите Telegram ID пользователя:"));
    if (!telegramId) return;
    const user = await ApiClient.getUser(telegramId);
    document.getElementById("admin-notification").textContent = JSON.stringify(user, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения пользователя: " + e.message;
  }
}

async function adminDeleteUserPrompt() {
  try {
    const telegramId = Number(prompt("Введите Telegram ID пользователя для удаления:"));
    if (!telegramId) return;
    const res = await ApiClient.deleteUser(telegramId);
    document.getElementById("admin-notification").textContent = "Удаление: " + JSON.stringify(res, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка удаления пользователя: " + e.message;
  }
}



// ------------------- EVENT -------------------
async function adminListEvents() {
  try {
    const events = await ApiClient.listEvents();
    document.getElementById("admin-notification").textContent = JSON.stringify(events, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения событий: " + e.message;
  }
}



async function adminCreateEventPrompt() {
  try {
    const name = prompt("Название события:");
    const creatorId = Number(prompt("Telegram ID создателя:"));
    if (!name || !creatorId) return;
    const res = await ApiClient.createEvent(name, creatorId, creatorId);
    document.getElementById("admin-notification").textContent = "Событие создано: " + JSON.stringify(res, null, 2);
    updateAdminStats(res.id);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка создания события: " + e.message;
  }
}

async function adminNextEventPhasePrompt() {
  try {
    const eventId = Number(prompt("ID события для перехода к следующей фазе:"));
    if (!eventId) return;
    const phase = await ApiClient.getNextEventPhase(eventId, telegramId);
    document.getElementById("admin-notification").textContent = "Следующая фаза: " + phase;
    updateAdminStats(eventId);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка перехода к следующей фазе: " + e.message;
  }
}

async function adminGetEventStatusPrompt() {
  try {
    const eventId = Number(prompt("ID события для получения статуса:"));
    if (!eventId) return;
    const status = await ApiClient.getEventStatus(eventId);
    document.getElementById("admin-notification").textContent = JSON.stringify(status, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения статуса события: " + e.message;
  }
}

// ------------------- QUIZ -------------------
async function adminListQuizzes() {
  try {
    const quizzes = await ApiClient.listQuizzes();
    document.getElementById("admin-notification").textContent = JSON.stringify(quizzes, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения викторин: " + e.message;
  }
}

async function adminCreateQuizPrompt() {
  try {
    const title = prompt("Название викторины:");
    const description = prompt("Описание викторины:");
    if (!title) return;
    const res = await ApiClient.createQuiz({ title, description });
    document.getElementById("admin-notification").textContent = "Викторина создана: " + JSON.stringify(res, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка создания викторины: " + e.message;
  }
}

async function adminListQuestionsPrompt() {
  try {
    const quizId = Number(prompt("ID викторины для списка вопросов:"));
    if (!quizId) return;
    const questions = await ApiClient.listQuestions(quizId);
    document.getElementById("admin-notification").textContent = JSON.stringify(questions, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения вопросов: " + e.message;
  }
}

async function adminCreateQuestionPrompt() {
  try {
    const quizId = Number(prompt("ID викторины для нового вопроса:"));
    const text = prompt("Текст вопроса:");
    if (!quizId || !text) return;
    const res = await ApiClient.createQuestion({ quiz_id: quizId, text });
    document.getElementById("admin-notification").textContent = "Вопрос создан: " + JSON.stringify(res, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка создания вопроса: " + e.message;
  }
}

async function adminCreateAnswer() {
  try {
    const userId = Number(prompt("ID пользователя:"));
    const questionId = Number(prompt("ID вопроса:"));
    const answer = prompt("Ответ пользователя:");
    if (!userId || !questionId || !answer) return;
    const res = await ApiClient.createAnswer({ user_id: userId, question_id: questionId, answer });
    document.getElementById("admin-notification").textContent = "Ответ создан: " + JSON.stringify(res, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка создания ответа: " + e.message;
  }
}

async function adminListAnswers() {
  try {
    const questionId = Number(prompt("ID вопроса для списка ответов:"));
    if (!questionId) return;
    const answers = await ApiClient.listAnswers(questionId);
    document.getElementById("admin-notification").textContent = JSON.stringify(answers, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения ответов: " + e.message;
  }
}

async function adminGetCurrentQuestionPrompt() {
  try {
    const eventId = Number(prompt("ID события для текущего вопроса:"));
    if (!eventId) return;
    const question = await ApiClient.getCurrentQuestion(eventId);
    document.getElementById("admin-notification").textContent = "Текущий вопрос: " + JSON.stringify(question, null, 2);
  } catch (e) {
    document.getElementById("admin-notification").textContent = "Ошибка получения текущего вопроса: " + e.message;
  }
}

// ----------------- Дефолтные вопросы для теста -----------------
const defaultQuestions = [
  "Что такое искусственный интеллект?",
  "Назовите основные виды машинного обучения.",
  "Для чего используют нейронные сети?",
  "Что такое генеративные модели?",
  "Как ИИ меняет современные профессии?"
];

let gameTimer = null;

// ----------------- Функция запуска игры для пользователей -----------------
async function startGame(eventId) {
  try {
    // Обновляем статус игры
    const status = await ApiClient.getEventStatus(eventId);

    if (status.game_status !== "started") {
      document.getElementById("admin-notification").textContent = "Статус игры не started, ожидаем...";
      return;
    }

    showState("game");
    let questionIndex = 0;
    const totalQuestions = defaultQuestions.length;

    function nextQuestion() {
      if (questionIndex >= totalQuestions) {
        clearInterval(gameTimer);
        finishGamePhase(eventId);
        return;
      }

      const questionText = defaultQuestions[questionIndex];
      document.getElementById("question-text").textContent = questionText;
      document.getElementById("current-q").textContent = questionIndex + 1;
      document.getElementById("total-qs").textContent = totalQuestions;

      // Таймер 10 секунд на вопрос
      let timer = 10;
      document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
      const interval = setInterval(() => {
        timer--;
        document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
        if (timer <= 0) clearInterval(interval);
      }, 1000);

      questionIndex++;
      gameTimer = setTimeout(nextQuestion, 10000);
    }

    nextQuestion();

  } catch (e) {
    console.error("Ошибка запуска игры:", e);
    document.getElementById("admin-notification").textContent = "Ошибка запуска игры: " + e.message;
  }
}

// ----------------- Функция перехода к следующей фазе события -----------------
async function finishGamePhase(eventId) {
  try {
    const phase = await ApiClient.getNextEventPhase(eventId, telegramId);
    console.log("Следующая фаза события:", phase);

    if (phase.game_status === "finished") {
      showState("finished");
    } else if (phase.game_status === "registration") {
      showState("registration");
    } else {
      // Если есть другие фазы, можно добавить логику
      showState("waiting");
    }

    // Обновляем админку
    updateAdminStats(eventId);

  } catch (e) {
    console.error("Ошибка завершения фазы:", e);
    document.getElementById("admin-notification").textContent = "Ошибка завершения фазы: " + e.message;
  }
}

// ----------------- Автоматическая проверка статуса и старт игры -----------------
async function checkAndStartGame(eventId) {
  try {
    const status = await ApiClient.getEventStatus(eventId);
    if (status.game_status === "started") {
      startGame(eventId);
    } else {
      showState("waiting");
    }
  } catch (e) {
    console.error("Ошибка проверки статуса игры:", e);
    document.getElementById("admin-notification").textContent = "Ошибка проверки статуса игры: " + e.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const EVENT_ID = 2;
  checkAndStartGame(EVENT_ID);
});

