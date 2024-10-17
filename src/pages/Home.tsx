import { Box, Container, Heading, HStack, Icon, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { FiCheck, FiX } from 'react-icons/fi'

const features: {id: string, title: string, text: string, note?: string}[] = [
  { id: "1", title: "Completely Client-Side", text: "Which means the logic of this website is run locally on your browser, thus your data is on your own, not going anywhere" },
  { id: "2", title: "Mobile Friendly", text: "This website is responsive and built with mobile-look in mind. Use this website anywhere with your phones" },
  { id: "3", title: "Dark Theme Available 🌙", text: "Who even hates dark look? 👀" },
  { id: "4", title: "Works Offline", text: "This website also has PWA (Progressive Web App) service worker available so you can use this site offline!", note: "Temporarily disabled due to technical issues with service worker routing. Feel free to help solving it by visiting the GitHub repo bellow" },
  { id: "5", title: "Open Source", text: "Source code is available on GitHub by clicking the icon at the footer of this page. Feel free to report issue and submit PR to the repository!" }
]

const Home = () => {
  return (
    <Container maxW={'4xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        pt={{ base: "10%", md: "12%", lg: "15%", xl: "17%", "2xl": "35%" }}
        pb={{ base: "10%", md: "11%", lg: "12%", xl: "13%", "2xl": "15%" }}>
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
      <Stack w="100%" mt={12} pb={{ base: "10%", md: "12%", lg: "15%", xl: "17%", "2xl": "35%" }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} w="100%">
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={feature?.note ? 'red.400' : 'green.400'} px={2} pt={1}>
                <Icon as={feature?.note ? FiX : FiCheck} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.500'} textAlign={'justify'}>
                  {feature?.note ? (
                    <>
                      <del>{feature.text}</del>
                      <br />{feature.note}
                    </>
                  ) : feature.text}
                </Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default Home