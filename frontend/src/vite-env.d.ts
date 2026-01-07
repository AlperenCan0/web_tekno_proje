/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // Diğer env değişkenleri buraya eklenebilir
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}




