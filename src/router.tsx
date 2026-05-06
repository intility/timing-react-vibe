import { createBrowserRouter } from "react-router";
import ErrorPage from "./components/ErrorPage";
import RootLayout from "./components/RootLayout";
import Home from "./routes/Home";

// https://reactrouter.com/start/data/routing
export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);
