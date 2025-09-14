const API_BASE = "https://6d5931e05cd9.ngrok-free.app";

const ApiClient = {
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
      return await res.json();
    } catch (e) {
      console.error("API registerUser error:", e);
      throw e;
    }
  },

  checkAdmin: async (telegramId) => {
    try {
      const res = await fetch(`${API_BASE}/users/check_admin?telegram_id=${telegramId}`, {
        method: "POST"
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка проверки админа");
      }
      return await res.json();
    } catch (e) {
      console.error("API checkAdmin error:", e);
      throw e;
    }
  }
};
