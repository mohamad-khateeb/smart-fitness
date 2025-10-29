/**
 * ============================================
 * FITNESS APP - EXPRESS API SERVER
 * ============================================
 * 
 * This server handles AI-powered fitness recommendations
 * by integrating with OpenAI's GPT API.
 * 
 * Features:
 * - Multi-language support (English & Hebrew)
 * - Profile-based fitness recommendations
 * - CORS enabled for frontend communication
 * - Environment variable configuration
 * 
 * Dependencies:
 * - express: Web framework
 * - dotenv: Environment variable management
 * - node-fetch: HTTP client for OpenAI API calls
 */

import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

// ============================================
// SETUP & CONFIGURATION
// ============================================

/**
 * Get directory name for ES modules
 * (required because __dirname is not available in ES modules)
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load environment variables from .env file in project root
 * This file should contain: VITE_OPENAI_API_KEY=sk-...
 */
dotenv.config({ path: join(__dirname, '../.env') });

// Debug: Log environment configuration
console.log('Environment check:');
console.log('- Current directory:', __dirname);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- API Key exists:', !!process.env.VITE_OPENAI_API_KEY);
console.log('- API Key starts with:', process.env.VITE_OPENAI_API_KEY?.substring(0, 10));

/**
 * Load OpenAI API key from environment
 * Exit if key is missing to prevent runtime errors
 */
const OPENAI_KEY = process.env.VITE_OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('❌ ERROR: VITE_OPENAI_API_KEY not found in .env');
  console.error('Please add your OpenAI API key to the .env file');
  process.exit(1);
}

// ============================================
// EXPRESS APP SETUP
// ============================================

const app = express();

/**
 * Middleware: Parse JSON request bodies
 * Allows us to access req.body in route handlers
 */
app.use(express.json());

/**
 * Middleware: Enable CORS (Cross-Origin Resource Sharing)
 * Allows the React frontend (running on port 5173) to make requests to this server
 * 
 * In production, replace with your actual frontend domain
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ============================================
// API ROUTES
// ============================================

/**
 * GET /api/test
 * 
 * Health check endpoint to verify:
 * - Server is running
 * - API key is loaded
 * 
 * Response: { status: "ok", hasKey: true/false }
 */
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', hasKey: !!OPENAI_KEY });
});

/**
 * POST /api/recommend
 * 
 * Generate personalized fitness recommendations using OpenAI GPT
 * 
 * Request body:
 * {
 *   sex: "male" | "female",
 *   age: number,
 *   heightCm: number,
 *   weightKg: number,
 *   activity: "sedentary" | "light" | "moderate" | "very" | "athlete",
 *   goal: "cut" | "maintain" | "bulk",
 *   prompt: string (optional - custom user instructions),
 *   language: "en" | "he" (optional - defaults to "en")
 * }
 * 
 * Response:
 * Success: { tips: "AI-generated recommendations..." }
 * Error: { error: "error_type", detail: "error details" }
 */
app.post("/api/recommend", async (req, res) => {
  try {
    // Extract and validate request parameters
    const { sex, age, heightCm, weightKg, activity, goal, prompt, language = "en" } = req.body;

    // Validate OpenAI key is available
    if (!OPENAI_KEY) {
      console.error("Missing OpenAI API key");
      return res.status(500).json({ 
        error: "Server configuration error - missing API key" 
      });
    }

    // Validate required profile fields
    if (!sex || !age || !heightCm || !weightKg || !activity || !goal) {
      return res.status(400).json({ 
        error: "Missing required profile data" 
      });
    }

    // ============================================
    // BUILD AI PROMPTS (Multi-language support)
    // ============================================

    /**
     * System prompt: Defines the AI's role and behavior
     * Customized based on selected language (English or Hebrew)
     */
    const system = language === "he" 
      ? `אתה מאמן כושר מועיל. תן עצות אימון ותזונה תמציתיות וניתנות ליישום.`
      : `You are a helpful fitness coach. Give concise, actionable training and nutrition tips.`;
    
    /**
     * User prompt: Contains user profile and request
     * Formatted in the user's selected language
     */
    const user = language === "he"
      ? `פרופיל:
- מין: ${sex === "male" ? "זכר" : "נקבה"}
- גיל: ${age}
- גובה: ${heightCm} ס״מ
- משקל: ${weightKg} ק״ג
- פעילות: ${activity}
- מטרה: ${goal}

הערת משתמש: ${prompt || "(אין)"}

ספק: 5 המלצות קצרות (אימון, תזונה, החלמה) וסיכום של 1-2 שורות.`
      : `Profile:
- Sex: ${sex}
- Age: ${age}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Activity: ${activity}
- Goal: ${goal}

User note: ${prompt || "(none)"}

Provide: 5 short recommendations (training, nutrition, recovery) and a 1-2 line summary.`;

    // ============================================
    // CALL OPENAI API
    // ============================================

    /**
     * Make request to OpenAI Chat Completions API
     * Model: gpt-3.5-turbo (fast and cost-effective)
     * Max tokens: 400 (controls response length)
     * Temperature: 0.7 (balances creativity and consistency)
     */
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

    // Handle OpenAI API errors
    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("OpenAI API error:", errText);
      return res.status(502).json({ 
        error: "AI provider error", 
        detail: errText,
        status: apiRes.status
      });
    }

    // Parse and validate OpenAI response
    const apiJson = await apiRes.json();
    if (!apiJson?.choices?.[0]?.message?.content) {
      console.error("Unexpected API response:", apiJson);
      return res.status(502).json({ 
        error: "Invalid API response format" 
      });
    }

    // Return successful response with AI-generated tips
    return res.json({ 
      tips: apiJson.choices[0].message.content 
    });

  } catch (err) {
    // Handle unexpected server errors
    console.error("Server error:", err);
    return res.status(500).json({ 
      error: "server_error",
      message: err.message
    });
  }
});

// ============================================
// START SERVER
// ============================================

/**
 * Start Express server on specified port
 * Default: 3001 (can be overridden with PORT env variable)
 */
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ API listening on http://localhost:${port}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   - GET  /api/test - Health check`);
  console.log(`   - POST /api/recommend - Get fitness recommendations`);
});
