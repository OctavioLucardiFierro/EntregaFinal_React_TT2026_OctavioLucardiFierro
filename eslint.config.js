import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Los contextos exportan a proposito el Provider junto a su hook (useXxx),
      // patron idiomatico de Context API. Desactivamos el aviso de fast-refresh.
      'react-refresh/only-export-components': 'off',
      // La app usa efectos de carga de datos que actualizan estados de
      // carga/error/datos (patron estandar de data fetching).
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // Los scripts de utilidad corren en Node (no en el navegador).
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
