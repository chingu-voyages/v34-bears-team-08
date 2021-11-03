const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary'),
    }),
    extend: {
      colors: {
        white: '#fff',
        blue: {
          medium: '#005c98',
        },
        black: {
          0: '#000',
          light: '#262626',
          off: '#1a1b20',
        },
        gray: {
          base: '#616161',
          background: '#fafafa',
          primary: '#dbdbdb',
        },
        red: {
          primary: '#ed4956',
        },
        ...require('@radix-ui/colors'),
      },
    },
  },

  plugins: [],
}

module.exports = config
