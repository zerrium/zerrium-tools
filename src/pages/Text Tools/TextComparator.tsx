import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading, IconButton,
  Stack,
  Switch,
  Text,
  Textarea, Tooltip,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
// @ts-ignore
import DiffMatchPatch from 'diff-match-patch';
import { useOutletContext } from "react-router-dom"
import type { IOutletContext } from "../../interface/Interfaces.ts"
import { LuExpand, LuShrink } from "react-icons/lu";
import { isMobile } from "react-device-detect";

const TextComparator = () => {
  const [textBox1, setTextBox1] = useState<string>("")
  const [textBox2, setTextBox2] = useState<string>("")
  const [isLive, setIsLive] = useState<boolean>(false)
  const [hasResult, setHasResult] = useState<boolean>(false)

  const { isFullScreen, setIsFullScreen } = useOutletContext<IOutletContext>()

  const { colorMode } = useColorMode()

  const dmp = new DiffMatchPatch()
  dmp.Diff_Timeout = 0

  const onChangeInput1 = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox1(e.target.value)
  }

  const onChangeInput2 = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextBox2(e.target.value)
  }

  const onChangeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLive(e.target.checked)
  }

  const onClickCompare = () => {
    const diff = dmp.diff_main(textBox1, textBox2)
    dmp.diff_cleanupSemantic(diff)
    setHasResult(diff.length !== 0)
    // @ts-ignore
    document.getElementById('divResult').innerHTML = dmp.diff_prettyHtml(diff)
    if (colorMode === "dark") {
      const dels = document.getElementsByTagName('del')
      // @ts-ignore
      for (const del of dels) {
        del.style.background = "#bd4848"
      }

      const ins = document.getElementsByTagName('ins')
      // @ts-ignore
      for (const inn of ins) {
        inn.style.background = "#42ab42"
      }
    }
  }

  useEffect(() => {
    if (isLive && textBox1.length !== 0 && textBox2.length !== 0) {
      onClickCompare()
    }
    // eslint-disable-next-line
  }, [textBox1, textBox2, isLive])

  useEffect(() => {
    const dels = document.getElementsByTagName('del')
    // @ts-ignore
    for (const del of dels) {
      del.style.background = colorMode === "light" ? "#ffe6e6" : "#bd4848"
    }

    const ins = document.getElementsByTagName('ins')
    // @ts-ignore
    for (const inn of ins) {
      inn.style.background = colorMode === "light" ? "#e6ffe6" : "#42ab42"
    }
  }, [colorMode])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack direction="column" w="full">
        <Stack
          spacing={4}
          w={'full'}
          maxW={isFullScreen ? 'full' : '1920px'}
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
              Text Comparator
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
          <Stack direction="row" w="100%">
            <Switch colorScheme='green'
                    mx={1} mt="0.2%"
                    isChecked={isLive}
                    onChange={onChangeSwitch}/>
            <Text mx={1}>Enable live compare</Text>
          </Stack>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>Disable for large text to improve performance</Text>
          <Stack direction={["column", "column", "column", "column", "row", "row"]} spacing={'20px'}>
            <Stack w={{ base: "100%", xl: "50%" }}>
              <Textarea
                placeholder="Input first text version"
                _placeholder={{ color: 'gray.500' }}
                value={textBox1}
                onChange={onChangeInput1}
                rows={isFullScreen ? 25 : 15}
                fontFamily="monospace"
                spellCheck={false}
              />
            </Stack>
            <Stack w={{ base: "100%", xl: "50%" }}>
              <Textarea
                placeholder="Input second text version"
                _placeholder={{ color: 'gray.500' }}
                value={textBox2}
                onChange={onChangeInput2}
                rows={isFullScreen ? 25 : 15}
                fontFamily="monospace"
                spellCheck={false}
              />
            </Stack>
          </Stack>
          <Stack justifyContent="center" direction="row" display={isLive ? "none" : "flex"}>
            <Button
              bg={useColorModeValue("green.400", "green.600")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("green.600", "green.400"),
              }}
              w={{ base: "100%", lg: "50%" }}
              onClick={onClickCompare}
              isDisabled={ textBox1.length === 0 || textBox2.length === 0 }>
              Compare
            </Button>
          </Stack>
        </Stack>

        <Stack justifyContent="center" direction="row" display={hasResult ? "flex" : "none"}>
          <Stack
            mt={6}
            spacing={4}
            w={'full'}
            maxW={isFullScreen ? 'full' : '960px'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'lg'}
            boxShadow={'lg'}
            borderWidth={1}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            p={6}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Result
            </Heading>
            <Stack>
              <div id="divResult"></div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default TextComparator