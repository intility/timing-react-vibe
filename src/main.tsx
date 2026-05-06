import { createRoot } from "react-dom/client";
// bifrost-app.css needs to be the first CSS file to make sure font files will be loaded properly.
import "@intility/bifrost-react/bifrost-app.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
