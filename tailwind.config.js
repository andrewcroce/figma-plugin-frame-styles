module.exports = {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
