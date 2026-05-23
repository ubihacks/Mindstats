import React from 'react';
import {
  Box, VStack, Heading, Text, Button, Icon, Center, HStack, Badge, Image, Divider,
} from '@chakra-ui/react';
import { CheckCircleIcon, DownloadIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { DISC_QUESTIONS } from '../features/assessment/data/questions';
import type { QuestionAnswer } from '../types';

const NAVY = '#001e40';

const buildCSV = (answers: QuestionAnswer[], assessmentType: string): string => {
  const rows: string[] = [
    ['Q#', 'Topic', 'Most — Selected Text', 'Most — DISC Trait', 'Least — Selected Text', 'Least — DISC Trait'].join(','),
  ];
  const traitMap: Record<string, string> = { a: 'D (Dominance)', b: 'I (Influence)', c: 'S (Steadiness)', d: 'C (Conscientiousness)' };

  answers.forEach((ans) => {
    const q = DISC_QUESTIONS.find((q) => q.id === ans.questionId);
    if (!q) return;
    const mostOpt  = q.options.find((o) => o.id === ans.mostOptionId);
    const leastOpt = q.options.find((o) => o.id === ans.leastOptionId);
    const escape   = (s = '') => `"${s.replace(/"/g, '""')}"`;
    rows.push([
      q.id,
      escape(q.title),
      escape(mostOpt?.text  ?? ''),
      traitMap[ans.mostOptionId?.slice(-1)  ?? ''] ?? '',
      escape(leastOpt?.text ?? ''),
      traitMap[ans.leastOptionId?.slice(-1) ?? ''] ?? '',
    ].join(','));
  });

  rows.splice(1, 0, [`Assessment Type: ${assessmentType}`, `Exported: ${new Date().toLocaleString()}`, '', '', '', ''].join(','));
  return rows.join('\n');
};

const AssessmentCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as {
    assessmentType?: string;
    totalAnswered?: number;
    answers?: QuestionAnswer[];
  } | null;

  const isHM          = state?.assessmentType === 'hiring-manager';
  const totalAnswered = state?.totalAnswered ?? 28;
  const answers       = state?.answers ?? [];

  const handleDownloadCSV = () => {
    const label = isHM ? 'role-profile' : 'candidate-assessment';
    const csv   = buildCSV(answers, isHM ? 'Project Manager — Project Profile' : 'Candidate Assessment');
    const blob  = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `disc-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Center minH="100vh" bg="gray.50" px={4} py={10}>
      <Box maxW="480px" w="full">
        <Box
          bg="white" borderRadius="2xl" overflow="hidden"
          boxShadow="0 4px 24px rgba(0,0,30,0.08)"
          border="1px solid" borderColor="gray.100"
        >
          <Box h="5px" bgGradient="linear(to-r, green.400, teal.400)" />

          <VStack spacing={7} p={10} align="center" textAlign="center">
            <Image src="/mindstats-logo.svg" h="20px" alt="Mindstat" />

            <Box bg="green.50" borderRadius="full" p={5} border="6px solid" borderColor="green.100">
              <Icon as={CheckCircleIcon} boxSize={10} color="green.500" />
            </Box>

            <VStack spacing={3}>
              <Heading size="lg" fontWeight="800" color={NAVY} letterSpacing="-0.03em">
                Assessment Complete!
              </Heading>
              <Text color="gray.500" fontSize="sm" lineHeight="1.8" maxW="340px">
                {isHM
                  ? 'Your role behavioural profile has been recorded. Candidates can now be invited and matched against your ideal profile.'
                  : 'Thank you for completing the DISC Behavioural Assessment. Your results have been recorded and will be reviewed by the team.'}
              </Text>
            </VStack>

            <HStack spacing={3} flexWrap="wrap" justify="center">
              <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
                ✓ {totalAnswered}/{totalAnswered} Questions Answered
              </Badge>
              <Badge borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700" bg="blue.50" color="blue.700">
                {isHM ? 'Role Profile' : 'Candidate Assessment'}
              </Badge>
            </HStack>

            {!isHM && (
              <Box bg="gray.50" borderRadius="xl" p={5} w="full" textAlign="left">
                <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" mb={3}>
                  What Happens Next
                </Text>
                <VStack spacing={2.5} align="stretch">
                  {[
                    'Your results have been securely submitted.',
                    'The HR team will evaluate your behavioural profile.',
                    "You'll be contacted with next steps shortly.",
                  ].map((text, i) => (
                    <HStack key={i} spacing={3} align="flex-start">
                      <Box
                        w="20px" h="20px" borderRadius="full" bg={NAVY} color="white" flexShrink={0}
                        display="flex" alignItems="center" justifyContent="center" fontSize="10px" fontWeight="800"
                      >
                        {i + 1}
                      </Box>
                      <Text fontSize="sm" color="gray.600" lineHeight="1.7">{text}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Download CSV — available to both candidate and HM */}
            {answers.length > 0 && (
              <Button
                leftIcon={<DownloadIcon />}
                size="md" w="full" variant="outline" fontWeight="700" borderRadius="full"
                borderColor="gray.200" color="gray.600"
                onClick={handleDownloadCSV}
                _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
                _active={{ transform: 'scale(0.98)' }}
              >
                Download Answers as CSV
              </Button>
            )}

            <Button
              size="lg" w="full" bg={NAVY} color="white" fontWeight="700" borderRadius="full"
              onClick={() => navigate(isHM ? '/projects' : '/')}
              _hover={{ bg: '#002952', transform: 'translateY(-1px)', boxShadow: 'lg' }}
              _active={{ bg: '#00152b' }}
              transition="all 0.15s"
            >
              {isHM ? 'Go to Roles' : 'Return to Home'}
            </Button>
          </VStack>
        </Box>
      </Box>
    </Center>
  );
};

export default AssessmentCompletePage;

