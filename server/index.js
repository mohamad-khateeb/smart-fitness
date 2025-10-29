// import express from 'express';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import fetch from 'node-fetch';

// // Get directory name for ES modules
// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Load .env from project root
// dotenv.config({ path: join(__dirname, '../.env') });

// const app = express();
// app.use(express.json());

// // Debug environment
// console.log('Environment check:');
// console.log('- Current directory:', __dirname);
// console.log('- NODE_ENV:', process.env.NODE_ENV);
// console.log('- API Key exists:', !!process.env.VITE_OPENAI_API_KEY);
// console.log('- API Key starts with:', process.env.VITE_OPENAI_API_KEY?.substring(0, 10));

// // CORS headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// app.post("/api/recommend", async (req, res) => {
//   try {
//     const { sex, age, heightCm, weightKg, activity, goal, prompt } = req.body;

//     // Build prompt for the model
//     const system = `You are a helpful fitness coach. Give concise, actionable training and nutrition tips.`;
//     const user = `Profile:
// - Sex: ${sex}
// - Age: ${age}
// - Height: ${heightCm} cm
// - Weight: ${weightKg} kg
// - Activity: ${activity}
// - Goal: ${goal}

// User note: ${prompt || "(none)"}

// Provide: 5 short recommendations (training, nutrition, recovery) and a 1-2 line summary.`;

//     // call OpenAI Chat Completions (gpt-3.5-turbo example)
//     const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${OPENAI_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: system },
//           { role: "user", content: user }
//         ],
//         max_tokens: 400,
//         temperature: 0.7,
//       }),
//     });

//     if (!apiRes.ok) {
//       const errText = await apiRes.text();
//       return res.status(502).json({ error: "AI provider error", detail: errText });
//     }

//     const apiJson = await apiRes.json();
//     const text = apiJson?.choices?.[0]?.message?.content ?? JSON.stringify(apiJson);

//     return res.json({ tips: text });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "server_error" });
//   }
// });

// app.get('/api/test', (req, res) => {
//   res.json({ status: 'ok', hasKey: !!process.env.VITE_OPENAI_API_KEY });
// });

// const port = process.env.PORT || 3001;
// app.listen(port, () => console.log(`API listening on ${port}`));







// server/index.js (or index.mjs)
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

// Get directory name for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// ✅ Load .env from project root
dotenv.config({ path: join(__dirname, '../.env') });

// ✅ Check environment
console.log('Environment check:');
console.log('- Current directory:', __dirname);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- API Key exists:', !!process.env.VITE_OPENAI_API_KEY);
console.log('- API Key starts with:', process.env.VITE_OPENAI_API_KEY?.substring(0, 10));

// ✅ Assign variable properly
const OPENAI_KEY = process.env.VITE_OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('❌ ERROR: VITE_OPENAI_API_KEY not found in .env');
  process.exit(1);
}

const app = express();
app.use(express.json());

// ✅ Allow frontend to access (Vite default: http://localhost:5173)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Routes
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', hasKey: !!OPENAI_KEY });
});

app.post("/api/recommend", async (req, res) => {
  try {
    const { sex, age, heightCm, weightKg, activity, goal, prompt, language = "en" } = req.body;

    // Validate OpenAI key first
    if (!OPENAI_KEY) {
      console.error("Missing OpenAI API key");
      return res.status(500).json({ error: "Server configuration error - missing API key" });
    }

    // Validate required fields
    if (!sex || !age || !heightCm || !weightKg || !activity || !goal) {
      return res.status(400).json({ error: "Missing required profile data" });
    }

    // Build prompt for the model
    const system = language === "he" 
      ? `אתה מאמן כושר מועיל. תן עצות אימון ותזונה תמציתיות וניתנות ליישום.`
      : `You are a helpful fitness coach. Give concise, actionable training and nutrition tips.`;
    
    const user = language === "he"
      ? `פרופיל:
+- מין: ${sex === "male" ? "זכר" : "נקבה"}
+- גיל: ${age}
+- גובה: ${heightCm} ס״מ
+- משקל: ${weightKg} ק״ג
+- פעילות: ${activity}
+- מטרה: ${goal}
+
+הערת משתמש: ${prompt || "(אין)"}
+
+ספק: 5 המלצות קצרות (אימון, תזונה, החלמה) וסיכום של 1-2 שורות.`
      : `Profile:
+- Sex: ${sex}
+- Age: ${age}
+- Height: ${heightCm} cm
+- Weight: ${weightKg} kg
+- Activity: ${activity}
+- Goal: ${goal}
+
+User note: ${prompt || "(none)"}
+
+Provide: 5 short recommendations (training, nutrition, recovery) and a 1-2 line summary.`;

    // call OpenAI Chat Completions (gpt-3.5-turbo example)
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("OpenAI API error:", errText);
      return res.status(502).json({ 
        error: "AI provider error", 
        detail: errText,
        status: apiRes.status
      });
    }

    const apiJson = await apiRes.json();
    if (!apiJson?.choices?.[0]?.message?.content) {
      console.error("Unexpected API response:", apiJson);
      return res.status(502).json({ error: "Invalid API response format" });
    }

    return res.json({ tips: apiJson.choices[0].message.content });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ 
      error: "server_error",
      message: err.message
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ API listening on http://localhost:${port}`));
