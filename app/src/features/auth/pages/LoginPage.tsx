/**
 * LoginPage — Desing.md · Light Professional
 * ─────────────────────────────────────────────────────────────────────────────
 * Left:  Deep navy #001e40 brand panel · logo · tagline · features · testimonial
 * Right: White canvas · #f3f3f4 filled inputs · navy pill submit button
 */
import React, { useState } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel, FormErrorMessage,
  Heading, HStack, Icon, IconButton, Image, Input, InputGroup,
  InputRightElement, Link as ChakraLink, Text, VStack, Alert, AlertIcon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { MdCheckCircle } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loginUser, isCompanyEmail } from '../authSlice';

/* ── Design tokens (Desing.md + DESIGN.md) ───────────────────────────────── */
const NAVY  = '#001e40';  // DESIGN.md primary
const TEAL  = 'teal.300';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(isCompanyEmail, 'Only professional company email addresses are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const FEATURES = [
  'Match candidates to hiring manager DISC profiles',
  'Gatekeeper workflow — HM completes first, always',
  '28-question behavioural intelligence engine',
  'Credit-based pricing with automatic link-expiry refunds',
];

/* ══════════════════════════════════════════════════════════════════════════ */

const LoginPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { status, error, user, initialized } = useAppSelector((s) => s.auth);

  React.useEffect(() => {
    if (initialized && user) navigate('/dashboard', { replace: true });
  }, [initialized, user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard', { replace: true });
  };

  return (
    <Flex minH="100vh">

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — deep navy, full brand presence
      ═══════════════════════════════════════════════════════════════════ */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        flexDirection="column"
        justifyContent="space-between"
        w="46%"
        bg={NAVY}
        p={14}
        position="relative"
        overflow="hidden"
      >
        {/* Subtle teal glow — decorative */}
        <Box
          position="absolute" bottom="-80px" right="-60px"
          w="380px" h="380px" borderRadius="full"
          bg="teal.400" opacity={0.07} filter="blur(90px)"
          pointerEvents="none"
        />
        <Box
          position="absolute" top="-40px" left="-40px"
          w="220px" h="220px" borderRadius="full"
          bg="blue.400" opacity={0.06} filter="blur(60px)"
          pointerEvents="none"
        />

        {/* ── Logo ── */}
        <Image
          src="/mindstats-logo.svg"
          h="24px"
          filter="brightness(0) invert(1)"
          alt="Mindstat"
          zIndex={1}
        />

        {/* ── Hero copy + feature list ── */}
        <VStack align="start" spacing={9} zIndex={1}>
          <Box>
            <Text
              fontSize="10px" fontWeight="700" letterSpacing="0.14em"
              textTransform="uppercase" color={TEAL} mb={4}
            >
              Behavioural Intelligence Platform
            </Text>
            <Heading
              fontFamily="heading"
              fontSize={{ lg: '30px', xl: '36px' }}
              fontWeight="800"
              color="white"
              lineHeight="1.14"
              letterSpacing="-0.03em"
            >
              Hire beyond the résumé.{' '}
              <Box as="span" color={TEAL}>Match on behaviour.</Box>
            </Heading>
          </Box>

          <VStack align="start" spacing={3.5}>
            {FEATURES.map((f) => (
              <HStack key={f} spacing={3} align="start">
                <Icon as={MdCheckCircle} color={TEAL} boxSize={4} mt={0.5} flexShrink={0} />
                <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.65">{f}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>

        {/* ── Testimonial ── */}
        <Box
          bg="rgba(255,255,255,0.07)"
          border="1px solid rgba(255,255,255,0.11)"
          borderRadius="xl"
          px={5} py={4}
          zIndex={1}
        >
          <Text
            fontSize="sm" color="whiteAlpha.800"
            fontStyle="italic" lineHeight="1.75" mb={4}
          >
            "Mindstat helped us cut mis-hires by surfacing behavioural patterns
            no résumé could ever reveal."
          </Text>
          <HStack spacing={2.5}>
            <Box
              w={8} h={8} bg="teal.400" borderRadius="full"
              display="flex" alignItems="center" justifyContent="center" flexShrink={0}
            >
              <Text fontSize="10px" fontWeight="800" color="white">SR</Text>
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" fontWeight="700" color="white">Sarah R.</Text>
              <Text fontSize="10px" color="whiteAlpha.500">Head of Talent Acquisition</Text>
            </VStack>
          </HStack>
        </Box>
      </Flex>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT PANEL — white canvas, clean form
      ═══════════════════════════════════════════════════════════════════ */}
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
          <Box mb={10} display={{ base: 'block', lg: 'none' }}>
            <Image src="/mindstats-logo.svg" h="22px" alt="Mindstat" />
          </Box>

          <VStack spacing={8} align="stretch">

            {/* Heading */}
            <VStack align="start" spacing={1}>
              <Heading
                size="lg" fontWeight="800" fontFamily="heading"
                color="gray.900" letterSpacing="-0.03em"
              >
                Welcome back
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Sign in to your workspace to continue
              </Text>
            </VStack>

            {/* Error banner */}
            {error && (
              <Alert status="error" borderRadius="xl" fontSize="sm">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5}>

                {/* Email */}
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="600" fontSize="sm" color="gray.700" mb={1.5}>
                    Company Email
                  </FormLabel>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.com"
                    size="lg"
                    bg="#f3f3f4"
                    border="1.5px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ bg: 'white', borderColor: NAVY, boxShadow: `0 0 0 1px ${NAVY}` }}
                    _placeholder={{ color: 'gray.400' }}
                    transition="all 0.15s"
                  />
                  <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                </FormControl>

                {/* Password */}
                <FormControl isInvalid={!!errors.password}>
                  {/* Label row with inline forgot-password link */}
                  <Flex justify="space-between" align="center" mb={1.5}>
                    <FormLabel fontWeight="600" fontSize="sm" color="gray.700" mb={0}>
                      Password
                    </FormLabel>
                    <ChakraLink
                      as={RouterLink} to="/forgot-password"
                      fontSize="xs" color="gray.500"
                      _hover={{ color: 'brand.600', textDecoration: 'none' }}
                    >
                      Forgot password?
                    </ChakraLink>
                  </Flex>
                  <InputGroup size="lg">
                    <Input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      bg="#f3f3f4"
                      border="1.5px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ bg: 'white', borderColor: NAVY, boxShadow: `0 0 0 1px ${NAVY}` }}
                      _placeholder={{ color: 'gray.400' }}
                      transition="all 0.15s"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        icon={showPw ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        onClick={() => setShowPw((v) => !v)}
                        _hover={{ color: 'gray.700', bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                </FormControl>

                {/* Submit — navy pill */}
                <Button
                  type="submit"
                  bg={NAVY}
                  color="white"
                  size="lg"
                  w="full"
                  borderRadius="full"
                  isLoading={status === 'loading'}
                  loadingText="Signing in…"
                  fontWeight="700"
                  fontFamily="heading"
                  _hover={{ bg: '#002952', transform: 'translateY(-1px)' }}
                  _active={{ bg: '#001428', transform: 'translateY(0)' }}
                  transition="all 0.15s"
                  mt={1}
                >
                  Sign In
                </Button>

              </VStack>
            </form>

            {/* Register link */}
            <HStack justify="center" spacing={1}>
              <Text fontSize="sm" color="gray.500">Don't have an account?</Text>
              <ChakraLink
                as={RouterLink} to="/register"
                color="brand.600" fontWeight="600" fontSize="sm"
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

