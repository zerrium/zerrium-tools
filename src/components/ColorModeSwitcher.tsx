import { FC } from "react"
import { IconButton, IconButtonProps, useColorMode, useColorModeValue, } from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher: FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      border="1px"
      borderColor="gray.200"
      marginRight="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon/>}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}
