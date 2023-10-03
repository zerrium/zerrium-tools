import Page from "../components/Page";
import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Stack,
  Textarea,
  Text,
  useColorModeValue,
  useToast, Checkbox
} from "@chakra-ui/react";
// @ts-ignore
import crypto from "crypto";

const lowerAlphabets = "abcdefghijklmnopqrstuvwxyz"
const upperAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const specialCharsURL = "$-_.+!*'(),"
const specialChars = specialCharsURL + "~@#%^&=~{}[]:;\"<>?/|\\"

const lowerAlphabetsNoAmbiguous = lowerAlphabets.replace("l", "");
const upperAlphabetsNoAmbiguous = upperAlphabets.replace("I", "").replace("O", "");
const numericNoAmbiguous = numbers.replace("0", "").replace("1", "")

export function PasswordGenerator() {
  const [textBox, setTextBox] = useState<string>("")
  const [numberOfPassword, setNumberOfPassword] = useState<number>(2)
  const [areaTextBox, setAreaTextBox] = useState<string>("")

  const [passwordLength, setPasswordLength] = useState<number>(8)
  const [minimumNumbers, setMinimumNumbers] = useState<number>(1)
  const [minimumSpecials, setMinimumSpecials] = useState<number>(1)
  const [isUppercase, setIsUppercase] = useState<boolean>(true)
  const [isLowercase, setIsLowercase] = useState<boolean>(true)
  const [isNumber, setIsNumber] = useState<boolean>(true)
  const [isSpecial, setIsSpecial] = useState<boolean>(true)
  const [isSpecialURL, setIsSpecialURL] = useState<boolean>(false)
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(false)

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const generateNumber = (min: number, max: number) => {
    // eslint-disable-next-line
    if (min == max) {
      return min
    }

    const randomNumber = crypto.randomBytes(4).readUInt32LE() / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max - 1);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  }

  const secureShuffle = async (array: string[]) => {
    const promises = [];

    // asynchronously generate an array of random numbers using a CSPRNG
    for (let i = array.length - 1; i > 0; i--) {
      promises.push(generateNumber(0, i));
    }

    const randomNumbers = await Promise.all(promises);

    // apply durstenfeld shuffle with previously generated random numbers
    for (let i = array.length - 1; i > 0; i--) {
      const j = randomNumbers[array.length - i - 1];
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  const generatePassword = async () => {
    const minNum: number = isNumber ? minimumNumbers : 0
    const maxNum: number = isNumber ? (passwordLength - (isSpecial ? minimumSpecials : 0) - 3) : 0
    const numLength: number = generateNumber(minNum, maxNum)

    const minSpecial: number = isSpecial ? minimumSpecials : 0
    const maxSpecial: number = isSpecial ? (passwordLength - (isNumber ? numLength : 0) - 3) : 0
    const specialLength: number = generateNumber(minSpecial, maxSpecial)

    const remainder = passwordLength - numLength - specialLength
    const upperLength = isUppercase ? (remainder - (isLowercase ? generateNumber(1, Math.min(remainder, (remainder - 2))) : 0)) : 0
    const lowerLength = isLowercase ? (remainder - upperLength) : 0

    let numberResults: string[] = []
    for (let i = 0; i < numLength; i++) {
      const n = (avoidAmbiguous ? numericNoAmbiguous : numbers).split("")
      const index = generateNumber(0, n.length)
      numberResults = [...numberResults, n[index]]
    }

    let specialResults: string[] = []
    for (let i = 0; i < specialLength; i++) {
      const n = (isSpecialURL ? specialCharsURL : specialChars).split("")
      const index = generateNumber(0, n.length)
      specialResults = [...specialResults, n[index]]
    }

    let upperResults: string[] = []
    for (let i = 0; i < upperLength; i++) {
      const n = (avoidAmbiguous ? upperAlphabetsNoAmbiguous : upperAlphabets).split("")
      const index = generateNumber(0, n.length)
      upperResults = [...upperResults, n[index]]
    }

    let lowerResults: string[] = []
    for (let i = 0; i < lowerLength; i++) {
      const n = (avoidAmbiguous ? lowerAlphabetsNoAmbiguous : lowerAlphabets).split("")
      const index = generateNumber(0, n.length)
      lowerResults = [...lowerResults, n[index]]
    }

    let results = [...lowerResults, ...upperResults, ...numberResults, ...specialResults]
    for(let i=0; i<generateNumber(1,3); i++) {
      results = await secureShuffle(results)
    }

    return results.join("")
  }

  const onClickGenerate = async () => {
    setTextBox(await generatePassword())
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBox)
    toast({ description: 'Copied!' })
  }

  const onClickGenerateMultiple = async () => {
    let temp: string = ""
    for (let i = 0; i < numberOfPassword; i++) {
      temp += await generatePassword() + "\n"
    }
    setAreaTextBox(temp.slice(0, -1))
  }

  const onClickCopyMultiple = () => {
    navigator.clipboard.writeText(areaTextBox)
    toast({ description: 'Copied!' })
  }

  const onChangeNumberOfPassword = (e: string) => {
    if(e.length !== 0) {
      setNumberOfPassword(e as unknown as number)
    }
  }

  const onChangeOptionPasswordLength = (e: string) => {
    if(e.length !== 0) {
      setPasswordLength(e as unknown as number)
    }
  }

  const onChangeOptionMinimumNumbers = (e: string) => {
    if(e.length !== 0) {
      setMinimumNumbers(e as unknown as number)
    }
  }

  const onChangeOptionMinimumSpecials = (e: string) => {
    if(e.length !== 0) {
      setMinimumSpecials(e as unknown as number)
    }
  }

  const onChangeIsUppercase = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUppercase(e.target.checked)
    if (!e.target.checked && !isNumber && !isSpecial && !isLowercase) {
      setIsLowercase(true)
    }
  }

  const onChangeIsLowercase = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLowercase(e.target.checked)
    if (!e.target.checked && !isNumber && !isSpecial && !isUppercase) {
      setIsLowercase(true)
    }
  }

  const onChangeIsNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNumber(e.target.checked)
    if (!e.target.checked && !isUppercase && !isSpecial && !isLowercase) {
      setIsLowercase(true)
    }
  }

  const onChangeIsSpecial = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpecial(e.target.checked)
    if (!e.target.checked && !isNumber && !isUppercase && !isLowercase) {
      setIsLowercase(true)
    }
  }

  const onChangeIsSpecialURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpecialURL(e.target.checked)
  }

  const onChangeAvoidAmbiguous = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvoidAmbiguous(e.target.checked)
  }

  return (
    <Page>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>
        <Stack w={'full'} maxW={'lg'}>
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
              Password Generator Options
            </Heading>
            <FormControl id="optionPassword">
              <Stack direction="row" w="100%">
                <Stack direction="row" w="50%" px={"1%"} justifyContent="right">
                  <Text mx={1} mt="1.5%">Password Length</Text>
                </Stack>
                <Stack direction="row" w="50%" px={"1%"}>
                  <NumberInput
                    value={passwordLength}
                    min={8}
                    max={511}
                    mb={3}
                    maxW="42%"
                    onChange={onChangeOptionPasswordLength}>
                    <NumberInputField/>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
              </Stack>

              <Stack direction="row" w="100%">
                <Stack direction="row" w="50%" px={"1%"} justifyContent="right">
                  <Text mx={1} mt="1.5%">Minimum Numbers</Text>
                </Stack>
                <Stack direction="row" w="50%" px={"1%"}>
                  <NumberInput
                    value={minimumNumbers}
                    min={1}
                    max={passwordLength - (isSpecial ? minimumSpecials : 0) - 3}
                    mb={3}
                    maxW="42%"
                    onChange={onChangeOptionMinimumNumbers}
                    isDisabled={!isNumber}>
                    <NumberInputField/>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
              </Stack>

              <Stack direction="row" w="100%">
                <Stack direction="row" w="50%" px={"1%"} justifyContent="right">
                  <Text mx={1} mt="1.5%">Minimum Symbols</Text>
                </Stack>
                <Stack direction="row" w="50%" px={"1%"}>
                  <NumberInput
                    value={minimumSpecials}
                    min={1}
                    max={passwordLength - (isNumber ? minimumNumbers : 0) - 3}
                    mb={3}
                    maxW="42%"
                    onChange={onChangeOptionMinimumSpecials}
                    isDisabled={!isSpecial}>
                    <NumberInputField/>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
              </Stack>

              <Checkbox colorScheme="green" me="5%"
                        isChecked={isUppercase}
                        onChange={onChangeIsUppercase}>
                A-Z
              </Checkbox>
              <Checkbox colorScheme="green" me="5%"
                        isChecked={isLowercase}
                        isDisabled={!isUppercase && !isNumber && !isSpecial}
                        onChange={onChangeIsLowercase}>
                a-z
              </Checkbox>
              <Checkbox colorScheme="green" me="5%"
                        isChecked={isNumber}
                        onChange={onChangeIsNumber}>
                0-9
              </Checkbox>
              <Checkbox colorScheme="green" me="5%"
                        isChecked={isSpecial}
                        onChange={onChangeIsSpecial}>
                Symbols
              </Checkbox>
              <Checkbox colorScheme="green" me="5%"
                        isChecked={avoidAmbiguous}
                        onChange={onChangeAvoidAmbiguous}>
                Avoid ambiguous characters
              </Checkbox>
              <Checkbox colorScheme="green" me="5%"
                        isChecked={isSpecialURL}
                        isDisabled={!isSpecial}
                        onChange={onChangeIsSpecialURL}>
                URL-friendy symbols
              </Checkbox>
            </FormControl>
            <Text mt={3}>Note: this password generator is based on <a href="https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback" target="_blank" rel="noreferrer"><u>crypto module</u></a> and therefore is claimed to be "cryptographically secure"</Text>
          </Stack>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'lg'}
            boxShadow={'lg'}
            p={6}
            my={2}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Random Password Generator
            </Heading>
            <FormControl id="password">
              <Input
                readOnly={true}
                placeholder="Generated Password"
                _placeholder={{ color: 'gray.500' }}
                value={textBox}
                fontFamily="monospace"
              />
            </FormControl>
            <Stack spacing={5} direction={['column', 'row']}>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickGenerate}>
                Generate
              </Button>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickCopy}
                isDisabled={ textBox.length === 0 }
              >
                Copy
              </Button>
            </Stack>
          </Stack>

          <Stack
            spacing={4}
            w={'full'}
            maxW={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'lg'}
            boxShadow={'lg'}
            p={6}
            mt={2}
            mb={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Multiple Password Generator
            </Heading>
            <FormControl id="passwordMultiple">
              <Stack direction='row'>
                <Text mx={3} mt="1.5%" align="center">Number of Passwords </Text>
                <NumberInput
                  value={numberOfPassword}
                  min={2}
                  max={32767}
                  mb={3}
                  maxW="50%"
                  onChange={onChangeNumberOfPassword}>
                  <NumberInputField/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
              <Textarea
                readOnly={true}
                placeholder="Generated Random Passwords"
                _placeholder={{ color: 'gray.500' }}
                value={areaTextBox}
                fontFamily="monospace"
              />
            </FormControl>
            <Stack spacing={5} direction={['column', 'row']}>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickGenerateMultiple}>
                Generate
              </Button>
              <Button
                bg={useColorModeValue("green.400", "green.600")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("green.600", "green.400"),
                }} w={{ base: "100%", md: "50%" }}
                onClick={onClickCopyMultiple}
                isDisabled={ areaTextBox.length === 0 }
              >
                Copy
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Page>
  )
}