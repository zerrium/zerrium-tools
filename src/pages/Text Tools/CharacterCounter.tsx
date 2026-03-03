import {
  Badge,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Stack,
  Textarea,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react"
import { useState } from "react";
import type { IOutletContext } from "../../interface/Interfaces.ts"
import { LuShrink } from "react-icons/lu";
import { useOutletContext } from "react-router-dom";

const CharacterCounter = () => {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);

  const { isFullScreen, setIsFullScreen } = useOutletContext<IOutletContext>()

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'3xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          boxShadow={'lg'}
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={6}>
          <Stack direction="row" w="100%" justify="space-between">
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Character Counter
            </Heading>
            {isFullScreen && (
                <Tooltip label="Exit fullscreen mode" mr="2">
                  <IconButton
                      variant="outline"
                      aria-label="open menu"
                      icon={<LuShrink fontSize="22px" />}
                      size="sm"
                      m={0}
                      onClick={() => setIsFullScreen(!isFullScreen)}
                  />
                </Tooltip>
            )}
          </Stack>
            <FormControl id="characterCounter">
            <Textarea
              placeholder="Input Text"
              _placeholder={{ color: 'gray.500' }}
              value={text}
              onChange={
                (e) => {
                  setText(e.target.value);
                  setCount(e.target.value.length);
                }
              }
              fontFamily="monospace"
              rows={10}
              mb={2}
              spellCheck={false}
            />
            <Badge>
              Character Count: {count}
            </Badge>
            </FormControl>
        </Stack>
    </Flex>
  )
}

export default CharacterCounter;