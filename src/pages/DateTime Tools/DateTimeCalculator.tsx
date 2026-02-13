import { type ChangeEvent, useEffect, useState } from "react";
import {
    Button,
    Flex,
    FormControl,
    Heading,
    Input, Select,
    Stack,
    Switch,
    Text, Textarea,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import moment from 'moment/moment.js';

const DateTimeCalculator = () => {
  const [textBoxInput1, setTextBoxInput1] = useState<string>("")
  const [textBoxInput2, setTextBoxInput2] = useState<string>("")
  const [textBoxOutput, setTextBoxOutput] = useState<string>("")
  const [useNumber, setUseNumber] = useState<boolean>(false)
  const [isNow, setIsNow] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [now, setNow] = useState(moment())
    const [unit, setUnit] = useState<string>('d')

  setInterval(() => {
    setNow(moment())
  }, 1000)

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput1 = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBoxInput1(e.target.value)
  }

  const onChangeInput2 = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBoxInput2(e.target.value)
  }

  const onChangeUnit = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setUnit(e.target.value)
    }
  }

  const onChangeSwitchNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    if (textBoxInput2.length !== 0) {
      setTextBoxInput2("")
    }
    setTextBoxOutput("")
    setUseNumber(toggle)
  }

  const onChangeSwitchIsNow = (e: ChangeEvent<HTMLInputElement>) => {
    const toggle = e.target.checked
    setIsNow(toggle)
    setTextBoxInput1("")
    if (!useNumber) {
      setTextBoxInput2("")
    }
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxOutput)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    if (textBoxInput1 && textBoxInput2) {
      try {
        let result = ""
        if (useNumber) {
          // @ts-ignore
            result += "Addition: " + moment(textBoxInput1).add(textBoxInput2, unit).format("YYYY-MM-DD HH:mm:ss")
          // @ts-ignore
            result += "\nSubtraction: " + moment(textBoxInput1).subtract(textBoxInput2, unit).format("YYYY-MM-DD HH:mm:ss")
        } else {
          const x = moment(textBoxInput1)
          const y = moment(textBoxInput2)

          const year = Math.abs(x.diff(y, 'y'))
          const month = Math.abs(x.diff(y, 'M'))
          const day = Math.abs(x.diff(y, 'd'))
          let second = Math.abs(x.diff(y, 's'))
          const hour = Math.floor((second % 86400) / 3600)
          const minute = Math.floor((second % 3600) / 60)
          second = second % 60

          result += year + " years or " + month + " months or " + day + " days,\n"
              + hour + " hours and " + minute + " minutes and " + second + " seconds"
        }
        setTextBoxOutput(result)
        setError(false)
      } catch (e) {
        setTextBoxOutput("Invalid input!")
        setError(true)
      }
    }
    // eslint-disable-next-line
  }, [textBoxInput1,  textBoxInput2, unit])

  useEffect(() => {
    if (isNow) {
      setTextBoxInput1(now.format("YYYY-MM-DD HH:mm:ss"))
      if (!useNumber) {
        setTextBoxInput2(now.format("YYYY-MM-DD HH:mm:ss"))
      }
    }
    // eslint-disable-next-line
  }, [isNow, useNumber])

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
          Date Time Calculator
        </Heading>
        <FormControl id="url">
          <Stack direction="row" w="100%" mb={3}>
            <Text mx={1}>Duration between 2 Dates</Text>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={useNumber}
                    onChange={onChangeSwitchNumber}/>
            <Text mx={1}>Date add/subtract</Text>
          </Stack>

          <Stack direction="row" w="100%" mb={3}>
            <Switch colorScheme='green'
                    mx={1} mt="0.6%"
                    isChecked={isNow}
                    onChange={onChangeSwitchIsNow}/>
            <Text mx={1}>Use now value</Text>
          </Stack>

          <Input
            placeholder={useNumber ? "Input date time" : "Input date time 1"}
            _placeholder={{ color: 'gray.500' }}
            value={textBoxInput1}
            onChange={onChangeInput1}
            fontFamily="monospace"
            mb={4}
          />
            {useNumber ? (
              <Stack direction="row" mx={1}>
                <Input
                    placeholder="Input number of"
                    _placeholder={{ color: 'gray.500' }}
                    value={textBoxInput2}
                    onChange={onChangeInput2}
                    fontFamily="monospace"
                    mb={4}
                />
                <Select
                    placeholder="Select unit"
                    mb={4}
                    value={unit}
                    onChange={onChangeUnit}
                >
                    <option value='ms'>Miliseconds</option>
                    <option value='s'>Seconds</option>
                    <option value='m'>Minutes</option>
                    <option value='h'>Hours</option>
                    <option value='d'>Days</option>
                    <option value='w'>Weeks</option>
                    <option value='M'>Months</option>
                    <option value='Q'>Quarters</option>
                    <option value='y'>Years</option>
                </Select>
              </Stack>
            ) : (
              <Input
                placeholder="Input date time 2"
                _placeholder={{ color: 'gray.500' }}
                value={textBoxInput2}
                onChange={onChangeInput2}
                fontFamily="monospace"
                mb={4}
              />
            )}
          <Text mb={3}>Output:</Text>
            <Textarea
              placeholder="Output"
              _placeholder={{ color: 'gray.500' }}
              value={textBoxOutput}
              fontFamily="monospace"
              rows={2}
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

export default DateTimeCalculator