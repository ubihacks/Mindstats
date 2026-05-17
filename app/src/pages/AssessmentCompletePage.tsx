import React, { useMemo } from 'react';
import {
  Box, VStack, Heading, Text, Button, Icon, Center, HStack, Badge, Image,
  Divider, Flex,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const NAVY = '#001e40';

interface DiscScores { D: number; I: number; S: number; C: number }

const DISC_TRAITS = {
  D: {
    label: 'Dominance',
    color: '#E53E3E',
    bg: '#FFF5F5',
    border: '#FED7D7',
    description: 'Direct, results-oriented, assertive. Drives change and thrives under challenge.',
    keywords: ['Decisive', 'Competitive', 'Driven'],
  },
  I: {
    label: 'Influence',
    color: '#D69E2E',
    bg: '#FFFFF0',
    border: '#FEFCBF',
    description: 'Enthusiastic, optimistic, collaborative. Excels at motivating and persuading others.',
    keywords: ['Sociable', 'Enthusiastic', 'Persuasive'],
  },
  S: {
    label: 'Steadiness',
    color: '#38A169',
    bg: '#F0FFF4',
    border: '#C6F6D5',
    description: 'Patient, reliable, supportive. Values stability, consistency and team harmony.',
    keywords: ['Reliable', 'Patient', 'Collaborative'],
  },
  C: {
    label: 'Conscientiousness',
    color: '#3182CE',
    bg: '#EBF8FF',
    border: '#BEE3F8',
    description: 'Analytical, precise, systematic. Prioritises quality, accuracy and logic.',
    keywords: ['Analytical', 'Precise', 'Systematic'],
  },
} as const;

const AssessmentCompletePage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = location.state as { assessmentType?: string; disc?: DiscScores; totalAnswered?: number } | null;

  const totalAnswered = state?.totalAnswered ?? 28;
  const isHM          = state?.assessmentType === 'hiring-manager';

  const sorted = useMemo(() => {
    const d: DiscScores = state?.disc ?? { D: 0, I: 0, S: 0, C: 0 };
    return (Object.entries(d) as [keyof DiscScores, number][]).sort((a, b) => b[1] - a[1]);
  }, [state?.disc]);

  const disc: DiscScores = state?.disc ?? { D: 0, I: 0, S: 0, C: 0 };
  const [primaryKey]   = sorted[0] ?? ['D', 0];
  const [secondaryKey] = sorted[1] ?? ['I', 0];

  const maxScore    = Math.max(...Object.values(disc), 1);
  const primaryInfo = DISC_TRAITS[primaryKey];

  return (
    <Center minH="100vh" bg="gray.50" px={4} py={10}>
      <Box maxW="600px" w="full">

        {/* ── Success card ── */}
        <Box
          bg="white" borderRadius="2xl" overflow="hidden"
          boxShadow="0 4px 24px rgba(0,0,30,0.08)"
          border="1px solid" borderColor="gray.100" mb={5}
        >
          {/* Top accent */}
          <Box h="5px" bgGradient="linear(to-r, green.400, teal.400)" />

          <VStack spacing={6} p={10} align="center" textAlign="center">
            {/* Logo */}
            <Image src="/mindstats-logo.svg" h="20px" alt="Mindstat" />

            {/* Icon */}
            <Box bg="green.50" borderRadius="full" p={5} border="6px solid" borderColor="green.100">
              <Icon as={CheckCircleIcon} boxSize={10} color="green.500" />
            </Box>

            <VStack spacing={2}>
              <Heading size="lg" fontWeight="800" color={NAVY} letterSpacing="-0.03em">
                Assessment Complete!
              </Heading>
              <Text color="gray.500" fontSize="sm" lineHeight="1.8" maxW="360px">
                {isHM
                  ? 'Your role behavioural profile has been recorded. Candidates can now be matched against your ideal profile.'
                  : 'Thank you for completing the DISC Behavioural Assessment. Your results have been recorded.'}
              </Text>
            </VStack>

            <HStack spacing={3} flexWrap="wrap" justify="center">
              <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
                ✓ {totalAnswered}/{totalAnswered} Questions Answered
              </Badge>
              <Badge
                borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700"
                bg="blue.50" color="blue.700"
              >
                {isHM ? 'Role Profile' : 'Candidate Assessment'}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* ── DISC result card ── */}
        <Box
          bg="white" borderRadius="2xl" overflow="hidden"
          boxShadow="0 4px 24px rgba(0,0,30,0.08)"
          border="1px solid" borderColor="gray.100" mb={5}
        >
          <Box h="4px" bg={primaryInfo.color} />
          <Box p={8}>
            <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" mb={5}>
              Your Behavioural Profile
            </Text>

            {/* Primary trait highlight */}
            <Box
              bg={primaryInfo.bg} border="1px solid" borderColor={primaryInfo.border}
              borderRadius="xl" p={5} mb={5}
            >
              <HStack justify="space-between" mb={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" mb={0.5}>Primary Style</Text>
                  <Heading size="md" fontWeight="800" color={primaryInfo.color} letterSpacing="-0.02em">
                    {primaryInfo.label}
                  </Heading>
                </Box>
                <Box
                  bg={primaryInfo.color} color="white" borderRadius="full"
                  w="48px" h="48px" display="flex" alignItems="center" justifyContent="center"
                  fontSize="xl" fontWeight="800"
                >
                  {primaryKey}
                </Box>
              </HStack>
              <Text fontSize="sm" color="gray.600" lineHeight="1.7" mb={3}>{primaryInfo.description}</Text>
              <HStack spacing={2} flexWrap="wrap">
                {primaryInfo.keywords.map((kw) => (
                  <Badge key={kw} bg={primaryInfo.color} color="white" borderRadius="full" px={2.5} fontSize="10px" fontWeight="700">
                    {kw}
                  </Badge>
                ))}
              </HStack>
            </Box>

            {/* All 4 bars */}
            <VStack spacing={3}>
              {sorted.map(([key, score]) => {
                const info = DISC_TRAITS[key];
                const pct  = Math.max(0, ((score + 14) / (maxScore + 14)) * 100); // normalise to always show bar
                return (
                  <Box key={key} w="full">
                    <Flex justify="space-between" mb={1}>
                      <HStack spacing={2}>
                        <Box
                          w="20px" h="20px" borderRadius="md" bg={info.color}
                          display="flex" alignItems="center" justifyContent="center"
                          fontSize="10px" fontWeight="800" color="white"
                        >
                          {key}
                        </Box>
                        <Text fontSize="xs" fontWeight="700" color="gray.700">{info.label}</Text>
                      </HStack>
                      <Text fontSize="xs" fontWeight="700" color="gray.400">{score > 0 ? `+${score}` : score}</Text>
                    </Flex>
                    <Box h="6px" bg="gray.100" borderRadius="full" overflow="hidden">
                      <Box
                        h="full" borderRadius="full" bg={info.color}
                        w={`${pct}%`} transition="width 0.6s ease-out"
                      />
                    </Box>
                  </Box>
                );
              })}
            </VStack>

            <Divider my={5} />

            {/* Secondary style */}
            <HStack spacing={3}>
              <Box
                w="32px" h="32px" borderRadius="md" bg={DISC_TRAITS[secondaryKey].color}
                display="flex" alignItems="center" justifyContent="center"
                fontSize="sm" fontWeight="800" color="white" flexShrink={0}
              >
                {secondaryKey}
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="700" color="gray.500">Secondary Style — {DISC_TRAITS[secondaryKey].label}</Text>
                <Text fontSize="xs" color="gray.400" lineHeight="1.6">{DISC_TRAITS[secondaryKey].description}</Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        {/* ── Next steps card ── */}
        <Box
          bg="white" borderRadius="2xl" p={7}
          boxShadow="0 4px 24px rgba(0,0,30,0.08)"
          border="1px solid" borderColor="gray.100" mb={5}
        >
          <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" mb={4}>
            What Happens Next
          </Text>
          <VStack spacing={3} align="stretch">
            {(isHM ? [
              { step: '1', text: 'Your DISC role profile has been saved.'               },
              { step: '2', text: 'Invite candidates via the Roles dashboard.'            },
              { step: '3', text: 'Candidate results will appear in your reports tab.'   },
            ] : [
              { step: '1', text: 'Your results have been securely submitted.'            },
              { step: '2', text: 'The HR team will review your behavioural profile.'     },
              { step: '3', text: "You'll be contacted with next steps shortly."          },
            ]).map(({ step, text }) => (
              <HStack key={step} spacing={3} align="flex-start">
                <Box
                  w="22px" h="22px" borderRadius="full" bg={NAVY} color="white" flexShrink={0}
                  display="flex" alignItems="center" justifyContent="center" fontSize="10px" fontWeight="800"
                >
                  {step}
                </Box>
                <Text fontSize="sm" color="gray.600" lineHeight="1.7">{text}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button
          size="lg" w="full" bg={NAVY} color="white" fontWeight="700" borderRadius="full"
          onClick={() => navigate(isHM ? '/roles' : '/login')}
          _hover={{ bg: '#002952', transform: 'translateY(-1px)', boxShadow: 'lg' }}
          _active={{ bg: '#00152b' }}
          transition="all 0.15s"
        >
          {isHM ? 'Go to Roles' : 'Return to Home'}
        </Button>
      </Box>
    </Center>
  );
};

export default AssessmentCompletePage;

