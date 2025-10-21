
const tg = window.Telegram?.WebApp;
tg?.expand();
const telegramUser = tg?.initDataUnsafe?.user;
const telegramId = telegramUser?.id;

function applyTheme() {
  document.documentElement.dataset.theme = tg?.colorScheme === 'dark' ? 'dark' : 'light';
}
applyTheme();
tg?.onEvent('themeChanged', applyTheme);

const I18N = {
  ru: {
    app: { title: "🎯 Квиз-игра" },
    registration: {
      subtitle: "Зарегистрируйтесь для участия. Введите ваше имя и фамилию:",
      firstname_ph: "Введите фамилию",
      lastname_ph: "Введите имя",
      nickname_ph: "Введите никнейм",
      choose_lang: "Выберите язык / Select language",
      lang_ru: "Русский",
      lang_en: "English",
      lang_kk: "Қазақ тілі",
      join_btn: "Участвовать!"
    },
    waiting: {
      title: "Ожидаем начала игры",
      nickname_label: "Ваш никнейм:",
      wait_text: "Как только админ запустит игру, здесь появится первый вопрос. Оставайтесь на связи! Если игра не началась, обновите страницу"
    },
    waiting_results: {
      title: "Ожидаем…",
      nickname_label: "Ваш никнейм:",
      text: "Как только игра завершится, произойдёт подсчёт очков. Новая игра начнётся на следующем брейке. Если игра зависла, обновите страницу"
    },
    common: {
      logout: "Поменять язык"
    },
    game: {
      question_label: "Вопрос",
      loading_question: "Текст текущего вопроса загружается...",
      answer_ph: "Введите ваш развернутый ответ здесь...",
      submit: "Отправить ответ",
      image_question: "Угадай, которая из картинок сгенерирована при помощи искусственного интеллекта."
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
      firstname_ph: "Enter First name",
      lastname_ph: "Enter Last name",
      nickname_ph: "Enter nickname",
      choose_lang: "Select language / Выберите язык",
      lang_ru: "Русский",
      lang_en: "English",
      lang_kk: "Қазақ тілі",
      join_btn: "Join!"
    },
    waiting: {
      title: "Waiting to start",
      nickname_label: "Your nickname:",
      wait_text: "As soon as the admin starts the game, the first question will appear here. Stay tuned! If the game hasn't started, refresh the page."
    },
    waiting_results: {
      title: "Waiting…",
      nickname_label: "Your nickname:",
      text: "When the game ends, we'll count the points! A new game starts on the next break. If the game freezes, refresh the page."
    },
    common: {
      logout: "Change the language"
    },
    game: {
      question_label: "Question",
      loading_question: "Loading the current question...",
      answer_ph: "Type your detailed answer here...",
      submit: "Submit answer",
      image_question: "Guess which of these images was generated using artificial intelligence."
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
  },
  kk: {
    app: { title: "🎯 Квиз ойыны" },
    registration: {
      subtitle: "Қатысу үшін тіркеліңіз. Атыңыз бен тегіңізді енгізіңіз:",
      firstname_ph: "Фамилияңызды енгізіңіз",
      lastname_ph: "Атыңызды енгізіңіз",
      nickname_ph: "Никнеймді енгізіңіз",
      choose_lang: "Тілді таңдаңыз / Select language",
      lang_ru: "Орыс тілі",
      lang_en: "English",
      lang_kk: "Қазақ тілі",
      join_btn: "Қатысу!"
    },
    waiting: {
      title: "Ойынның басталуын күтіңіз",
      nickname_label: "Сіздің никнейміңіз:",
      wait_text: "Админ ойынды іске қосқан сәтте, мұнда бірінші сұрақ шығады. Байланыста болыңыз! Ойын басталмаса, бетті жаңартыңыз."
    },
    waiting_results: {
      title: "Күтеміз…",
      nickname_label: "Сіздің никнейміңіз:",
      text: "Ойын аяқталған бойда ұпайлар есептеледі! Келесі үзілісте жаңа ойын басталады. Ойын қатып қалса, бетті жаңартыңыз."
    },
    common: {
      logout: "Тілді өзгерту"
    },
    game: {
      question_label: "Сұрақ",
      loading_question: "Сұрақтың мәтіні жүктелуде...",
      answer_ph: "Толық жауабыңызды осында енгізіңіз...",
      submit: "Жауапты жіберу",
      image_question: "Жасанды интеллект көмегімен қай сурет жасалғанын тап."
    },
    between: {
      title: "Жауап қабылданды!",
      next_in: "Келесі сұрақтың пайда болуына <span id=\"between-timer\">5</span> секунд...",
      stay_tuned: "Бізбен бірге болыңыздар! Сіз жеңіске бір қадам жақындадыңыз..."
    },
    finished: {
      title: "Ойын аяқталды!",
      thanks: "Жауаптарыңыз бен қатысқаныңыз үшін рақмет!",
      processing: "Қазір  біздің ЖИ-ассистент нәтижелерді талдап жатыр. Қорытынды мен жеңімпаздар тізімі кейінірек осында жарияланады."
    },
    winner: {
      title: "Құттықтаймыз!",
      text: "Сіздің жауаптарыңыз ең үздіктердің қатарында болды! Сіз жеңімпаздар қатарына кірдіңіз!",
      prize_title: "Сіздің жүлдеңіз:",
      prize_text: "Өзіңізге лайық жүлдені алу үшін <strong id=\"winner-nickname\"></strong> бірінші қабаттағы ұйымдастырушылардың тіркеу үстеліне барып, никнейміңіз айтыңыз.",
      thanks_again: "Қатысқаныңыз үшін тағы да рақмет!"
    }
  },
};

function setRegistrationViewMode(mode) {
  if (mode === 'langOnly') {
    nameFields.classList.add('hidden');
    langSelect.classList.remove('hidden');
    toggleNameFields(false);
    registrationForm.noValidate = true;     // отключаем HTML5-валидацию
    setJoinButtonMode('langOnly');
  } else {
    nameFields.classList.remove('hidden');
    langSelect.classList.remove('hidden');
    toggleNameFields(true);
    registrationForm.noValidate = false;
    setJoinButtonMode('full');
  }
}

const t = (keyPath, lang) => {
  const l = lang || (window.appState?.lang) || 'ru';
  return keyPath.split('.').reduce((acc, k) => acc?.[k], I18N[l]) ?? '';
};

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

  const imageQuestionText = document.querySelector('#state-game-image #question-text');
  if (imageQuestionText) {
    imageQuestionText.textContent = t('game.image_question', lang);
  }
}

function quizKey(eventId, quizId) {
  return `quiz:${eventId}:${quizId}:${telegramId}`;
}

function readQuizMark(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    // если вдруг был битый JSON — зачистим и вернём пусто
    localStorage.removeItem(key);
    return {};
  }
}

function updateQuestionProgressLabel() {
  const container = document.querySelector(`#state-${appState.currentState} #question-progress`);
  const curEl = document.querySelector(`#state-${appState.currentState} #current-q`);
  const totEl = document.querySelector(`#state-${appState.currentState} #total-qs`);
  if (!container) return;

  const current = curEl ? curEl.textContent : '1';
  const total = totEl ? totEl.textContent : '1';
  container.innerHTML = `${t('game.question_label')} <span id="current-q">${current}</span>/<span id="total-qs">${total}</span>`;
}

function detectDefaultLang() {
  const saved = localStorage.getItem('lang');
  if (saved) return saved;

  const code = tg?.initDataUnsafe?.user?.language_code || '';
  if (code.startsWith('kk')) return 'kk';
  if (code.startsWith('ru')) return 'ru';
  return 'en';
}

let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
  points: null,
  lang: detectDefaultLang(),
};

function syncHtmlLang() {
  const lang = appState.lang || 'ru';
  document.documentElement.lang = lang;
  document.documentElement.dir = ['ar','he','fa','ur'].includes(lang) ? 'rtl' : 'ltr';
}
syncHtmlLang();
applyTranslations(document);

const registrationForm = document.getElementById("registration-form");
const joinBtn = document.getElementById("register-btn");
const nameFields = document.querySelector("#registration-form .name-fields");
const langSelect = document.querySelector("#registration-form .lang-select");
const nicknameInput = document.getElementById("nickname-input");
const firstNameInput = document.getElementById("firstname-input");
const lastNameInput = document.getElementById("lastname-input");
const registrationError = document.getElementById("registration-error");

function toggleNameFields(enabled) {
  document
    .querySelectorAll('#registration-form .name-fields input')
    .forEach(i => { i.disabled = !enabled; i.required = !!enabled; });
}

function setJoinButtonMode(mode) {
  if (mode === 'langOnly') {
    // кнопка НЕ сабмитит форму, просто сохраняет язык и переводит на waiting
    joinBtn.type = 'button';
    joinBtn.onclick = async () => {
      const lang = (new FormData(registrationForm).get('lang') || 'ru').toLowerCase();
      appState.lang = lang;
      localStorage.setItem('lang', lang);
      syncHtmlLang();
      applyTranslations(document);
      // если пользователь уже авторизован — просто уходим на ожидание
      if (appState.userId) {
        showState('waiting');
        startPolling();
        checkAndStartGame().catch(console.error);
      } else {
        // если вдруг не залогинен — покажем поля
        setRegistrationViewMode('full');
      }
    };
  } else {
    // обычный submit
    joinBtn.type = 'submit';
    joinBtn.onclick = null;
  }
}

document.addEventListener('change', (e) => {
  if (e.target && e.target.name === 'lang') {
    appState.lang = e.target.value.toLowerCase();
    localStorage.setItem('lang', appState.lang);
    syncHtmlLang();
    applyTranslations(document);

    if (appState.userId) {
      // У пользователя есть аккаунт — оставляем только язык
      setRegistrationViewMode('langOnly');
    }
  }
});


registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const lang = (new FormData(registrationForm).get('lang') || appState.lang || 'ru').toLowerCase();
  if (!nickname || !firstName || !lastName) return;

  try {
    registrationError.classList.add("hidden");
    console.log("🚀 Начало процесса регистрации/авторизации...");

    const userData = await ApiClient.registerOrGetUser(telegramId, nickname, firstName, lastName);

    appState.userId = userData.id;
    appState.userNickname = userData.nickname;
    appState.points = userData.points;
    appState.lang = lang;

    localStorage.setItem('lang', appState.lang);
    syncHtmlLang();
    applyTranslations(document);

    console.log("✅ Пользователь вошёл:", appState);
    primeAudio();
    showState('waiting');  
    startPolling();       
  } catch (err) {
    console.error("❌ Ошибка входа:", err);
    registrationError.textContent = err.message;
    registrationError.classList.remove("hidden");
  }
});
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
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");
  const nicknameElements = el?.querySelectorAll("[id$='nickname']") || [];
  nicknameElements.forEach(elm => {
    elm.textContent = appState.userNickname || '';
  });
  appState.currentState = state;
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

let finishing = false;

async function finishGamePhase() {
  if (finishing) return;
  finishing = true;
  try {
    stopPolling();         
    const event_id = await getActiveEventId(telegramId);
    let phase = await ApiClient.getEventStatus(event_id, telegramId);

    if (questions.length > 0) {
      const quizId = questions[0]?.quiz_id;
      if (quizId) {
        const key = quizKey(event_id, quizId); // 👈 event_id
        localStorage.setItem(key, JSON.stringify({ completed: true }));
      }
    }
    stopBg();
    clearQuizTitle();

    if (phase.game_status === "finished") {
      showState("finished");
    } else if (phase.game_status === "registration") {
      showState("registration");
    } else {
      showState("waiting-results");
    }

  } catch (e) {
    console.error("Ошибка завершения фазы:", e);
    const adminEl = document.getElementById("admin-notification");
    if (adminEl) adminEl.textContent = "Ошибка завершения фазы: " + e.message;
  } finally {
    finishing = false;
  }
}

let gameStarted = false;
let questionIndex = 0;
let questions = [];
let intervalId = null;
let gameTimer = null;
let currentLang = appState.lang;
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
    const status = String(eventStatus?.game_status || '').trim().toLowerCase();

    const quizzes = await ApiClient.listQuizzes(event_id);
    const activeQuiz = quizzes.find(q => q?.is_active === true);
    setQuizTitle(activeQuiz);
    console.log('status=', status, 'activeQuiz=', activeQuiz);

    if (status === "started" && activeQuiz) {
      const key = quizKey(event_id, activeQuiz.id);
      const mark = readQuizMark(key);

      if (mark?.completed) {
        console.log("⛔ Уже проходил этот квиз — показываем ожидание результатов");
        showState("waiting-results");
        return;
      }

      if (appState.currentState !== 'game' && appState.currentState !== 'game-open' && appState.currentState !== 'game-image') {
        currentLang = appState.lang;

        const rawQuestions = await ApiClient.listQuestions(activeQuiz.id, currentLang, true, telegramId);
        const seen = new Set();
        const unique = [];
        for (const q of rawQuestions || []) {
          if (q && !seen.has(q.id)) { seen.add(q.id); unique.push(q); }
        }
        const preparedQuestions = unique.map(q => ({ ...q, quiz_id: activeQuiz.id }));

        questions = shuffle(preparedQuestions).slice(0, 15);
        questionIndex = 0;
        askedQuestionIds.clear();

        if (!questions.length) {
          console.warn('Нет вопросов для активного квиза');
          showState('waiting');
          return;
        }

        // Определяем начальный экран по типу первого вопроса
        const firstType = questions[0]?.type;
        if (firstType === "image") {
          showState("game-image");
        } else if (firstType === "open") {
          showState("game-open");
        } else {
          showState("game");
        }

        await playCountdownVideoOncePerQuiz(activeQuiz.id);

        nextQuestion();
        startBg(0.18); 

        localStorage.setItem(key, JSON.stringify({ inProgress: true }));
      }
    } else {
      clearQuizTitle();
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

function qText(q) {
  const pref = appState.lang || 'ru';
  const i18n = q?.text_i18n || {};
  return i18n[pref] ?? i18n.ru ?? i18n.en ?? q?.text ?? "";
}

function qOptions(q) {
  const pref = appState.lang || 'ru';
  const i18n = q?.options_i18n || {};
  if (Array.isArray(i18n[pref])) return i18n[pref];
  if (Array.isArray(i18n.ru))   return i18n.ru;
  if (Array.isArray(i18n.en))   return i18n.en;
  return Array.isArray(q?.options) ? q.options : [];
}

function qCorrect(q) { return []; }

function setQuizTitle(quiz) {
  const el = document.querySelector(".question-header .quiz-title");
  if (el) el.textContent = quiz?.name || "";
}

document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  // например Ctrl+C, Ctrl+S, Ctrl+P
  if (e.ctrlKey && ['c','s','p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

function clearQuizTitle() {
  setQuizTitle(null);
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

async function getActiveEventId() {
  try {
    const events = await ApiClient.listEvents();
    if (!events || !events.length) throw new Error("Нет доступных событий");

    const active = events.find(e => String(e?.game_status || '').trim().toLowerCase() === "started");
    if (active) return active.id;

    const latest = events.reduce((max, e) => e.id > max.id ? e : max, events[0]);
    return latest.id;
  } catch (err) {
    console.error("❌ Ошибка при получении event_id:", err);
    return 1;
  }
}

async function handleOptionClick(index) {
  const q = questions[questionIndex];
  const options = qOptions(q);
  const chosen = options[index];
  const selectedBtn = document.querySelector(`.answer-option[data-index="${index}"]`);

  document.querySelectorAll(".answer-option").forEach(btn => {
    btn.classList.add("disabled");
    btn.style.pointerEvents = "none";
  });
  selectedBtn?.classList.add("selected");

  let res; // 👈 вынесли наверх
  try {
    res = await ApiClient.sendAnswer(telegramId, q.id, q.quiz_id ?? 1, [chosen], currentLang);
    console.log("✅ Ответ отправлен:", res);

    const isCorrect = !!(res?.awarded_points != 0);
    selectedBtn?.classList.remove("selected");
    selectedBtn?.classList.add(isCorrect ? "correct" : "incorrect");
    playSfx(isCorrect ? "correct" : "wrong", isCorrect ? 1 : 0.9);

    // ✅ проверяем завершение ВНУТРИ try
    if (res?.isCompleted) {
      console.log("🎬 Викторина завершена сервером");
      await playEndQuizVideo();
      finishGamePhase();
      return;
    }

  } catch (err) {
    console.error("Ошибка при отправке:", err);
    selectedBtn?.classList.remove("selected");
    selectedBtn?.classList.add("incorrect");
  }

  setTimeout(() => { questionIndex++; nextQuestion(); }, 1500);
}

async function handleImageOptionClick(index) {
  const q = questions[questionIndex];
  const selectedBtn = document.querySelector(`.answer-option[data-index="${index}"]`);

  document.querySelectorAll(".answer-option").forEach(btn => {
    btn.classList.add("disabled");
    btn.style.pointerEvents = "none";
  });
  selectedBtn?.classList.add("selected");

  let res;
  try {
    const chosenOption = qOptions(q)[index];
    res = await ApiClient.sendAnswer(telegramId, q.id, q.quiz_id ?? 1, [chosenOption], currentLang);
    console.log("✅ Ответ отправлен:", res);

    const isCorrect = !!(res?.awarded_points != 0);
    selectedBtn?.classList.remove("selected");
    selectedBtn?.classList.add(isCorrect ? "correct" : "incorrect");
    playSfx(isCorrect ? 'correct' : 'wrong', isCorrect ? 1 : 0.9);

    if (res?.isCompleted) {
      console.log("🎬 Викторина завершена сервером");
      await playEndQuizVideo();
      finishGamePhase();
      return;
    }

  } catch (err) {
    console.error("Ошибка при отправке:", err);
    selectedBtn?.classList.remove("selected");
    selectedBtn?.classList.add("incorrect");
  }

  setTimeout(() => { questionIndex++; nextQuestion(); }, 1500);
}

function qs(id) {
  return document.querySelector(`#state-${appState.currentState} #${id}`);
}

function qsa(sel) {
  return document.querySelectorAll(`#state-${appState.currentState} ${sel}`);
}

const askedQuestionIds = new Set();

function nextQuestion() {
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
  if (q?.id != null) askedQuestionIds.add(q.id);

  const qTextEl = qs("question-text");
  const curEl   = qs("current-q");
  const totEl   = qs("total-qs");
  const timerEl = qs("question-timer");
  if (!qTextEl || !curEl || !totEl || !timerEl) return;

  curEl.textContent = String(questionIndex + 1);
  totEl.textContent = String(questions.length);
  updateQuestionProgressLabel();

  let timer = q?.duration_seconds || 25;
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
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

  // Выбор экрана по типу вопроса
  if (q.type === "single") {
    if (images_urls){
      showState("game-image");
      renderImageQuestion(q);
    }
    showState("game");
    qTextEl.textContent = qText(q, currentLang);
    renderOptions(qOptions(q, currentLang));
  } else {
    showState("game-open");
    qTextEl.textContent = qText(q, currentLang);
    const textarea = qs("answer-textarea");
    const submitBtn = qs("submit-answer-btn");
    if (textarea && submitBtn) {
      textarea.setAttribute('placeholder', t('game.answer_ph'));
      submitBtn.textContent = t('game.submit');
      submitBtn.disabled = false;

      // ⬇️ ВАЖНО: проверяем isCompleted ПОСЛЕ отправки
      submitBtn.onclick = async () => {
        submitBtn.disabled = true;
        const res = await ApiClient.sendAnswer(
          telegramId, q.id, q.quiz_id, [textarea.value], currentLang
        );

        if (res?.isCompleted) {
          await playEndQuizVideo();
          finishGamePhase();
          return;
        }

        setTimeout(() => { questionIndex++; nextQuestion(); }, 1000);
      };
    }
  }
}

// Функция для рендеринга вопроса с одной картинкой
function renderImageQuestion(q) {
  const singleImageContainer = document.querySelector('.single-image-container');
  const collageImage = document.querySelector('.collage-image');
  const optionsContainer = qs("options");
  
  if (!singleImageContainer || !collageImage || !optionsContainer) return;

  // Очищаем варианты ответов
  optionsContainer.innerHTML = "";

  // Устанавливаем картинку (можно оставить фиксированной или брать из вопроса)
  collageImage.src = q.images_urls?.[0] ? `${API_BASE_URL}${q.images_urls[0]}` : "./picture.jpg";
  collageImage.alt = "Варианты картинок A, B, C, D";

  // Рендерим варианты ответов
  const options = qOptions(q, currentLang);
  options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "answer-option";
    btn.dataset.index = i;
    btn.textContent = opt;
    btn.onclick = () => handleImageOptionClick(i);
    optionsContainer.appendChild(btn);
  });
}

// Показываем выбор языка без разлогина
function showLanguagePicker() {
  stopPolling();
  // ВАЖНО: НЕ обнуляем appState.userId, чтобы пользователь оставался "зарегистрирован"
  stopBg();
  setRegistrationViewMode('langOnly');
  showState('registration');
}

// Если прям нужен настоящий логаут — оставь отдельную функцию:
function logoutHard() {
  stopPolling();   
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  stopBg();
  setRegistrationViewMode('full');
  showState('registration');
}

document.addEventListener("DOMContentLoaded", async () => {
  const ru = document.getElementById('lang-ru');
  const en = document.getElementById('lang-en');
  const kk = document.getElementById('lang-kk');
  if (ru && en && kk) {
    (appState.lang === 'ru' ? ru : appState.lang === 'en' ? en : kk).checked = true;
  }

  applyTranslations(document);

  const nameFields = document.querySelector("#registration-form .name-fields");
  const langSelect = document.querySelector("#registration-form .lang-select");

  try {
    console.log("🚀 Проверяем, есть ли пользователь...");
    const userData = await ApiClient.registerOrGetUser(
      telegramId,
      "autouser",
      "auto",
      "user"
    );

    if (userData && userData.id) {
      console.log("✅ Пользователь найден, автологин:", userData);

      appState.userId = userData.id;
      appState.userNickname = userData.nickname;
      appState.points = userData.points;

      // Показываем только выбор языка
      setRegistrationViewMode('langOnly');

      primeAudio();
      showState("waiting");
      startPolling();
      checkAndStartGame().catch(e => console.error("Стартовая проверка игры:", e));
      return;
    }

    console.log("🆕 Не найден — показываем полную форму");
    setRegistrationViewMode('full');
    showState("registration");
  } catch (err) {
    console.error("❌ Ошибка при автологине:", err);
    setRegistrationViewMode('full');
    showState("registration");
  }
});

const SFX = {
  bg      : document.getElementById('sfx-bg'),
  correct : document.getElementById('sfx-correct'),
  wrong   : document.getElementById('sfx-wrong'),
};

let sfxEnabled = true;          
let audioPrimed = false;      

function primeAudio() {
  if (audioPrimed) return;
  audioPrimed = true;
  // одноразово пытаемся запустить и тут же остановить
  const a = SFX.correct;
  a.volume = 0;
  a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(()=>{});
}

function playSfx(name, vol = 1) {
  if (!sfxEnabled) return;
  const el = SFX[name];
  if (!el) return;
  try {
    el.currentTime = 0;
    el.volume = vol;
    el.play().catch(()=>{});
  } catch(_) {}
}

function startBg(vol = 0.2) {
  if (!sfxEnabled) return;
  const bg = SFX.bg;
  if (!bg) return;
  bg.volume = vol;
  // если уже играет, повторно не запускаем
  if (!bg.paused) return;
  bg.play().catch(()=>{});
}
function stopBg() {
  const bg = SFX.bg;
  if (!bg) return;
  try { bg.pause(); } catch(_) {}
  bg.currentTime = 0;
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopBg();
  else if (appState.currentState === 'game' || appState.currentState === 'game-open') startBg();
});

// Флаг: какие квизы уже показывали отсчёт
const countdownPlayedForQuiz = new Set();

function playCountdownVideoOncePerQuiz(quizId) {
  return new Promise((resolve) => {
    if (!quizId || countdownPlayedForQuiz.has(quizId)) {
      resolve(false);
      return;
    }

    const overlay = document.getElementById('countdown-overlay');
    const video = document.getElementById('countdown-video');
    if (!overlay || !video) {
      resolve(false);
      return;
    }

    // На время видео — приглушаем фон
    const wasBgPlaying = !SFX.bg?.paused;
    stopBg();

    // Показали оверлей
    overlay.classList.remove('hidden');

    // Гарантируем старт (на некоторых девайсах нужен reset currentTime)
    video.currentTime = 0;

    // Автовоспроизведение разрешено т.к. muted
    const onFinish = () => {
      video.removeEventListener('ended', onFinish);
      video.removeEventListener('error', onFinish);
      overlay.classList.add('hidden');
      countdownPlayedForQuiz.add(quizId);

      // Вернём фон если он был включён
      if (wasBgPlaying) startBg(0.18);

      resolve(true);
    };

    video.addEventListener('ended', onFinish);
    video.addEventListener('error', onFinish);

    // Стартуем
    video.play().catch(() => {
      // Если не получилось автоплеем — просто скрываем и продолжаем
      onFinish();
    });
  });
}

async function playEndQuizVideo() {
  return new Promise((resolve) => {
    const overlayId = "endquiz-overlay";
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.zIndex = "9999";
      overlay.style.background = "#000";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      document.body.appendChild(overlay);
    }

    let video = overlay.querySelector("video");
    if (!video) {
      video = document.createElement("video");
      video.src = "./sfx/endquiz.mp4";
      video.autoplay = true;
      video.playsInline = true;
      video.muted = false;
      video.style.width = "100vw";
      video.style.height = "100vh";
      video.style.objectFit = "cover";
      overlay.appendChild(video);
    }

    // Останавливаем фон
    const wasBgPlaying = !SFX.bg?.paused;
    stopBg();
    overlay.classList.remove("hidden");

    const cleanup = () => {
      overlay.classList.add("hidden");
      if (wasBgPlaying) startBg(0.18);
      resolve(true);
    };

    const onFinish = () => {
      video.removeEventListener("ended", onFinish);
      video.removeEventListener("error", onFinish);
      cleanup();
    };

    video.addEventListener("ended", onFinish);
    video.addEventListener("error", cleanup);
    video.play().catch(() => onFinish());
  });
}


// ===== Anti-screenshot blur =====
(function setupAntiScreenshot() {
  const overlayId = 'anti-screenshot-overlay';
  let overlay = document.getElementById(overlayId);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = overlayId;
    document.body.appendChild(overlay);
  }

  let blurTimer = null;
  const BLUR_ON_MS  = 0;     // без задержки включаем
  const BLUR_OFF_MS = 120;   // маленькая задержка на снятие — меньше мерцания

  const setBlur = (on) => {
    clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
      overlay.style.opacity = on ? '1' : '0';
      document.documentElement.classList.toggle('is-screen-blurred', on);
    }, on ? BLUR_ON_MS : BLUR_OFF_MS);
  };

  // Потеря фокуса/видимости — включаем
  window.addEventListener('blur', () => setBlur(true));
  document.addEventListener('visibilitychange', () => {
    setBlur(document.hidden);
  });

  // Возврат фокуса — выключаем
  window.addEventListener('focus', () => setBlur(false));

  // На мобильных иногда срабатывает при сворачивании
  window.addEventListener('pageshow', () => setBlur(false));
  window.addEventListener('pagehide', () => setBlur(true));

  // На старте — вдруг вкладка уже не активна
  setBlur(document.hidden || !document.hasFocus());
})();
