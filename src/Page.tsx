import React, {ReactText} from 'react'
import {
  Box,
  BoxProps,
  ChakraProvider,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Text,
  theme,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {ColorModeSwitcher} from "./ColorModeSwitcher"
import {FiCompass, FiHome, FiMenu, FiSettings, FiStar, FiTrendingUp,} from 'react-icons/fi'
import {IconType} from 'react-icons'
import { Footer } from "./Footer"

interface LinkItemProps {
  name: string
  icon: IconType
}

const LinkItems: Array<LinkItemProps> = [
  {name: 'Home', icon: FiHome},
  {name: 'Trending', icon: FiTrendingUp},
  {name: 'Explore', icon: FiCompass},
  {name: 'Favourites', icon: FiStar},
  {name: 'Settings', icon: FiSettings},
]

export function Page() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <SidebarContent onClose={() => onClose} display={{base: 'none', md: 'block'}}/>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose}/>
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav display={{base: 'flex', md: 'none'}} onOpen={onOpen}/>
        <Box ml={{base: 0, md: 60}}>
          <Box position="absolute" right="0" zIndex="9999" p="5" display={{ base: "none", md: "block" }}>
            <ColorModeSwitcher/>
          </Box>
          <Box p="15" pb="120">
            {/* Content */}
            <Text>AAA</Text>
            <Text>AAA</Text>
            <Text>AAA</Text>
            <Text>AAA</Text>
            <Text>AAA</Text>
            <Text>AAA</Text>
          </Box>
          <Box position="fixed" bottom="0" left="0" right="0" ml={{base: 0, md: 60}}>
            <Footer/>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{base: 'full', md: 60}}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Zerrium Tools
        </Text>
        <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: ReactText
}

const NavItem = ({icon, children, ...rest}: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{textDecoration: 'none'}}
      _focus={{boxShadow: 'none'}}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

const MobileNav = ({onOpen, ...rest}: MobileProps) => {
  return (
    <Flex
      ml={{base: 0, md: 60}}
      px={{base: 4, md: 24}}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu/>}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Zerrium Tools
      </Text>
      <Box position="absolute" right="0" p="5" display={{ base: "block", md: "none" }}>
        <ColorModeSwitcher/>
      </Box>
    </Flex>
  )
}