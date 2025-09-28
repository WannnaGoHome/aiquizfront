const API_BASE = "https://56de7dc3b07a.ngrok-free.app";

const ApiClient = {

  getUser: async (telegram_id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${telegram_id}`, {
        method: "GET",
        headers: { "Accept": "application/json",
        "ngrok-skip-browser-warning": "1"
        },
      });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // Если сервер вернул HTML (ngrok free, ошибка CORS и т.п.)
      if (!contentType.includes("application/json")) {
        console.error("Non-JSON response from server:", text.substring(0, 200));
        throw new Error("Сервер вернул не JSON (скорее всего ngrok/CORS).");
      }

      const data = JSON.parse(text);

      if (!res.ok) {
        const error = new Error(data.detail?.message || `HTTP ${res.status}`);
        error.detail = data.detail;
        error.status = res.status;
        throw error;
      }

      return data;
    } catch (e) {
      console.error("API getUser error:", e);
      throw e;
    }
  },

  registerUser: async (telegramId, nickname) => {
    try {
      const res = await fetch(`${API_BASE}/users/register/?telegram_id=1234`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({ telegram_id: telegramId, nickname })
      });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      if (!contentType.includes("application/json")) {
        console.error("Non-JSON response from server:", text.substring(0, 200));
        throw new Error("Сервер вернул не JSON (скорее всего ngrok/CORS).");
      }

      const data = JSON.parse(text);

      if (!res.ok) {
        const err = new Error(data.detail?.message || `HTTP ${res.status}`);
        err.detail = data.detail;
        throw err;
      }

      return data;
    } catch (e) {
      console.error("API registerUser error:", e);
      throw e;
    }
  },

  registerOrGetUser: async (telegramId, nickname) => {
    console.log("🔍 Проверяем существующего пользователя...");
    let user = null;
    try {
      user = await ApiClient.getUser(telegramId);
      console.log("✅ Пользователь найден:", user);
      return user;
    } catch (err) {
      if (err.status === 401 || err.status === 404) {
        console.log("Пользователь не найден. Регистрируем...");
      } else {
        throw err;
      }
    }

    const newUser = await ApiClient.registerUser(telegramId, nickname);
    console.log("✅ Новый пользователь зарегистрирован:", newUser);
    return newUser;
  },

  checkAdmin: async (telegram_id) => {
    try {
      const res = await fetch(`${API_BASE}/users/check_admin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({ telegram_id })
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
  },

  getEventStatus: async (eventId, telegram_id) => {
      try {
          const res = await fetch(`${API_BASE}/events/${eventId}?telegram_id=${telegram_id}`, { 
            method: "GET",
            headers: { "Accept": "application/json",
            "ngrok-skip-browser-warning": "1"
          },
        });
        if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения статуса события");
        }
        return await res.json();
      } catch (e) {
          console.error("API getEventStatus error:", e);
          throw e;
      }
  },

  listQuizzes: async (eventId) => {
      try {
        const res =  await fetch(`${API_BASE}/quizes/quizes/by-event/${eventId}`, {
          method: "GET", 
          headers: { "Accept": "application/json",
            "ngrok-skip-browser-warning": "1"
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения списка викторин");
        }
        return await res.json();
      } catch (e) {
        console.error("API listQuiz error:", e);
        throw e;
      }
  },

  listQuestions: async (quizId, locale, include_correct, telegram_id) => {
  try {
    const res = await fetch(`${API_BASE}/quizes/${quizId}/questions?locale=${locale}&include_correct=${include_correct}&telegram_id=${telegram_id}`, {
      headers: {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "1"
      }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения вопросов");
    }
    const data = await res.json();
    // 👇 ВСЕГДА МАССИВ
    return Array.isArray(data) ? data : [data];
  } catch (e) {
    console.error("API listQuestions error:", e);
    throw e;
  }
  },

  listEvents: async (telegram_id) => {
    try {
      const res = await fetch(`${API_BASE}/events/?telegram_id=${telegram_id}`, {
        method: "GET", 
        headers: { 
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения списка событий");
      }
      return await res.json();
    } catch (e) {
      console.error("API listEvents error:", e);
      throw e;
    }
  },

  sendAnswer: async (telegramId, questionId, quizId, answers, locale) => {
    try {
      const res = await fetch(`${API_BASE}/quizes/answer?telegram_id=${telegramId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({
          "question_id": questionId,
          "quiz_id": quizId,
          "answers": answers,
          "locale": locale,
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка отправки ответа");
      }
      return await res.json();
    } catch (e) {
      console.error("API createUserAnswer error:", e);
      throw e;
    }
  },

};
