let appState = {
  currentState: 'registration',
  userId: null,
  userNickname: '',
};

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
    const res = await ApiClient.registerUser(telegramId, nickname);
    appState.userId = telegramId;
    appState.userNickname = nickname;

    // Показываем успешную регистрацию
    // registeredNickname.textContent = nickname;
    // registrationSuccess.classList.remove("hidden");

    // Проверка на админа
    const isAdmin = await ApiClient.checkAdmin(telegramId);
    if (isAdmin.is_admin) {
        showState("admin");
    } else {
        showState("waiting");
    }
  } catch (err) {
    registrationError.textContent = err.message;
    registrationError.classList.remove("hidden");
  }
});

// Функция для переключения экранов
function showState(state) {
  document.querySelectorAll(".state").forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(`state-${state}`);
  if (el) el.classList.remove("hidden");
  appState.currentState = state;
}

// Выход/смена никнейма
function logout() {
  appState.userId = null;
  appState.userNickname = '';
  nicknameInput.value = '';
  showState('registration');
}
