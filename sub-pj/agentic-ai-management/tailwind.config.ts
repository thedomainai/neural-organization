import type { Config } from 'tailwindcss';
import { tailwindThemeExtend } from './src/lib/theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: tailwindThemeExtend,
  },
  plugins: [],
};

export default config;
