const API_BASE = "https://a7606a666e47.ngrok-free.app";

const ApiClient = {
  // registerUser: async (telegramId, nickname) => {
  //   try {
  //     const res = await fetch(`${API_BASE}/users/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ telegram_id: telegramId, nickname })
  //     });
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка регистрации");
  //     }
  //     return await res.json();
  //   } catch (e) {
  //     console.error("API registerUser error:", e);
  //     throw e;
  //   }
  // },

  getUser: async (telegram_id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${telegram_id}`, {
        method: "GET",
        headers: { "Accept": "application/json",
        "ngrok-skip-browser-warning": "1"
        }, // явно просим JSON
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
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1" // явно просим JSON
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
      headers: { "Content-Type": "application/json" },
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


  
  // getUser: async (telegram_id) => {
  //   const res = await fetch(`${API_BASE}/users/${telegram_id}`, { method: "GET" });
  //   const text = await res.text();
    
  //   let data;
  //   try {
  //     data = text ? JSON.parse(text) : {};
  //   } catch (e) {
  //     throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
  //   }

  //   if (!res.ok) {
  //     const error = new Error(data.detail?.message || `HTTP ${res.status}`);
  //     error.detail = data.detail;
  //     error.status = res.status;
  //     throw error;
  //   }

  //   return data;
  // },

  // listUsers: async () => {
  //   try {
  //       const res = await fetch(`${API_BASE}/users/`);
  //       if (!res.ok) {
  //           throw new Error("Ошибка получения пользователей");
  //       }
  //       return await res.json();
  //   } catch (e) {
  //       console.error("API listUsers error:", e);
  //       throw e;
  //   }
  // },

  // Добавьте обработку не-JSON ответов
  
  // getUser: async (telegram_id) => {
  //   try {
  //     const res = await fetch(`${API_BASE}/users/${telegram_id}`);
  //     const contentType = res.headers.get('content-type');

  //     if (!contentType || !contentType.includes('application/json')) {
  //         const text = await res.text();
  //         console.error('Non-JSON response:', text.substring(0, 200));
  //         throw new Error(`Server returned non-JSON response: ${res.status}`);
  //     }

  //     if (!res.ok) {
  //         const err = await res.json();
  //         throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения пользователя");
  //     }

  //     return await res.json();
  //   } catch (e) {
  //     console.error("API getUser error:", e);
  //     throw e;
  //   }
  // },

  

  // registerOrGetUser: async (telegramId, nickname) => {
  //   console.log("🔍 Проверяем существующего пользователя...");
  //   console.log("🔎 Делаем getUser для id =", telegramId);
  //   const user = await ApiClient.getUser(telegramId).catch(err => {
  //     if (err.status === 401 || err.status === 404) {
  //       // Пользователь не найден → идём регистрировать
  //       return null;
  //     }
  //     // Если другая ошибка (например 500), пробрасываем её дальше
  //     throw err;
  //   });

  //   if (user) {
  //     console.log("✅ Пользователь найден:", user);
  //     return user;
  //   }

  //   console.log("📝 Регистрируем нового пользователя...");
  //   try {
  //     const newUser = await ApiClient.registerUser(telegramId, nickname);
  //     console.log("✅ Новый пользователь зарегистрирован:", newUser);
  //     return newUser;
  //   } catch (registerError) {
  //     console.error("❌ Ошибка регистрации:", registerError);

  //     // Обрабатываем частные случаи
  //     const errorCode = registerError.detail?.code;
  //     if (errorCode === "NICKNAME_TAKEN") {
  //       throw new Error("Этот никнейм уже занят. Выберите другой.");
  //     }

  //     throw new Error(registerError.detail?.message || "Ошибка при регистрации");
  //   }
  // },

  // deleteUser: async (telegramId) => {
  //   try {
  //     const res = await fetch(`${API_BASE}/users/${telegram_id}`, {
  //       method: "DELETE"
  //     });
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка удаления пользователя");
  //     }
  //     return await res.json(); // {detail: "User deleted"}
  //   } catch (e) {
  //     console.error("API deleteUser error:", e);
  //     throw e;
  //   }
  // },

  // createEvent: async (name, creatorId, telegramId) => {
  //   try {
  //           const query = new URLSearchParams({
  //               name, creator_id: creatorId, telegram_id: telegramId
  //           }).toString();
        
  //           const res = await fetch(`${API_BASE}/events/create?${query}`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //       });

  //       if (!res.ok) {
  //           const err = await res.json();
  //           throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка регистрации");
  //       }
  //       return await res.json();
  //   } catch (e) {
  //       console.error("API registerUser error:", e);
  //       throw e;
  //   }
  // },
  
  // getNextEventPhase: async (eventId, telegramId) => {
  //   try {
  //     const query = new URLSearchParams({event_id: eventId, telegram_id: telegramId }).toString();
  //     const res = await fetch(`${API_BASE}/events/${eventId}/next_phase?${query}`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" }
  //     });

  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения следующей фазы события");
  //     }

  //     return await res.json(); // вернет строку с названием следующей фазы
  //   } catch (e) {
  //     console.error("API getNextEventPhase error:", e);
  //     throw e;
  //   }
  // },

    getEventStatus: async (eventId) => {
      try {
          const res = await fetch(`${API_BASE}/events/${eventId}`, { method: "GET" });
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

    // getQuizList: async () => {
    //   try {
    //     const res =  await fetch(`${API_BASE}/quiz/`, {method: "GET"});
    //     if (!res.ok) {
    //       const err = await res.json();
    //       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения списка викторин");
    //     }
    //     return await res.json();
    //   } catch (e) {
    //     console.error("API listQuiz error:", e);
    //     throw e;
    //   }
    // },

    getQuiz: async (quizId) => {
      try {
        const res = await fetch(`${API_BASE}/quiz/${quizId}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения квиза");
        }
        return await res.json(); // {title, description, id}
      } catch (e) {
        console.error("API getQuiz error:", e);
        throw e;
      }
    },

    listQuestions: async (quizId) => {
      try {
        const res = await fetch(`${API_BASE}/quiz/${quizId}/questions`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения вопросов");
        }
        return await res.json(); // [{text, id, quiz_id}, ...]
      } catch (e) {
        console.error("API listQuestions error:", e);
        throw e;
      }
    },

    


  // listEvents: async () => {
  //   try {
  //     const res = await fetch(`${API_BASE}/events/`, { method: "GET" });
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения списка событий");
  //     }
  //     return await res.json();
  //   } catch (e) {
  //     console.error("API listEvents error:", e);
  //     throw e;
  //   }
  // },




//   listQuizzes: async () => {
//     try {
//       const res = await fetch(`${API_BASE}/quiz/`);
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения списка квизов");
//       }
//       return await res.json(); 
//     } catch (e) {
//       console.error("API listQuizzes error:", e);
//       throw e;
//     }
//   },

//   createQuiz: async ({title, description}) => {
//   try {
//     const res = await fetch(`${API_BASE}/quiz/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, description })
//     });
//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка создания квиза");
//     }
//     return await res.json();
//   } catch (e) {
//     console.error("API createQuiz error:", e);
//     throw e;
//   }
// },

// createQuestion: async ({ quiz_id, text }) => {
//   try {
//     const res = await fetch(`${API_BASE}/quiz/questions`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ quiz_id, text })
//     });
//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка создания вопроса");
//     }
//     return await res.json();
//   } catch (e) {
//     console.error("API createQuestion error:", e);
//     throw e;
//   }
// },





//   createUserAnswer: async (userId, questionId, answer) => {
//     try {
//       const res = await fetch(`${API_BASE}/quiz/answers`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: userId, question_id: questionId, answer })
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка отправки ответа");
//       }
//       return await res.json(); // {user_id, answer, id, question_id}
//     } catch (e) {
//       console.error("API createUserAnswer error:", e);
//       throw e;
//     }
//   },

//   listUserAnswers: async (questionId) => {
//     try {
//       const res = await fetch(`${API_BASE}/quiz/questions/${questionId}/answers`);
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения ответов");
//       }
//       return await res.json(); 
//     } catch (e) {
//       console.error("API listUserAnswers error:", e);
//       throw e;
//     }
//   },

//   getCurrentQuestion: async (eventId) => {
//     try {
//       const res = await fetch(`${API_BASE}/quiz/${eventId}/current_question`);
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail ? JSON.stringify(err.detail) : "Ошибка получения текущего вопроса");
//       }
//       return await res.json(); // обычно строка с текстом вопроса
//     } catch (e) {
//       console.error("API getCurrentQuestion error:", e);
//       throw e;
//     }
//   },

};
