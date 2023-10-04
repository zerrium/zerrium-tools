import Page from "../../components/Page";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

export function UrlEncoder() {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBoxInput(e.target.value)
  }

  const onChangeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setDecode(toggle)
    if (textBoxOutput.length !== 0) {
      setTextBoxInput(error ? "" : textBoxOutput)
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    try {
      const result = decode ? decodeURIComponent(textBoxInput) : encodeURIComponent(textBoxInput)
      setTextBoxOutput(result)
      setError(false)
    } catch (e) {
      setTextBoxOutput("Invalid input!")
      setError(true)
    }
  }, [textBoxInput, decode])

  return (
    <Page>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          p={6}
          mt={12}
          mb={2}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            URL {decode ? "Decoder" : "Encoder"}
          </Heading>
          <FormControl id="hash">
            <Stack direction="row" w="100%" mb={3}>
              <Switch colorScheme='green'
                      mx={1} mt="0.6%"
                      isChecked={decode}
                      onChange={onChangeSwitch}/>
              <Text mx={1}>Decode Text</Text>
            </Stack>

            <Textarea
              placeholder={"Input any text to " + (decode ? "decode" : "encode")}
              _placeholder={{ color: 'gray.500' }}
              value={textBoxInput}
              onChange={onChangeInput}
              fontFamily="monospace"
              mb={4}
            />

            <Text mb={3}>Output:</Text>
            <Textarea
              readOnly={true}
              placeholder="Output"
              _placeholder={{ color: 'gray.500' }}
              value={textBoxOutput}
              fontFamily="monospace"
              fontWeight={error ? "bold" : "none"}
              textColor={
                useColorModeValue(
                  error ? "#f01818" : "current",
                  error ? "#fa3232" : "current")
              }
            />
          </FormControl>
          <Button
            bg={useColorModeValue("green.400", "green.600")}
            color={'white'}
            _hover={{
              bg: useColorModeValue("green.600", "green.400"),
            }}
            onClick={onClickCopy}
            isDisabled={textBoxOutput.length === 0 || error}
          >
            Copy
          </Button>
        </Stack>
      </Flex>
    </Page>
  )
}