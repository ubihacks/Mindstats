import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon, HStack,
  Flex, Image, Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../../lib/supabaseClient';
import { isCompanyEmail } from '../authSlice';
import { ArrowBackIcon, EmailIcon } from '@chakra-ui/icons';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(isCompanyEmail, 'Only professional company email addresses are allowed'),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="slate.50" px={4}>
      <Box
        w="full"
        maxW="420px"
        bg="white"
        borderRadius="2xl"
        boxShadow="card"
        p={{ base: 8, md: 10 }}
        border="1px solid"
        borderColor="slate.100"
      >
        {/* Logo */}
        <HStack spacing={2} mb={8}>
          <Image src="/mindstat-favicon.svg" h="28px" w="28px" alt="Mindstat" />
          <Image src="/mindstats-logo.svg" h="20px" alt="Mindstat" />
        </HStack>

        {sent ? (
          <VStack spacing={5} align="start">
            <Box bg="green.50" borderRadius="xl" p={4} w="full" border="1px solid" borderColor="green.100">
              <HStack spacing={3} mb={2}>
                <EmailIcon color="green.500" boxSize={5} />
                <Text fontWeight="700" color="green.700" fontSize="sm">Check your email</Text>
              </HStack>
              <Text fontSize="sm" color="green.700">
                We sent a reset link to <strong>{getValues('email')}</strong>. Click the link in the email to set a new password. The link expires in 1 hour.
              </Text>
            </Box>
            <Text fontSize="xs" color="slate.400">
              Didn't receive it? Check your spam folder or try again.
            </Text>
            <Button
              variant="ghost"
              size="sm"
              color="brand.600"
              leftIcon={<ArrowBackIcon />}
              as={RouterLink}
              to="/login"
              _hover={{ bg: 'brand.50' }}
              fontWeight="600"
            >
              Back to sign in
            </Button>
          </VStack>
        ) : (
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={1}>
              <Heading size="md" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                Reset your password
              </Heading>
              <Text fontSize="sm" color="slate.500">
                Enter your work email and we'll send a reset link.
              </Text>
            </VStack>

            {serverError && (
              <Alert status="error" borderRadius="xl" fontSize="sm">
                <AlertIcon />
                {serverError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                    Company Email
                  </FormLabel>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.com"
                    size="lg"
                    bg="slate.50"
                    border="1.5px solid"
                    borderColor="slate.200"
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' }}
                  />
                  <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.600"
                  color="white"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Sending…"
                  fontWeight="700"
                  _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
                  _active={{ bg: 'brand.800', transform: 'translateY(0)' }}
                  transition="all 0.15s"
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>

            <HStack justify="center">
              <ChakraLink
                as={RouterLink}
                to="/login"
                fontSize="sm"
                color="slate.500"
                fontWeight="500"
                _hover={{ color: 'brand.600', textDecoration: 'none' }}
              >
                ← Back to sign in
              </ChakraLink>
            </HStack>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default ForgotPasswordPage;
