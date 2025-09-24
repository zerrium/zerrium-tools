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
              maxW={'md'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'lg'}
              boxShadow={'lg'}
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              p={6}>
              <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                Character Counter
              </Heading>
               
                <Textarea
                  placeholder="Input Text"
                  _placeholder={{ color: 'gray.500' }}
                  outlineColor={useColorModeValue('gray.300', 'gray.600')}
                  value={text}
                  onChange={
                    (e) => {
                      setText(e.target.value);
                      setCount(e.target.value.length);
                    }
                  }
                  fontFamily="monospace"
                />
                <Badge>
                  Character Count: {count}
                </Badge>
              </Stack>
              
        </Flex>

  )
}

export default CharacterCounter;