/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./routes/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#566FFF',
        brown: '#8B4513',  // Brown 색상
        gold: '#FFD700',   // Gold 색상}
        beige: '#DBD3D1'
      },
      fontFamily: {
        'fontdiner': ['Fontdiner Swanky', 'serif']
      }
    },
    plugins: [],
  }

}