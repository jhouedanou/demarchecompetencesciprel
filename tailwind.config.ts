import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Palette officielle CIPREL
        'ciprel-orange': {
          DEFAULT: '#EE7F00',
          50: '#FFF4E6',
          100: '#FFE3C2',
          200: '#FFC58C',
          300: '#FFA251',
          400: '#F28F26',
          500: '#EE7F00',
          600: '#D36F00',
          700: '#A75700',
          800: '#7C4200',
          900: '#4E2A00',
        },
        'ciprel-orange-gradient': '#E0832F',
        'ciprel-green': {
          DEFAULT: '#58A636',
          50: '#F0F8F0',
          100: '#DCECD9',
          200: '#B6D8AF',
          300: '#8BC47B',
          400: '#6FA84A',
          500: '#58A636',
          600: '#4C8F32',
          700: '#3D6F2B',
          800: '#2C5122',
          900: '#1D3718',
        },
        'ciprel-green-gradient': '#6FA84A',
        'ciprel-blue': '#3A6FA2',
        'ciprel-blue-dark': '#2A436D',
        'ciprel-turquoise': '#60A9B3',
        'ciprel-light-green': '#BDC748',
        'ciprel-yellow': '#FAEA15',
        'ciprel-gray': {
          light: '#D8D8D8',
          medium: '#9E9E9E',
          100: '#F2F2F2',
          200: '#D8D8D8',
          300: '#BFBFBF',
          400: '#9E9E9E',
          500: '#7F7F7F',
        },
        'ciprel-black': '#0A0E12',
        'ciprel-white': '#FFFFFF',
        blue: {
          50: '#EDF4FB',
          100: '#CFE2F4',
          200: '#A0C4E6',
          300: '#6FA5D1',
          400: '#4D8BC0',
          500: '#3A6FA2',
          600: '#2F5984',
          700: '#27476B',
          800: '#1F3652',
          900: '#142538',
        },
        green: {
          50: '#F1F8F0',
          100: '#DDECD8',
          200: '#B8D8AF',
          300: '#92C385',
          400: '#6FA84A',
          500: '#58A636',
          600: '#4B8E30',
          700: '#3C6E28',
          800: '#2C5220',
          900: '#1F3B18',
        },
        orange: {
          50: '#FFF4E6',
          100: '#FFE1BF',
          200: '#FFC080',
          300: '#FFA04A',
          400: '#F28A1E',
          500: '#EE7F00',
          600: '#D36F00',
          700: '#A95700',
          800: '#7A3F00',
          900: '#4F2700',
        },
        purple: {
          50: '#EBF7F9',
          100: '#D1EEF2',
          200: '#A3DDE5',
          300: '#75CCD8',
          400: '#4DBACB',
          500: '#60A9B3',
          600: '#4D8A93',
          700: '#3A6B73',
          800: '#284D54',
          900: '#172F35',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
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
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'blob': {
          '0%': { 
            transform: 'translate(0px, 0px) scale(1)' 
          },
          '33%': { 
            transform: 'translate(30px, -50px) scale(1.1)' 
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.9)' 
          },
          '100%': { 
            transform: 'translate(0px, 0px) scale(1)' 
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      fontFamily: {
        sans: [
          'var(--font-body)',
          'Century Gothic',
          'Questrial',
          'Avenir',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'var(--font-body)',
          'sans-serif',
        ],
      },
      aspectRatio: {
        'video-vertical': '9 / 16',
        'video-horizontal': '16 / 9',
      },
      animationDelay: {
        '0': '0s',
        '1000': '1s', 
        '2000': '2s',
        '3000': '3s',
        '4000': '4s',
        '5000': '5s',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
