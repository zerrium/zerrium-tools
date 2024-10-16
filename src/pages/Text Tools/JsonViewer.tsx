import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Flex,
  FormControl,
  Heading,
  Stack,
  Text,
  Textarea,
  useColorModeValue
} from "@chakra-ui/react";
import { JsonViewer as JV } from "@textea/json-viewer";

export function JsonViewer() {
  const [textBox, setTextBox] = useState<string>("")
  const [status, setStatus] = useState<"Invalid" | "Valid">("Invalid")
  const [jsonObj, setJsonObj] = useState()

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox(e.target.value)
  }

  useEffect(() => {
    try {
      const obj = JSON.parse(textBox)
      setJsonObj(obj)
      setStatus("Valid")
    } catch (e) {
      setStatus("Invalid")
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
          maxW={'1920px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            JSON Viewer
          </Heading>
          <Stack direction={["column", "column", "column", "column", "row"]} spacing={'20px'}>
            <Stack w={{ base: "100%", xl: "50%" }}>
              <FormControl id="uuid">
                <Text
                  my={2}
                  fontSize={18}
                  w="100%"
                  textAlign="center"
                  textColor={
                    useColorModeValue(
                      status === "Valid" ? "#30c030" : "#f01818",
                      status === "Valid" ? "#18f018" : "#fa3232")
                  }
                  fontWeight={"bold"}>
                  {status}
                </Text>
                <Textarea
                  placeholder="Input JSON text"
                  _placeholder={{ color: 'gray.500' }}
                  value={textBox}
                  onChange={onChangeInput}
                  rows={20}
                  fontFamily="monospace"
                />
              </FormControl>
            </Stack>
            <Stack w={{ base: "100%", xl: "50%" }} display={status === "Invalid" || textBox.length ===0 || !jsonObj ? "none" : "flex"}>
              <JV value={jsonObj} theme={useColorModeValue("light", "dark")}/>
            </Stack>
            <Stack w={{ base: "100%", xl: "50%" }} display={status === "Invalid" || textBox.length ===0 || !jsonObj ? "flex" : "none"}>
              <Text color={"gray.500"} fontSize={32} fontFamily="monospace">No Data.</Text>
            </Stack>
          </Stack>
        </Stack>
    </Flex>
  )
}