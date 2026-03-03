import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, IconButton, Select,
  Stack,
  Switch,
  Text,
  Textarea, Tooltip,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom"
import type { IOutletContext } from "../../interface/Interfaces.ts"
import { LuExpand, LuShrink } from "react-icons/lu";
import { isMobile } from "react-device-detect";
import { FaRegCopy } from "react-icons/fa";

const encodings: { label: string, key: number | string }[] = [
  { label: "Binary", key: 2 },
  { label: "Octal", key: 8 },
  { label: "Decimal", key: 10 },
  { label: "Hexadecimal", key: 16 },
  { label: "Base64", key: "Base64" },
  { label: "Base64 URL", key: "Base64Url" }
]

const TextEncoder = () => {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [encoding, setEncoding] = useState<string | number>(encodings[4].key)

  const { isFullScreen, setIsFullScreen } = useOutletContext<IOutletContext>()

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
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={isFullScreen ? 'full' : '3xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'lg'}
        boxShadow={'lg'}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={6}
        mt={12}
        mb={2}>
        <Stack direction="row" w="100%" justify="space-between">
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Text {decode ? "Decoder" : "Encoder"}
          </Heading>
          {!isMobile && (
              <Tooltip label={`${isFullScreen ? "Exit" : "Enter"} fullscreen mode`} mr="2">
                <IconButton
                    variant="outline"
                    aria-label="open menu"
                    icon={isFullScreen ? <LuShrink fontSize="22px" /> : <LuExpand fontSize="22px" />}
                    size="sm"
                    m={0}
                    onClick={() => setIsFullScreen(!isFullScreen)}
                />
              </Tooltip>
          )}
        </Stack>
        <FormControl id="url">
          <Stack direction="row" w={isFullScreen && !isMobile ? "40%" : "100%"} my={3}>
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
                    mx={1} mt="0.2%"
                    isChecked={decode}
                    onChange={onChangeSwitch}/>
            <Text mx={1}>Decode Text</Text>
          </Stack>

          {encoding === "Base64Url" && (
            <Text mx={1} mb={3} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool {decode ? "decodes" : "encodes"} URI object according to <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding" target="_blank"
              rel="noreferrer"><u>RFC 3986 standard.</u></a>
            </Text>
          )}

          <Textarea
            placeholder={"Input any text to " + (decode ? "decode" : "encode")}
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput}
            onChange={onChangeInput}
            fontFamily="monospace"
            mb={4}
            spellCheck={false}
            rows={isFullScreen && !isMobile ? 10 : 5}
          />

          <Stack direction="row" w="100%" mb={3}>
            <Text>Output:</Text>
            {isFullScreen && (
                <Button
                    variant="outline"
                    aria-label="open menu"
                    leftIcon={<FaRegCopy fontSize="22px" />}
                    size="sm"
                    m={0}
                    onClick={onClickCopy}
                    isDisabled={textBoxOutput.length === 0 || error}
                >
                  Copy
                </Button>
            )}
          </Stack>
          <Textarea
            placeholder="Output"
            _placeholder={{ color: 'gray.500' }}
            value={textBoxOutput}
            onChange={() => {}}
            fontFamily="monospace"
            fontWeight={error ? "bold" : "none"}
            textColor={
              useColorModeValue(
                error ? "#f01818" : "current",
                error ? "#fa3232" : "current")
            }
            spellCheck={false}
            rows={isFullScreen && !isMobile ? 20 : 5}
          />
        </FormControl>
        <Stack alignItems="center" w="100%">
          <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              onClick={onClickCopy}
              isDisabled={textBoxOutput.length === 0 || error}
              w={isFullScreen && !isMobile ? "40%" : "100%"}
          >
            Copy
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default TextEncoder