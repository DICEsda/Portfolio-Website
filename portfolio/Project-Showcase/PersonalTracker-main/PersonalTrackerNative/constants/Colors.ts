const stone = {
  50: 'oklch(98.5% 0.005 95)',
  100: 'oklch(96.7% 0.008 95)',
  200: 'oklch(93.5% 0.014 95)',
  300: 'oklch(89.2% 0.021 95)',
  400: 'oklch(83.7% 0.029 95)',
  500: 'oklch(76.7% 0.039 95)',
  600: 'oklch(64.7% 0.048 95)',
  700: 'oklch(52.7% 0.048 95)',
  800: 'oklch(41.7% 0.039 95)',
  900: 'oklch(31.7% 0.029 95)',
  950: 'oklch(20.7% 0.021 95)',
};

const orange = {
  50: 'oklch(98% 0.015 60)',
  100: 'oklch(95% 0.025 60)',
  200: 'oklch(90% 0.035 60)', // This is orange-200
  300: 'oklch(85% 0.045 60)',
  400: 'oklch(80% 0.055 60)',
  500: 'oklch(75% 0.065 60)',
  600: 'oklch(70% 0.075 60)',
  700: 'oklch(65% 0.085 60)',
  800: 'oklch(60% 0.095 60)',
  900: 'oklch(55% 0.105 60)',
  950: 'oklch(50% 0.115 60)',
};

export default {
  light: {
    text: stone[900],
    background: stone[50],
    tint: stone[700],
    tabIconDefault: stone[300],
    tabIconSelected: stone[700],
    border: stone[200],
    input: stone[100],
    card: stone[50],
    accent: orange[200], // Orange-200 accent
  },
  dark: {
    text: stone[50],
    background: stone[900],
    tint: stone[200],
    tabIconDefault: stone[700],
    tabIconSelected: stone[200],
    border: stone[700],
    input: stone[800],
    card: stone[800],
    accent: orange[200], // Orange-200 accent
  },
};
