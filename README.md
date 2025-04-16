# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Running the React Extension

To run the React extension, follow these steps:

1. First, run the development server:
   ```sh
   npm run dev
   ```

2. After the build is complete, locate the `dist` folder in your project directory.

3. Open Chrome and navigate to `chrome://extensions/`.

4. Enable "Developer mode" by toggling the switch in the top right corner.

5. Click on the "Load unpacked" button and select the `dist` folder from your project directory.

Your React extension should now be loaded and running in Chrome.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
