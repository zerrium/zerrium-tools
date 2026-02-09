import { type FC, useEffect, useState } from "react"
import {
  IconButton,
  type IconButtonProps,
  useColorMode,
  useColorModePreference,
} from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"
import { MdHdrAuto } from "react-icons/md";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher: FC<ColorModeSwitcherProps> = (props) => {
  const { setColorMode } = useColorMode()
  const systemColorMode = useColorModePreference()
  const colorModeCycle = ["system", "light", "dark"]

  const systemColorModeInit = !localStorage?.getItem("is-follow-system-color-mode") ? "true" : localStorage.getItem("is-follow-system-color-mode")
  const [colorModeCycleState, setColorModeCycleState] = useState(
      systemColorModeInit === "true" ? 0 : (localStorage?.getItem("chakra-ui-color-mode") === "light" ? 1 : 2))

  const onClick = () => {
    setColorModeCycleState((prev) => (prev + 1) % colorModeCycle.length)
  }

  const getIcon = () => {
    const icons = [<MdHdrAuto />, <FaMoon />, <FaSun />]
    return icons[colorModeCycleState]
  }

  useEffect(() => {
    if (colorModeCycleState === 0) {
      localStorage.setItem("is-follow-system-color-mode", "true")
      setColorMode(systemColorMode ?? "system")
    } else {
      localStorage.setItem("is-follow-system-color-mode", "false")
      setColorMode(colorModeCycle[colorModeCycleState])
    }
  }, [colorModeCycleState, systemColorMode, setColorMode])

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      border="1px"
      borderColor="gray.200"
      marginRight="2"
      onClick={onClick}
      icon={getIcon()}
      aria-label="Switch color mode"
      {...props}
    />
  )
}
