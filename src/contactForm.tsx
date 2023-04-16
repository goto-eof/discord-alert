import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Stack,
  Textarea,
  Text,
  VStack,
  Alert,
  AlertIcon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    text: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    text: false,
  });
  const [validity, setValidity] = useState({
    name: true,
    email: true,
    phone: true,
    text: true,
  });

  const [mandatory, setMandatory] = useState({
    name: true,
    email: false,
    phone: false,
    text: true,
  });
  const [submit, setSubmit] = useState({
    show: false,
    formStatus: '',
  });

  const handleOnChange = (e: any) => {
    const value: string = e.target.value;
    const name: string = e.target.name;
    setForm({ ...form, [name]: value });
  };

  const sendToDiscord = (dat: any) => {
    let str = `==================================\n${new Date().toLocaleString()} - Someone wrote to you:\n==================================\n${JSON.stringify(
      dat,
      null,
      4
    )}`;
    let data = {
      content: str,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    fetch(process.env.REACT_APP_DISCORD_URI || '', requestOptions).then(
      () => setSubmit({ formStatus: 'ok', show: true }),
      (err) => {
        console.log(err);
        setSubmit({ formStatus: 'error', show: true });
      }
    );
  };

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    const contactData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      text: form.text,
    };

    const validation = {
      name: isValid('name', true),
      email: isValid('email', true),
      text: isValid('text', true),
      phone: isValid('phone', true),
    };

    if (
      !validation.name ||
      !validation.email ||
      !validation.phone ||
      !validation.text
    ) {
      setSubmit({ formStatus: 'ko', show: true });
      setValidity(validation);
      return;
    }

    sendToDiscord(contactData);
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone: string) => {
    return String(phone).match(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
    );
  };

  const functions = {
    name: (propName: string) => {
      if ((mandatory as any)[propName]) {
        return (
          (form as any)[propName].length >= 3 &&
          (form as any)[propName].length <= 70
        );
      }
      return true;
    },
    email: (propName: string) => {
      if ((mandatory as any)[propName]) {
        return validateEmail((form as any)[propName]);
      }
      return true;
    },
    phone: (propName: string) => {
      if ((mandatory as any)[propName]) {
        return validatePhone((form as any)[propName]);
      }
      return true;
    },
    text: (propName: string) => {
      if ((mandatory as any)[propName]) {
        return (
          (form as any)[propName].length >= 5 &&
          (form as any)[propName].length <= 1000
        );
      }
      return true;
    },
  };

  // magic function
  const isValid = (propName: string, forceTouched?: boolean): boolean => {
    const func: (value: string) => boolean = (functions as any)[propName];
    return forceTouched || (touched as any)[propName] ? func(propName) : true;
  };

  const handleOnBlur = (e: any) => {
    const name = e.target.name;
    setTouched({ ...touched, [name]: true });
    setValidity({ ...validity, [name]: isValid(name, true) });
  };

  const isFormValid = () => {
    const validation = {
      name: isValid('name', true),
      email: isValid('email', true),
      text: isValid('text', true),
      phone: isValid('phone', true),
    };
    return (
      validation.name && validation.email && validation.phone && validation.text
    );
  };

  const isReadOnly = () => {
    return submit.show && submit.formStatus === 'ok';
  };

  const calculateBackgroundColor = (val: boolean) => {
    if (submit.show && submit.formStatus === 'ok') {
      return 'gray.100';
    }
    return val ? 'white' : 'red.50';
  };

  return (
    <Box
      id="contactme"
      pt={150}
      pb={4}
      px={4}
      bg={'gray.50'}
      minH={'calc(100vh)'}
    >
      <Stack maxW="6xl" m={'auto'} as={Container} textAlign={'center'}>
        <Heading color={'green.400'} fontSize={'5xl'}>
          Contact me
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 1 }}>
          <VStack w={'full'}>
            {submit.show && submit.formStatus === 'ko' && (
              <Alert status="error">
                <AlertIcon />
                Invalid form
              </Alert>
            )}
            {submit.show && submit.formStatus === 'error' && (
              <Alert status="error">
                <AlertIcon />
                Unable to do it
              </Alert>
            )}
            {submit.show && submit.formStatus === 'ok' && (
              <Alert status="success">
                <AlertIcon />
                Message sent successfully!
              </Alert>
            )}
            <form onSubmit={onSubmitHandler} style={{ width: '100%' }}>
              <FormControl id="name">
                <FormLabel fontSize={'2xl'} color={'gray.700'}>
                  Your Name {mandatory.name ? '*' : ''}
                </FormLabel>
                {!validity.name && (
                  <Text textAlign={'left'} color={'red.400'}>
                    * Invalid value
                  </Text>
                )}
                <InputGroup borderColor="#E0E1E7">
                  <Input
                    w={'full'}
                    readOnly={isReadOnly()}
                    minLength={3}
                    maxLength={70}
                    value={form.name}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    name="name"
                    borderColor="gray.500"
                    borderWidth={'1px'}
                    borderStyle={'solid'}
                    background={calculateBackgroundColor(validity.name)}
                    h={'60px'}
                    size="md"
                    _hover={{
                      borderColor: 'gray.400',
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="email" pt={5}>
                <FormLabel fontSize={'2xl'} color={'gray.700'}>
                  E-Mail {mandatory.email ? '*' : ''}
                </FormLabel>
                {!validity.email && (
                  <Text textAlign={'left'} color={'red.400'}>
                    * Invalid value
                  </Text>
                )}
                <InputGroup borderColor="#E0E1E7">
                  <Input
                    readOnly={isReadOnly()}
                    type="email"
                    minLength={5}
                    maxLength={319}
                    value={form.email}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    name="email"
                    h={'60px'}
                    borderWidth={'1px'}
                    borderStyle={'solid'}
                    borderColor="gray.500"
                    background={calculateBackgroundColor(validity.email)}
                    size="md"
                    _hover={{
                      borderColor: 'gray.400',
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="phone" pt={5}>
                <FormLabel fontSize={'2xl'} color={'gray.700'}>
                  Phone number {mandatory.phone ? '*' : ''}
                </FormLabel>
                {!validity.phone && (
                  <Text textAlign={'left'} color={'red.400'}>
                    * Invalid value
                  </Text>
                )}
                <InputGroup borderColor="#E0E1E7">
                  <Input
                    readOnly={isReadOnly()}
                    type="tel"
                    minLength={5}
                    maxLength={30}
                    value={form.phone}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    name="phone"
                    h={'60px'}
                    borderWidth={'1px'}
                    borderStyle={'solid'}
                    borderColor="gray.500"
                    background={calculateBackgroundColor(validity.email)}
                    size="md"
                    _hover={{
                      borderColor: 'gray.400',
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="text">
                <FormLabel fontSize={'2xl'} color={'gray.700'}>
                  Message {mandatory.text ? '*' : ''}
                </FormLabel>
                {!validity.text && (
                  <Text textAlign={'left'} color={'red.400'}>
                    * Invalid value
                  </Text>
                )}
                <Textarea
                  readOnly={isReadOnly()}
                  minLength={5}
                  maxLength={1000}
                  value={form.text}
                  onChange={handleOnChange}
                  name="text"
                  borderColor="gray.500"
                  borderWidth={'1px'}
                  borderStyle={'solid'}
                  onBlur={handleOnBlur}
                  background={calculateBackgroundColor(validity.text)}
                  size={'lg'}
                  resize={'vertical'}
                  rows={15}
                  _hover={{
                    borderColor: 'gray.400',
                  }}
                />
              </FormControl>
              <FormControl id="name" float="right">
                <Button
                  disabled={isReadOnly()}
                  type={'submit'}
                  variant="solid"
                  bg={!isFormValid() ? 'gray.400' : 'green.400'}
                  mt={4}
                  size={'lg'}
                  fontSize={'3xl'}
                  px={'25px'}
                  py={'40px'}
                  color="white"
                  _hover={{
                    backgroundColor: !isFormValid() ? 'gray.500' : 'green.500',
                  }}
                >
                  Send Message
                </Button>
              </FormControl>
            </form>
          </VStack>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
