import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { parse } from "yaml";

const validateYaml = (text: string) => {
  try {
    parse(text)
    return true
  } catch (e) {
    return false
  }
}

const YamlValidator = () => {
  const [textBox, setTextBox] = useState<string>("")
  const [status, setStatus] = useState<"Invalid" | "Valid">("Invalid")

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox(e.target.value)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBox)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    setStatus(validateYaml(textBox) ? "Valid" : "Invalid")
  }, [textBox])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'1200px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            YAML Validator
          </Heading>
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
              placeholder="Input YAML text"
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
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
              isDisabled={ textBox.length === 0 || status === "Invalid" }>
              Copy
            </Button>
          </Stack>
        </Stack>
    </Flex>
  )
}

export default YamlValidator