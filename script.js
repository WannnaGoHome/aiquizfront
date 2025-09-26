
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
    //const events = await ApiClient.listEvents();
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

async function checkAndStartGame() {
  try {
    const eventStatus = await ApiClient.getEventStatus(event_id, telegramId);

    if (eventStatus.game_status === "started") {
      if (gameStarted) return; // защита от повторного запуска
      console.log("🎮 Игра началась — загружаем 10 случайных вопросов...");

      gameStarted = true;

      // ✅ Берём 10 случайных вопросов
      const shuffled = shuffle(defaultQuestionsFromJson.items);
      const raw = shuffled.slice(0, 10).map((q, i) => ({
        ...q,
        id: i + 1,
        quiz_id: 3
      }));

      questions = raw;
      questionIndex = 0;

      const firstType = questions[0]?.type;
      showState(firstType === "open" ? "game-open" : "game");

      nextQuestion();
    } else {
      if (!gameStarted && appState.currentState !== "waiting") {
        showState("waiting");
      }
    }
  } catch (e) {
    console.error("Произошла ошибка при запуске игры:", e);
  }
}

const defaultQuestionsFromJson = {
  items: [
    {
      type: "single",
      text_i18n: { ru: "Оптика изучает что?", en: "Optics studies what?" },
      options_i18n: { ru: ["Звук", "Тепло", "Свет", "Электричество"], en: ["Sound", "Heat", "Light", "Electricity"] },
      correct_answers_i18n: { ru: ["Свет"], en: ["Light"] },
      duration_seconds: 10,
      points: 3
    },
    {
      type: "single",
      text_i18n: { ru: "Что означает ДНК?", en: "What does DNA stand for?" },
      options_i18n: { ru: ["Дезоксирибонуклеиновая кислота", "Динуклеотидный кислотный агрегат", "ДНК-нуклеиновая кислота", "Динамическая нуклеиновая кислота"], en: ["Deoxyribonucleic acid", "Dinucleotide acid aggregate", "DNA nucleic acid", "Dynamic nucleic acid"] },
      correct_answers_i18n: { ru: ["Дезоксирибонуклеиновая кислота"], en: ["Deoxyribonucleic acid"] },
      duration_seconds: 10,
      points: 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая лунная миссия «Аполлон» была первой, на которой появился луноход?", "en": "Which Apollo mission was the first to use a lunar rover?" },
      "options_i18n": { "ru": ["Аполлон-11", "Аполлон-13", "Аполлон-15", "Аполлон-17"], "en": ["Apollo 11", "Apollo 13", "Apollo 15", "Apollo 17"] },
      "correct_answers_i18n": { "ru": ["Аполлон-15"], "en": ["Apollo 15"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как назывался первый искусственный спутник, запущенный Советским Союзом в 1957 году?", "en": "What was the first artificial satellite launched by the Soviet Union in 1957 called?" },
      "options_i18n": { "ru": ["Восток-1", "Спутник-1", "Луна-1", "Союз-1"], "en": ["Vostok 1", "Sputnik 1", "Luna 1", "Soyuz 1"] },
      "correct_answers_i18n": { "ru": ["Спутник-1"], "en": ["Sputnik 1"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая самая редкая группа крови?", "en": "What is the rarest blood type?" },
      "options_i18n": { "ru": ["0 (I) положительная", "A (II) отрицательная", "B (III) положительная", "AB отрицательная"], "en": ["O positive", "A negative", "B positive", "AB negative"] },
      "correct_answers_i18n": { "ru": ["AB отрицательная"], "en": ["AB negative"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Каковы три основных слоя Земли?", "en": "What are the three main layers of the Earth?" },
      "options_i18n": { "ru": ["Кора, мантия, ядро", "Литосфера, астеносфера, ядро", "Почва, пластмасса, ядро", "Кора, магма, ядро"], "en": ["Crust, mantle, core", "Lithosphere, asthenosphere, core", "Soil, plastic, core", "Crust, magma, core"] },
      "correct_answers_i18n": { "ru": ["Кора, мантия, ядро"], "en": ["Crust, mantle, core"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Лягушки относятся к какой группе животных?", "en": "Frogs belong to which group of animals?" },
      "options_i18n": { "ru": ["Рептилии", "Земноводные", "Млекопитающие", "Рыбы"], "en": ["Reptiles", "Amphibians", "Mammals", "Fish"] },
      "correct_answers_i18n": { "ru": ["Земноводные"], "en": ["Amphibians"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько костей в теле акулы?", "en": "How many bones are in a shark's body?" },
      "options_i18n": { "ru": ["Ноль", "Около 50", "Более 100", "Около 200"], "en": ["Zero", "About 50", "More than 100", "About 200"] },
      "correct_answers_i18n": { "ru": ["Ноль"], "en": ["Zero"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Где расположены самые маленькие кости в организме человека?", "en": "Where are the smallest bones in the human body located?" },
      "options_i18n": { "ru": ["В пальцах", "В носу", "В ухе", "В позвоночнике"], "en": ["In the fingers", "In the nose", "In the ear", "In the spine"] },
      "correct_answers_i18n": { "ru": ["В ухе"], "en": ["In the ear"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько сердец у осьминога?", "en": "How many hearts does an octopus have?" },
      "options_i18n": { "ru": ["Одно", "Два", "Три", "Четыре"], "en": ["One", "Two", "Three", "Four"] },
      "correct_answers_i18n": { "ru": ["Три"], "en": ["Three"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кто предположил, что Солнце находится в центре нашей Солнечной системы?", "en": "Who proposed that the Sun is at the center of our Solar System?" },
      "options_i18n": { "ru": ["Галилео Галилей", "Николай Коперник", "Исаак Ньютон", "Аристотель"], "en": ["Galileo Galilei", "Nicolaus Copernicus", "Isaac Newton", "Aristotle"] },
      "correct_answers_i18n": { "ru": ["Николай Коперник"], "en": ["Nicolaus Copernicus"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кого считают изобретателем телефона?", "en": "Who is credited with inventing the telephone?" },
      "options_i18n": { "ru": ["Томас Эдисон", "Александр Грэхем Белл", "Никола Тесла", "Гульельмо Маркони"], "en": ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"] },
      "correct_answers_i18n": { "ru": ["Александр Грэхем Белл"], "en": ["Alexander Graham Bell"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая планета вращается быстрее всех?", "en": "Which planet rotates the fastest?" },
      "options_i18n": { "ru": ["Меркурий", "Венера", "Земля", "Юпитер"], "en": ["Mercury", "Venus", "Earth", "Jupiter"] },
      "correct_answers_i18n": { "ru": ["Юпитер"], "en": ["Jupiter"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "В воздухе звук распространяется быстрее, чем в воде. Правда или ложь?", "en": "Sound travels faster in air than in water. True or false?" },
      "options_i18n": { "ru": ["Правда", "Ложь"], "en": ["True", "False"] },
      "correct_answers_i18n": { "ru": ["Ложь"], "en": ["False"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какое самое твердое природное вещество на Земле?", "en": "What is the hardest natural substance on Earth?" },
      "options_i18n": { "ru": ["Алмаз", "Сталь", "Кварц", "Графит"], "en": ["Diamond", "Steel", "Quartz", "Graphite"] },
      "correct_answers_i18n": { "ru": ["Алмаз"], "en": ["Diamond"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько зубов у взрослого человека?", "en": "How many teeth does an adult human have?" },
      "options_i18n": { "ru": ["28", "30", "32", "36"], "en": ["28", "30", "32", "36"] },
      "correct_answers_i18n": { "ru": ["32"], "en": ["32"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как звали первую собаку, запущенную в космос?", "en": "What was the name of the first dog launched into space?" },
      "options_i18n": { "ru": ["Белка", "Стрелка", "Лайка", "Звездочка"], "en": ["Belka", "Strelka", "Laika", "Zvezdochka"] },
      "correct_answers_i18n": { "ru": ["Лайка"], "en": ["Laika"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Волосы и ногти сделаны из одного и того же материала. Правда или ложь?", "en": "Hair and nails are made of the same material. True or false?" },
      "options_i18n": { "ru": ["Правда", "Ложь"], "en": ["True", "False"] },
      "correct_answers_i18n": { "ru": ["Правда"], "en": ["True"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кто была первой женщиной в космосе?", "en": "Who was the first woman in space?" },
      "options_i18n": { "ru": ["Салли Райд", "Валентина Терешкова", "Елена Кондакова", "Пегги Уитсон"], "en": ["Sally Ride", "Valentina Tereshkova", "Elena Kondakova", "Peggy Whitson"] },
      "correct_answers_i18n": { "ru": ["Валентина Терешкова"], "en": ["Valentina Tereshkova"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какое научное слово означает толкать или тянуть?", "en": "Which scientific word means to push or pull?" },
      "options_i18n": { "ru": ["Энергия", "Сила", "Мощность", "Импульс"], "en": ["Energy", "Force", "Power", "Momentum"] },
      "correct_answers_i18n": { "ru": ["Сила"], "en": ["Force"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Где на теле человека больше всего потовых желез?", "en": "Where on the human body are the most sweat glands located?" },
      "options_i18n": { "ru": ["На подмышках", "На ладонях", "На лице", "На подошвах стоп"], "en": ["In the armpits", "On the palms", "On the face", "On the soles of the feet"] },
      "correct_answers_i18n": { "ru": ["На подошвах стоп"], "en": ["On the soles of the feet"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько примерно времени требуется солнечному свету, чтобы достичь Земли?", "en": "Approximately how long does sunlight take to reach the Earth?" },
      "options_i18n": { "ru": ["8 секунд", "8 минут", "8 часов", "8 дней"], "en": ["8 seconds", "8 minutes", "8 hours", "8 days"] },
      "correct_answers_i18n": { "ru": ["8 минут"], "en": ["8 minutes"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько костей в теле взрослого человека?", "en": "How many bones are in the adult human body?" },
      "options_i18n": { "ru": ["200", "206", "212", "218"], "en": ["200", "206", "212", "218"] },
      "correct_answers_i18n": { "ru": ["206"], "en": ["206"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Может ли молния ударить по одному и тому же месту дважды?", "en": "Can lightning strike the same place twice?" },
      "options_i18n": { "ru": ["Да", "Нет"], "en": ["Yes", "No"] },
      "correct_answers_i18n": { "ru": ["Да"], "en": ["Yes"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как называется процесс расщепления пищи?", "en": "What is the process of breaking down food called?" },
      "options_i18n": { "ru": ["Метаболизм", "Пищеварение", "Ассимиляция", "Ферментация"], "en": ["Metabolism", "Digestion", "Assimilation", "Fermentation"] },
      "correct_answers_i18n": { "ru": ["Пищеварение"], "en": ["Digestion"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какой цвет первым бросается в глаза?", "en": "Which color catches the eye first?" },
      "options_i18n": { "ru": ["Красный", "Зеленый", "Желтый", "Синий"], "en": ["Red", "Green", "Yellow", "Blue"] },
      "correct_answers_i18n": { "ru": ["Желтый"], "en": ["Yellow"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая единственная кость в организме человека не прикреплена к другой кости?", "en": "What is the only bone in the human body not attached to another bone?" },
      "options_i18n": { "ru": ["Коленная чашечка", "Подъязычная кость", "Ключица", "Лопатка"], "en": ["Patella", "Hyoid bone", "Clavicle", "Scapula"] },
      "correct_answers_i18n": { "ru": ["Подъязычная кость"], "en": ["Hyoid bone"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как называются животные, активные на рассвете и в сумерках?", "en": "What are animals active at dawn and dusk called?" },
      "options_i18n": { "ru": ["Ночные", "Дневные", "Сумеречные", "Полуночные"], "en": ["Nocturnal", "Diurnal", "Crepuscular", "Midnight-active"] },
      "correct_answers_i18n": { "ru": ["Сумеречные"], "en": ["Crepuscular"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "При какой температуре градусы Цельсия и Фаренгейта равны?", "en": "At what temperature are Celsius and Fahrenheit equal?" },
      "options_i18n": { "ru": ["0", "-40", "-100", "-273"], "en": ["0", "-40", "-100", "-273"] },
      "correct_answers_i18n": { "ru": ["-40"], "en": ["-40"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какие четыре основных драгоценных металла?", "en": "What are the four main precious metals?" },
      "options_i18n": { "ru": ["Золото, серебро, медь, цинк", "Золото, серебро, платина, палладий", "Золото, железо, никель, олово", "Серебро, алюминий, титан, вольфрам"], "en": ["Gold, silver, copper, zinc", "Gold, silver, platinum, palladium", "Gold, iron, nickel, tin", "Silver, aluminum, titanium, tungsten"] },
      "correct_answers_i18n": { "ru": ["Золото, серебро, платина, палладий"], "en": ["Gold, silver, platinum, palladium"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Космических путешественников из Китая называют...", "en": "Chinese space travelers are called..." },
      "options_i18n": { "ru": ["Астронавтами", "Космонавтами", "Тайконавтами", "Спутринавтами"], "en": ["Astronauts", "Cosmonauts", "Taikonauts", "Sputronauts"] },
      "correct_answers_i18n": { "ru": ["Тайконавтами"], "en": ["Taikonauts"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Подмышечная впадина - это какая часть тела?", "en": "The axillary fossa is which part of the body?" },
      "options_i18n": { "ru": ["Пах", "Шея", "Подмышка", "Коленный сгиб"], "en": ["Groin", "Neck", "Armpit", "Knee pit"] },
      "correct_answers_i18n": { "ru": ["Подмышка"], "en": ["Armpit"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Что замерзает быстрее: горячая или холодная вода?", "en": "What freezes faster: hot water or cold water?" },
      "options_i18n": { "ru": ["Холодная вода", "Горячая вода", "Замерзают одинаково"], "en": ["Cold water", "Hot water", "Freeze at the same rate"] },
      "correct_answers_i18n": { "ru": ["Горячая вода"], "en": ["Hot water"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как жир покидает ваше тело, когда вы худеете?", "en": "How does fat leave your body when you lose weight?" },
      "options_i18n": { "ru": ["Через пот", "Через мочу", "Через пот, мочу и дыхание", "Через пищеварительную систему"], "en": ["Through sweat", "Through urine", "Through sweat, urine, and breath", "Through the digestive system"] },
      "correct_answers_i18n": { "ru": ["Через пот, мочу и дыхание"], "en": ["Through sweat, urine, and breath"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая часть мозга отвечает за слух и речь?", "en": "Which part of the brain is responsible for hearing and speech?" },
      "options_i18n": { "ru": ["Лобная доля", "Теменная доля", "Затылочная доля", "Височная доля"], "en": ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Temporal lobe"] },
      "correct_answers_i18n": { "ru": ["Височная доля"], "en": ["Temporal lobe"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Группа тигров называется...", "en": "A group of tigers is called..." },
      "options_i18n": { "ru": ["Стая", "Прайд", "Стадо", "Засада"], "en": ["Pack", "Pride", "Herd", "Ambush"] },
      "correct_answers_i18n": { "ru": ["Засада"], "en": ["Ambush"] },
      "duration_seconds": 10,
      "points": 3
    }
  ]
};

let questionIndex = 0;
let questions = [];
let intervalId = null;
let gameTimer = null;            
let currentLang = 'ru'; 
let event_id = 3; //TODO 

// ----------------- Автоматическая проверка статуса и старт игры -----------------
// async function checkAndStartGame() {
//   // если мы ждём результаты или уже всё завершено — ничего не делаем
//   if (appState.currentState === 'waiting-results' || appState.currentState === 'finished') return;

//   try {
//     const eventStatus = await ApiClient.getEventStatus(event_id, telegramId);
//     const quizzes = await ApiClient.listQuizzes(event_id);
//     const activeQuiz = quizzes.find(q => q.is_active);

//     if (eventStatus.game_status === "started" && activeQuiz) {
//       if (appState.currentState !== 'game' && appState.currentState !== 'game-open') {
//         //const raw = await ApiClient.listQuestions(activeQuiz.id);
//         const raw=defaultQuestionsFromJson;
//         questions = shuffle(raw);
//         questionIndex = 0;
//         const firstType = questions[0]?.type;
//         showState(firstType === "open" ? "game-open" : "game");
//         nextQuestion();
//       }
//     } else {
//       if (appState.currentState !== 'waiting') showState("waiting");
//     }
//   } catch (e) {
//     console.error("Произошла ошибка при запуске игры:", e);
//     const adminEl = document.getElementById("admin-notification");
//     if (adminEl) adminEl.textContent = "Ошибка: " + e.message;
//   }
// }

// function qText(q, lang) {
//   //q.text = {ru: "...", en: "..."};
//   if (q?.text?.[lang]) return q.text[lang];
//   if (q?.text?.ru) return q.text.ru;
//   const any = q && q.text && Object.values(q.text)[0];
//   return any ?? "";
// }

// function qOptions(q, lang) {
//   //q.options = {ru: ["..."], en: ["..."]};
//   if (q?.options?.[lang]) return q.options[lang];
//   if (q?.options?.ru) return q.options.ru;
//   const any = q && q.options && Object.values(q.options)[0];
//   return Array.isArray(any) ? any : [];
// }

// function qCorrect(q, lang) {
//   // q.correct_answers = {ru: ["..."], en: ["..."]}
//   if (q?.correct_answers?.[lang]) return q.correct_answers[lang];
//   if (q?.correct_answers?.ru) return q.correct_answers.ru;
//   const any = q && q.correct_answers && Object.values(q.correct_answers)[0];
//   return Array.isArray(any) ? any : [];
// }

function qText(q, lang) {
  return q?.text_i18n?.[lang] ?? q?.text_i18n?.ru ?? "";
}

function qOptions(q, lang) {
  return q?.options_i18n?.[lang] ?? q?.options_i18n?.ru ?? [];
}

function qCorrect(q, lang) {
  return q?.correct_answers_i18n?.[lang] ?? q?.correct_answers_i18n?.ru ?? [];
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


function handleOptionClick(index) {
  const q = questions[questionIndex];
  const options = qOptions(q, currentLang);
  const chosen = options[index];
  const selectedBtn = document.querySelector(`.answer-option[data-index="${index}"]`);

  // блокируем остальные кнопки
  document.querySelectorAll(".answer-option").forEach(btn => btn.classList.add("disabled"));

  ApiClient.sendAnswer(
    telegramId,
    q.id,
    q.quiz_id,
    [chosen],
    currentLang
  )
    .then(res => {
      console.log("Ответ отправлен:", res);

      // ✅ временно всегда зелёный
      selectedBtn.classList.add("correct");

      // переход к следующему вопросу
      setTimeout(() => {
        questionIndex++;
        nextQuestion();
      }, 1500);
    })
    .catch(err => {
      console.error("Ошибка при отправке:", err);
      // при ошибке всё равно отмечаем зелёным (можно поменять на красный, если нужно)
      selectedBtn.classList.add("correct");
    });
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

const defaultQuestions = [
    {
      "type": "single",
      "text_i18n": { "ru": "Оптика изучает что?", "en": "Optics studies what?" },
      "options_i18n": { "ru": ["Звук", "Тепло", "Свет", "Электричество"], "en": ["Sound", "Heat", "Light", "Electricity"] },
      "correct_answers_i18n": { "ru": ["Свет"], "en": ["Light"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Что означает ДНК?", "en": "What does DNA stand for?" },
      "options_i18n": { "ru": ["Дезоксирибонуклеиновая кислота", "Динуклеотидный кислотный агрегат", "ДНК-нуклеиновая кислота", "Динамическая нуклеиновая кислота"], "en": ["Deoxyribonucleic acid", "Dinucleotide acid aggregate", "DNA nucleic acid", "Dynamic nucleic acid"] },
      "correct_answers_i18n": { "ru": ["Дезоксирибонуклеиновая кислота"], "en": ["Deoxyribonucleic acid"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая лунная миссия «Аполлон» была первой, на которой появился луноход?", "en": "Which Apollo mission was the first to use a lunar rover?" },
      "options_i18n": { "ru": ["Аполлон-11", "Аполлон-13", "Аполлон-15", "Аполлон-17"], "en": ["Apollo 11", "Apollo 13", "Apollo 15", "Apollo 17"] },
      "correct_answers_i18n": { "ru": ["Аполлон-15"], "en": ["Apollo 15"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как назывался первый искусственный спутник, запущенный Советским Союзом в 1957 году?", "en": "What was the first artificial satellite launched by the Soviet Union in 1957 called?" },
      "options_i18n": { "ru": ["Восток-1", "Спутник-1", "Луна-1", "Союз-1"], "en": ["Vostok 1", "Sputnik 1", "Luna 1", "Soyuz 1"] },
      "correct_answers_i18n": { "ru": ["Спутник-1"], "en": ["Sputnik 1"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая самая редкая группа крови?", "en": "What is the rarest blood type?" },
      "options_i18n": { "ru": ["0 (I) положительная", "A (II) отрицательная", "B (III) положительная", "AB отрицательная"], "en": ["O positive", "A negative", "B positive", "AB negative"] },
      "correct_answers_i18n": { "ru": ["AB отрицательная"], "en": ["AB negative"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Каковы три основных слоя Земли?", "en": "What are the three main layers of the Earth?" },
      "options_i18n": { "ru": ["Кора, мантия, ядро", "Литосфера, астеносфера, ядро", "Почва, пластмасса, ядро", "Кора, магма, ядро"], "en": ["Crust, mantle, core", "Lithosphere, asthenosphere, core", "Soil, plastic, core", "Crust, magma, core"] },
      "correct_answers_i18n": { "ru": ["Кора, мантия, ядро"], "en": ["Crust, mantle, core"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Лягушки относятся к какой группе животных?", "en": "Frogs belong to which group of animals?" },
      "options_i18n": { "ru": ["Рептилии", "Земноводные", "Млекопитающие", "Рыбы"], "en": ["Reptiles", "Amphibians", "Mammals", "Fish"] },
      "correct_answers_i18n": { "ru": ["Земноводные"], "en": ["Amphibians"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько костей в теле акулы?", "en": "How many bones are in a shark's body?" },
      "options_i18n": { "ru": ["Ноль", "Около 50", "Более 100", "Около 200"], "en": ["Zero", "About 50", "More than 100", "About 200"] },
      "correct_answers_i18n": { "ru": ["Ноль"], "en": ["Zero"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Где расположены самые маленькие кости в организме человека?", "en": "Where are the smallest bones in the human body located?" },
      "options_i18n": { "ru": ["В пальцах", "В носу", "В ухе", "В позвоночнике"], "en": ["In the fingers", "In the nose", "In the ear", "In the spine"] },
      "correct_answers_i18n": { "ru": ["В ухе"], "en": ["In the ear"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько сердец у осьминога?", "en": "How many hearts does an octopus have?" },
      "options_i18n": { "ru": ["Одно", "Два", "Три", "Четыре"], "en": ["One", "Two", "Three", "Four"] },
      "correct_answers_i18n": { "ru": ["Три"], "en": ["Three"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кто предположил, что Солнце находится в центре нашей Солнечной системы?", "en": "Who proposed that the Sun is at the center of our Solar System?" },
      "options_i18n": { "ru": ["Галилео Галилей", "Николай Коперник", "Исаак Ньютон", "Аристотель"], "en": ["Galileo Galilei", "Nicolaus Copernicus", "Isaac Newton", "Aristotle"] },
      "correct_answers_i18n": { "ru": ["Николай Коперник"], "en": ["Nicolaus Copernicus"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кого считают изобретателем телефона?", "en": "Who is credited with inventing the telephone?" },
      "options_i18n": { "ru": ["Томас Эдисон", "Александр Грэхем Белл", "Никола Тесла", "Гульельмо Маркони"], "en": ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"] },
      "correct_answers_i18n": { "ru": ["Александр Грэхем Белл"], "en": ["Alexander Graham Bell"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая планета вращается быстрее всех?", "en": "Which planet rotates the fastest?" },
      "options_i18n": { "ru": ["Меркурий", "Венера", "Земля", "Юпитер"], "en": ["Mercury", "Venus", "Earth", "Jupiter"] },
      "correct_answers_i18n": { "ru": ["Юпитер"], "en": ["Jupiter"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "В воздухе звук распространяется быстрее, чем в воде. Правда или ложь?", "en": "Sound travels faster in air than in water. True or false?" },
      "options_i18n": { "ru": ["Правда", "Ложь"], "en": ["True", "False"] },
      "correct_answers_i18n": { "ru": ["Ложь"], "en": ["False"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какое самое твердое природное вещество на Земле?", "en": "What is the hardest natural substance on Earth?" },
      "options_i18n": { "ru": ["Алмаз", "Сталь", "Кварц", "Графит"], "en": ["Diamond", "Steel", "Quartz", "Graphite"] },
      "correct_answers_i18n": { "ru": ["Алмаз"], "en": ["Diamond"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько зубов у взрослого человека?", "en": "How many teeth does an adult human have?" },
      "options_i18n": { "ru": ["28", "30", "32", "36"], "en": ["28", "30", "32", "36"] },
      "correct_answers_i18n": { "ru": ["32"], "en": ["32"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как звали первую собаку, запущенную в космос?", "en": "What was the name of the first dog launched into space?" },
      "options_i18n": { "ru": ["Белка", "Стрелка", "Лайка", "Звездочка"], "en": ["Belka", "Strelka", "Laika", "Zvezdochka"] },
      "correct_answers_i18n": { "ru": ["Лайка"], "en": ["Laika"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Волосы и ногти сделаны из одного и того же материала. Правда или ложь?", "en": "Hair and nails are made of the same material. True or false?" },
      "options_i18n": { "ru": ["Правда", "Ложь"], "en": ["True", "False"] },
      "correct_answers_i18n": { "ru": ["Правда"], "en": ["True"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Кто была первой женщиной в космосе?", "en": "Who was the first woman in space?" },
      "options_i18n": { "ru": ["Салли Райд", "Валентина Терешкова", "Елена Кондакова", "Пегги Уитсон"], "en": ["Sally Ride", "Valentina Tereshkova", "Elena Kondakova", "Peggy Whitson"] },
      "correct_answers_i18n": { "ru": ["Валентина Терешкова"], "en": ["Valentina Tereshkova"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какое научное слово означает толкать или тянуть?", "en": "Which scientific word means to push or pull?" },
      "options_i18n": { "ru": ["Энергия", "Сила", "Мощность", "Импульс"], "en": ["Energy", "Force", "Power", "Momentum"] },
      "correct_answers_i18n": { "ru": ["Сила"], "en": ["Force"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Где на теле человека больше всего потовых желез?", "en": "Where on the human body are the most sweat glands located?" },
      "options_i18n": { "ru": ["На подмышках", "На ладонях", "На лице", "На подошвах стоп"], "en": ["In the armpits", "On the palms", "On the face", "On the soles of the feet"] },
      "correct_answers_i18n": { "ru": ["На подошвах стоп"], "en": ["On the soles of the feet"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько примерно времени требуется солнечному свету, чтобы достичь Земли?", "en": "Approximately how long does sunlight take to reach the Earth?" },
      "options_i18n": { "ru": ["8 секунд", "8 минут", "8 часов", "8 дней"], "en": ["8 seconds", "8 minutes", "8 hours", "8 days"] },
      "correct_answers_i18n": { "ru": ["8 минут"], "en": ["8 minutes"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Сколько костей в теле взрослого человека?", "en": "How many bones are in the adult human body?" },
      "options_i18n": { "ru": ["200", "206", "212", "218"], "en": ["200", "206", "212", "218"] },
      "correct_answers_i18n": { "ru": ["206"], "en": ["206"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Может ли молния ударить по одному и тому же месту дважды?", "en": "Can lightning strike the same place twice?" },
      "options_i18n": { "ru": ["Да", "Нет"], "en": ["Yes", "No"] },
      "correct_answers_i18n": { "ru": ["Да"], "en": ["Yes"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как называется процесс расщепления пищи?", "en": "What is the process of breaking down food called?" },
      "options_i18n": { "ru": ["Метаболизм", "Пищеварение", "Ассимиляция", "Ферментация"], "en": ["Metabolism", "Digestion", "Assimilation", "Fermentation"] },
      "correct_answers_i18n": { "ru": ["Пищеварение"], "en": ["Digestion"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какой цвет первым бросается в глаза?", "en": "Which color catches the eye first?" },
      "options_i18n": { "ru": ["Красный", "Зеленый", "Желтый", "Синий"], "en": ["Red", "Green", "Yellow", "Blue"] },
      "correct_answers_i18n": { "ru": ["Желтый"], "en": ["Yellow"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая единственная кость в организме человека не прикреплена к другой кости?", "en": "What is the only bone in the human body not attached to another bone?" },
      "options_i18n": { "ru": ["Коленная чашечка", "Подъязычная кость", "Ключица", "Лопатка"], "en": ["Patella", "Hyoid bone", "Clavicle", "Scapula"] },
      "correct_answers_i18n": { "ru": ["Подъязычная кость"], "en": ["Hyoid bone"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как называются животные, активные на рассвете и в сумерках?", "en": "What are animals active at dawn and dusk called?" },
      "options_i18n": { "ru": ["Ночные", "Дневные", "Сумеречные", "Полуночные"], "en": ["Nocturnal", "Diurnal", "Crepuscular", "Midnight-active"] },
      "correct_answers_i18n": { "ru": ["Сумеречные"], "en": ["Crepuscular"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "При какой температуре градусы Цельсия и Фаренгейта равны?", "en": "At what temperature are Celsius and Fahrenheit equal?" },
      "options_i18n": { "ru": ["0", "-40", "-100", "-273"], "en": ["0", "-40", "-100", "-273"] },
      "correct_answers_i18n": { "ru": ["-40"], "en": ["-40"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какие четыре основных драгоценных металла?", "en": "What are the four main precious metals?" },
      "options_i18n": { "ru": ["Золото, серебро, медь, цинк", "Золото, серебро, платина, палладий", "Золото, железо, никель, олово", "Серебро, алюминий, титан, вольфрам"], "en": ["Gold, silver, copper, zinc", "Gold, silver, platinum, palladium", "Gold, iron, nickel, tin", "Silver, aluminum, titanium, tungsten"] },
      "correct_answers_i18n": { "ru": ["Золото, серебро, платина, палладий"], "en": ["Gold, silver, platinum, palladium"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Космических путешественников из Китая называют...", "en": "Chinese space travelers are called..." },
      "options_i18n": { "ru": ["Астронавтами", "Космонавтами", "Тайконавтами", "Спутринавтами"], "en": ["Astronauts", "Cosmonauts", "Taikonauts", "Sputronauts"] },
      "correct_answers_i18n": { "ru": ["Тайконавтами"], "en": ["Taikonauts"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Подмышечная впадина - это какая часть тела?", "en": "The axillary fossa is which part of the body?" },
      "options_i18n": { "ru": ["Пах", "Шея", "Подмышка", "Коленный сгиб"], "en": ["Groin", "Neck", "Armpit", "Knee pit"] },
      "correct_answers_i18n": { "ru": ["Подмышка"], "en": ["Armpit"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Что замерзает быстрее: горячая или холодная вода?", "en": "What freezes faster: hot water or cold water?" },
      "options_i18n": { "ru": ["Холодная вода", "Горячая вода", "Замерзают одинаково"], "en": ["Cold water", "Hot water", "Freeze at the same rate"] },
      "correct_answers_i18n": { "ru": ["Горячая вода"], "en": ["Hot water"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Как жир покидает ваше тело, когда вы худеете?", "en": "How does fat leave your body when you lose weight?" },
      "options_i18n": { "ru": ["Через пот", "Через мочу", "Через пот, мочу и дыхание", "Через пищеварительную систему"], "en": ["Through sweat", "Through urine", "Through sweat, urine, and breath", "Through the digestive system"] },
      "correct_answers_i18n": { "ru": ["Через пот, мочу и дыхание"], "en": ["Through sweat, urine, and breath"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Какая часть мозга отвечает за слух и речь?", "en": "Which part of the brain is responsible for hearing and speech?" },
      "options_i18n": { "ru": ["Лобная доля", "Теменная доля", "Затылочная доля", "Височная доля"], "en": ["Frontal lobe", "Parietal lobe", "Occipital lobe", "Temporal lobe"] },
      "correct_answers_i18n": { "ru": ["Височная доля"], "en": ["Temporal lobe"] },
      "duration_seconds": 10,
      "points": 3
    },
    {
      "type": "single",
      "text_i18n": { "ru": "Группа тигров называется...", "en": "A group of tigers is called..." },
      "options_i18n": { "ru": ["Стая", "Прайд", "Стадо", "Засада"], "en": ["Pack", "Pride", "Herd", "Ambush"] },
      "correct_answers_i18n": { "ru": ["Засада"], "en": ["Ambush"] },
      "duration_seconds": 10,
      "points": 3
    }
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

