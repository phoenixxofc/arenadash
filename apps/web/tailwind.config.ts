import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { 'arena-bg': '#050506', 'arena-cyan': '#00F2FF' } } },
  plugins: [],
};
export default config;
