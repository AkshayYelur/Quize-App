// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
//     "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           50:  "#f7f6ff",
//           100: "#f0effb",
//           300: "#a8a1ff",
//           500: "#6b46ff",
//           600: "#5b3dff",
//         },
//         accent: {
//           blue: "#4f46e5",
//           indigo: "#6366f1"
//         }
//       },
//       boxShadow: {
//         soft: "0 8px 30px rgba(16,24,40,0.06)",
//       },
//       borderRadius: {
//         xl2: "1rem",
//       }
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ VERY IMPORTANT (enables dark mode)

  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f6ff",
          100: "#f0effb",
          300: "#a8a1ff",
          500: "#6b46ff",
          600: "#5b3dff",
        },
        accent: {
          blue: "#4f46e5",
          indigo: "#6366f1",
        },

        // ✅ ADD DARK COLORS (optional but useful)
        darkbg: "#0f172a",   // background
        darkcard: "#1e293b", // card background
        darktext: "#e2e8f0", // text color
      },

      boxShadow: {
        soft: "0 8px 30px rgba(16,24,40,0.06)",
      },

      borderRadius: {
        xl2: "1rem",
      },
    },
  },

  plugins: [],
};
