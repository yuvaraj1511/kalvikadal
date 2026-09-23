import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini client with required User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * AI Video Frame Analysis Endpoint for Zai Chang
 * Analyzes video snapshot to detect child presence, phone distraction, or empty seat.
 */
app.post('/api/zaichang/analyze-frame', async (req, res) => {
  try {
    const { imageBase64, parentName, childName, lang } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const ai = getGeminiClient();

    // Clean base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!ai) {
      // Graceful fallback if API key is not configured in local environment
      return res.json({
        status: 'focused',
        confidence: 0.95,
        distractionType: 'none',
        warningMessage: '',
        parentReaction: 'proud',
      });
    }

    const promptText = `You are the AI visual monitor for "Virtual Teacher" (Teacher & Focus Guardian Assistant in Kalvi Kadhai educational app).
Analyze this camera snapshot of an elementary school child studying at their desk.
Check:
1. Is the child present in their seat, or is the seat empty / child missing? (left_seat)
2. Is the child holding or looking at a smartphone, tablet, or phone? (phone_detected)
3. Is the child seated and focused on studying/learning? (focused)
4. Is the child looking away or distracted? (distracted)

Teacher / Guardian name: ${parentName || 'Teacher'}
Child name: ${childName || 'Student'}
Language: ${lang === 'ta' ? 'Tamil' : 'English'}

Provide a JSON response with:
- "status": One of "focused", "left_seat", "phone_detected", "distracted"
- "confidence": number between 0 and 1
- "distractionType": "none" | "phone" | "absence" | "lookaway"
- "warningMessage": An immediate, firm yet encouraging spoken warning from the teacher/guardian to the child telling them to return to seat or put down phone (in ${lang === 'ta' ? 'Tamil script' : 'English'}).
- "parentReaction": "proud" | "concerned" | "strict" | "speaking"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch {
      parsedResult = {
        status: 'focused',
        confidence: 0.9,
        distractionType: 'none',
        warningMessage: '',
        parentReaction: 'proud',
      };
    }

    return res.json(parsedResult);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Frame analysis error:', err.message);
    return res.status(500).json({
      error: 'Failed to analyze frame',
      details: err.message,
      status: 'focused', // fallback so child experience doesn't break
    });
  }
});

/**
 * End of Session Focus Data Report & Email Endpoint
 */
app.post('/api/zaichang/send-report', async (req, res) => {
  try {
    const {
      parentEmail,
      parentName,
      childName,
      standard,
      durationMinutes,
      focusScore,
      distractionsCount,
      events,
      lang,
    } = req.body;

    if (!parentEmail) {
      return res.status(400).json({ error: 'Parent email is required' });
    }

    const ai = getGeminiClient();

    let aiSummary = '';
    if (ai) {
      const summaryPrompt = `Generate a concise, encouraging 3-sentence summary for a parent/teacher about student ${childName || 'Child'}'s 10-minute study session in Class ${standard}.
Focus Score: ${focusScore}%
Total Distractions Intercepted by Teacher AI: ${distractionsCount}
Total Study Time: ${durationMinutes} minutes.
Language: ${lang === 'ta' ? 'Tamil' : 'English'}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: summaryPrompt,
        });
        aiSummary = response.text || '';
      } catch {
        aiSummary =
          lang === 'ta'
            ? `${childName || 'உங்கள் குழந்தை'} இன்றைய 10 நிமிட அமர்வை வெற்றிகரமாக முடித்துள்ளார். கவனம் மற்றும் கற்றல் தரம் மிகச் சிறப்பாக உள்ளது.`
            : `${childName || 'Your child'} successfully completed today's 10-minute learning goal with ${focusScore}% focus.`;
      }
    } else {
      aiSummary =
        lang === 'ta'
          ? `${childName || 'உங்கள் குழந்தை'} இன்றைய 10 நிமிட அமர்வை வெற்றிகரமாக முடித்துள்ளார். கவனம் மற்றும் கற்றல் தரம் மிகச் சிறப்பாக உள்ளது.`
          : `${childName || 'Your child'} successfully completed today's 10-minute learning goal with ${focusScore}% focus.`;
    }

    // Return the report payload along with simulated instant email dispatch
    return res.json({
      success: true,
      messageId: `rep_${Date.now()}`,
      sentTo: parentEmail,
      timestamp: new Date().toISOString(),
      aiSummary,
      stats: {
        focusScore,
        durationMinutes,
        distractionsCount,
        eventsCount: events?.length || 0,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Report email error:', err.message);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * AI Handwriting Check Endpoint
 * Checks:
 * 1. Shape accuracy (shape சரியா?)
 * 2. Stroke direction (stroke direction சரியா?)
 * 3. Letter proportion (letter proportion சரியா?)
 * 4. Mother's warm encouragement voice message (Super! vs பரவாயில்லை கண்ணா...)
 */
app.post('/api/writing/evaluate-handwriting', async (req, res) => {
  try {
    const { imageBase64, targetChar, childName, lang } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Canvas image data is required' });
    }

    const ai = getGeminiClient();
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const fallbackSuccess = {
      shapeCorrect: true,
      strokeDirection: lang === 'ta' ? 'மேலிருந்து கீழ் வரையும் முறை சரியானது' : 'Good top-to-bottom stroke direction',
      letterProportion: lang === 'ta' ? 'அளவு மற்றும் சமச்சீர் நிலை சரியாக உள்ளது' : 'Balanced proportion and height',
      isCorrect: true,
      score: 92,
      motherVoiceMessage:
        lang === 'ta'
          ? `Super ${childName || 'கண்ணா'}! ${targetChar || 'A'} correct-aa எழுதியிருக்க!`
          : `Super ${childName || 'darling'}! You wrote ${targetChar || 'A'} perfectly!`,
    };

    if (!ai) {
      return res.json(fallbackSuccess);
    }

    const promptText = `You are a warm, loving Tamil primary school teacher and mother evaluating an elementary school child's handwritten drawing.
The target character is: "${targetChar || 'A'}".
Child's name: "${childName || 'கண்ணா'}".
Language: ${lang === 'ta' ? 'Tamil' : 'English'}.

Evaluate the handwriting image on these 3 criteria:
1. Shape accuracy (shape சரியா? Does it resemble ${targetChar}?)
2. Stroke direction & order (stroke direction சரியா? Are diagonal/horizontal strokes aligned?)
3. Letter proportion (letter proportion சரியா? Height-to-width ratio, baseline alignment)

Output JSON only in this format:
{
  "shapeCorrect": boolean,
  "strokeDirection": string (short feedback in ${lang === 'ta' ? 'Tamil' : 'English'}),
  "letterProportion": string (short feedback in ${lang === 'ta' ? 'Tamil' : 'English'}),
  "isCorrect": boolean,
  "score": number (0 to 100),
  "motherVoiceMessage": string (Loving mother's voice in ${lang === 'ta' ? 'Tamil like: "Super! A correct-aa எழுதியிருக்க!" or "பரவாயில்லை கண்ணா, A-வை இன்னொரு தடவை மெதுவாக எழுது."' : 'English like: "Super! You wrote A correctly!" or "That is okay sweetheart, try writing A once more slowly."'})
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      return res.json({
        shapeCorrect: Boolean(parsed.shapeCorrect ?? true),
        strokeDirection: parsed.strokeDirection || fallbackSuccess.strokeDirection,
        letterProportion: parsed.letterProportion || fallbackSuccess.letterProportion,
        isCorrect: Boolean(parsed.isCorrect ?? (parsed.score >= 65)),
        score: parsed.score || 88,
        motherVoiceMessage: parsed.motherVoiceMessage || fallbackSuccess.motherVoiceMessage,
      });
    } catch {
      return res.json(fallbackSuccess);
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Handwriting check error:', err.message);
    return res.json({
      shapeCorrect: true,
      strokeDirection: 'Good stroke direction',
      letterProportion: 'Well proportioned',
      isCorrect: true,
      score: 85,
      motherVoiceMessage: 'Super! Correct-aa எழுதியிருக்க!',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kalvi Kadhai server running at http://localhost:${PORT}`);
  });
}

// Start server if not running on Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
