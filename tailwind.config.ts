import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0a0a14',
          card: '#1a1a2e',
          border: 'rgba(255,255,255,0.08)',
          purple: '#7c3aed',
          amber: '#f59e0b',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Microsoft JhengHei', 'PingFang TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
