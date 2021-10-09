const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  plugins: [],
  variants: {
    extend: {
      transform: ['hover', 'focus'],
      scale: ['active', 'group-hover'],
    }
  }
};

module.exports = config;