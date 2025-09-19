// @ts-ignore
import { validate } from "uuid";
import { type ChangeEvent, useEffect, useState } from "react";
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

const validateUuid = (uuid: string) => {
  return validate(uuid)
}

const UuidValidator = () => {
  const [textBox, setTextBox] = useState<string>("")
  const [textBoxResult, setTextBoxResult] = useState<string>("")
  const [status, setStatus] = useState<"Invalid" | "Valid">("Invalid")

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  // const onClickPaste = async () => {
  //   setTextBox(await navigator.clipboard.readText())
  // }

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox(e.target.value)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBoxResult)
    toast({ description: 'Copied!' })
  }

  const onClickDownload = () => {
    const element = document.createElement("a");
    // @ts-ignore
    const file = new Blob([document.getElementById('result').value], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "UUID_Validate_Results.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  useEffect(() => {
    const uuids: string[] = textBox.split(/\n/)
    let isValid = true
    let results: string = ""
    uuids.forEach((s) => {
      const temp = validateUuid(s)
      isValid = isValid && temp
      results += s + " -> " + (temp ? "Valid" : "Invalid") + "\n"
    })
    setStatus(isValid ? "Valid" : "Invalid")
    setTextBoxResult(results)
  }, [textBox])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            UUID Validator
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
              placeholder="Input UUID(s)"
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
              fontFamily="monospace"
            />
            <Textarea id="result" value={textBoxResult} display="none" disabled readOnly/>
          </FormControl>
          <Stack spacing={5} direction={['column', 'row']}>
            <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              w={{ base: "100%", md: "50%" }}
              onClick={onClickCopy}
              isDisabled={ textBox.length === 0 }>
              Copy Results
            </Button>
            <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              w={{ base: "100%", md: "50%" }}
              onClick={onClickDownload}
              isDisabled={ textBox.length === 0 }>
              Download Results
            </Button>
          </Stack>
          {/*<Button*/}
          {/*  bg={useColorModeValue("green.400", "green.600")}*/}
          {/*  color={'white'}*/}
          {/*  _hover={{*/}
          {/*    bg: useColorModeValue("green.600", "green.400"),*/}
          {/*  }}*/}
          {/*  onClick={onClickPaste}>*/}
          {/*  Paste*/}
          {/*</Button>*/}
        </Stack>
    </Flex>
  )
}

export default UuidValidator