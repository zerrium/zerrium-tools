import React from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
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
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { FiChevronDown, FiHome, FiLock, FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { Footer } from "./Footer"

interface LinkItemProps {
  name: string
  icon?: IconType
  child?: string[]
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  {
    name: 'Security Tools', icon: FiLock,
    child: ["Hash Calculator", "UUID Generator"]
  },
  {
    name: 'Encoding Tools',
    child: ["URL Encoder", "Text Encoder", "Image Encoder", "File Encoder"]
  }
]

const Page: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }}/>
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
        <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} position="fixed" w="100%"/>
        <Box ml={{ base: 0, md: 60 }}>
          <Box position="fixed" right="0" zIndex="9999" p="5" display={{ base: "none", md: "block" }}>
            <ColorModeSwitcher/>
          </Box>
          <Box px="25" pb="120" pt={{ base: "100", md: "15" }}>
            {children}
          </Box>
          <Box position="fixed" bottom="0" left="0" right="0" ml={{ base: 0, md: 60 }}>
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

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
      overflowY="scroll">
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Zerrium Tools
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose}/>
      </Flex>
      <Box>
        <Accordion allowMultiple width="100%" maxW="lg" rounded="lg">
          {LinkItems.map((link) => (
            <>
              {link.child ? (
                <AccordionItem>
                  <AccordionButton
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={4}
                    _hover={{
                      bg: 'green.300',
                      color: 'white',
                    }}>
                    <Box w="100%" display="flex">
                      {link.icon ? (
                        <>
                          <Icon
                            mr="4"
                            mt="1"
                            fontSize="16"
                            _groupHover={{
                              color: 'white',
                            }}
                            as={link.icon}
                          />
                          <Text fontSize="md">{link.name}</Text>
                        </>
                      ) : (
                        <Text ml="8" fontSize="md">{link.name}</Text>
                      )}
                    </Box>
                    <Icon as={FiChevronDown}/>
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {link.child.map((child) => (
                      <NavItem key={child}>
                        {child}
                      </NavItem>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                <NavItem key={link.name} icon={link?.icon} ps={link.icon ? "4" : "12"}>
                  {link.name}
                </NavItem>
              )}
            </>
          ))}
        </Accordion>
      </Box>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon?: IconType
  children: string | number
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'green.300',
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

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
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

export default Page;