
import { Box, Button, Container, Heading, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionBox = motion(Box);



export default function PageNotFound() {
  return (
    <Container maxW="container.lg" textAlign="center" py={20}>
    <MotionBox
      fontSize="9xl"
      fontWeight="bold"
      animate={{ y: [0, -30, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      404
    </MotionBox>
    <VStack spacing={5} mt={10}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Heading size="xl">Page Not Found</Heading>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Text fontSize="lg">
          Sorry, the page you're looking for doesn't exist.
        </Text>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <Button  as={Link} to='/' colorScheme="blue" size="lg" variant={'primary'}>
          Go Back Home
        </Button>
      </MotionBox>
    </VStack>
  </Container>
  )
}