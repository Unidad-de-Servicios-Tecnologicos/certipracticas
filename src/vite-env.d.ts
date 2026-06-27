/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GEMINI_MODEL: string;
  readonly VITE_UX_V2: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
