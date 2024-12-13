import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import ErrorPage from "./pages/ErrorPage";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>
);
