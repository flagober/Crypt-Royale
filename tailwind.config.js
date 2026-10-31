export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0f172a' },
        neon: { blue: '#00f0ff', pink: '#ff003c', green: '#00ff66' }
      }
    },
  },
  plugins: [],
}
