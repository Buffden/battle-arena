/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts,scss}"],
    theme: {
      extend: {
        fontFamily: {
          '8bit': ['"Press Start 2P"', '"VT323"', 'monospace'],
        },
        colors: {
          arcadeBlack: '#181820',
          arcadeOrange: '#ff3c00',
          arcadeYellow: '#ffb300',
          arcadeRedDark: '#2d0a0a',
        },
        boxShadow: {
          arcade: '0 0 0 4px #ff3c00, 0 0 16px #ffb300',
        },
      },
    },
    plugins: [],
  };
  