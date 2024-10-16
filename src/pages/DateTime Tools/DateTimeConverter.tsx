import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import moment from 'moment/moment.js';

export function DateTimeConverter() {
  const [textBoxInput, setTextBoxInput] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [decode, setDecode] = useState<boolean>(false)
  const [isNow, setIsNow] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [now, setNow] = useState(moment())

  setInterval(() => {
    setNow(moment())
  }, 1000)

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBoxInput(e.target.value)
  }

  const onChangeSwitchDecode = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setDecode(toggle)
    if (textBoxOutput.length !== 0) {
      setTextBoxInput("")
    }
  }

  const onChangeSwitchIsNow = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setIsNow(toggle)
    if (textBoxOutput.length !== 0) {
      setTextBoxInput("")
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    if (!isNow) {
      try {
        const result = decode ? moment.unix(Number(textBoxInput)).format("YYYY-MM-DD HH:mm:ss") :
            moment(textBoxInput).format("x")
        setTextBoxOutput(result)
        setError(false)
      } catch (e) {
        setTextBoxOutput("Invalid input!")
        setError(true)
      }
    }
  }, [textBoxInput])

  useEffect(() => {
    if (isNow) {
      setTextBoxInput(now.format(decode ? "x" : "YYYY-MM-DD HH:mm:ss"))
      setTextBoxOutput(now.format(decode ? "YYYY-MM-DD HH:mm:ss" : "x"))
    }
  }, [now])

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
          {decode ? "UNIX Timestamp to Date Time" : "Date Time to UNIX Timestamp"}
        </Heading>
        <FormControl id="url">
          <Stack direction="row" w="100%" mb={3}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={decode}
                    onChange={onChangeSwitchDecode}/>
            <Text mx={1}>Swap</Text>
          </Stack>

          <Stack direction="row" w="100%" mb={3}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={isNow}
                    onChange={onChangeSwitchIsNow}/>
            <Text mx={1}>Use now value</Text>
          </Stack>

          <Input
            placeholder={"Input " + (decode ? "timestamp" : "date time") + " to convert"}
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput}
            onChange={onChangeInput}
            fontFamily="monospace"
            mb={4}
            readOnly={isNow}
          />

          <Text mb={3}>Output:</Text>
          <Input
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
  )
}