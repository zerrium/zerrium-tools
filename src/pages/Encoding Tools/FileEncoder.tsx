import Page from "../../components/Page";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, Input, Select,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { filetypeextension } from 'magic-bytes.js'

const encodings: { label: string, key: number | string }[] = [
  { label: "Binary", key: 2 },
  { label: "Octal", key: 8 },
  { label: "Decimal", key: 10 },
  { label: "Hexadecimal", key: 16 },
  { label: "Base64", key: "Base64" },
  { label: "Base64 URL", key: "Base64Url" }
]

export function FileEncoder() {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [encoding, setEncoding] = useState<string | number>(encodings[4].key)
  const [fileName, setFileName] = useState<string>("")
  const [fileData, setFileData] = useState<string | Uint8Array>("")
  const [fileLoading, setFileLoading] = useState<boolean>(false)
  const [fileExt, setFileExt] = useState<string>("")

  let fileUpload: HTMLInputElement | null
  const data = new FileReader()

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
    setFileLoading(false)
    setFileName("")
    setFileData("")
    setTextBoxOutput("")
    setFileExt("")
    setTextBoxInput("")
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setEncoding(!isNaN(Number(value)) ? Number(value) : value)
  }

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setFileLoading(true)

      setFileName(file.name)
      data.readAsBinaryString(file)
      data.onload = (event) => {
        setFileData(event.target?.result?.toString() ?? "")
      }

    }
  }

  const onClickCopy = async () => {
    if (decode) {
      const element = document.createElement("a");
      // @ts-ignore
      const file = new Blob([fileData as Uint8Array])
      element.href = URL.createObjectURL(file)
      element.download = "File_Decode_Results." + fileExt
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } else {
      navigator.clipboard.writeText(textBoxOutput)
      toast({ description: 'Copied!' })
    }
  }

  useEffect(() => {
    try {
      setFileLoading(true)

      if (decode) {
        let result: string = ""
        if (typeof encoding === "number") {
          result = textBoxInput.split(' ').map((c) => parseInt(c, Number(encoding))).map((c) => String.fromCharCode(c)).join('')
        } else {
          if (encoding === "Base64") {
            result = atob(textBoxInput)
          } else if (encoding === "Base64Url") {
            result = atob(decodeURIComponent(textBoxInput))
          }
        }

        const bytes = new Array(result.length)
        for (let i = 0; i < result.length; i++) {
          bytes[i] = result.charCodeAt(i);
        }
        const Uint8Bytes = new Uint8Array(bytes)
        const fileExt = filetypeextension(Uint8Bytes)[0] ?? "bin"
        setFileExt(fileExt)
        setFileData(Uint8Bytes)
      } else {
        const pad = (() => {
          switch(encoding) {
            case 2: return 8;
            case 8: return 3;
            case 10: return 3;
            case 16: return 2;
            default: return 0;
          }
        })()

        let result: string = ""
        if (typeof encoding === "number") {
          result = (fileData as string).split('').map((c) => c.charCodeAt(0).toString(Number(encoding))
            .padStart(pad, '0')).join(' ')
        } else {
          if (encoding === "Base64") {
            result = btoa(fileData as string)
          } else if (encoding === "Base64Url") {
            result = encodeURIComponent(btoa(fileData as string))
          }
        }

        setTextBoxOutput(result)
      }

      setError(false)
    } catch (e) {
      if (decode) {
        setFileName("Invalid input!")
      } else {
        setTextBoxOutput("Invalid input!")
      }

      setError(true)
    } finally {
      setFileLoading(false)
    }
  }, [textBoxInput, fileData, encoding, decode])

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
            File {decode ? "Decoder" : "Encoder"}
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
              <Text mx={1}>Decode File</Text>
            </Stack>

            <Stack direction="row" w="100%" mb={3} display={decode ? "none" : "flex"}>
              <Stack direction="row" w="70%" me={"1%"}>
                <Input
                  placeholder="Uploaded file"
                  _placeholder={{ color: 'gray.500' }}
                  readOnly
                  value={fileName}
                  fontFamily="monospace"
                  mb={4}
                />
              </Stack>
              <Stack direction="row" w="30%">
                <Input ref={input => fileUpload = input}
                       type="file" display="none" onChange={onChangeFile} />
                <Button
                  bg={useColorModeValue("green.400", "green.600")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("green.600", "green.400"),
                  }}
                  onClick={() => fileUpload?.click()}
                  w="95%"
                  h="72%"
                  isLoading={fileLoading}
                >
                  Select File
                </Button>
              </Stack>
            </Stack>

            <Textarea
              placeholder={"Input any text to decode into a file"}
              _placeholder={{ color: 'gray.500' }}
              value={textBoxInput}
              onChange={onChangeInput}
              fontFamily="monospace"
              mb={4}
              isDisabled={!decode}
              display={decode ? "current" : "none"}
            />

            <Text whiteSpace={"pre"} mb={3}>{"Output: " +
              (decode && !error && textBoxInput.length !== 0 ? "detected as a " + fileExt + " file." +
                  (fileExt === "bin" ? "\nFile type can't be determined. File result is set as .bin file instead." : "")
                : ""
              )
            }</Text>

            <Textarea
              readOnly={true}
              placeholder="Output"
              _placeholder={{ color: 'gray.500' }}
              value={textBoxOutput}
              fontFamily="monospace"
              fontWeight={error ? "bold" : "none"}
              display={decode ? "none" : "current"}
              textColor={
                useColorModeValue(
                  error ? "#f01818" : "current",
                  error ? "#fa3232" : "current")
              }
            />
          </FormControl>
          <Button
            bg={useColorModeValue(
              error && decode ? "#f01818" : "green.400",
              error && decode ? "#fa3232" : "green.600")}
            color={'white'}
            _hover={{
              bg: useColorModeValue("green.600", "green.400"),
            }}
            onClick={onClickCopy}
            isDisabled={(decode ? fileData.length === 0 : textBoxOutput.length === 0) || error}
            isLoading={fileLoading}
            loadingText="Calculating..."
          >
            {decode ? (error ? "Invalid input!" : "Download Result File") : "Copy"}
          </Button>
          <Text mt={3} display={decode ? "current" : "none"}>Disclaimer:<br/>
            File type detection may not be accurate. It is determined based on&nbsp;
            <a
              href="https://en.wikipedia.org/wiki/List_of_file_signatures" target="_blank"
              rel="noreferrer"><u>magic number</u>
            </a>
            &nbsp;using&nbsp;
            <a
              href="https://github.com/LarsKoelpin/magic-bytes" target="_blank"
              rel="noreferrer"><u>magic-bytes library</u></a>
          </Text>
        </Stack>
      </Flex>
    </Page>
  )
}