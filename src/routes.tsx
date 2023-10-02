import { IconType } from "react-icons";
import { FiHome, FiLock } from "react-icons/fi";
import { ReactElement } from "react";
import { Home } from "./pages/Home";

interface LinkItemProps {
  name: string
  icon?: IconType
  child?: { name: string, link: string, element: ReactElement }[]
  link?: string
  element?: ReactElement
}

export const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, link: "home", element: <Home/> },
  {
    name: 'Security Tools', icon: FiLock,
    child: [
      { name: "Hash Calculator", link: "hash-calculator", element: <Home/> },
      { name: "UUID Generator", link: "uuid-generator", element: <Home/> },
      { name: "UUID Validator", link: "uuid-validator", element: <Home/> },
      { name: "Password Generator", link: "password-generator", element: <Home/> }
    ]
  },
  {
    name: 'Encoding Tools',
    child: [
      { name: "URL Encoder", link: "url-encoder", element: <Home/> },
      { name: "Text Encoder", link: "text-encoder", element: <Home/> },
      { name: "Image Encoder", link: "image-encoder", element: <Home/> },
      { name: "File Encoder", link: "file-encoder", element: <Home/> }
    ]
  },
  {
    name: 'Text Tools',
    child: [
      { name: "Text Comparator", link: "text-comparator", element: <Home/> },
      { name: "JSON Beautifier", link: "json-beautifier", element: <Home/> },
      { name: "XML Beautifier", link: "xml-beautifier", element: <Home/> },
      { name: "YAML Validator", link: "yaml-validator", element: <Home/> },
      { name: "Regex Checker", link: "regex-checker", element: <Home/> },
    ]
  }
]