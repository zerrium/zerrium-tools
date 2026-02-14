import { lazy } from "react"
import type { RouteObject } from "react-router-dom";
import type { IconType } from "react-icons";
import { FiCode, FiHome, FiLock, FiFileText, FiClock } from "react-icons/fi";
import type { ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom"
import Page from "./Page";
import { LuCodeXml } from "react-icons/lu";


const Home = lazy(() => import("./../pages/Home"));
const NotFound = lazy(() => import("./../pages/NotFound"));

const UuidGenerator = lazy(() => import("./../pages/Security Tools/UuidGenerator"));
const UuidValidator = lazy(() => import("./../pages/Security Tools/UuidValidator"));
const PasswordGenerator = lazy(() => import("./../pages/Security Tools/PasswordGenerator"));
const HashCalculator = lazy(() => import("./../pages/Security Tools/HashCalculator"));

const HtmlEncoder = lazy(() => import("./../pages/Encoding Tools/HtmlEncoder"));
const UrlEncoder = lazy(() => import("./../pages/Encoding Tools/UrlEncoder"));
const TextEncoder = lazy(() => import("./../pages/Encoding Tools/TextEncoder"));
const FileEncoder = lazy(() => import("./../pages/Encoding Tools/FileEncoder"));

const Beautifier = lazy(() => import("./../pages/Text Tools/Beautifier"));
const YamlValidator = lazy(() => import("./../pages/Text Tools/YamlValidator"));
const YamlComparator = lazy(() => import("./../pages/Text Tools/YamlComparator"));
const JsonViewer = lazy(() => import("./../pages/Text Tools/JsonViewer"));
const JsonComparator = lazy(() => import("./../pages/Text Tools/JsonComparator"));
const TextComparator = lazy(() => import("./../pages/Text Tools/TextComparator"));
const Regex = lazy(() => import("./../pages/Text Tools/Regex"));
const CharacterCounter = lazy(() => import("./../pages/Text Tools/CharacterCounter"));

const DateTimeCalculator = lazy(() => import("./../pages/DateTime Tools/DateTimeCalculator"));
const DateTimeConverter = lazy(() => import("./../pages/DateTime Tools/DateTimeConverter"));

const StackTraceViewer = lazy(() => import("./../pages/Debugging Tools/StackTraceViewer"));


interface LinkItemProps {
  name: string
  key: string
  icon?: IconType
  child?: { name: string, link: string, element: ReactElement, keyword?: string }[]
  link?: string
  element?: ReactElement
}

export const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, link: "home", element: <Home />, key: "home" },
  {
    name: 'Security Tools', icon: FiLock, key: "securityTools",
    child: [
      { name: "Hash Calculator", link: "hash-calculator", element: <HashCalculator />, keyword: "sha,sha3,file,keccak" },
      { name: "UUID Generator", link: "uuid-generator", element: <UuidGenerator /> },
      { name: "UUID Validator", link: "uuid-validator", element: <UuidValidator /> },
      { name: "Password Generator", link: "password-generator", element: <PasswordGenerator />, keyword: "pwd,psswd,psswrd" },
    ]
  },
  {
    name: 'Encoding Tools', icon: FiCode, key: "encodingTools",
    child: [
      { name: "HTML Encoder", link: "html-encoder", element: <HtmlEncoder />, keyword: "entity,decoder" },
      { name: "URL Encoder", link: "url-encoder", element: <UrlEncoder />, keyword: "decoder,link,uri,percent" },
      { name: "Text Encoder", link: "text-encoder", element: <TextEncoder />, keyword: "decoder,base64,base64url,hex,dec,oct" },
      { name: "File Encoder", link: "file-encoder", element: <FileEncoder />, keyword: "decoder,base64,base64url,hex,dec,oct" },
    ]
  },
  {
    name: 'Text Tools', icon: FiFileText, key: "textTools",
    child: [
      {name: "Character Counter", link: "character-counter", element: <CharacterCounter />, keyword: "length,calculator" },
      { name: "Text Comparator", link: "text-comparator", element: <TextComparator />, keyword: "compare,diff" },
      { name: "Regex Templates", link: "regex", element: <Regex /> },
      { name: "Beautifier/Minifier", link: "beautifier-minifier", element: <Beautifier />, keyword: "format,json,html,css,js,javascript,xml,sql" },
      { name: "JSON Viewer", link: "json-viewer", element: <JsonViewer />, keyword: "validator" },
      { name: "JSON Comparator", link: "json-comparator", element: <JsonComparator />, keyword: "diff" },
      { name: "YAML Validator", link: "yaml-validator", element: <YamlValidator /> },
      { name: "YAML Comparator", link: "yaml-comparator", element: <YamlComparator />, keyword: "diff" },
    ]
  },
  {
    name: 'Date Time Tools', icon: FiClock, key: "dateTimeTools",
    child: [
        { name: "Date Time Calculator", link: "date-time-calculator", element: <DateTimeCalculator />, keyword: "unix,timestamp,delta,diff,add,subtract,duration,between" },
      { name: "Date Time Converter", link: "date-time-converter", element: <DateTimeConverter />, keyword: "unix,timestamp,formatter" },
    ]
  },
  {
    name: 'Debugging Tools', icon: LuCodeXml, key: "encodingTools",
    child: [
      { name: "Stack Trace Viewer", link: "stack-trace-viewer", element: <StackTraceViewer />, keyword: "java,debug,format" },
    ]
  },
]

const convertToRouteObject = (input: LinkItemProps[]): RouteObject[] => {
  let result: RouteObject[] = [{path: "/", element: input[0].element, index: true}]
  input.forEach((r) => {
    if (r.child) {
      r.child.forEach((s) => {
        result = [...result, { path: s.link, element: s.element }]
      })
    } else {
      result = [...result, { path: r.link, element: r.element }]
    }
  })
  return [...result, { path: "*", element: <NotFound /> }]
}

export const router = createBrowserRouter([
  { path: "/", element: <Page />, children: convertToRouteObject(LinkItems) }
])