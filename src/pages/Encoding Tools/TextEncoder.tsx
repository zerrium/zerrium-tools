import Page from "../../components/Page";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, Select,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

const encodings: { label: string, key: number | string }[] = [
  { label: "Binary", key: 2 },
  { label: "Octal", key: 8 },
  { label: "Decimal", key: 10 },
  { label: "Hexadecimal", key: 16 },
  { label: "Base64", key: "Base64" },
  { label: "Base64 URL", key: "Base64Url" }
]

export function TextEncoder() {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [encoding, setEncoding] = useState<string | number>(encodings[4].key)

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

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setEncoding(!isNaN(Number(value)) ? Number(value) : value)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    try {
      let result: string = ""
      if(typeof encoding === "number") {
        result = decode ?
          textBoxInput.split(' ').map((c) => parseInt(c, Number(encoding))).map((c) => String.fromCharCode(c)).join('') :
          textBoxInput.split('').map((c) => c.charCodeAt(0).toString(Number(encoding))).join(' ')
      } else {
        if (encoding === "Base64") {
          result = decode ? atob(textBoxInput) : btoa(textBoxInput)
        } else if (encoding === "Base64Url") {
          result = decode ? atob(decodeURIComponent(textBoxInput)) : encodeURIComponent(btoa(textBoxInput))
        }
      }

      setTextBoxOutput(result)
      setError(false)
    } catch (e) {
      setTextBoxOutput("Invalid input!")
      setError(true)
    }
  }, [textBoxInput, encoding, decode])

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
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}
          mt={12}
          mb={2}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Text {decode ? "Decoder" : "Encoder"}
          </Heading>
          <FormControl id="url">
            <Stack direction="row" w="100%" my={3}>
              <Stack direction="row" w="28%" px={"1%"}>
                <Text mx={1} mt="5%">{decode ? "Decode from" : "Encode to"}</Text>
              </Stack>
              <Stack direction="row" w="72%" px={"1%"}>
                <Select placeholder={decode ? "Select decoder..." : "Select encoder..."} value={encoding} onChange={onChangeSelect}>
                  {encodings.map((en) => (
                    <option value={en.key} key={en.key}>{en.label}</option>
                  ))}
                </Select>
              </Stack>
            </Stack>

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