import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./components/Router"
import { registerSW } from "virtual:pwa-register";
import process from "process";

window.process = process;

// Register the service worker
if ('serviceWorker' in navigator) {
    registerSW();
}

// const basename = document.querySelector('base')?.getAttribute('href') ?? '/'
const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container)

root.render(
  <StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}/>
    </ChakraProvider>
  </StrictMode>,
)

