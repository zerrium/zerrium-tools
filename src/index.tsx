import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import reportWebVitals from "./reportWebVitals"
import { register } from "./serviceWorkerRegistration"
import { RouterProvider } from "react-router-dom"
import { router } from "./components/Router"

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

