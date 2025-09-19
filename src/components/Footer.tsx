'use client'

import { Box, chakra, Container, Stack, Text, useColorModeValue, VisuallyHidden, } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'
import type { ReactNode } from 'react'

const SocialButton = ({
                        children,
                        label,
                        href,
                      }: {
  children: ReactNode
  label: string
  href: string
}) => {
  return (
    <chakra.button
      target="_blank"
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Box>
          <Text fontSize="12">Version {import.meta.env.VITE_REACT_APP_VERSION} © 2025 Zerrium. All rights reserved.</Text>
          <Text fontSize="12">Developed using <a href="https://react.dev/" target="_blank" rel="noreferrer">ReactJS</a> and <a
            href="https://chakra-ui.com/" target="_blank" rel="noreferrer">ChakraUI</a></Text>
        </Box>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'GitHub'} href={'https://github.com/zerrium/zerrium-tools'}>
            <FaGithub/>
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}