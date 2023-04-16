import * as React from 'react';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import ContactForm from './contactForm';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <ContactForm />
    </Box>
  </ChakraProvider>
);
