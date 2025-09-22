// Updated to use the new Tailwind CSS PostCSS plugin package (@tailwindcss/postcss)
// required for Tailwind v4+.
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss(), autoprefixer()]
};
