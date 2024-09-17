import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  // createBrowserRouter,
  // RouterProvider,
  // createRoutesFromElements,
  BrowserRouter,
} from "react-router-dom";
// import ErrorPage from "./pages/ErrorPage";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./styles/main.scss";

// const router = createBrowserRouter([
//   {
//     id: "root",
//     path: "/",
//     element: (
//       <ThemeContextProvider>
//         <App />
//       </ThemeContextProvider>
//     ),
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         Component: PublicPage,
//       },
//       {
//         path: "login",
//         action: loginAction,
//         loader: loginLoader,
//         Component: LoginPage,
//       },
//       {
//         path: "protected",
//         loader: protectedLoader,
//         Component: ProtectedPage,
//       },
//     ],
//   },
// ]);
// createRoutesFromElements();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <BrowserRouter>
      <ThemeContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>
);
