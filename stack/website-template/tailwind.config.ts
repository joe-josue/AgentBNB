import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        foreground: '#1A1A1A',
        primary: {
          DEFAULT: '#1E6B7B',
          dark: '#155969',
          light: '#2A8599',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#C4956A',
          dark: '#A67A52',
          light: '#D4AA85',
          foreground: '#ffffff',
        },
        forest: '#2D5F3F',
        ink: '#1A1A1A',
        muted: {
          DEFAULT: '#F4F2EE',
          foreground: '#6B6B63',
        },
        border: '#E5E2DB',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1A1A1A',
        },
        // shadcn CSS-variable passthrough (needed for shadcn components)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        ring: 'hsl(var(--ring))',
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        input: 'hsl(var(--input))',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': [
          'clamp(3rem, 6vw, 5rem)',
          { lineHeight: '1.05', letterSpacing: '-0.02em' },
        ],
        'display-lg': [
          'clamp(2.25rem, 4vw, 3.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.01em' },
        ],
        'display-md': [
          'clamp(1.75rem, 3vw, 2.5rem)',
          { lineHeight: '1.15' },
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'bounce-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-y': 'bounce-y 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
