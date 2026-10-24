// PostCSS configuration.
// @tailwindcss/postcss only processes files that import tailwindcss —
// specifically app/admin/admin.css. The public site is unaffected.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
