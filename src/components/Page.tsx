import React from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { Footer } from "./Footer"
import { LinkItems } from "../routes";


const findAccordationIndex = (url: string) => {
  // @ts-ignore
  const a = LinkItems.filter((link) => link.child).map((i) => i.child.map((j) => j.link))
  let temp = -1
  a.forEach((i) => {
    const j = i.indexOf(url)
    if (j !== -1) {
      temp = a.indexOf(i)
    }
  })
  return temp
}

const Page: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
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
      <Box ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}>
        <Box position="fixed" right="0" zIndex="9999" p="5" display={{ base: "none", md: "block" }}>
          <ColorModeSwitcher/>
        </Box>
        <Box px="25" pb="120" pt={{ base: "100", md: "15" }}>
          {children}
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0"
             ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}>
          <Footer/>
        </Box>
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const activeColor = useColorModeValue("green.200", "green.800")
  const basename = (document.querySelector('base')?.getAttribute('href') ?? '') + '/'
  const url = window.location.pathname.replace(basename, "")

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}
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
        <Accordion allowMultiple width="100%" maxW="lg" rounded="lg" defaultIndex={[findAccordationIndex(url)]}>
          {LinkItems.map((link) => (
            <React.Fragment key={link.name}>
              {link.child ? (
                <AccordionItem key={link.name}>
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
                    <AccordionIcon/>
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {link.child.map((child) => (
                      <NavItem key={child.name} href={basename + child.link} fontWeight={url === child.link ? "bold" : "none"}
                               background={url === child.link ? activeColor : "none"}>
                        {child.name}
                      </NavItem>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                <NavItem key={link.name} icon={link?.icon} ps={link.icon ? "4" : "12"} href={basename + (link.link || "#")}
                         fontWeight={url === link.link ? "bold" : "none"}
                         background={url === link.link ? activeColor : "none"}>
                  {link.name}
                </NavItem>
              )}
            </React.Fragment>
          ))}
        </Accordion>
      </Box>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon?: IconType
  href?: string
  children: string | number
}

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href={href || "#"}
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
      ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
      zIndex={999}>
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