import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Heading, Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

const templates: { label: string, key: string, value: RegExp }[] = [
  { label: "Username", key: "username", value: /^[a-z0-9_-]{3,15}$/g },
  { label: "Email", key: "email", value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g },
  { label: "IP Address v4", key: "ipv4", value: /^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/g },
  { label: "IP Address v6", key: "ipv6", value: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/g },
  { label: "Port Number", key: "port", value: /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/g },
  { label: "MAC Address", key: "mac", value: /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/g },
  { label: "URL", key: "url", value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)$/g },
  { label: "Phone Number", key: "phone", value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g },
  { label: "Emoji", key: "emoji", value: /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/g },
  { label: "Strong Password", key: "password", value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g },
  { label: "Credit Card", key: "credit-card", value: /(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)/g },
  { label: "GPS Long Lat", key: "gps", value: /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/g },
]

const Regex = () => {
  const [textBox, setTextBox] = useState<string>("")
  const [template, setTemplate] = useState<string>("")

  const toast = useToast({
    position: "top",
    duration: 2000,
    status: "success"
  })

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setTemplate(e.target.value)
  }

  const onClickCopy = () => {
    navigator.clipboard.writeText(textBox)
    toast({ description: 'Copied!' })
  }

  useEffect(() => {
    const index = templates.map((t) => t.key).indexOf(template)
    setTextBox(templates[index]?.value?.toString() || "")
  }, [template])

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'lg'}
        boxShadow={'lg'}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        p={6}
        mt={12}
        mb={2}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Regex Templates
        </Heading>
        <FormControl id="regex">
          <Stack direction="row" w="100%" my={3}>
            <Stack direction="row" w="28%" px={"1%"}>
              <Text mx={1} mt="5%">Select template</Text>
            </Stack>
            <Stack direction="row" w="72%" px={"1%"}>
              <Select placeholder="Select template..." value={template} onChange={onChangeSelect}>
                {templates.map((t) => (
                  <option value={t.key} key={t.key}>{t.label}</option>
                ))}
              </Select>
            </Stack>
          </Stack>

          <Textarea
            placeholder="No result"
            _placeholder={{ color: 'gray.500' }}
            value={textBox}
            onChange={() => {}}
            fontFamily="monospace"
            mb={4}
            rows={5}
            spellCheck={false}
          />
        </FormControl>
        <Button
          bg={useColorModeValue("green.400", "green.600")}
          color={'white'}
          _hover={{
            bg: useColorModeValue("green.600", "green.400"),
          }}
          onClick={onClickCopy}
          isDisabled={textBox.length === 0}
        >
          Copy
        </Button>
        <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
          Debug your regex <a href="https://regex101.com/" target="_blank" rel="noreferrer"><u>here</u></a> (regex101.com)
        </Text>
      </Stack>
    </Flex>
  )
}

export default Regex