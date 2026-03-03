import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, IconButton, Select,
  Stack, Switch,
  Text,
  Textarea, Tooltip,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { decode as decodeHtml, type Level, type EncodeMode } from 'html-entities';
import { useOutletContext } from "react-router-dom"
import type { IOutletContext } from "../../interface/Interfaces.ts"
import { LuExpand, LuShrink } from "react-icons/lu";
import { isMobile } from "react-device-detect";
import { FaRegCopy } from "react-icons/fa";

const codes: { label: string, key: string, regex: RegExp[] }[] = [
  { label: "Java", key: "java", regex: [
      /(Caused by: \b[^\s.][^\s]*\.[^\s]*\b)/gm,
      /(Suppressed: \b[^\s.][^\s]*\.[^\s]*\b)/gm,
      /(\s*... \d+ more)/gm,
      /(\s*... \d+ common frames omitted)/gm,
      /(\s+at \b[^\s.][^\s]*\.[^\s]*\b)/gm,
    ]
  },
]

const getCode = (key: string) => {
  return codes.find((i) => i.key === key)
}

const StackTraceViewer = () => {
  const [textBox, setTextBox] = useState<string>("")
  const [code, setCode] = useState<string>(codes[0].key)
  const [result, setResult] = useState<string>("")
  const [isDecodeHtml, setIsDecodeHtml] = useState<boolean>(false)
  const [isDecodeUrl, setIsDecodeUrl] = useState<boolean>(false)

  const { isFullScreen, setIsFullScreen } = useOutletContext<IOutletContext>()

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const toastError = useToast({
    position: "top",
    duration: 3000,
    status: "error"
  })

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox(e.target.value)
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCode(e.target.value)
  }

  const onChangeDecodeHtml = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setIsDecodeHtml(toggle)
  }

  const onChangeDecodeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setIsDecodeUrl(toggle)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(result)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    if (textBox && code) {
      const obj = getCode(code)
      if (obj) {
        let temp = textBox
        for (const regex of obj?.regex) {
          temp = temp.replace(regex, "\n$1")
        }

        if (isDecodeUrl) {
          try {
            temp = decodeURIComponent(temp)
          }
          catch (e) {
            setIsDecodeUrl(false)
            toastError({ description: 'Failed to decode URL text, invalid sequence.' })
          }
        }

        if (isDecodeHtml) {
          const options = {
            level: 'all' as Level,
            mode: 'nonAscii' as EncodeMode,
            numeric: 'decimal' as 'decimal'
          }
          temp = decodeHtml(temp, options)
        }

        setResult(temp)
      } else {
        setResult("")
      }
    } else {
      setResult("")
    }
  }, [textBox, code, isDecodeHtml, isDecodeUrl])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={isFullScreen ? 'full' : '1920px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}
          mt={12}
        >
          <Stack direction="row" w="100%" justify="space-between">
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Stack Trace Viewer
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
          <FormControl id="stackTrace">
            <Stack direction="row" w="100%" my={3}>
              <Stack direction="row" w="28%" maxW="200px" px={"1%"}>
                <Text mx={1} mt="3%">Code</Text>
              </Stack>
              <Stack direction="row" w="72%" maxW="350px" pl={"1%"}>
                <Select placeholder="Select code..." value={code} onChange={onChangeSelect}>
                  {codes.map((en) => (
                      <option value={en.key} key={en.key}>{en.label}</option>
                  ))}
                </Select>
              </Stack>
            </Stack>
            <Stack direction="row" w="100%" mb={3}>
              <Switch colorScheme='green'
                mx={1} mt="0.2%"
                isChecked={isDecodeUrl}
                onChange={onChangeDecodeUrl}/>
              <Text mx={1}>Decode URL Text</Text>
            </Stack>
            <Stack direction="row" w="100%" mb={3}>
              <Switch colorScheme='green'
                mx={1} mt="0.2%"
                isChecked={isDecodeHtml}
                onChange={onChangeDecodeHtml}/>
              <Text mx={1}>Decode HTML Entity</Text>
            </Stack>
            {isDecodeUrl && (
              <Text mb={1} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool decodes URI object according to <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding" target="_blank"
                rel="noreferrer"><u>RFC 3986 standard.</u></a>
              </Text>
            )}
            {isDecodeHtml && (
              <Text mb={1} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool decodes HTML entity according to <a
                href="https://html.spec.whatwg.org/multipage/named-characters.html" target="_blank"
                rel="noreferrer"><u>HTML Living standard.</u></a>
              </Text>
            )}
            <Textarea
              mt={2}
              placeholder={code ? `Input ${getCode(code)?.label} stack trace here` : 'Select code first'}
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
              rows={5}
              fontFamily="monospace"
              disabled={!code}
              spellCheck={false}
            />
            {isFullScreen && (
                <Button
                    mt={2}
                    variant="outline"
                    aria-label="open menu"
                    leftIcon={<FaRegCopy fontSize="22px" />}
                    size="sm"
                    onClick={onClickCopy}
                    isDisabled={result.length === 0}
                >
                  Copy Output
                </Button>
            )}
            <Textarea
              mt={isFullScreen ? 2 : 4}
              placeholder="Formatted output"
              _placeholder={{ color: 'gray.500' }}
              value={result}
              onChange={() => {}}
              rows={20}
              whiteSpace="nowrap"
              fontFamily="monospace"
              spellCheck={false}
            />
          </FormControl>
          <Stack justifyContent="center" direction="row">
            <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              w={{ base: "100%", lg: "50%" }}
              onClick={onClickCopy}
              isDisabled={ result.length === 0 }>
              Copy
            </Button>
          </Stack>
        </Stack>
    </Flex>
  )
}

export default StackTraceViewer