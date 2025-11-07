# VIKAS AI Assistant

VIKAS AI Assistant ek friendly Hinglish chatbot experience hai jo VIKAS CSC – Fastrac Digital Service Provider ki services ko samjhane aur guide karne ke liye banaaya gaya hai. App Next.js (App Router) par based hai aur Vercel deployment ke liye ready hai.

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/) (Vercel aur Next.js 14 ke liye recommended)
- npm (Node ke saath aata hai)

### Installation

```bash
npm install
npm run dev
```

Browser me `http://localhost:3000` open karke assistant ka UI dekhiye.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css      # Global styling
│   ├── layout.tsx       # Root layout aur metadata
│   └── page.tsx         # Chat interface aur assistant logic
├── public/              # Static assets (agar future me jarurat ho)
├── package.json         # Scripts aur dependencies
└── tsconfig.json        # TypeScript config
```

## 🎯 Features

- Hinglish me polite conversation flow jo har message ke end me official closing deta hai.
- Naam detection aur personalized greeting.
- Step-by-step guidance based on user ke intent (pension, Samman card, banking, Aadhaar, PAN, passport, PM schemes, bill payments).
- Relevant service suggestions har response ke saath.
- Responsive aur accessible UI jo desktop aur tablet par smooth chalti hai.

## 📦 Tech Stack

- [Next.js 14](https://nextjs.org/)
- [React 18](https://react.dev/)
- TypeScript for predictable typing

## 🔄 Deployment

Project Vercel par direct deploy ho sakta hai:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-2a179a46
```

## 🤝 Support

Agar aapko customization karni ho ya features add karne ho to feel free project ko extend kariye. Issues ya sawal ke liye repository me issue raise karein.

धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.
