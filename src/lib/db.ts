import { neon } from '@neondatabase/serverless';

// Access runtime configuration injected directly into index.html
const getTargetUrl = () => {
  const runtimeUrl = (window as any).ENV_CONFIG?.VITE_NEON_DATABASE_URL;
  if (runtimeUrl && !runtimeUrl.includes('__VITE_')) return runtimeUrl;
  
  const buildTimeUrl = import.meta.env.VITE_NEON_DATABASE_URL;
  if (buildTimeUrl && !buildTimeUrl.includes('__VITE_')) return buildTimeUrl;
  
  return null;
};

const databaseUrl = getTargetUrl();

if (!databaseUrl) {
  console.warn('VITE_NEON_DATABASE_URL not found. Database integration will remain disabled.');
}

// Export a robust SQL client proxy
export const sql = databaseUrl 
  ? neon(databaseUrl) 
  : ((...args: any[]) => { 
      console.error('Database query attempted but VITE_NEON_DATABASE_URL is not configured.');
      throw new Error('Database not configured'); 
    }) as any;

