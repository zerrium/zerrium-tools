import { Box, ChakraProvider, Container, Heading, Stack, Text, theme } from "@chakra-ui/react";
import React from "react";


export function NotFound() {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py="50%">
          <Heading
            fontWeight={700}
            fontSize={{ base: '5xl', md: '6xl' }}
            lineHeight={'110%'}>
            <Text as={'span'} color={'green.400'}>
              404 - Not Found
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize="xl">
            Getting lost, bruh??
          </Text>
        </Stack>
      </Container>
    </ChakraProvider>
  )
}