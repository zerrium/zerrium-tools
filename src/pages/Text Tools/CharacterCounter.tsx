import { Badge, Flex, FormControl, Heading, Stack, Textarea, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react";
const CharacterCounter = () => {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
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
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Character Counter
          </Heading>
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