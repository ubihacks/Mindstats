/**
 * LandingPage — UI/UX Pro Max Skill Applied
 * ─────────────────────────────────────────────────────────────────────────────
 * Style ref : PocketOS.ai · Krisp.ai · Stripe · Vercel dark premium
 * Aesthetic : Deep dark layers · Razor-sharp 1px borders · Glassmorphism
 * Layout    : Hero-Centric + Bento Grid (behaviour cards)
 * Motion    : Framer Motion — duration: 0.2, cubic-bezier ease-out
 * Rules     : border="1px solid" borderColor="whiteAlpha.100"
 *             backdropFilter="blur(16px)" · borderRadius ≤ xl · no heavy shadows
 */

import React, { useEffect } from 'react';
import {
  Box, Button, Container, Divider, Flex, Grid,
  Heading, HStack, Icon, Image,
  SimpleGrid, Text, VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  MdTrendingUp, MdInsights, MdWorkspaces, MdPsychology,
  MdVerified, MdGroups,
} from 'react-icons/md';
import { useAppSelector } from '../app/hooks';

// ── Motion primitives ─────────────────────────────────────────────────────────
const MotionBox  = motion(Box);
const MotionFlex = motion(Flex);

// ── Skill §1-C: duration 0.2s ease-out — cubic-bezier array (TS-safe) ────────
const EASE_OUT = [0.0, 0.0, 0.2, 1] as [number, number, number, number];
const mkT = (delay = 0) => ({ duration: 0.2, ease: EASE_OUT, delay });

// ── Skill §1-A: Glassmorphic card token ──────────────────────────────────────
// "Razor-sharp 1px borders with low-opacity white to create depth"
const GLASS = {
  bg:                   'rgba(10, 10, 10, 0.70)',
  backdropFilter:       'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border:               '1px solid',
  borderColor:          'whiteAlpha.100',
  borderRadius:         'xl',          // rule: never exceed xl
} as const;

// ── Data ──────────────────────────────────────────────────────────────────────

const BEHAVIOUR_CARDS = [
  {
    title:       'Public Behaviour',
    description: 'How individuals behave, communicate, and engage with others in social interactions — particularly with strangers or the general public.',
    src:         '/public-behaviour.jpg',
    icon:        MdGroups,
  },
  {
    title:       'Private Behaviour',
    description: 'How individuals act in intimate or personal settings, in the presence of familiar people, or when alone — their true baseline.',
    src:         '/private-behaviour.jpg',
    icon:        MdPsychology,
  },
  {
    title:       'Perceived Behaviour',
    description: "How an individual's behaviour is viewed by others, based on observations, interactions, and the impressions they leave behind.",
    src:         '/perceived-behaviour.jpg',
    icon:        MdVerified,
  },
];

const STATS = [
  { value: '85%', label: 'lack true self-awareness',        icon: MdInsights   },
  { value: '3×',  label: 'lower mis-hire with DISC hiring', icon: MdTrendingUp },
  { value: '28',  label: 'force-choice questions',          icon: MdWorkspaces },
];

// ── Component ─────────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const navigate       = useNavigate();
  const prefersReduced = useReducedMotion();
  const { user, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (initialized && user) navigate('/dashboard', { replace: true });
  }, [initialized, user, navigate]);

  return (
    /* Skill §1-A: primary bg = #0A0A0A — deepest dark layer */
    <Box bg="#0A0A0A" minH="100vh">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — dark bg · glassmorphic badge · gradient headline
          Skill: deep dark + 1px border depth + Vercel-style white CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        position="relative" overflow="hidden"
        bg="#080808"
        borderBottom="1px solid" borderColor="whiteAlpha.60"
      >
        {/* Ambient radial glow (NOT a drop shadow) */}
        <Box
          position="absolute" top="-200px" right="-150px"
          w="600px" h="600px" borderRadius="full"
          bg="brand.600" opacity={0.06} filter="blur(120px)"
          pointerEvents="none"
        />
        <Box
          position="absolute" bottom="-80px" left="-80px"
          w="380px" h="380px" borderRadius="full"
          bg="teal.500" opacity={0.05} filter="blur(100px)"
          pointerEvents="none"
        />

        <Container maxW="1280px" px={{ base: 5, md: 10 }} py={{ base: 20, md: 28 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 14, lg: 20 }}>

            {/* ── Copy ─────────────────────────────────────────── */}
            <MotionBox
              flex={1}
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={mkT(0)}
            >
              {/* Glassmorphic pill badge */}
              <Box
                display="inline-flex" alignItems="center" gap={2}
                {...GLASS} px={4} py={1.5} mb={7} borderRadius="full"
              >
                <Box w={1.5} h={1.5} borderRadius="full" bg="teal.400" flexShrink={0} />
                <Text
                  fontSize="11px" fontWeight="700" letterSpacing="0.10em"
                  color="whiteAlpha.800" textTransform="uppercase" fontFamily="heading"
                >
                  DISC Workplace Behavioural Assessment
                </Text>
              </Box>

              <Heading
                as="h1" fontFamily="heading"
                fontSize={{ base: '3xl', md: '42px', lg: '52px' }}
                fontWeight="800" color="white"
                lineHeight="1.06" letterSpacing="-0.035em" mb={4}
              >
               DISC Workplace Behavior Assessment
              </Heading>

              <Text
                color="gray.200" fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="600" fontFamily="heading" lineHeight="1.4" mb={5}
              >
                A better self-awareness can create a happier workplace.
              </Text>

              {/* Skill §1-A: muted secondary = gray.400 */}
              <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.8" maxW="460px" mb={10}>
                There are reasons why some are so aggressive at work, some are chill,
                some are slow, and some overthink everything. What are you? Find out
                with our workplace-focused DISC behavioural assessment.
              </Text>

              {/* Vercel-style CTAs: white primary / glass ghost */}
              <HStack spacing={3} flexWrap="wrap">
                <Button
                  as={RouterLink} to="/register" size="lg"
                  bg="white" color="gray.900" fontWeight="700" fontFamily="heading"
                  borderRadius="xl" rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
                  _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
                  transition="all 0.2s ease-out" h="48px" px={7}
                >
                  Take a Free Assessment Now
                </Button>
                <Button
                  as={RouterLink} to="/pricing" size="lg" variant="outline"
                  color="whiteAlpha.700" borderColor="whiteAlpha.200"
                  borderRadius="xl" fontWeight="600" fontFamily="heading"
                  _hover={{ bg: 'whiteAlpha.50', borderColor: 'whiteAlpha.400', color: 'white' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  transition="all 0.2s ease-out" h="48px" px={7}
                >
                  See Pricing
                </Button>
              </HStack>
            </MotionBox>

            {/* ── Hero image — glassmorphic 1px frame ─────────── */}
            <MotionBox
              flex={1}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={mkT(0.08)}
              display={{ base: 'none', lg: 'block' }}
            >
              <Box position="relative" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100">
                <Image src="/12.jpg" alt="Professional at work" w="full" h="460px" objectFit="cover" filter="brightness(0.85)" />
                <Box position="absolute" bottom={4} left={4} right={4} {...GLASS} px={4} py={3}>
                  <HStack spacing={3}>
                    <Box bg="brand.600" borderRadius="lg" p={2} flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                      <Icon as={MdPsychology} boxSize={5} color="white" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" fontWeight="700" color="white" fontFamily="heading">Behavioural Match Engine</Text>
                      <Text fontSize="10px" color="gray.400">DISC · Hiring Manager Profile</Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>
            </MotionBox>

          </Flex>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS ROW — #0f0f0f · glass icon tiles · no heavy shadow
          Skill §1-A: secondary card bg = #121212 area
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="#0f0f0f" borderBottom="1px solid" borderColor="whiteAlpha.60" py={10}>
        <Container maxW="1280px" px={{ base: 5, md: 10 }}>
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={0}>
            {STATS.map((s, i) => (
              <MotionFlex
                key={s.label}
                align="center" gap={4} justify="center"
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={mkT(i * 0.06)}
                px={8} py={4}
                borderRight={i < STATS.length - 1 ? { sm: '1px solid' } : undefined}
                borderColor="whiteAlpha.80"
              >
                <Box {...GLASS} p={3} flexShrink={0} borderRadius="lg">
                  <Icon as={s.icon} boxSize={5} color="brand.400" />
                </Box>
                <Box>
                  <Text fontFamily="heading" fontSize="2xl" fontWeight="800" color="white" letterSpacing="-0.04em" lineHeight="1">
                    {s.value}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1} fontWeight="500">{s.label}</Text>
                </Box>
              </MotionFlex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          BEHAVIOUR — Bento Grid (Skill §1-B)
          spacing={6} · glass cards · border-color illumination on hover
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="#080808" py={{ base: 20, md: 28 }}>
        <Container maxW="1280px" px={{ base: 5, md: 10 }}>
          <VStack spacing={3} mb={14} textAlign="center">
            <Box display="inline-flex" alignItems="center" gap={2} {...GLASS} px={4} py={1.5} borderRadius="full">
              <Icon as={MdVerified} boxSize={3} color="teal.400" />
              <Text fontSize="11px" fontWeight="700" letterSpacing="0.10em" color="whiteAlpha.800" textTransform="uppercase" fontFamily="heading">
                The DISC Framework
              </Text>
            </Box>
            <Heading fontFamily="heading" fontSize={{ base: '2xl', md: '32px' }} fontWeight="800" color="white" letterSpacing="-0.03em" lineHeight="1.15" maxW="560px">
              Discover how you see yourself, how others perceive you, and your ideal professional image.
            </Heading>
            <Text color="gray.400" fontSize="md" maxW="480px" lineHeight="1.75">
              A workplace assessment that surfaces three distinct behavioural dimensions.
            </Text>
          </VStack>

          {/* Bento Grid — §1-B: gap={6}, hover border illumination */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {BEHAVIOUR_CARDS.map((card, i) => (
              <MotionBox
                key={card.title}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={mkT(i * 0.06)}
              >
                <Box
                  {...GLASS} overflow="hidden" h="full" cursor="default" role="group"
                  _hover={{ borderColor: 'whiteAlpha.200', bg: 'rgba(20,20,20,0.80)', transform: 'translateY(-3px)' }}
                  transition="all 0.2s ease-out"
                >
                  <Box overflow="hidden" h="188px" borderRadius="lg" m={3}>
                    <Image
                      src={card.src} alt={card.title} w="full" h="full" objectFit="cover"
                      filter="brightness(0.80)"
                      transition="transform 0.3s ease-out"
                      _groupHover={{ transform: 'scale(1.03)', filter: 'brightness(0.90)' }}
                    />
                  </Box>
                  <Box px={5} pb={6} pt={2}>
                    <HStack spacing={2} mb={2.5}>
                      <Icon as={card.icon} boxSize={4} color="brand.400" flexShrink={0} />
                      <Heading size="sm" fontFamily="heading" fontWeight="700" color="white">{card.title}</Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" lineHeight="1.75">{card.description}</Text>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          RESEARCH — split layout · glass stat panel · teal badge
          Skill: 1px border, gray.400 body, teal accent
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="#0f0f0f" borderTop="1px solid" borderBottom="1px solid" borderColor="whiteAlpha.60" py={{ base: 20, md: 28 }}>
        <Container maxW="1280px" px={{ base: 5, md: 10 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 12, lg: 20 }}>

            <MotionBox
              flex={1} order={{ base: 2, lg: 1 }}
              initial={prefersReduced ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={mkT(0)}
            >
              <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100">
                <Image src="/self-awareness-ai.jpg" alt="Self-awareness insight" w="full" h={{ base: '260px', lg: '400px' }} objectFit="cover" filter="brightness(0.80)" />
              </Box>
            </MotionBox>

            <MotionBox
              flex={1} order={{ base: 1, lg: 2 }}
              initial={prefersReduced ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={mkT(0)}
            >
              <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={5} textAlign={{ base: 'center', lg: 'left' }}>
                <Box display="inline-flex" alignItems="center" gap={2} {...GLASS} px={4} py={1.5} borderRadius="full">
                  <Box w={1.5} h={1.5} borderRadius="full" bg="teal.400" flexShrink={0} />
                  <Text fontSize="11px" fontWeight="700" letterSpacing="0.10em" color="whiteAlpha.800" textTransform="uppercase" fontFamily="heading">
                    Research-Backed
                  </Text>
                </Box>

                <Box {...GLASS} px={6} py={5} w="full" maxW={{ base: '340px', lg: 'full' }} alignSelf={{ base: 'center', lg: 'flex-start' }}>
                  <Text fontFamily="heading" fontSize={{ base: '4xl', md: '5xl' }} fontWeight="800" color="white" letterSpacing="-0.04em" lineHeight="1">
                    85%
                  </Text>
                  <Text fontSize="sm" color="gray.400" mt={1.5} fontWeight="500">of individuals lack a true understanding of themselves</Text>
                </Box>

                <Heading fontFamily="heading" fontSize={{ base: '2xl', md: '28px' }} fontWeight="800" color="white" letterSpacing="-0.025em" lineHeight="1.25">
                  Self-awareness gaps cost companies in{' '}
                  <Box as="span" color="brand.400">mis-hires</Box>{' '}
                  every quarter.
                </Heading>

                <Text color="gray.400" fontSize="md" lineHeight="1.8">
                  Boost your team's self-awareness in just 30 minutes per person. Our DISC assessment
                  surfaces the behavioural patterns that drive performance, communication, and team dynamics.
                </Text>

                <Divider borderColor="whiteAlpha.100" />

                <Button
                  as={RouterLink} to="/register" size="lg"
                  bg="white" color="gray.900" fontWeight="700" fontFamily="heading"
                  borderRadius="xl" rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
                  _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
                  transition="all 0.2s ease-out" h="48px" px={7}
                >
                  Start Assessing Your Team
                </Button>
              </VStack>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA — darkest section · glass testimonial · dual CTA
          Skill: primary dark bg + glassmorphic card
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="#080808" py={{ base: 20, md: 24 }} position="relative" overflow="hidden">
        <Box position="absolute" bottom="-100px" right="20%" w="500px" h="300px" borderRadius="full" bg="brand.600" opacity={0.05} filter="blur(100px)" pointerEvents="none" />

        <Container maxW="760px" px={{ base: 5, md: 8 }} textAlign="center" position="relative">
          <MotionBox
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={mkT(0)}
          >
            <Box {...GLASS} px={{ base: 6, md: 10 }} py={8} mb={10}>
              <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }} fontStyle="italic" lineHeight="1.85" mb={7}>
                "Mindstat gave us behavioural clarity we never had before.
                Our mis-hire rate dropped significantly in the first quarter of using it."
              </Text>
              <HStack justify="center" spacing={3}>
                <Box w={9} h={9} bg="brand.600" borderRadius="full" flexShrink={0} display="flex" alignItems="center" justifyContent="center" border="1px solid" borderColor="whiteAlpha.200">
                  <Text fontSize="10px" fontWeight="800" color="white" fontFamily="heading">SR</Text>
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="700" color="white" fontFamily="heading">Sarah R.</Text>
                  <Text fontSize="xs" color="gray.500">Head of Talent Acquisition</Text>
                </VStack>
              </HStack>
            </Box>

            <Heading fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="white" letterSpacing="-0.025em" mb={3}>
              Ready to hire with behavioural intelligence?
            </Heading>
            <Text color="gray.400" fontSize="md" mb={8}>Join forward-thinking teams already using Mindstat.</Text>

            <HStack justify="center" spacing={3} flexWrap="wrap">
              <Button
                as={RouterLink} to="/register" size="lg"
                bg="white" color="gray.900" fontWeight="700" fontFamily="heading"
                borderRadius="xl" rightIcon={<ArrowForwardIcon />}
                _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
                _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
                transition="all 0.2s ease-out" h="48px" px={7}
              >
                Get Started Free
              </Button>
              <Button
                as={RouterLink} to="/about" size="lg" variant="outline"
                color="whiteAlpha.700" borderColor="whiteAlpha.200"
                borderRadius="xl" fontWeight="600" fontFamily="heading"
                _hover={{ bg: 'whiteAlpha.50', borderColor: 'whiteAlpha.400', color: 'white' }}
                _active={{ bg: 'whiteAlpha.100' }}
                transition="all 0.2s ease-out" h="48px" px={7}
              >
                Learn More
              </Button>
            </HStack>
          </MotionBox>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;
