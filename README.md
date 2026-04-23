# Daily Focus Tracker

A performance-tracking web application designed to help you measure and optimize your daily focus, execution, and mental clarity.

## Features

- **Performance Logs**: Track your Execution Score and Mental Clarity daily.
- **Neon DB Integration**: Secure, cloud-hosted PostgreSQL storage for all your entries.
- **Performance Insights**: Visualize your 7-day trend, focus-execution correlation, and blocker frequency.
- **Entry History**: Review your past reflections with detailed views on boosters and blockers.
- **Multi-Language Support**: Choose from 19 different languages, with automatic locale detection.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Database**: [Neon PostgreSQL](https://neon.tech/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **i18n**: Custom JSON-based dynamic loading with Google Translate support.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Create a `.env` file in the root and add your Neon connection string:
   ```env
   VITE_NEON_DATABASE_URL=your_neon_connection_string
   ```

3. **Initialize Database**:
   ```bash
   node scripts/setup-db.js
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## Internationalization

The app supports 19 languages. Translations are managed as static JSON files in `src/locales/`. 

To update or add translations:
1. Update `scripts/translate.js` with new strings or languages.
2. Run `node scripts/translate.js`.
3. The JSON files will be automatically generated.
