import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon,
  Link as ChakraLink, InputGroup, InputRightElement, IconButton,
  HStack, Flex, SimpleGrid, Icon, Badge, Image,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { registerUser, isCompanyEmail } from '../authSlice';
import { ViewIcon, ViewOffIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { MdEmail } from 'react-icons/md';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(isCompanyEmail, 'Only professional company email addresses are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Company name is required'),
  companyWebsite: z.string().url('Enter a valid URL (e.g. https://company.com)'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user, initialized } = useAppSelector((s) => s.auth);
  const [showPwd, setShowPwd] = useState(false);
  const [registered, setRegistered] = useState(false);

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
    const result = await dispatch(
      registerUser({
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
      })
    );
    if (registerUser.fulfilled.match(result)) {
      setRegistered(true);
    }
  };

  if (registered) {
    return (
      <Flex minH="100vh" bg="slate.50" align="center" justify="center" px={4}>
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="card"
          p={12}
          w="full"
          maxW="460px"
          border="1px solid"
          borderColor="slate.100"
          textAlign="center"
        >
          <VStack spacing={5}>
            <Box
              w={14} h={14} bg="green.50" borderRadius="full"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdEmail} color="green.500" boxSize={7} />
            </Box>
            <VStack spacing={2}>
              <Heading size="md" color="slate.900" letterSpacing="-0.03em">
                Check your inbox
              </Heading>
              <Text color="slate.500" fontSize="sm" lineHeight="1.7" maxW="300px">
                We've sent a verification link to your email.
                Please verify before signing in.
              </Text>
            </VStack>
            <Badge colorScheme="green" borderRadius="full" px={4} py={1} fontSize="xs">
              10 free credits waiting for you
            </Badge>
            <ChakraLink
              as={RouterLink}
              to="/login"
              color="brand.600"
              fontWeight="600"
              fontSize="sm"
              _hover={{ color: 'brand.700', textDecoration: 'none' }}
            >
              ← Back to Sign In
            </ChakraLink>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh">
      {/* ── Left: Brand Panel ── */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flexDirection="column"
        justifyContent="center"
        w="40%"
        bg="slate.900"
        p={14}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="brand.600"
          opacity={0.12}
          filter="blur(60px)"
        />

        <HStack spacing={3} mb={12}>
          <Image src="/mindstat-favicon.svg" h="36px" w="36px" alt="Mindstat icon" />
          <Image src="/mindstats-logo.svg" h="26px" filter="brightness(0) invert(1)" alt="Mindstat" />
        </HStack>

        <VStack align="start" spacing={6}>
          <VStack align="start" spacing={3}>
            <Badge bg="brand.900" color="brand.300" borderRadius="full" px={4} py={1} fontSize="xs" fontWeight="700">
              Start free — 10 credits on signup
            </Badge>
            <Heading
              size="xl"
              color="white"
              letterSpacing="-0.04em"
              fontWeight="800"
              lineHeight="1.15"
            >
              Your workspace,<br />
              <Box as="span" color="brand.400">up in minutes.</Box>
            </Heading>
            <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8" maxW="360px">
              Create your company workspace, invite your team, and start making
              behavioural-informed hiring decisions today.
            </Text>
          </VStack>

          <VStack align="start" spacing={3}>
            {[
              { title: 'Company workspace', desc: 'All users under your domain, one shared credit pool' },
              { title: 'Role-based access', desc: 'Admin, HR, and Project Manager roles built-in' },
              { title: 'DISC assessments', desc: '28-question validated behavioural profiling' },
            ].map(({ title, desc }) => (
              <HStack key={title} spacing={3} align="flex-start">
                <Box
                  w={6} h={6} bg="brand.900" borderRadius="md" mt={0.5}
                  display="flex" alignItems="center" justifyContent="center"
                  flexShrink={0}
                >
                  <CheckCircleIcon color="brand.400" boxSize={3} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text color="white" fontSize="sm" fontWeight="600">{title}</Text>
                  <Text color="whiteAlpha.500" fontSize="xs">{desc}</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* ── Right: Register Form ── */}
      <Flex
        flex={1}
        bg="white"
        align="center"
        justify="center"
        px={{ base: 6, md: 12, lg: 16 }}
        py={12}
        overflowY="auto"
      >
        <Box w="full" maxW="460px">
          {/* Mobile logo */}
          <HStack spacing={2} mb={8} display={{ base: 'flex', lg: 'none' }}>
            <Image src="/mindstat-favicon.svg" h="30px" w="30px" alt="Mindstat icon" />
            <Image src="/mindstats-logo.svg" h="22px" alt="Mindstat" />
          </HStack>

          <VStack spacing={7} align="stretch">
            <VStack align="start" spacing={1}>
              <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                Create your workspace
              </Heading>
              <Text color="slate.500" fontSize="sm">
                Professional email addresses only — personal emails are blocked
              </Text>
            </VStack>

            {error && (
              <Alert status="error" borderRadius="xl" fontSize="sm">
                <AlertIcon />{error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                  <FormControl isInvalid={!!errors.companyName}>
                    <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                      Company Name
                    </FormLabel>
                    <Input
                      {...register('companyName')}
                      placeholder="Acme Corp"
                      size="lg"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                    />
                    <FormErrorMessage fontSize="xs">{errors.companyName?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.companyWebsite}>
                    <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                      Company Website
                    </FormLabel>
                    <Input
                      {...register('companyWebsite')}
                      placeholder="https://acme.com"
                      size="lg"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                    />
                    <FormErrorMessage fontSize="xs">{errors.companyWebsite?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

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

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                      Password
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        {...register('password')}
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••"
                        bg="slate.50"
                        border="1.5px solid"
                        borderColor="slate.200"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label="Toggle password"
                          icon={showPwd ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          color="slate.400"
                          onClick={() => setShowPwd((v) => !v)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                      Confirm Password
                    </FormLabel>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="••••••••"
                      size="lg"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                    />
                    <FormErrorMessage fontSize="xs">{errors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <Button
                  type="submit"
                  bg="brand.600"
                  color="white"
                  size="lg"
                  w="full"
                  isLoading={status === 'loading'}
                  loadingText="Creating workspace…"
                  fontWeight="700"
                  _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
                  _active={{ bg: 'brand.800', transform: 'translateY(0)' }}
                  _focusVisible={{ boxShadow: '0 0 0 3px rgba(79,70,229,0.35)' }}
                  transition="all 0.15s"
                  mt={1}
                >
                  Create Workspace — Free
                </Button>

                <Text fontSize="xs" color="slate.400" textAlign="center" lineHeight="1.6">
                  By signing up, you agree to our Terms of Service. Your first company user
                  receives 10 free trial credits.
                </Text>
              </VStack>
            </form>

            <HStack justify="center" spacing={1}>
              <Text fontSize="sm" color="slate.500">Already have an account?</Text>
              <ChakraLink
                as={RouterLink}
                to="/login"
                color="brand.600"
                fontWeight="600"
                fontSize="sm"
                _hover={{ color: 'brand.700', textDecoration: 'none' }}
              >
                Sign in →
              </ChakraLink>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default RegisterPage;
