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
import { FileEncoder } from "./pages/Encoding Tools/FileEncoder";
import { Beautifier } from "./pages/Text Tools/Beautifier";
import { YamlValidator } from "./pages/Text Tools/YamlValidator";
import { JsonViewer } from "./pages/Text Tools/JsonViewer";
import { TextComparator } from "./pages/Text Tools/TextComparator";
import { Regex } from "./pages/Text Tools/Regex";

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
      { name: "Password Generator", link: "password-generator", element: <PasswordGenerator/> }
    ]
  },
  {
    name: 'Encoding Tools', icon: FiCode,
    child: [
      { name: "URL Encoder", link: "url-encoder", element: <UrlEncoder/> },
      { name: "Text Encoder", link: "text-encoder", element: <TextEncoder/> },
      { name: "File Encoder", link: "file-encoder", element: <FileEncoder/> }
    ]
  },
  {
    name: 'Text Tools', icon: FiFileText,
    child: [
      { name: "Text Comparator", link: "text-comparator", element: <TextComparator/> },
      { name: "Regex Templates", link: "regex", element: <Regex/> },
      { name: "Beautifier/Minifier", link: "beautifier-minifier", element: <Beautifier/> },
      { name: "JSON Viewer", link: "json-viewer", element: <JsonViewer/> },
      { name: "YAML Validator", link: "yaml-validator", element: <YamlValidator/> }
    ]
  }
]