let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
};

const ADMIN_IDS = [707309709, 1046929828]; 

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
    const userData = await ApiClient.registerOrGetUser(telegramId, nickname);
    appState.userId=userData.userId;
    appState.userNickname=userData.nickname;
    appState.points=userData.points;
    console.log("✅ Пользователь вошёл:", appState);
  } catch (err) {
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


// Выход/смена никнейма
function logout() {
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');
}

let gameTimer = null;

// ----------------- Функция перехода к следующей фазе события -----------------
async function finishGamePhase() {
  try {
    let phase= await ApiClient.getEventStatus();
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

// ----------------- Автоматическая проверка статуса и старт игры -----------------
async function checkAndStartGame() {
  try {
    const events = await ApiClient.listEvents();
      if (events.length > 0) {
        eventId = Math.max(...events.map(e => e.id));
      }
    const status = await ApiClient.getEventStatus(eventId);
    if (status.game_status === "started") {
      showState("game");
      let questionIndex = 0;
      let totalQuestions = await ApiClient.listQuestions(quizId);
      if (!totalQuestions || totalQuestions.length === 0) {
        totalQuestions = defaultQuestions;
      }
      let gameTimer = null;
      let intervalId = null;
      
      function nextQuestion() {
        if (questionIndex >= totalQuestions.length) {
          clearTimeout(gameTimer);
          finishGamePhase(eventId);
          clearTimeout(gameTimer);
          clearInterval(intervalId);
          return;
        }

        const questionText = totalQuestions[questionIndex].question;
        document.getElementById("question-text").textContent = questionText;
        document.getElementById("current-q").textContent = questionIndex + 1;
        document.getElementById("total-qs").textContent = totalQuestions.length;

        let timer = 15;
        clearInterval(intervalId);
        document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
        intervalId = setInterval(() => {
          timer--;
          document.getElementById("question-timer").textContent = `00:${timer < 10 ? '0' + timer : timer}`;
          if (timer <= 0) clearInterval(intervalId);
        }, 1000);

        questionIndex++;
        gameTimer = setTimeout(nextQuestion, 15000);
      }
      nextQuestion();
    } else {
      showState("waiting");
    }
  } catch (e) {
    console.error("Произошла ошибка при запуске игры:", e);
    document.getElementById("admin-notification").textContent = "Ошибка: " + e.message;
  }
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



document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    try {
      checkAndStartGame();
    } catch (e) {
      console.error("Ошибка проверки статуса игры:", e);
    }
  }, 2000);
});
