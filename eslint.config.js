import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,vue}'],
    extends: [js.configs.recommended, ...pluginVue.configs['flat/recommended']],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Las vistas de página de una SPA (Home, Admin…) llevan nombre simple
      'vue/multi-word-component-names': 'off',
    },
  },
])
