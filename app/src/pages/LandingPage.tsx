import React, { useEffect } from 'react';
import {
  Box, Button, Container, Flex, Heading, HStack, Icon,
  Image, List, ListIcon, ListItem, SimpleGrid, Stack, Text,
  VStack, Badge,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  MdPeople, MdTrendingUp, MdLock, MdInsights, MdWorkspaces,
} from 'react-icons/md';
import { useAppSelector } from '../app/hooks';


const MotionBox  = motion(Box);
const MotionFlex = motion(Flex);

const FEATURES = [
  'Match candidates to hiring manager behavioural profiles',
  'Gatekeeper workflow — HM must complete before candidates',
  '28-question DISC behavioural intelligence engine',
  'Credit-based pricing with 2-week link expiry refunds',
];

const BEHAVIOUR_CARDS = [
  {
    title: 'Public Behaviour',
    description:
      "How individuals behave, communicate, and engage with others in social interactions — particularly with strangers or the general public.",
    src: '/public-behaviour.jpg',
  },
  {
    title: 'Private Behaviour',
    description:
      "How individuals act in intimate or personal settings, in the presence of familiar people, or when alone — their true baseline.",
    src: '/private-behaviour.jpg',
  },
  {
    title: 'Perceived Behaviour',
    description:
    "How an individual's behaviour is viewed by others, based on observations, interactions, and the impressions they leave behind.",
    src: '/perceived-behaviour.jpg',
  },
];

const STATS = [
  { value: '85%', label: 'of individuals lack true self-awareness', icon: MdInsights },
  { value: '3×',  label: 'lower mis-hire rate with DISC-matched hiring', icon: MdTrendingUp },
  { value: '28',  label: 'force-choice questions per assessment',  icon: MdWorkspaces },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAppSelector((s) => s.auth);

  // If already authenticated, send to dashboard
  useEffect(() => {
    if (initialized && user) navigate('/dashboard', { replace: true });
  }, [initialized, user, navigate]);

  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Box bg="brand.800" overflow="hidden" position="relative">
        {/* Decorative blobs */}
        <Box
          position="absolute" top="-120px" right="-120px"
          w="500px" h="500px" borderRadius="full"
          bg="teal.600" opacity={0.06} filter="blur(80px)"
        />
        <Box
          position="absolute" bottom="-80px" left="-80px"
          w="360px" h="360px" borderRadius="full"
          bg="brand.400" opacity={0.08} filter="blur(60px)"
        />

        <Container maxW="1280px" px={{ base: 5, md: 8 }} py={{ base: 16, md: 24 }}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            gap={{ base: 12, lg: 16 }}
          >
            {/* Left: copy */}
            <MotionBox
              flex={1}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                bg="teal.900"
                color="teal.300"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.08em"
                px={3} py={1}
                borderRadius="full"
                mb={5}
                textTransform="uppercase"
              >
                DISC Workplace Behavioural Assessment
              </Badge>

              <Heading
                as="h1"
                fontFamily="heading"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.1"
                letterSpacing="-0.03em"
                mb={5}
              >
                Hire beyond the résumé.{' '}
                <Box as="span" color="teal.300">
                  Understand behaviour.
                </Box>
              </Heading>

              <Text
                color="whiteAlpha.700"
                fontSize={{ base: 'md', md: 'lg' }}
                lineHeight="1.7"
                maxW="500px"
                mb={8}
              >
                The B2B platform that matches candidates to hiring managers using DISC
                behavioural intelligence — so you make decisions with confidence, not guesswork.
              </Text>

              <List spacing={3} mb={10}>
                {FEATURES.map((f) => (
                  <ListItem key={f} display="flex" alignItems="flex-start" gap={3}>
                    <ListIcon as={CheckCircleIcon} color="teal.400" mt={0.5} boxSize={4} />
                    <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">{f}</Text>
                  </ListItem>
                ))}
              </List>

              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  bg="teal.600"
                  color="white"
                  fontWeight="700"
                  borderRadius="md"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: 'teal.700', transform: 'translateY(-2px)', boxShadow: 'card-hover' }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.15s ease"
                >
                  Start Free Trial
                </Button>
                <Button
                  as={RouterLink}
                  to="/pricing"
                  size="lg"
                  variant="outline"
                  color="whiteAlpha.800"
                  borderColor="whiteAlpha.300"
                  borderRadius="md"
                  fontWeight="600"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'white', color: 'white' }}
                  transition="all 0.15s ease"
                >
                  See Pricing
                </Button>
              </HStack>
            </MotionBox>

            {/* Right: hero image */}
            <MotionBox
              flex={1}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              display={{ base: 'none', lg: 'block' }}
            >
              <Box
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="0 24px 64px rgba(0,0,0,0.4)"
                maxH="480px"
              >
                <Image
                  src="/12.jpg"
                  alt="Professional at work"
                  w="full"
                  h="480px"
                  objectFit="cover"
                />
              </Box>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <Box bg="brand.700" py={8}>
        <Container maxW="1280px" px={{ base: 5, md: 8 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {STATS.map((s, i) => (
              <MotionFlex
                key={s.label}
                align="center"
                gap={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Box bg="whiteAlpha.100" borderRadius="xl" p={3} flexShrink={0}>
                  <Icon as={s.icon} boxSize={6} color="teal.300" />
                </Box>
                <Box>
                  <Text
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="800"
                    color="white"
                    letterSpacing="-0.04em"
                    lineHeight="1"
                  >
                    {s.value}
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.600" mt={1}>{s.label}</Text>
                </Box>
              </MotionFlex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── Behaviour Cards ───────────────────────────────────── */}
      <Box bg="slate.50" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px" px={{ base: 5, md: 8 }}>
          <VStack spacing={4} mb={14} textAlign="center">
            <Badge
              bg="brand.50"
              color="brand.700"
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.08em"
              px={3} py={1}
              borderRadius="full"
              textTransform="uppercase"
            >
              The DISC Framework
            </Badge>
            <Heading
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="700"
              color="slate.800"
              letterSpacing="-0.025em"
              maxW="640px"
            >
              Discover how you see yourself, how others perceive you, and your
              ideal professional image.
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {BEHAVIOUR_CARDS.map((card, i) => (
              <MotionBox
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Box
                  bg="white"
                  borderRadius="3xl"
                  overflow="hidden"
                  boxShadow="card"
                  border="1px solid"
                  borderColor="slate.200"
                  _hover={{ boxShadow: 'card-hover', transform: 'translateY(-4px)' }}
                  transition="all 0.25s ease"
                >
                  <Image
                    src={card.src}
                    alt={card.title}
                    h="220px"
                    w="full"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading
                      size="sm"
                      fontFamily="heading"
                      fontWeight="700"
                      color="slate.800"
                      mb={2}
                    >
                      {card.title}
                    </Heading>
                    <Text fontSize="sm" color="slate.600" lineHeight="1.7">
                      {card.description}
                    </Text>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── Self-awareness CTA section ────────────────────────── */}
      <Box bg="slate.100" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px" px={{ base: 5, md: 8 }}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            gap={{ base: 10, lg: 16 }}
          >
            <Box
              flex={1}
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="card-hover"
              order={{ base: 2, lg: 1 }}
            >
              <Image
                src="/self-awareness-ai.jpg"
                alt="Self-awareness insight"
                w="full"
                h={{ base: '280px', lg: '420px' }}
                objectFit="cover"
              />
            </Box>

            <VStack
              flex={1}
              align={{ base: 'center', lg: 'flex-start' }}
              spacing={6}
              order={{ base: 1, lg: 2 }}
              textAlign={{ base: 'center', lg: 'left' }}
            >
              <Badge
                bg="teal.50"
                color="teal.700"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.08em"
                px={3} py={1}
                borderRadius="full"
                textTransform="uppercase"
              >
                Research-Backed
              </Badge>
              <Heading
                fontFamily="heading"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="800"
                color="slate.800"
                letterSpacing="-0.025em"
                lineHeight="1.2"
              >
                Studies reveal that{' '}
                <Box as="span" color="brand.700">85% of individuals</Box>{' '}
                lack a true understanding of themselves.
              </Heading>
              <Text color="slate.600" fontSize="md" lineHeight="1.7">
                Boost your team's self-awareness in just 30 minutes per person.
                Our DISC assessment surfaces the behavioural patterns that
                drive performance, communication, and team dynamics.
              </Text>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="brand"
                fontWeight="700"
                borderRadius="md"
                rightIcon={<ArrowForwardIcon />}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'brand-glow' }}
                transition="all 0.15s ease"
              >
                Start Assessing Your Team
              </Button>
            </VStack>
          </Flex>
        </Container>
      </Box>

      {/* ── Testimonial / CTA banner ──────────────────────────── */}
      <Box bg="brand.800" py={{ base: 16, md: 20 }}>
        <Container maxW="800px" px={{ base: 5, md: 8 }} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text
              color="whiteAlpha.700"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontStyle="italic"
              lineHeight="1.8"
              mb={8}
            >
              "Mindstat gave us behavioural clarity we never had before.
              Our mis-hire rate dropped significantly in the first quarter of using it."
            </Text>
            <HStack justify="center" spacing={3} mb={10}>
              <Box
                w={10} h={10}
                bg="brand.600"
                borderRadius="full"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Text fontSize="xs" fontWeight="800" color="white">SR</Text>
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="700" color="white">Sarah R.</Text>
                <Text fontSize="xs" color="whiteAlpha.500">Head of Talent Acquisition</Text>
              </VStack>
            </HStack>

            <Heading
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.025em"
              mb={6}
            >
              Ready to hire with behavioural intelligence?
            </Heading>
            <HStack justify="center" spacing={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                bg="teal.600"
                color="white"
                fontWeight="700"
                borderRadius="md"
                rightIcon={<ArrowForwardIcon />}
                _hover={{ bg: 'teal.700', transform: 'translateY(-2px)' }}
                transition="all 0.15s ease"
              >
                Get Started Free
              </Button>
              <Button
                as={RouterLink}
                to="/about"
                size="lg"
                variant="outline"
                color="whiteAlpha.800"
                borderColor="whiteAlpha.300"
                borderRadius="md"
                fontWeight="600"
                _hover={{ bg: 'whiteAlpha.100', color: 'white', borderColor: 'white' }}
                transition="all 0.15s ease"
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
