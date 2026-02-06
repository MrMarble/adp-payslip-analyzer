/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
