# Kalvi Kadhai (கல்வி கதை) — TN Samacheer Kalvi Learning Games 📚🎮

An interactive educational web application designed for Tamil Nadu Samacheer Kalvi syllabus (Classes 1 to 5) with gamified learning, AI visual focus monitoring ("Virtual Teacher" / Zai Chang), 5-step smart handwriting studio with AI feedback, and mother's personalized voice encouragement.

---

## 🚀 Features

- **TN Samacheer Kalvi Syllabus**: Interactive games across Tamil, English, Math, Science, and Social Science for Classes 1 to 5.
- **5-Step Smart Handwriting Studio**:
  1. **பார்த்து எழுதுதல் (Trace & See)**: Guided dotted tracing on responsive slate.
  2. **உதவி குறைத்தல் (Memory Recall)**: Faded letter handwriting test.
  3. **AI சரிபார்ப்பு (AI Handwriting Diagnosis)**: Shape, stroke direction, and proportion analysis.
  4. **அம்மாவின் குரல் ❤️ (Mother's Loving Voice)**: Loving voice feedback with custom voice recorder.
  5. **சவால் (Progression)**: Letter → Word (APPLE) → Sentence mastery.
- **AI Focus Guardian ("Virtual Teacher" / Zai Chang)**: Non-intrusive desk presence and distraction monitor with parent report.
- **10-Minute Daily Timer**: Habit-forming study sprint with golden stars.
- **Fully Responsive**: Smooth pointer/touch event drawing for phones, tablets, and desktops.

---

## 🛠️ Deploy to Vercel (Recommended)

### Option 1: 1-Click Deploy via Vercel Dashboard

1. Push your repository to **GitHub** (see instructions below).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your **`kalvi-kadhai`** GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key from Google AI Studio)*
6. Click **Deploy**.

Your app and serverless API endpoints will be live in seconds without any errors!

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production Deploy
vercel --prod
```

---

## 📦 Push to GitHub (Step-by-Step)

If you haven't created a GitHub repository yet:

1. Create a new repository on [GitHub](https://github.com/new) (e.g., `kalvi-kadhai`).
2. Run the following commands in your project terminal:

```bash
# Initialize git if not already initialized
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: complete TN Samacheer Kalvi app with 5-step handwriting studio & Vercel deployment"

# Rename default branch to main
git branch -M main

# Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/kalvi-kadhai.git

# Push to GitHub
git push -u origin main
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local full-stack development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Build and Lint

```bash
# Run TypeScript checks
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

---

## 📄 License

MIT License. Designed with ❤️ for Tamil Nadu students and parents.
