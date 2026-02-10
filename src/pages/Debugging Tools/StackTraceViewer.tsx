import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

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

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox(e.target.value)
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCode(e.target.value)
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
        setResult(temp)
      } else {
        setResult("")
      }
    } else {
      setResult("")
    }
  }, [textBox, code])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'1440px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Stack Trace Viewer
          </Heading>
          <FormControl id="stackTrace">
            <Stack direction="row" w="100%" my={3} pb={3}>
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
            <Textarea
              placeholder={code ? `Input ${getCode(code)?.label} stack trace here` : 'Select code first'}
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
              rows={5}
              fontFamily="monospace"
              disabled={!code}
            />
            <Textarea
              mt={4}
              readOnly
              placeholder="Formatted output"
              _placeholder={{ color: 'gray.500' }}
              value={result}
              rows={20}
              fontFamily="monospace"
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