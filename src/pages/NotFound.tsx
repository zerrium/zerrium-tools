import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";


const NotFound = () => {
  return (
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
  )
}

export default NotFound