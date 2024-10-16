import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorkerRegistration"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { LinkItems } from "./routes";
import Page from "./components/Page"

// const basename = document.querySelector('base')?.getAttribute('href') ?? '/'
const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeScript/>
      <ChakraProvider theme={theme}>
        <Page>
          <Routes>
            <Route index element={<Navigate to={LinkItems[0].link as string}/>}/>
            {LinkItems.map((route) => (
              <React.Fragment key={route.name}>
                {route.child ? (
                  <React.Fragment key={route.name}>
                    {route.child.map((subroute) => (
                      <Route path={subroute.link} element={subroute.element} key={subroute.name}/>
                    ))}
                  </React.Fragment>
                ) : (
                  <Route path={route.link} element={route.element}/>
                )}
              </React.Fragment>
            ))}
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Page>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

