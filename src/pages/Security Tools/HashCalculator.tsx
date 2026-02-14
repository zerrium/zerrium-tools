import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { type Hash, keccak224, keccak256, keccak384, keccak512, sha3_224, sha3_256, sha3_384, sha3_512 } from 'js-sha3';

const hashAlgorithm: { label: string, key: string, lib?: string, function?:Hash | void }[] = [
  { label: "SHA3-256", key: "sha3_256", lib: "js-sha3", function: sha3_256 },
  { label: "SHA3-384", key: "sha3_384", lib: "js-sha3", function: sha3_384 },
  { label: "SHA3-512", key: "sha3_512", lib: "js-sha3", function: sha3_512 },
  { label: "SHA3-224", key: "sha3_224", lib: "js-sha3", function: sha3_224 },

  { label: "SHA256", key: "SHA-256", lib: "crypto-hash" },
  { label: "SHA384", key: "SHA-384", lib: "crypto-hash" },
  { label: "SHA512", key: "SHA-512", lib: "crypto-hash" },
  // { label: "SHA224", key: "SHA-224", lib: "crypto-hash" },       Somehow the Web Crypto API doesn't support it
  { label: "SHA1", key: "SHA-1", lib: "crypto-hash" },

  { label: "Keccak-256", key: "keccak256", lib: "js-sha3", function: keccak256 },
  { label: "Keccak-384", key: "keccak384", lib: "js-sha3", function: keccak384 },
  { label: "Keccak-512", key: "keccak512", lib: "js-sha3", function: keccak512 },
  { label: "Keccak-224", key: "keccak224", lib: "js-sha3", function: keccak224 },

  // { label: "RIPEMD-160", key: "rmd160", lib: "crypto-hash" },    Removed. No longer supported
  // { label: "MD5", key: "md5", lib: "crypto-hash" }               Removed. No longer supported
]

const HashCalculator = () => {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [hashAlgo, setHashAlgo] = useState<string>(hashAlgorithm[0].key)
  const [fileInput, setFileInput] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("")
  const [fileData, setFileData] = useState<ArrayBuffer>(new ArrayBuffer())
  const [fileLoading, setFileLoading] = useState<boolean>(false)

  let fileUpload: HTMLInputElement | null
  const data = new FileReader()

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBoxInput(e.target.value)
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setHashAlgo(e.target.value)
  }

  const onChangeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setFileInput(toggle)
    if (!toggle) {
      setFileLoading(false)
      setFileName("")
      setFileData(new ArrayBuffer())
    }
  }

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setFileLoading(true)

      setFileName(file.name)
      data.readAsArrayBuffer(file)
      data.onloadend = (event) => {
        setFileData(event?.target?.result as ArrayBuffer ?? new ArrayBuffer())
      }
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    if (fileInput) {
      setFileLoading(true)
    }
    const index = hashAlgorithm.map((i) => i.key).indexOf(hashAlgo)
    if(index !== -1) {
      if (hashAlgorithm[index].lib === "crypto-hash") {
        // As of Sep 2025, migrated from old crypto-browserify to Web Crypto API
        (async () => {
          const encoder = new TextEncoder()
          const data = fileInput ? fileData : encoder.encode(textBoxInput)
          const hashBuffer = await crypto.subtle.digest(hashAlgo, data)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

          setTextBoxOutput(hashHex)
        })()
      } else if (hashAlgorithm[index].lib === "js-sha3" && hashAlgorithm[index].function) {
        // @ts-ignore
        const hash = hashAlgorithm[index].function(fileInput ? fileData : textBoxInput)
        setTextBoxOutput(hash)
      }
    } else {
      setTextBoxOutput("")
    }
    if (fileInput) {
      setFileLoading(false)
    }
  }, [textBoxInput, fileData, hashAlgo, fileInput])

  return (
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
          Hash Calculator
        </Heading>
        <FormControl id="hash">
          <Stack direction="row" w="100%" my={3}>
            <Stack direction="row" w="35%" px={"1%"}>
              <Text mx={1} mt="5%">Hash Algorithm</Text>
            </Stack>
            <Stack direction="row" w="65%" px={"1%"}>
              <Select placeholder="Select Hash Algorithm..." value={hashAlgo} onChange={onChangeSelect}>
                {hashAlgorithm.map((ha) => (
                  <option value={ha.key} key={ha.key}>{ha.label}</option>
                ))}
              </Select>
            </Stack>
          </Stack>

          <Stack direction="row" w="100%" mb={3}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={fileInput}
                    onChange={onChangeSwitch}/>
            <Text mx={1}>File Input</Text>
          </Stack>

          {hashAlgo.startsWith("sha3_") && (
            <Text mb={3} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool calculates SHA3 according to <a
              href="https://www.rfc-editor.org/rfc/rfc9688.html" target="_blank"
              rel="noreferrer"><u>RFC 9688</u></a> / <a
              href="https://csrc.nist.gov/pubs/fips/202/final" target="_blank"
              rel="noreferrer"><u>FIPS 202</u></a> standard.
            </Text>
          )}

          {hashAlgo.startsWith("SHA-") && (
            <Text mb={3} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool calculates SHA according to <a
              href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final" target="_blank"
              rel="noreferrer"><u>FIPS 180-4 standard.</u></a>
            </Text>
          )}

          {hashAlgo.startsWith("keccak") && (
            <Text mb={3} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool calculates Keccak hash according to <a
              href="https://csrc.nist.gov/pubs/fips/202/final" target="_blank"
              rel="noreferrer"><u>FIPS 202 standard.</u></a>
            </Text>
          )}

          <Input
            placeholder="Input any text"
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput}
            onChange={onChangeInput}
            fontFamily="monospace"
            mb={4}
            display={fileInput ? "none" : "initial"}
            spellCheck={false}
          />

          <Stack direction="row" w="100%" mb={3} display={fileInput ? "flex" : "none"}>
            <Stack direction="row" w="70%" me={"1%"}>
              <Input
                placeholder="Uploaded file"
                _placeholder={{ color: 'gray.500' }}
                readOnly
                value={fileName}
                fontFamily="monospace"
                mb={4}
                spellCheck={false}
              />
            </Stack>
            <Stack direction="row" w="30%">
              <Input ref={input => fileUpload = input}
                      type="file" display="none" onChange={onChangeFile} spellCheck={false} />
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

          <Text mb={3}>Output:</Text>
          <Textarea
            placeholder="Output"
            _placeholder={{ color: 'gray.500' }}
            value={textBoxOutput}
            onChange={() => {}}
            fontFamily="monospace"
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
          isLoading={fileLoading}
          loadingText="Calculating..."
        >
          Copy
        </Button>
      </Stack>
    </Flex>
  )
}

export default HashCalculator