import React from 'react';
import {
  Box, Button, Container, Flex, Heading, HStack, Icon,
  Image, SimpleGrid, Stack, Text, VStack, Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { MdVerified, MdInsights, MdGroups, MdScience } from 'react-icons/md';

const MotionBox = motion(Box);

const PILLARS = [
  {
    icon: MdScience,
    title: 'Proven DISC model',
    description:
      'Created by William Moulton Marston in 1928, DISC serves as the foundation for numerous prominent assessment providers in existence today. We apply it specifically to the hiring context.',
    img: '/7.jpg',
    colorScheme: 'brand',
  },
  {
    icon: MdInsights,
    title: 'Behavioural, not personality',
    description:
      'While personality tests assess enduring traits, workplace behavioural assessments evaluate job-specific behaviours and competencies — predicting actual performance, not just cultural fit.',
    img: '/8.jpg',
    colorScheme: 'teal',
  },
  {
    icon: MdGroups,
    title: 'Team-level intelligence',
    description:
      'Mindstat surfaces not just individual profiles but the behavioural compatibility between project managers and candidates — a team-first approach to recruitment.',
    img: '/9.jpg',
    colorScheme: 'brand',
  },
];

const AboutPage: React.FC = () => (
  <Box>
    {/* ── Header image section ─────────────────────────────── */}
    <Box position="relative" h={{ base: '280px', md: '420px' }} overflow="hidden">
      <Image
        src="/6.jpg"
        alt="Professional workspace"
        w="full"
        h="full"
        objectFit="cover"
        objectPosition="center 30%"
      />
      {/* Overlay gradient */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, brand.800, transparent 40%, transparent 60%, brand.800)"
        opacity={0.85}
      />
      <VStack
        position="absolute"
        inset={0}
        justify="center"
        spacing={4}
        px={5}
        textAlign="center"
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            textTransform="uppercase"
            mb={4}
            display="block"
          >
            About Mindstat
          </Badge>
          <Heading
            fontFamily="heading"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.025em"
            lineHeight="1.15"
          >
            Personality ≠ Behaviour.
          </Heading>
          <Text
            color="whiteAlpha.700"
            fontSize={{ base: 'md', md: 'xl' }}
            mt={3}
          >
            Find out your workplace behaviour in just 15 mins.
          </Text>
        </MotionBox>
      </VStack>
    </Box>

    {/* ── Mission statement ─────────────────────────────────── */}
    <Box bg="white" py={{ base: 14, md: 20 }}>
      <Container maxW="860px" px={{ base: 5, md: 8 }} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading
            fontFamily="heading"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="800"
            color="slate.800"
            letterSpacing="-0.025em"
            mb={6}
          >
            An introverted personality can behave extrovertly at work — because
            people adapt their behaviour to fit job demands.
          </Heading>
          <Text color="slate.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.8" mb={8}>
            While personality tests assess enduring traits to gauge cultural fit,
            focusing on general characteristics, workplace behavioural assessments
            evaluate job-specific behaviours and competencies, predicting performance
            through situational responses. They offer detailed, job-related insights,
            making them far more predictive of actual job performance.
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
            Start Assessment Now
          </Button>
          <Text fontSize="sm" color="slate.400" mt={3}>No credit card required to get started.</Text>
        </MotionBox>
      </Container>
    </Box>

    {/* ── 3 Pillars ─────────────────────────────────────────── */}
    <Box bg="slate.50" py={{ base: 14, md: 20 }}>
      <Container maxW="1280px" px={{ base: 5, md: 8 }}>
        <VStack spacing={3} mb={14} textAlign="center">
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
            Our Approach
          </Badge>
          <Heading
            fontFamily="heading"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="700"
            color="slate.800"
            letterSpacing="-0.025em"
          >
            What makes Mindstat different
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {PILLARS.map((pillar, i) => (
            <MotionBox
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <Box
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="card"
                border="1px solid"
                borderColor="slate.200"
                h="full"
                _hover={{ boxShadow: 'card-hover', transform: 'translateY(-4px)' }}
                transition="all 0.25s ease"
              >
                <Image
                  src={pillar.img}
                  alt={pillar.title}
                  h="200px"
                  w="full"
                  objectFit="cover"
                />
                <Box p={6}>
                  <HStack spacing={3} mb={3}>
                    <Box
                      bg={`${pillar.colorScheme}.50`}
                      borderRadius="xl"
                      p={2}
                    >
                      <Icon as={pillar.icon} color={`${pillar.colorScheme}.600`} boxSize={5} />
                    </Box>
                    <Heading
                      size="sm"
                      fontFamily="heading"
                      fontWeight="700"
                      color="slate.800"
                    >
                      {pillar.title}
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="slate.600" lineHeight="1.7">
                    {pillar.description}
                  </Text>
                </Box>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>

    {/* ── Self-awareness section ────────────────────────────── */}
    <Box bg="white" py={{ base: 14, md: 20 }}>
      <Container maxW="1280px" px={{ base: 5, md: 8 }}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          gap={{ base: 10, lg: 16 }}
        >
          <VStack
            flex={1}
            align={{ base: 'center', lg: 'flex-start' }}
            spacing={6}
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
              The Research
            </Badge>
            <Heading
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              color="slate.800"
              letterSpacing="-0.025em"
              lineHeight="1.2"
            >
              Study reveals that a whopping{' '}
              <Box as="span" color="brand.700">85% of individuals</Box>{' '}
              lack a true understanding of themselves.
            </Heading>
            <Text color="slate.600" fontSize="md" lineHeight="1.7">
              Boost your self-awareness in just 30 minutes. Mindstat's DISC engine
              identifies the behavioural patterns that drive how you work, lead,
              communicate, and make decisions under pressure.
            </Text>
            <HStack spacing={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="brand"
                fontWeight="700"
                borderRadius="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'brand-glow' }}
                transition="all 0.15s ease"
              >
                Start Free Assessment
              </Button>
            </HStack>
          </VStack>

          <Box
            flex={1}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="card-hover"
          >
            <Image
              src="/self-awareness-ai.jpg"
              alt="Self-awareness"
              w="full"
              h={{ base: '260px', lg: '400px' }}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  </Box>
);

export default AboutPage;
