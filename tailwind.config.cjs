const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary'),
    }),
    extend: {
      colors: {
        white: '#ffffff',
        blue: {
          medium: '#005c98',
        },
        black: {
          light: '#262626',
          faded: '#00000059',
        },
        gray: {
          base: '#616161',
          background: '#fafafa',
          primary: '#dbdbdb',
        },
        red: {
          primary: '#ed4956',
        },
      },
    },
  },

  plugins: [],
  variants: {
    extend: {
      transform: ['hover', 'focus'],
      scale: ['active', 'group-hover'],
    },
  },
}

module.exports = config
