/**
 * LandingPage — MindStats Design Guide (Light Professional)
 * ─────────────────────────────────────────────────────────────────────────────
 * Primary:  #003366 (navy) · Canvas: white · Feature: #E8F3ED (mint)
 * Buttons:  borderRadius="full" pill · Borders: #DADADA
 * Images:   borderRadius="24px" for hero / large assets
 * Typography: Montserrat headings · Inter body
 */

import React, { useEffect } from 'react';
import {
  Box, Button, Container, Flex, Grid,
  Heading, HStack, Icon, Image, Text, VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { MdPsychology, MdVerified, MdGroups } from 'react-icons/md';
import { useAppSelector } from '../app/hooks';

const MotionBox = motion(Box);
const EASE_OUT  = [0.0, 0.0, 0.2, 1] as [number, number, number, number];
const mkT = (delay = 0) => ({ duration: 0.3, ease: EASE_OUT, delay });

const NAVY = '#003366';
const MINT = '#E8F3ED';

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

const LandingPage: React.FC = () => {
  const navigate       = useNavigate();
  const prefersReduced = useReducedMotion();
  const { user, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (initialized && user) navigate('/dashboard', { replace: true });
  }, [initialized, user, navigate]);

  return (
    <Box bg="white" minH="100vh">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — white canvas · navy headline · pill CTAs
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="white" borderBottom="1px solid #DADADA">
        <Container maxW="1280px" px={{ base: 5, md: 10 }} py={{ base: 20, md: 28 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 12, lg: 20 }}>

            {/* ── Copy ── */}
            <MotionBox
              flex={1}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={mkT(0)}
            >
              {/* Mint pill badge */}
              <Box
                display="inline-flex" alignItems="center" gap={2}
                bg={MINT} px={4} py={1.5} mb={6} borderRadius="full"
              >
                <Box w={1.5} h={1.5} borderRadius="full" bg={NAVY} flexShrink={0} />
                <Text
                  fontSize="11px" fontWeight="700" letterSpacing="0.10em"
                  color={NAVY} textTransform="uppercase" fontFamily="heading"
                >
                  DISC Workplace Behavioural Assessment
                </Text>
              </Box>

              <Heading
                as="h1" fontFamily="heading"
                fontSize={{ base: '3xl', md: '42px', lg: '52px' }}
                fontWeight="800" color={NAVY}
                lineHeight="1.06" letterSpacing="-0.035em" mb={4}
              >
                DISC Workplace Behavior Assessment
              </Heading>

              <Text
                color={NAVY} fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="600" fontFamily="heading" lineHeight="1.4" mb={4}
              >
                A better self-awareness can create a happier workplace.
              </Text>

              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.8" maxW="460px" mb={8}>
                There are reasons why some are so aggressive at work, some are chill,
                some are slow, and some overthink everything. What are you? Find out
                with our workplace-focused DISC behavioural assessment.
              </Text>

              {/* Pill CTAs — Desing.md: borderRadius="full" */}
              <HStack spacing={3} flexWrap="wrap">
                <Button
                  as={RouterLink} to="/register" size="lg"
                  bg={NAVY} color="white" fontWeight="700" fontFamily="heading"
                  borderRadius="full" rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: '#002952', transform: 'translateY(-1px)' }}
                  _active={{ bg: '#002952', transform: 'translateY(0)' }}
                  transition="all 0.2s ease-out"
                >
                  Take a Free Assessment Now
                </Button>
                <Button
                  as={RouterLink} to="/pricing" size="lg" variant="outline"
                  color={NAVY} borderColor={NAVY}
                  borderRadius="full" fontWeight="600" fontFamily="heading"
                  _hover={{ bg: MINT }}
                  transition="all 0.2s ease-out"
                >
                  See Pricing
                </Button>
              </HStack>
            </MotionBox>

            {/* ── Hero image — borderRadius="24px" per Desing.md ── */}
            <MotionBox
              flex={1}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={mkT(0.08)}
              display={{ base: 'none', lg: 'block' }}
            >
              <Box position="relative" borderRadius="24px" overflow="hidden" boxShadow="0 4px 32px rgba(0,51,102,0.12)">
                <Image src="/12.jpg" alt="Professional at work" w="full" h="460px" objectFit="cover" />
                {/* Navy glass chip overlay */}
                <Box
                  position="absolute" bottom={5} left={5} right={5}
                  bg="rgba(0,51,102,0.88)" backdropFilter="blur(8px)"
                  px={4} py={3} borderRadius="xl"
                >
                  <HStack spacing={3}>
                    <Box bg="white" borderRadius="lg" p={2} flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                      <Icon as={MdPsychology} boxSize={5} color={NAVY} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" fontWeight="700" color="white" fontFamily="heading">Behavioural Match Engine</Text>
                      <Text fontSize="10px" color="whiteAlpha.700">DISC · Hiring Manager Profile</Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>
            </MotionBox>

          </Flex>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          BEHAVIOUR — Mint feature block (Desing.md: #E8F3ED)
          Cards: white · 1px #DADADA border · borderRadius="8px"
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg={MINT} py={{ base: 16, md: 24 }}>
        <Container maxW="1280px" px={{ base: 5, md: 10 }}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Box
              display="inline-flex" alignItems="center" gap={2}
              bg="white" border="1px solid #DADADA"
              px={4} py={1.5} borderRadius="full"
            >
              <Icon as={MdVerified} boxSize={3} color={NAVY} />
              <Text
                fontSize="11px" fontWeight="700" letterSpacing="0.10em"
                color={NAVY} textTransform="uppercase" fontFamily="heading"
              >
                The DISC Framework
              </Text>
            </Box>
            <Heading
              fontFamily="heading" fontSize={{ base: '2xl', md: '32px' }}
              fontWeight="800" color={NAVY} letterSpacing="-0.03em" lineHeight="1.15" maxW="560px"
            >
              Discover how you see yourself, how others perceive you, and your ideal professional image.
            </Heading>
            <Text color="gray.600" fontSize="md" maxW="480px" lineHeight="1.75">
              A workplace assessment that surfaces three distinct behavioural dimensions.
            </Text>
          </VStack>

          {/* Card grid — Desing.md: 1px #DADADA border, borderRadius="8px" */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {BEHAVIOUR_CARDS.map((card, i) => (
              <MotionBox
                key={card.title}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={mkT(i * 0.08)}
              >
                <Box
                  bg="white" border="1px solid #DADADA" borderRadius="lg"
                  overflow="hidden" h="full"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
                  transition="all 0.2s ease-out"
                >
                  <Box h="188px" overflow="hidden">
                    {/* Desing.md: illustrative images use borderRadius="24px" */}
                    <Image
                      src={card.src} alt={card.title}
                      w="full" h="full" objectFit="cover"
                      borderRadius="0"
                    />
                  </Box>
                  <Box px={5} pb={6} pt={4}>
                    <HStack spacing={2} mb={2}>
                      <Icon as={card.icon} boxSize={4} color={NAVY} flexShrink={0} />
                      <Heading size="sm" fontFamily="heading" fontWeight="700" color={NAVY}>
                        {card.title}
                      </Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" lineHeight="1.75">{card.description}</Text>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          RESEARCH — white · split layout · mint stat panel
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg="white" borderTop="1px solid #DADADA" borderBottom="1px solid #DADADA" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px" px={{ base: 5, md: 10 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 12, lg: 20 }}>

            <MotionBox
              flex={1} order={{ base: 2, lg: 1 }}
              initial={prefersReduced ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={mkT(0)}
            >
              {/* Desing.md: large images borderRadius="24px" */}
              <Box borderRadius="24px" overflow="hidden" border="1px solid #DADADA">
                <Image
                  src="/self-awareness-ai.jpg" alt="Self-awareness insight"
                  w="full" h={{ base: '260px', lg: '400px' }} objectFit="cover"
                />
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
                <Box
                  display="inline-flex" alignItems="center" gap={2}
                  bg={MINT} px={4} py={1.5} borderRadius="full"
                >
                  <Box w={1.5} h={1.5} borderRadius="full" bg={NAVY} flexShrink={0} />
                  <Text fontSize="11px" fontWeight="700" letterSpacing="0.10em" color={NAVY} textTransform="uppercase" fontFamily="heading">
                    Research-Backed
                  </Text>
                </Box>

                {/* Big stat — mint panel */}
                <Box
                  bg={MINT} px={6} py={5} borderRadius="xl"
                  w="full" maxW={{ base: '340px', lg: 'full' }}
                  alignSelf={{ base: 'center', lg: 'flex-start' }}
                >
                  <Text fontFamily="heading" fontSize={{ base: '4xl', md: '5xl' }} fontWeight="800" color={NAVY} letterSpacing="-0.04em" lineHeight="1">
                    85%
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt={1.5} fontWeight="500">
                    of individuals lack a true understanding of themselves
                  </Text>
                </Box>

                <Heading
                  fontFamily="heading" fontSize={{ base: '2xl', md: '28px' }}
                  fontWeight="800" color={NAVY} letterSpacing="-0.025em" lineHeight="1.25"
                >
                  Self-awareness gaps cost companies in{' '}
                  <Box as="span" color="teal.600">mis-hires</Box>{' '}
                  every quarter.
                </Heading>

                <Text color="gray.600" fontSize="md" lineHeight="1.8">
                  Boost your team's self-awareness in just 30 minutes per person. Our DISC
                  assessment surfaces the behavioural patterns that drive performance,
                  communication, and team dynamics.
                </Text>

                <Button
                  as={RouterLink} to="/register" size="lg"
                  bg={NAVY} color="white" fontWeight="700" fontFamily="heading"
                  borderRadius="full" rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: '#002952', transform: 'translateY(-1px)' }}
                  _active={{ bg: '#002952', transform: 'translateY(0)' }}
                  transition="all 0.2s ease-out"
                >
                  Start Assessing Your Team
                </Button>
              </VStack>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA — Navy bg (Desing.md: footer/CTA sections = #003366)
      ═══════════════════════════════════════════════════════════════════ */}
      <Box bg={NAVY} py={{ base: 16, md: 20 }}>
        <Container maxW="760px" px={{ base: 5, md: 8 }} textAlign="center">
          <MotionBox
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={mkT(0)}
          >
         

            <Heading
              fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800" color="white" letterSpacing="-0.025em" mb={3}
            >
              Ready to hire with behavioural intelligence?
            </Heading>
            <Text color="whiteAlpha.700" fontSize="md" mb={8}>Join forward-thinking teams already using Mindstat.</Text>

            <HStack justify="center" spacing={3} flexWrap="wrap">
              <Button
                as={RouterLink} to="/register" size="lg"
                bg="white" color={NAVY} fontWeight="700" fontFamily="heading"
                borderRadius="full" rightIcon={<ArrowForwardIcon />}
                _hover={{ bg: MINT, transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s ease-out"
              >
                Get Started Free
              </Button>
              <Button
                as={RouterLink} to="/about" size="lg" variant="outline"
                color="white" borderColor="rgba(255,255,255,0.40)"
                borderRadius="full" fontWeight="600" fontFamily="heading"
                _hover={{ bg: 'rgba(255,255,255,0.10)', borderColor: 'white' }}
                transition="all 0.2s ease-out"
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

