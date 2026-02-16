import { type ChangeEvent, useEffect, useState } from "react";
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
import { encode as encodeHtml, decode as decodeHtml, type Level, type EncodeMode } from 'html-entities';

const HtmlEncoder = () => {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)

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
      setTextBoxInput(textBoxOutput)
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    const options = {
      level: 'all' as Level,
      mode: 'nonAscii' as EncodeMode,
      numeric: 'decimal' as 'decimal'
    }
    const result = decode ? decodeHtml(textBoxInput, options) : encodeHtml(textBoxInput, options)
    setTextBoxOutput(result)
  }, [textBoxInput, decode])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'3xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'lg'}
        boxShadow={'lg'}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={6}
        mt={12}
        mb={2}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          HTML Entity {decode ? "Decoder" : "Encoder"}
        </Heading>
        <FormControl id="html">
          <Stack direction="row" w="100%" mb={2}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={decode}
                    onChange={onChangeSwitch}/>
            <Text mx={1}>Decode Text</Text>
          </Stack>

          <Text mb={4} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool {decode ? "decodes" : "encodes"} HTML entity according to <a
            href="https://html.spec.whatwg.org/multipage/named-characters.html" target="_blank"
            rel="noreferrer"><u>HTML Living standard.</u></a>
          </Text>

          <Textarea
            placeholder={"Input any text to " + (decode ? "decode" : "encode")}
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput}
            onChange={onChangeInput}
            fontFamily="monospace"
            mb={4}
            spellCheck={false}
          />

          <Text mb={3}>Output:</Text>
          <Textarea
            placeholder="Output"
            _placeholder={{ color: 'gray.500' }}
            value={textBoxOutput}
            onChange={() => {}}
            fontFamily="monospace"
            fontWeight={"none"}
            textColor={
              useColorModeValue("current", "current")
            }
            spellCheck={false}
          />
        </FormControl>
        <Button
          bg={useColorModeValue("green.400", "green.600")}
          color={'white'}
          _hover={{
            bg: useColorModeValue("green.600", "green.400"),
          }}
          onClick={onClickCopy}
          isDisabled={textBoxOutput.length === 0}
        >
          Copy
        </Button>
      </Stack>
    </Flex>
  )
}

export default HtmlEncoder