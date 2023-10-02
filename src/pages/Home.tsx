import Page from "../components/Page";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";


export function Home() {
  return (
    <Page>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: "10%", md: "12%", lg: "15%", xl: "17%", "2xl": "35%" }}>
          <Heading
            fontWeight={700}
            fontSize={{ base: '5xl', md: '6xl' }}
            lineHeight={'110%'}>
            Welcome to <br/>
            <Text as={'span'} color={'green.400'}>
              Zerrium Tool Kit
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize="xl">
            A handy website for developers that provides many useful tools to help with your development.
          </Text>
        </Stack>
      </Container>
    </Page>
  )
}