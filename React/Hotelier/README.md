# Hotelier

## Deploy to Netlify

This project is configured for Netlify with Vite and React Router.

1. Push the project to GitHub, GitLab, or Bitbucket. Do not commit `.env`; use `.env.example` as the variable template.
2. In Netlify, select **Add new site** > **Import an existing project** and choose the repository.
3. Use these build settings (they are also defined in `netlify.toml`):
	- Build command: `npm run build`
	- Publish directory: `dist`
4. In **Site configuration** > **Environment variables**, add these variables with the values from your local `.env` file:
	- `VITE_FIREBASE_API_KEY`
	- `VITE_FIREBASE_AUTH_DOMAIN`
	- `VITE_FIREBASE_PROJECT_ID`
	- `VITE_FIREBASE_STORAGE_BUCKET`
	- `VITE_FIREBASE_MESSAGING_SENDER_ID`
	- `VITE_FIREBASE_APP_ID`
5. In Firebase Console, open **Authentication** > **Settings** > **Authorized domains** and add your Netlify domain, for example `your-site.netlify.app`.
6. Deploy the site. Netlify will run the build automatically on future pushes.

The redirect in `netlify.toml` keeps direct visits and refreshes working for routes such as `/rooms` and `/admin`.

## Local development

```bash
npm install
npm run dev
```

Without Firebase variables, the app uses its local mock mode and browser `localStorage`. Firebase is required for shared production authentication and Firestore data.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
