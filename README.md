# Customer Lifetime Navigator

![Dashboard Screenshot](https://github.com/user-attachments/assets/placeholder-screenshot.png)

> **AI-powered dashboard for SaaS executives to track unit economics and predict churn.**

**🚀 Live Demo:** <https://customer-lifetime-navigator-v2.vercel.app>

## 🎯 Problem It Solves

As a Customer Success Manager for 15+ years, I saw the same problem repeatedly: executives want to understand customer profitability, but CS tools show activity metrics—not financial impact. This dashboard bridges the gap by visualizing LTV:CAC ratios, churn probability, and segment performance in one view.

## ✨ Features

- **Unit Economics Grid** — Real-time LTV, CAC, ARPU by segment
- **Churn Prediction** — Probability trends with confidence scores
- **Journey Visualization** — Sankey flow from onboarding to retention
- **AI-Powered Insights** — Gemini-generated recommendations per segment (via secure backend)
- **Live Data Simulation** — Test with synthetic data or upload your own
- **Unit Economics Health Score** — Automated scoring based on industry benchmarks

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| Backend | Vercel Serverless Functions |
| Build | Vite |
| Deployment | Vercel |

## 🔒 Security

API keys are stored securely on Vercel's backend and never exposed to the browser. The frontend communicates with Gemini through a serverless proxy function.

## 🚀 Deployment

### Quick Deploy

```bash
# 1. Clone
git clone https://github.com/Nas20two/Customer-Lifetime-Navigator.git
cd Customer-Lifetime-Navigator

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
npx vercel

# 4. Add your Gemini API key (secure - stored server-side)
npx vercel env add GEMINI_API_KEY
# Paste your API key when prompted

# 5. Production deploy
npx vercel --prod
```

### Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Vercel Dashboard (Production) | Your Google Gemini API key |

## 🏃‍♂️ Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create local env file for backend
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Run dev server
npm run dev

# 4. In another terminal, run API server
npx vercel dev
```

## 📊 What I Learned

Building this reinforced three lessons from my CS career:

1. **Data without context is useless** — Raw LTV numbers don't matter; trends and comparisons do. I added the segment selector so users can benchmark performance.

2. **AI needs guardrails** — My first Gemini integration gave impossible recommendations. I added validation logic and confidence thresholds to ensure suggestions align with business reality.

3. **Security matters from day one** — Initially, the API key was exposed in the frontend. I refactored to use Vercel serverless functions, keeping credentials secure while maintaining functionality.

## 🔮 Roadmap

- [x] Core dashboard with mock data
- [x] Gemini AI insights integration
- [x] Vercel deployment with secure API handling
- [x] Unit economics health scoring
- [ ] CSV upload for custom data
- [ ] Supabase backend for persistence
- [ ] PDF export for board presentations
- [ ] Multi-currency support

## 🤝 Why I Built This

I'm transitioning from Customer Success to AI/ML roles. This project demonstrates I can:
- **Understand business problems** (15 years in CS/Sales)
- **Build production-ready apps** (React + TypeScript)
- **Integrate AI meaningfully** (Gemini for insights, not just chat)
- **Ship securely** (Serverless backend, no exposed credentials)
- **Ship fast** (built in 2 weeks with Lovable + custom code)

**Hiring?** Let's talk: [LinkedIn](your-linkedin) | [Portfolio](https://nasyhub.lovable.app)

---

Built with ❤️ by [NaSy](https://github.com/Nas20two)
