import Page from "../../components/Page";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Stack,
  Textarea,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

const generateUuid = () => {
  return uuidv4()
}

export function UuidGenerator() {
  const [textBox, setTextBox] = useState<string>("")
  const [numberOfUuid, setNumberOfUuid] = useState<number>(2)
  const [areaTextBox, setAreaTextBox] = useState<string>("")

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onClickGenerate = () => {
    setTextBox(generateUuid())
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBox)
    toast({ description: 'Copied!' })
  }

  const onChangeNumberOfUuid = (e: string) => {
    if(e.length !== 0) {
      setNumberOfUuid(e as unknown as number)
    }
  }

  const onClickGenerateMultiple = () => {
    let temp: string = ""
    for(let i=0; i<numberOfUuid; i++) {
      temp += generateUuid() + "\n"
    }
    setAreaTextBox(temp.slice(0, -1))
  }

  const onClickCopyMultiple = () => {
    navigator.clipboard.writeText(areaTextBox)
    toast({ description: 'Copied!' })
  }

  return (
    <Page>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>
        <Stack w={'full'} maxW={'md'}>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'lg'}
            boxShadow={'lg'}
            p={6}
            mt={12}
            mb={2}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Random UUID Generator
            </Heading>
            <FormControl id="uuid">
              <Input
                readOnly={true}
                placeholder="Generated Random UUID"
                _placeholder={{ color: 'gray.500' }}
                value={textBox}
                fontFamily="monospace"
              />
            </FormControl>
            <Stack spacing={5} direction={['column', 'row']}>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickGenerate}>
                Generate
              </Button>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickCopy}
                isDisabled={ textBox.length === 0 }
              >
                Copy
              </Button>
            </Stack>
          </Stack>

          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'lg'}
            boxShadow={'lg'}
            p={6}
            mt={2}
            mb={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Multiple UUID Generator
            </Heading>
            <FormControl id="uuidMultiple">
              <Stack direction='row'>
                <Text mx={3} mt="1.5%" align="center">Number of UUIDs </Text>
                <NumberInput
                  value={numberOfUuid}
                  min={2}
                  max={32767}
                  mb={3}
                  maxW="50%"
                  onChange={onChangeNumberOfUuid}>
                  <NumberInputField/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
              <Textarea
                readOnly={true}
                placeholder="Generated Random UUIDs"
                _placeholder={{ color: 'gray.500' }}
                value={areaTextBox}
                fontFamily="monospace"
              />
            </FormControl>
            <Stack spacing={5} direction={['column', 'row']}>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickGenerateMultiple}>
                Generate
              </Button>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickCopyMultiple}
                isDisabled={ areaTextBox.length === 0 }
              >
                Copy
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Page>
  )
}