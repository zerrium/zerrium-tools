import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, IconButton,
  Stack,
  Text,
  Textarea, Tooltip,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { parse } from "yaml";
import { useOutletContext } from "react-router-dom"
import type { IOutletContext } from "../../interface/Interfaces.ts"
import { LuExpand, LuShrink } from "react-icons/lu";
import { isMobile } from "react-device-detect";
import { FaRegCopy } from "react-icons/fa";

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

  const { isFullScreen, setIsFullScreen } = useOutletContext<IOutletContext>()

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
          maxW={isFullScreen ? 'full' : '1200px'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}
          mt={12}
        >
          <Stack direction="row" w="100%" justify="space-between">
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              YAML Validator
            </Heading>
            {!isMobile && (
                <Tooltip label={`${isFullScreen ? "Exit" : "Enter"} fullscreen mode`} mr="2">
                  <IconButton
                      variant="outline"
                      aria-label="open menu"
                      icon={isFullScreen ? <LuShrink fontSize="22px" /> : <LuExpand fontSize="22px" />}
                      size="sm"
                      m={0}
                      onClick={() => setIsFullScreen(!isFullScreen)}
                  />
                </Tooltip>
            )}
          </Stack>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Note: This tool parses YAML according to <a
            href="https://yaml.org/spec/1.2.2" target="_blank"
            rel="noreferrer"><u>YAML specification v1.2.2</u></a> and backwards compatible.
          </Text>
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
            {isFullScreen && (
                <Button
                    mb={2}
                    variant="outline"
                    aria-label="open menu"
                    leftIcon={<FaRegCopy fontSize="22px" />}
                    size="sm"
                    onClick={onClickCopy}
                    isDisabled={textBox.length === 0 || status === "Invalid"}
                >
                  Copy
                </Button>
            )}
            <Textarea
              placeholder="Input YAML text"
              _placeholder={{ color: 'gray.500' }}
              value={textBox}
              onChange={onChangeInput}
              rows={isFullScreen && !isMobile ? 30 : 20}
              fontFamily="monospace"
              spellCheck={false}
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