import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { 'arena-bg': '#050506', 'arena-cyan': '#00F2FF' } } },
  plugins: [],
};
export default config;
