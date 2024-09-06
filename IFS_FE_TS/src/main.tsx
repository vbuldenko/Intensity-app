import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/main.scss";
import ErrorPage from "./pages/ErrorPage";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    ),
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
