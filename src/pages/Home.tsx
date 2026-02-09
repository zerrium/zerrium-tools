import {
  Accordion, AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Box, Button,
  Container,
  Heading,
  HStack,
  Icon, ListItem,
  SimpleGrid,
  Stack,
  Text, UnorderedList, useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { FiCheck, FiX } from 'react-icons/fi'
import { useEffect } from "react";

interface FeatureProps {
  id: string,
  title: string,
  text: string,
  note?: string
}

interface ChangeLogProps {
  version: string,
  date: string,
  note?: string,
  changes?: string[]
}

const features: FeatureProps[] = [
  { id: "1", title: "Completely Client-Side", text: "Which means the logic of this website is run locally on your browser, thus your data is on your own, not going anywhere" },
  { id: "2", title: "Mobile Friendly", text: "This website is responsive and built with mobile-look in mind. Use this website anywhere with your phones" },
  { id: "3", title: "Dark Theme Available 🌙", text: "Who even hates dark look? 👀" },
  { id: "4", title: "Works Offline", text: "This website also has PWA (Progressive Web App) service worker available so you can use this site offline!" },
  { id: "5", title: "Open Source", text: "Source code is available on GitHub by clicking the icon at the footer of this page. Feel free to report issue and submit PR to the repository!" }
]

const changeLogs: ChangeLogProps[] = [
  { version: "1.7.0", date: "10 Feb 2026", changes: [
      "Updated dependencies",
      "Added version history (changelog)",
      "Added auto color mode toggle (follow system)",
      "Added Java stack trace viewer"
    ]
  },
  { version: "1.6.2", date: "5 Feb 2026", changes: [
      "Revised navLink item for seamless navigation between pages"
    ]
  },
  { version: "1.6.1", date: "25 Sep 2025", changes: [
      "Added character counter",
      "Added date time calculator"
    ]
  },
  { version: "1.6.0", date: "19 Sep 2025",
    note: "I successfully migrated from React CRA script to Vite. As the result, I managed to get PWA service worker functionality working again.\nFrom now on, I wrap up this personal project. In the future, there might be less updates or maintenance to this repository unless I need a new feature for myself.\nI think this is my first successful personal project that I actually use every day 😎\n\u00A0",
    changes: [
      "Migrated from create-react-app (CRA) to vite",
      "Enabled PWA service worker again with vite",
      "Updated dependencies",
      "Fixed number generator logic (unbiased cryptographically secure)",
      "Optimized code minifier regex"
    ]
  },
  { version: "1.5.0", date: "6 May 2025", changes: [
      "Added JSON comparator",
      "Added search to nav bar menu"
    ]
  },
  { version: "1.4.1", date: "17 Oct 2024",
    note: "The code base was a huge mess, so I decided to utilize code splitting to reduce the bundle size build. As the result, the PWA service worker broke and I have no idea how to fix it, so I have to disable it for now",
    changes: [
      "Optimized import with lazy (code splitting)",
      "Disabled PWA service worker temporarily"
    ]
  },
  { version: "1.2.3", date: "17 Oct 2024", changes: [
      "Fixed page routing"
    ]
  },
  { version: "1.2.2", date: "16 Oct 2024", changes: [
      "Fixed page wrapper"
    ]
  },
  { version: "1.2.1", date: "16 Oct 2024", changes: [
      "Fixed page wrapper"
    ]
  },
  { version: "1.2.0", date: "16 Oct 2024", changes: [
      "Added HTML entity encoder/decoder",
      "Fixed page wrapper"
    ]
  },
  { version: "1.1.0", date: "7 May 2024", changes: [
      "Added date time converter"
    ]
  },
  { version: "1.0.2", date: "8 Oct 2023", changes: [
      "Fixed mobile view nav panel",
      "Fixed mobile view password generator"
    ]
  },
  { version: "1.0.1", date: "8 Oct 2023", changes: [
      "Added PWA service worker",
      "Fixed navbar link"
    ]
  },
  { version: "1.0.0", date: "7 Oct 2023",
    note: "First release deployed to tools.zerrium.com website",
    changes: [
      "Added landing page, menu",
      "Added dark/light color mode",
      "Added UUID generator and validator",
      "Added password generator",
      "Added hash calculator",
      "Added URL encoder/decoder",
      "Added text/file encoder/decoder (binary, octal, decimal, hexadecimal, base64, base64 URL)",
      "Added code beautifier/minifier (JSON, HTML, CSS, JS, XML)",
      "Added YAML validator",
      "Added JSON viewer",
      "Added text comparator",
      "Added regex template"
    ]
  },
  { version: "0.1.0", date: "29 Sep 2023", changes: [
      "Initial setup"
    ]
  },
]

const Home = () => {
  const textColor = useColorModeValue("gray.500", "gray.400")

  useEffect(() => {
    const originalRestoration = window.history.scrollRestoration;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, behavior: "smooth" })

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = originalRestoration;
      }
    };
  }, []);

  return (
    <Container maxW={'4xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        pt={{ base: "10%", md: "12%", lg: "15%", xl: "17%", "2xl": "35%" }}>
        <Heading
          fontWeight={700}
          fontSize={{ base: '5xl', md: '6xl' }}
          lineHeight={'110%'}>
          Welcome to <br/>
          <Text as={'span'} color={'green.400'}>
            Zerrium Tool Kit
          </Text>
        </Heading>
        <Text color={textColor} fontSize="xl">
          A handy website for developers that provides many useful tools to help with your development.
        </Text>
      </Stack>
      <Stack w="100%" my={12} py={{ base: "10%", md: "11%", lg: "12%", xl: "13%", "2xl": "15%" }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} w="100%">
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={feature?.note ? 'red.400' : 'green.400'} px={2} pt={1}>
                <Icon as={feature?.note ? FiX : FiCheck} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={textColor} textAlign={'justify'}>
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
      <Stack w="100%" pt={6} pb={{ base: "8%", md: "10%", lg: "12%", xl: "15%", "2xl": "18%" }}>
        <Text fontWeight={600} fontSize="3xl" textAlign="center" pb={2}>
          What's new?
        </Text>
        <Accordion defaultIndex={[0]} allowMultiple>
          {changeLogs.map((log) => (
            <AccordionItem key={log.version}>
              <AccordionButton pb={2}>
                <AccordionIcon />
                <Box as='span' flex='1' textAlign='left' pl={3}>
                  <Text fontWeight={600} fontSize="xl">Version {log.version}</Text>
                </Box>
                <Box as='span' flex='1' textAlign='right' pr={2}>
                  <Text color={textColor} fontSize="sm">{log.date}</Text>
                </Box>
              </AccordionButton>
              <AccordionPanel pb={6}>
                {log?.note && <Text color={textColor} whiteSpace="pre-line" textAlign={'justify'} pb={1}>{log.note}</Text>}
                {log?.changes && log?.changes?.length > 0 && (
                  <UnorderedList>
                    {log.changes.map((change, index) => (
                      <ListItem color={textColor} key={index}>
                        <Text color={textColor} whiteSpace="pre-line" textAlign={'justify'}>{change}</Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Box flex='1' textAlign='center'>
          <Button variant='outline'>
            <Text
              color={useColorModeValue("gray.700", "gray.300")}
              fontSize="sm"
              fontWeight="normal"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top
            </Text>
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}

export default Home