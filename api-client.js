const API_BASE = "https://6d5931e05cd9.ngrok-free.app";

const ApiClient = {
  // Регистрация пользователя
  registerUser: async (telegramId, nickname) => {
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_id: telegramId, nickname })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка регистрации");
      }
      return await res.json(); // возвращает id или строку подтверждения
    } catch (e) {
      console.error("API registerUser error:", e);
      throw e;
    }
  },

  // Проверка, является ли пользователь админом
  checkAdmin: async (telegramId) => {
    try {
      const res = await fetch(`${API_BASE}/users/check_admin?telegram_id=${telegramId}`, {
        method: "POST"
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка проверки админа");
      }
      return await res.json(); // true/false или строка
    } catch (e) {
      console.error("API checkAdmin error:", e);
      throw e;
    }
  }
};
