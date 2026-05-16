import React from 'react';
import {
  Box, VStack, Heading, Text, Button, Icon, Center, HStack, Badge, Image,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';

const AssessmentCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Center minH="100vh" bg="slate.50" px={4}>
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="card-hover"
        p={12}
        maxW="480px"
        w="full"
        textAlign="center"
        border="1px solid"
        borderColor="slate.100"
        position="relative"
        overflow="hidden"
      >
        {/* Top accent bar */}
        <Box
          position="absolute" top={0} left={0} right={0} h="4px"
          bgGradient="linear(to-r, brand.400, purple.400)"
        />

        <VStack spacing={6}>
          {/* Brand icon */}
          <HStack
            spacing={2}
            mb={2}
            justify="center"
            color="brand.600"
            fontWeight="800"
            fontSize="lg"
          >
            <Image src="/mindstats-logo.svg" h="24px" alt="Mindstat" />
          </HStack>

          {/* Success icon */}
          <Box
            bg="green.50"
            borderRadius="full"
            p={5}
            border="6px solid"
            borderColor="green.100"
          >
            <Icon as={CheckCircleIcon} boxSize={10} color="green.500" />
          </Box>

          <VStack spacing={3}>
            <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
              Assessment Complete!
            </Heading>
            <Text color="slate.500" fontSize="sm" lineHeight="1.8" maxW="320px">
              Thank you for completing the DISC Behavioural Assessment.
              Your results have been recorded and the HR team will be in touch shortly.
            </Text>
          </VStack>

          <Badge
            bg="brand.50"
            color="brand.700"
            borderRadius="xl"
            px={4}
            py={2}
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.03em"
          >
            Results securely submitted ✓
          </Badge>

          <Button
            size="lg"
            bg="brand.600"
            color="white"
            fontWeight="700"
            w="full"
            onClick={() => navigate('/login')}
            _hover={{ bg: 'brand.700', boxShadow: 'brand-glow', transform: 'translateY(-1px)' }}
            _active={{ bg: 'brand.800' }}
            transition="all 0.15s"
          >
            Return to Home
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AssessmentCompletePage;
