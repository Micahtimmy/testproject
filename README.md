# FinanceFlow

<div align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="FinanceFlow Logo" />

  **AI-Powered Personal Finance Tracker**

  ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
  ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
  ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)
</div>

---

FinanceFlow is a modern, AI-powered finance management application featuring beautiful glassmorphism UI, smart budgeting with alerts, and personalized investment recommendations.

## Features

### Core Features
- **Smart Dashboard** - Real-time financial overview with interactive charts
- **Transaction Tracking** - Income/expense management with smart categorization
- **Budget Management** - Set limits, track spending, receive threshold alerts
- **AI Insights Engine** - Personalized savings tips, investment advice, and spending analysis

### AI Capabilities
- Budget optimization recommendations
- Stock & ETF investment suggestions
- Savings opportunity identification
- Financial health scoring (0-100)
- Spending pattern analysis

### User Experience
- Glassmorphism UI design
- Dark/Light mode with system detection
- Real-time notifications
- Responsive across all devices
- Google OAuth + email authentication

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build | Vite 6 |
| Charts | Recharts |
| Animation | Framer Motion |
| Routing | React Router 7 |
| Icons | Lucide React |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` - use any email/password to sign in.

## Project Structure

```
src/
├── components/layout/   # Sidebar, Navbar, Layout
├── context/            # Auth, Theme, Notifications
├── hooks/              # Transactions, Budgets, AI
├── pages/              # Dashboard, Transactions, Budgets, Insights, Settings
└── types.ts            # TypeScript definitions
```

## Roadmap

- [ ] Plaid bank integration
- [ ] React Native mobile app
- [ ] Advanced ML predictions
- [ ] Bill reminders
- [ ] Multi-currency support
- [ ] Export reports (PDF/CSV)

## License

MIT

---

<div align="center">
  <sub>Built with AI-powered insights for smarter financial decisions</sub>
</div>
