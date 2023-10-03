import Page from "../../components/Page";
// @ts-ignore
import crypto, { createHash } from "crypto";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { Hash, keccak224, keccak256, keccak384, keccak512, sha3_224, sha3_256, sha3_384, sha3_512 } from 'js-sha3';

const hashAlgorithm: { label: string, key: string, lib?: string, function?:Hash | void }[] = [
  { label: "SHA3-256", key: "sha3_256", lib: "js-sha3", function: sha3_256 },
  { label: "SHA3-384", key: "sha3_384", lib: "js-sha3", function: sha3_384 },
  { label: "SHA3-512", key: "sha3_512", lib: "js-sha3", function: sha3_512 },
  { label: "SHA3-224", key: "sha3_224", lib: "js-sha3", function: sha3_224 },

  { label: "SHA256", key: "sha256", lib: "crypto-hash" },
  { label: "SHA384", key: "sha384", lib: "crypto-hash" },
  { label: "SHA512", key: "sha512", lib: "crypto-hash" },
  { label: "SHA224", key: "sha224", lib: "crypto-hash" },
  { label: "SHA1", key: "sha1", lib: "crypto-hash" },

  { label: "Keccak-256", key: "keccak256", lib: "js-sha3", function: keccak256 },
  { label: "Keccak-384", key: "keccak384", lib: "js-sha3", function: keccak384 },
  { label: "Keccak-512", key: "keccak512", lib: "js-sha3", function: keccak512 },
  { label: "Keccak-224", key: "keccak224", lib: "js-sha3", function: keccak224 },

  { label: "RIPEMD-160", key: "rmd160", lib: "crypto-hash" },
  { label: "MD5", key: "md5", lib: "crypto-hash" }
]

export function HashCalculator() {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [hashAlgo, setHashAlgo] = useState<string>(hashAlgorithm[0].key)

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

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    const index = hashAlgorithm.map((i) => i.key).indexOf(hashAlgo)
    if(index !== -1) {
      if (hashAlgorithm[index].lib === "crypto-hash") {
        const hash = createHash(hashAlgo)
        hash.update(textBoxInput)
        setTextBoxOutput(hash.digest("hex"))
      } else if (hashAlgorithm[index].lib === "js-sha3" && hashAlgorithm[index].function) {
        // @ts-ignore
        const hash = hashAlgorithm[index].function(textBoxInput)
        setTextBoxOutput(hash)
      }
    }
  }, [textBoxInput, hashAlgo])

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
            Hash Calculator
          </Heading>
          <FormControl id="hash">
            <Stack direction="row" w="100%" my={3}>
              <Stack direction="row" w="28%" px={"1%"}>
                <Text mx={1} mt="5%">Hash Algorithm</Text>
              </Stack>
              <Stack direction="row" w="72%" px={"1%"}>
                <Select placeholder="Select Hash Algorithm..." value={hashAlgo} onChange={onChangeSelect}>
                  {hashAlgorithm.map((ha) => (
                    <option value={ha.key} key={ha.key}>{ha.label}</option>
                  ))}
                </Select>
              </Stack>
            </Stack>

            <Input
              placeholder="Input any text"
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
            />
          </FormControl>
          <Button
            bg={useColorModeValue("green.400", "green.600")}
            color={'white'}
            _hover={{
              bg: useColorModeValue("green.600", "green.400"),
            }}
            onClick={onClickCopy}
            isDisabled={ textBoxOutput.length === 0 }
          >
            Copy
          </Button>
        </Stack>
      </Flex>
    </Page>
  )
}