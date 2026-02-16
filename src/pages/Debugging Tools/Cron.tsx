// @ts-ignore
import { validate } from "uuid";
import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, Input,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { CronExpressionParser } from "cron-parser";
import moment from "moment/moment.js";
import cronstrue from 'cronstrue';

const Cron = () => {
  const [textBox, setTextBox] = useState<string>("* * * * *")
  const [status, setStatus] = useState<"Invalid" | "Valid">("Valid")
  const [nextDate, setNextDate] = useState<string>("")
  const [desc, setDesc] = useState<string>("")

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBox(e.target.value)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBox)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    if (textBox?.length > 0) {
      try {
        const interval = CronExpressionParser.parse(textBox)
        setStatus("Valid")
        setNextDate(moment(interval?.next()?.toDate())?.format("YYYY-MM-DD HH:mm:ss"))
        setDesc(cronstrue.toString(textBox, { locale: "en" }))
      } catch (e){
        setStatus("Invalid")
        setNextDate("")
        setDesc("")
      }
    } else {
      setStatus("Invalid")
      setNextDate("")
      setDesc("")
    }
  }, [textBox])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'4xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Cron Viewer
          </Heading>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: There is no definitive standard of cron format. However, this tool supports both <a
            href="https://www.javadoc.io/doc/org.quartz-scheduler/quartz/latest/org/quartz/CronExpression.html" target="_blank"
            rel="noreferrer"><u>Quartz format (Java)</u></a> and <a
            href="https://pubs.opengroup.org/onlinepubs/9799919799" target="_blank"
            rel="noreferrer"><u>UNIX format (IEEE 1003.1-2024)</u></a>
          </Text>
          <FormControl id="cron">
            {status === "Valid" ? (
              <>
                <Text textAlign="center" fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl", xl: "4xl" }} fontFamily="monospace">“{desc}”</Text>
                <Text textAlign="center" fontFamily="monospace" fontSize={{ base: "sm", sm: "md", md: "lg", xl: "xl" }} pb={3}>Next at {nextDate}</Text>
              </>
            ) : (
              <Text
                pb={3}
                w="100%"
                textAlign="center"
                textColor={
                  useColorModeValue("#f01818", "#fa3232")
                }
                fontFamily="monospace"
                fontSize={{ base: "md", sm: "lg", md: "xl", xl: "2xl" }}
                fontWeight={"bold"}>
                  Invalid
              </Text>
            )}
            <Input
              placeholder="Input cron expression"
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
              fontFamily="monospace"
              spellCheck={false}
              textAlign="center"
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
              size={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
              borderRadius="8px"
            />
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ base: 3, md: 4, lg: 5 }} pt={1} color={useColorModeValue("gray.500", "gray.400")}>
              {textBox?.split(" ")?.length > 5 && (<Text>second</Text>)}
              <Text>minute</Text>
              <Text>hour</Text>
              <Text>day</Text>
              <Text>month</Text>
              <Text>weekday</Text>
            </Stack>
          </FormControl>
          <Stack justifyContent="center" direction="row" pt={3}>
            <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              w={{ base: "100%", md: "50%" }}
              onClick={onClickCopy}
              isDisabled={ textBox.length === 0 }>
              Copy
            </Button>
          </Stack>
        </Stack>
    </Flex>
  )
}

export default Cron