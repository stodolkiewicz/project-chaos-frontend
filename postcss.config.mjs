/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Add Mantine preset and simple vars plugin
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
    // Include your existing Tailwind plugin
    // Note: Using object syntax for consistency, equivalent to ["@tailwindcss/postcss"]
    "@tailwindcss/postcss": {},
  },
};

export default config;
