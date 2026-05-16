import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon, Link as ChakraLink,
  InputGroup, InputRightElement, IconButton, HStack, Flex, Icon,
  List, ListItem, ListIcon, Image,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loginUser } from '../authSlice';
import { isCompanyEmail } from '../authSlice';
import { ViewIcon, ViewOffIcon, CheckCircleIcon } from '@chakra-ui/icons';


const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(isCompanyEmail, 'Only professional company email addresses are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const FEATURES = [
  'Match candidates to hiring manager behavioural profiles',
  'Gatekeeper workflow — HM must complete before candidates',
  '28-question DISC behavioural intelligence engine',
  'Credit-based pricing with 2-week link expiry refunds',
];

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user, initialized } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Already logged in — go straight to dashboard
  React.useEffect(() => {
    if (initialized && user) navigate('/dashboard', { replace: true });
  }, [initialized, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <Flex minH="100vh">
      {/* ── Left: Brand Panel ── */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flexDirection="column"
        justifyContent="space-between"
        w="45%"
        bg="slate.900"
        p={14}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="brand.700"
          opacity={0.15}
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="-60px"
          w="240px"
          h="240px"
          borderRadius="full"
          bg="teal.600"
          opacity={0.1}
          filter="blur(50px)"
        />

        {/* Logo */}
        <HStack spacing={3} zIndex={1}>
          <Image src="/mindstat-favicon.svg" h="36px" w="36px" alt="Mindstat icon" />
          <VStack align="start" spacing={0}>
            <Image src="/mindstats-logo.svg" h="26px" filter="brightness(0) invert(1)" alt="Mindstat" />
            <Text fontSize="xs" color="whiteAlpha.500">Behavioural Intelligence</Text>
          </VStack>
        </HStack>


      </Box>

      {/* ── Right: Login Form ── */}
      <Flex
        flex={1}
        bg="white"
        align="center"
        justify="center"
        px={{ base: 6, md: 16 }}
        py={12}
      >
        <Box w="full" maxW="400px">
          {/* Mobile logo */}
          <HStack spacing={2} mb={10} display={{ base: 'flex', lg: 'none' }}>
            <Image src="/mindstat-favicon.svg" h="30px" w="30px" alt="Mindstat icon" />
            <Image src="/mindstats-logo.svg" h="22px" alt="Mindstat" />
          </HStack>

          <VStack spacing={8} align="stretch">
            <VStack align="start" spacing={1}>
              <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                Welcome back
              </Heading>
              <Text color="slate.500" fontSize="sm">
                Sign in to your workspace to continue
              </Text>
            </VStack>

            {error && (
              <Alert status="error" borderRadius="xl" fontSize="sm">
                <AlertIcon />
                {error}
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
                  />
                  <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                <Button
                  type="submit"
                  bg="brand.600"
                  color="white"
                  size="lg"
                  w="full"
                  isLoading={status === 'loading'}
                  loadingText="Signing in…"
                  fontWeight="700"
                  _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
                  _active={{ bg: 'brand.800', transform: 'translateY(0)' }}
                  _focusVisible={{ boxShadow: '0 0 0 3px rgba(79,70,229,0.35)' }}
                  transition="all 0.15s"
                  mt={1}
                >
                  Sign In
                </Button>

                <ChakraLink
                  as={RouterLink}
                  to="/forgot-password"
                  fontSize="sm"
                  color="slate.500"
                  textAlign="center"
                  display="block"
                  _hover={{ color: 'brand.600', textDecoration: 'none' }}
                >
                  Forgot password?
                </ChakraLink>
              </VStack>
            </form>

            <HStack justify="center" spacing={1}>
              <Text fontSize="sm" color="slate.500">Don't have an account?</Text>
              <ChakraLink
                as={RouterLink}
                to="/register"
                color="brand.600"
                fontWeight="600"
                fontSize="sm"
                _hover={{ color: 'brand.700', textDecoration: 'none' }}
              >
                Create workspace →
              </ChakraLink>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
