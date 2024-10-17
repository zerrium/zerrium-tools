import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import prettify from "html-prettify";
// @ts-ignore
import terser from "terser-sync";
import { pd } from "../../utils/pretty-data"


const beautifyJs = require("js-beautify/js").js
const beautifyCss = require("js-beautify/js").css
// const beautifyHtml = require("js-beautify/js").html

const processJson = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  return JSON.stringify(JSON.parse(text), null, isMinify ? 0 : (numberOfSpace || 2)).toString()
}

const processHtml = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  if (isMinify) {
    return pd.htmlmin(text)
  } else {
    // return beautifyHtml(text, { indent_size: numberOfSpace || 2 })
    // @ts-ignore
    return prettify(text, { count: numberOfSpace || 2 })
  }
}

const processCss = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  return isMinify ? pd.cssmin(text, false) : beautifyCss(text, { indent_size: numberOfSpace || 2 })
}

const processJs = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  return isMinify ? terser.minifySync(text).code : beautifyJs(text, { indent_size: numberOfSpace || 2 })
}

const processXml = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  pd.setStep(numberOfSpace || 2)
  return isMinify ? pd.xmlmin(text, false) : pd.xml(text)
}

const processSql = (text: string, isMinify: boolean, numberOfSpace?: number): string => {
  pd.setStep(numberOfSpace || 2)
  return isMinify ? pd.sqlmin(text) : pd.sql(text)
}

const codes: { label: string, key: string, function: (text: string, isMinify: boolean, numberOfSpace?: number) => string }[] = [
  { label: "JSON", key: "json", function: processJson },
  { label: "HTML", key: "html", function: processHtml },
  { label: "CSS", key: "css", function: processCss },
  { label: "Javascript", key: "js", function: processJs },
  { label: "XML", key: "xml", function: processXml },
  { label: "SQL", key: "sql", function: processSql }
]

const Beautifier = () => {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [numberOfSpaces, setNumberOfSpaces] = useState<number>(2)
  const [isMinify, setIsMinify] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [code, setCode] = useState<string>(codes[0].key)

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
    setIsMinify(toggle)
    if (textBoxOutput.length !== 0) {
      setTextBoxInput(error ? "" : textBoxOutput)
    }
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCode(e.target.value)
  }

  const onChangeNumberOfSpaces = (e: string) => {
    if(e.length !== 0) {
      setNumberOfSpaces(Number(e))
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    try {
      const index = codes.map((c) => c.key).indexOf(code)
      setTextBoxOutput(codes[index].function(textBoxInput, isMinify, numberOfSpaces))
      setError(false)
    } catch (e) {
      setTextBoxOutput("Invalid input!")
      setError(true)
    }
  }, [textBoxInput, code, isMinify, numberOfSpaces])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'2xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'lg'}
        boxShadow={'lg'}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={6}
        mt={12}
        mb={2}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Code {isMinify ? "Minifier" : "Beautifier"}
        </Heading>
        <FormControl id="url">
          <Stack direction="row" w="100%" my={3}>
            <Stack direction="row" w="28%" px={"1%"}>
              <Text mx={1} mt="5%">Language</Text>
            </Stack>
            <Stack direction="row" w="72%" px={"1%"}>
              <Select placeholder="Select language..." value={code} onChange={onChangeSelect}>
                {codes.map((en) => (
                  <option value={en.key} key={en.key}>{en.label}</option>
                ))}
              </Select>
            </Stack>
          </Stack>

          <Stack direction="row" w="100%" mb={3}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={isMinify}
                    onChange={onChangeSwitch}/>
            <Text mx={1}>Minify Code</Text>
          </Stack>

          <Stack direction='row' w="100%" mb={3} display={isMinify ? "none": "flex"}>
            <Text mx={2} mt="1.5%" align="center">Number of spaces </Text>
            <NumberInput
              value={numberOfSpaces}
              min={1}
              max={4}
              ms={1}
              mb={3}
              maxW="30%"
              onChange={onChangeNumberOfSpaces}>
              <NumberInputField/>
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Stack>

          <Textarea
            placeholder={"Input any text to " + (isMinify ? "minify" : "beautify")}
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput}
            onChange={onChangeInput}
            fontFamily="monospace"
            mb={4}
            rows={5}
          />

          <Text mb={3}>Output:</Text>
          <Textarea
            readOnly={true}
            placeholder="Output"
            _placeholder={{ color: 'gray.500' }}
            value={textBoxOutput}
            fontFamily="monospace"
            fontWeight={error ? "bold" : "none"}
            rows={5}
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
        <Text mt={3} display={!isMinify && code === "html" ? "current" : "none"}>Note:<br/>
          If HTML beautify result is messy, you have invalid HTML code.
        </Text>
      </Stack>
    </Flex>
  )
}

export default Beautifier