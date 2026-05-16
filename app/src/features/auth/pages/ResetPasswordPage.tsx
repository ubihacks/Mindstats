import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon, HStack,
  Flex, Image, InputGroup, InputRightElement, IconButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../../lib/supabaseClient';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the user back with a hash fragment containing the access token.
  // We must wait for onAuthStateChange to fire PASSWORD_RECOVERY before allowing the form.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
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

        {done ? (
          <Alert status="success" borderRadius="xl" flexDirection="column" textAlign="center" py={6}>
            <AlertIcon boxSize={8} mb={2} />
            <Text fontWeight="700" color="green.700">Password updated!</Text>
            <Text fontSize="sm" color="green.600" mt={1}>Redirecting you to sign in…</Text>
          </Alert>
        ) : !sessionReady ? (
          <VStack spacing={4} align="start">
            <Alert status="warning" borderRadius="xl" fontSize="sm">
              <AlertIcon />
              Waiting for reset link to be verified. If you arrived here directly, please request a new reset link.
            </Alert>
            <ChakraLink
              as={RouterLink}
              to="/forgot-password"
              fontSize="sm"
              color="brand.600"
              fontWeight="600"
              _hover={{ textDecoration: 'none' }}
            >
              Request a new reset link →
            </ChakraLink>
          </VStack>
        ) : (
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={1}>
              <Heading size="md" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                Set new password
              </Heading>
              <Text fontSize="sm" color="slate.500">
                Choose a strong password for your account.
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
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                    New Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide' : 'Show'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        size="sm"
                        color="slate.400"
                        onClick={() => setShowPassword((v) => !v)}
                        _hover={{ color: 'slate.700' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirm}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                    Confirm Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('confirm')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirm ? 'Hide' : 'Show'}
                        icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        size="sm"
                        color="slate.400"
                        onClick={() => setShowConfirm((v) => !v)}
                        _hover={{ color: 'slate.700' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.confirm?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.600"
                  color="white"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Updating…"
                  fontWeight="700"
                  _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
                  _active={{ bg: 'brand.800', transform: 'translateY(0)' }}
                  transition="all 0.15s"
                >
                  Update Password
                </Button>
              </VStack>
            </form>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default ResetPasswordPage;
