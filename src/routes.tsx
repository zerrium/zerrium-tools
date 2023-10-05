import { IconType } from "react-icons";
import { FiCode, FiHome, FiLock, FiFileText } from "react-icons/fi";
import { ReactElement } from "react";
import { Home } from "./pages/Home";
import { UuidGenerator } from "./pages/Security Tools/UuidGenerator";
import { UuidValidator } from "./pages/Security Tools/UuidValidator";
import { PasswordGenerator } from "./pages/Security Tools/PasswordGenerator";
import { HashCalculator } from "./pages/Security Tools/HashCalculator";
import { UrlEncoder } from "./pages/Encoding Tools/UrlEncoder";
import { TextEncoder } from "./pages/Encoding Tools/TextEncoder";

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
      { name: "Hash Calculator", link: "hash-calculator", element: <HashCalculator/> },
      { name: "UUID Generator", link: "uuid-generator", element: <UuidGenerator/> },
      { name: "UUID Validator", link: "uuid-validator", element: <UuidValidator/> },
      { name: "Password Generator", link: "password-generator", element: <PasswordGenerator/> },
      { name: "JWT Encoder/Decoder", link: "jwt", element: <Home/> }
    ]
  },
  {
    name: 'Encoding Tools', icon: FiCode,
    child: [
      { name: "URL Encoder", link: "url-encoder", element: <UrlEncoder/> },
      { name: "Text Encoder", link: "text-encoder", element: <TextEncoder/> },
      { name: "Image Encoder", link: "image-encoder", element: <Home/> },
      { name: "File Encoder", link: "file-encoder", element: <Home/> }
    ]
  },
  {
    name: 'Text Tools', icon: FiFileText,
    child: [
      { name: "Text Comparator", link: "text-comparator", element: <Home/> },
      { name: "JSON Beautifier", link: "json-beautifier", element: <Home/> },
      { name: "XML Beautifier", link: "xml-beautifier", element: <Home/> },
      { name: "YAML Validator", link: "yaml-validator", element: <Home/> },
      { name: "Regex Checker", link: "regex-checker", element: <Home/> },
    ]
  }
]