import { type ChangeEvent, useEffect, useState } from "react";
import {
  Flex,
  FormControl,
  Heading,
  Stack,
  Text,
  Textarea,
  useColorModeValue
} from "@chakra-ui/react";
import { JsonDiffComponent } from "json-diff-react";
import _ from 'lodash';

const JsonComparator = () => {
  const [textBox1, setTextBox1] = useState<string>("")
  const [textBox2, setTextBox2] = useState<string>("")
  const [status1, setStatus1] = useState<"Invalid" | "Valid">("Invalid")
  const [status2, setStatus2] = useState<"Invalid" | "Valid">("Invalid")
  const [jsonObj1, setJsonObj1] = useState()
  const [jsonObj2, setJsonObj2] = useState()
  const [isEqual, setIsEqual] = useState<boolean>(false);

  const onChangeInput1 = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox1(e.target.value)
  }

  const onChangeInput2 = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox2(e.target.value)
  }

  useEffect(() => {
    try {
      const obj1 = JSON.parse(textBox1)
      setJsonObj1(obj1)
      setStatus1("Valid")
    } catch (e) {
      setStatus1("Invalid")
    }
  }, [textBox1])

  useEffect(() => {
    try {
      const obj2 = JSON.parse(textBox2)
      setJsonObj2(obj2)
      setStatus2("Valid")
    } catch (e) {
      setStatus2("Invalid")
    }
  }, [textBox2])

  useEffect(() => {
    if (status1 === "Valid" && jsonObj1 && status2 === "Valid" && jsonObj2 && _.isEqual(jsonObj1, jsonObj2)) {
      setIsEqual(true)
    } else {
      setIsEqual(false)
    }
  }, [jsonObj1, jsonObj2, status1, status2])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'1920px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            JSON Object Comparator
          </Heading>
          <Stack direction={["column", "column", "column", "row", "row"]} spacing={'20px'}>
            <Stack w={{ base: "100%", lg: "50%" }}>
              <FormControl id="json1">
                <Text
                  my={2}
                  fontSize={18}
                  w="100%"
                  textAlign="center"
                  textColor={
                    useColorModeValue(
                      status1 === "Valid" ? "#30c030" : "#f01818",
                      status1 === "Valid" ? "#18f018" : "#fa3232")
                  }
                  fontWeight={"bold"}>
                  {status1}
                </Text>
                <Textarea
                  placeholder="Input JSON text 1"
                  _placeholder={{ color: 'gray.500' }}
                  value={textBox1}
                  onChange={onChangeInput1}
                  rows={20}
                  fontFamily="monospace"
                  spellCheck={false}
                />
              </FormControl>
            </Stack>
            <Stack w={{ base: "100%", lg: "50%" }}>
              <FormControl id="json2">
                <Text
                  my={2}
                  fontSize={18}
                  w="100%"
                  textAlign="center"
                  textColor={
                    useColorModeValue(
                      status2 === "Valid" ? "#30c030" : "#f01818",
                      status2 === "Valid" ? "#18f018" : "#fa3232")
                  }
                  fontWeight={"bold"}>
                  {status2}
                </Text>
                <Textarea
                  placeholder="Input JSON text 2"
                  _placeholder={{ color: 'gray.500' }}
                  value={textBox2}
                  onChange={onChangeInput2}
                  rows={20}
                  fontFamily="monospace"
                  spellCheck={false}
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack w={{ base: "100%", lg: "100%" }} display={status1 === "Invalid" || status2 === "Invalid" || textBox1.length === 0 || textBox2.length === 0 || (!jsonObj1 && !jsonObj2) || isEqual ? "none" : "flex"}>
            <style>
              {`
                .deletion::before {
                  content: '-';
                }

                .addition::before {
                  content: '+';
                }`
              }
            </style>
            <JsonDiffComponent
              jsonA={jsonObj1 ?? {}}
              jsonB={jsonObj2 ?? {}}
              styleCustomization={{
                additionLineStyle: { color: useColorModeValue('#30c030', '#18f018') },
                deletionLineStyle: { color: useColorModeValue('#f01818', '#fa3232') },
                unchangedLineStyle: { color: 'gray' },
                frameStyle: {
                  fontFamily: 'monospace',
                  whiteSpace: 'pre'
                }
              }}
            />
          </Stack>
          <Stack display={status1 === "Invalid" || status2 === "Invalid" || textBox1.length === 0 || textBox2.length === 0 || (!jsonObj1 && !jsonObj2) ? "flex" : "none"}>
            <Text color={"gray.500"} fontSize={32} fontFamily="monospace">No Data.</Text>
          </Stack>
          <Stack display={status1 === "Valid" && status2 === "Valid" && isEqual ? "flex" : "none"}>
            <Text color={"gray.500"} fontSize={32} fontFamily="monospace">Identical Data.</Text>
          </Stack>
        </Stack>
    </Flex>
  )
}

export default JsonComparator