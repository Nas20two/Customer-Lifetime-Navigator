# Customer Lifetime Navigator

![Dashboard Screenshot](https://github.com/user-attachments/assets/placeholder-screenshot.png)

> **AI-powered dashboard for SaaS executives to track unit economics and predict churn.**

## 🎯 Problem It Solves

As a Customer Success Manager for 15+ years, I saw the same problem repeatedly: executives want to understand customer profitability, but CS tools show activity metrics—not financial impact. This dashboard bridges the gap by visualizing LTV:CAC ratios, churn probability, and segment performance in one view.

## ✨ Features

- **Unit Economics Grid** — Real-time LTV, CAC, ARPU by segment
- **Churn Prediction** — Probability trends with confidence scores
- **Journey Visualization** — Sankey flow from onboarding to retention
- **AI-Powered Insights** — Gemini-generated recommendations per segment
- **Live Data Simulation** — Test with synthetic data or upload your own

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| Build | Vite |
| Deployment | Vercel |

## 🚀 Live Demo

**[View Live →](https://customer-lifetime-navigator.vercel.app)** *(Update with your Vercel URL)*

## 📊 What I Learned

Building this reinforced three lessons from my CS career:

1. **Data without context is useless** — Raw LTV numbers don't matter; trends and comparisons do. I added the segment selector so users can benchmark performance.

2. **AI needs guardrails** — My first Gemini integration gave impossible recommendations. I added validation logic and confidence thresholds to ensure suggestions align with business reality.

3. **Execs want answers, not options** — Dashboards with 20 metrics overwhelm. I focused on 4 key numbers (LTV, CAC, ARPU, Churn Risk) and let AI explain what to do about them.

## 🏃‍♂️ Run Locally

```bash
# 1. Clone
git clone https://github.com/Nas20two/Customer-Lifetime-Navigator.git
cd Customer-Lifetime-Navigator

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Add your Gemini API key to .env.local

# 4. Run dev server
npm run dev
```

## 🔮 Roadmap

- [x] Core dashboard with mock data
- [x] Gemini AI insights integration
- [x] Vercel deployment
- [ ] CSV upload for custom data
- [ ] Supabase backend for persistence
- [ ] PDF export for board presentations
- [ ] Multi-currency support

## 🤝 Why I Built This

I'm transitioning from Customer Success to AI/ML roles. This project demonstrates I can:
- **Understand business problems** (15 years in CS/Sales)
- **Build production-ready apps** (React + TypeScript)
- **Integrate AI meaningfully** (Gemini for insights, not just chat)
- **Ship fast** (built in 2 weeks with Lovable + custom code)

**Hiring?** Let's talk: [LinkedIn](your-linkedin) | [Portfolio](https://nasyhub.lovable.app)

---

Built with ❤️ by [NaSy](https://github.com/Nas20two)
