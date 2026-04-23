import axios from 'axios';
import fs from 'fs';
import path from 'path';

const GOOGLE_TRANSLATE_API_KEY = process.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' }, // Mandarin
  { code: 'ja', name: 'Japanese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
  { code: 'th', name: 'Thai' },
  { code: 'tl', name: 'Filipino' }
];

const STRINGS_TO_TRANSLATE = [
  "Daily Focus Tracker",
  "Track. Measure. Optimize your daily performance.",
  "Execution Score",
  "Measures how effectively you turned priorities into completed results today.",
  "Poor execution",
  "Exceptional",
  "Mental Clarity",
  "Measures how mentally sharp, focused, and cognitively clear you felt today.",
  "Foggy / Distracted",
  "Sharp / Focused",
  "Entry Saved Successfully",
  "Log Today's Reflection",
  "View Performance Insights",
  "View Entry History",
  "7-Day Execution Trend",
  "Focus × Execution",
  "Consistency Score",
  "Blocker Frequency (14 Days)",
  "Log at least 3 days to see performance insights.",
  "No entries recorded yet.",
  "Top Priority:",
  "Completed",
  "Not Completed",
  "Blocker:",
  "Work Depth:",
  "Surface-Level Tasks",
  "Admin, emails, quick tasks",
  "Focused Work",
  "Structured, goal-oriented work",
  "Deep Work",
  "High-intensity, creative work",
  "Did you complete your top priority?",
  "Yes",
  "No",
  "Primary Blocker",
  "What hindered your performance the most?",
  "Other",
  "Describe your custom blocker...",
  "Productivity Depth",
  "How deeply were you able to work?",
  "Custom Work Depth",
  "Describe your work depth...",
  "Distraction",
  "Emotional State",
  "Lack of Clarity",
  "External Dependency",
  "Low Energy",
  "No Major Blocker",
  "High Performance Zone",
  "Moderate Zone",
  "Improvement Needed",
  "What impacted your performance the most?",
  "Please specify",
  "Describe what impacted your performance…",
  "Did you complete your most important task today?",
  "Required",
  "Yes, I did",
  "Not yet",
  "What best describes your work depth today?",
  "Optional",
  "On days your Mental Clarity is above 7, your Execution improves by",
  "Log at least 3 days to see performance insights.",
  "Search languages...",
  "No languages found",
  "What is one thing you did well today?",
  "Success Reflection:"
];

const LOCALES_DIR = path.resolve('src/locales');

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR, { recursive: true });
}

async function translateAndSave() {
  for (const lang of LANGUAGES) {
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    
    // Create translation object
    const translations = {};
    
    // If English, just use source strings as keys and values
    if (lang.code === 'en') {
      STRINGS_TO_TRANSLATE.forEach(s => { translations[s] = s; });
    } else {
      try {
        const response = await axios.post(`${BASE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
          q: STRINGS_TO_TRANSLATE,
          target: lang.code,
          source: 'en'
        });
        
        const translatedStrings = response.data.data.translations;
        
        STRINGS_TO_TRANSLATE.forEach((s, idx) => {
          translations[s] = translatedStrings[idx].translatedText;
        });
      } catch (err) {
        console.error(`Failed to translate for ${lang.code}:`, err.response ? err.response.data : err.message);
        continue;
      }
    }
    
    const filePath = path.join(LOCALES_DIR, `${lang.code}.json`);
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`Saved ${lang.code}.json`);
  }
}

translateAndSave().then(() => console.log('All translations completed.'));
