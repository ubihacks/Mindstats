/**
 * AssessmentPage — Light Professional (Desing.md)
 * ──────────────────────────────────────────────────────────────────────────
 * Body:     #fbf9f8 (soft off-white)
 * Header:   #003366 navy sticky bar + white progress rail
 * Card:     white · 1px #DADADA · boxShadow subtle
 * Buttons:  borderRadius="full" · navy Next · ghost Back
 * Dots:     navy active · teal done · gray default
 */
import React, { useEffect } from 'react';
import {
  Box, Button, Container, Flex, HStack, Image, Text, useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setMostChoice, setLeastChoice,
  goToNextQuestion, goToPreviousQuestion,
  goToQuestion, submitAssessment, resetAssessment,
} from '../assessmentSlice';
import QuestionCard from '../components/QuestionCard';

const NAVY = '#003366';
const MINT = '#E8F3ED';

const AssessmentPage: React.FC = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { roleId, type } = useParams<{ roleId: string; type: 'hiring-manager' | 'candidate' }>();

  const { questions, answers, currentQuestionIndex, status, submittedAt, error } =
    useAppSelector((s) => s.assessment);
  const { user } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const currentQuestion   = questions[currentQuestionIndex];
  const currentAnswer     = currentQuestion ? answers[currentQuestion.id] : undefined;
  const completedCount    = Object.values(answers).filter((a) => a.mostOptionId && a.leastOptionId).length;
  const progressPercent   = questions.length ? (completedCount / questions.length) * 100 : 0;
  const isCurrentComplete = !!(currentAnswer?.mostOptionId && currentAnswer?.leastOptionId);
  const isLastQuestion    = currentQuestionIndex === questions.length - 1;
  const allComplete       = completedCount === questions.length;

  useEffect(() => {
    if (status === 'error') {
      toast({
        title: 'Submission failed',
        description: error ?? 'Something went wrong. Please try again.',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (submittedAt) {
      // Scoring is authoritative server-side (calculate-disc Edge Function).
      // Pass the raw answers for the CSV download on the complete page.
      const snapshot = Object.values(answers);
      dispatch(resetAssessment());
      navigate('/assessment/complete', {
        state: {
          assessmentType: type,
          totalAnswered: snapshot.length,
          answers: snapshot,
        },
      });
    }
  }, [submittedAt, dispatch, navigate, answers, type]);

  const handleSubmit = () => {
    if (!allComplete || !roleId) return;

    const isHM       = type === 'hiring-manager';
    const inviteToken = sessionStorage.getItem('candidate_invite_token') ?? undefined;

    // For hiring managers use the authenticated user's identity.
    // For candidates use the name/email saved to sessionStorage by InvitePage.
    const respondentName = isHM
      ? (user?.email?.split('@')[0] ?? user?.email ?? 'Hiring Manager')
      : (sessionStorage.getItem('candidate_name')  ?? 'Candidate');
    const respondentEmail = isHM
      ? (user?.email ?? '')
      : (sessionStorage.getItem('candidate_email') ?? '');

    dispatch(submitAssessment({
      roleId,
      assessmentType:  isHM ? 'HIRING_MANAGER' : 'CANDIDATE',
      respondentId:    user?.id ?? '',
      respondentName,
      respondentEmail,
      inviteToken,
    }));
  };

  if (!currentQuestion) return null;

  return (
    <Box bg="#fbf9f8" minH="100vh" pb={24}>

      {/* ── Sticky navy header ── */}
      <Box position="sticky" top={0} zIndex={10} bg={NAVY}>
        <Container maxW="800px" px={{ base: 4, md: 8 }}>
          <Flex justify="space-between" align="center" h="72px">

            {/* Logo */}
            <HStack spacing={2.5}>
              <Image
                src="/mindstat-favicon.svg" h="28px" w="28px" alt="Mindstat"
                filter="brightness(0) invert(1)"
              />
              <Image
                src="/mindstats-logo.svg" h="18px" alt="Mindstat"
                filter="brightness(0) invert(1)"
              />
            </HStack>

            {/* Step counter pill */}
            <Box
              display="inline-flex" alignItems="center"
              px={4} py={1} borderRadius="full"
              bg="rgba(255,255,255,0.15)" border="1px solid rgba(255,255,255,0.20)"
            >
              <Text fontFamily="mono" fontSize="xs" fontWeight="700" color="white" letterSpacing="0.06em">
                {currentQuestionIndex + 1} / {questions.length}
              </Text>
            </Box>

            <Text
              fontSize="xs" fontWeight="600" color="whiteAlpha.700"
              letterSpacing="0.04em" display={{ base: 'none', md: 'block' }}
            >
              {type === 'hiring-manager' ? 'Role Profile' : 'Candidate Assessment'}
            </Text>
          </Flex>

          {/* White progress rail */}
          <Box h="3px" bg="rgba(255,255,255,0.20)" overflow="hidden">
            <Box
              h="full" bg="white"
              w={`${progressPercent}%`}
              transition="width 0.4s ease-out"
            />
          </Box>
        </Container>
      </Box>

      <Container maxW="800px" px={{ base: 4, md: 8 }} pt={14}>

        {/* ── Progress pill ── */}
        <Flex direction="column" align="center" mb={12}>
          <Box
            display="inline-flex" alignItems="center"
            px={6} py={1.5} borderRadius="full"
            border="1px solid #DADADA" bg="white" mb={5}
          >
            <Text fontFamily="mono" fontSize="xs" fontWeight="700" color="gray.500" letterSpacing="0.08em">
              {currentQuestionIndex + 1} / {questions.length}
            </Text>
          </Box>

          <Box w="192px" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
            <Box
              h="full" borderRadius="full" bg={NAVY}
              w={`${progressPercent}%`}
              transition="width 0.4s ease-out"
            />
          </Box>
        </Flex>

        {/* ── White question card ── */}
        <Box
          bg="white"
          border="1px solid #DADADA"
          borderRadius="xl"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 12 }}
          boxShadow="0px 4px 20px rgba(0,0,0,0.04)"
        >
          <QuestionCard
            question={currentQuestion}
            answer={currentAnswer}
            onMostSelect={(id)  => dispatch(setMostChoice ({ questionId: currentQuestion.id, optionId: id }))}
            onLeastSelect={(id) => dispatch(setLeastChoice({ questionId: currentQuestion.id, optionId: id }))}
          />

          {/* ── Navigation ── */}
          <Flex justify="center" gap={4} mt={14} pt={8} borderTop="1px solid #DADADA">
            <Button
              leftIcon={<ArrowBackIcon />}
              borderRadius="full"
              border="1px solid #DADADA"
              bg="white" color="gray.600"
              fontFamily="heading" fontWeight="700" fontSize="sm"
              px={8} h="44px"
              isDisabled={currentQuestionIndex === 0}
              onClick={() => dispatch(goToPreviousQuestion())}
              _hover={{ bg: MINT, borderColor: NAVY, color: NAVY }}
              _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
              _active={{ transform: 'scale(0.97)' }}
              transition="all 0.15s ease-out"
            >
              Back
            </Button>

            {isLastQuestion ? (
              <Button
                leftIcon={<CheckIcon />}
                borderRadius="full"
                bg={allComplete ? NAVY : 'gray.200'}
                color={allComplete ? 'white' : 'gray.400'}
                fontFamily="heading" fontWeight="700" fontSize="sm"
                px={8} h="44px"
                isLoading={status === 'loading'}
                loadingText="Submitting…"
                isDisabled={!allComplete}
                onClick={handleSubmit}
                _hover={{ bg: allComplete ? '#002952' : undefined, transform: allComplete ? 'translateY(-1px)' : 'none' }}
                _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                _active={{ transform: 'scale(0.97)' }}
                transition="all 0.15s ease-out"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                rightIcon={<ArrowForwardIcon />}
                borderRadius="full"
                bg={isCurrentComplete ? NAVY : 'gray.200'}
                color={isCurrentComplete ? 'white' : 'gray.400'}
                fontFamily="heading" fontWeight="700" fontSize="sm"
                px={8} h="44px"
                isDisabled={!isCurrentComplete}
                onClick={() => dispatch(goToNextQuestion())}
                _hover={{ bg: '#002952', transform: 'translateY(-1px)' }}
                _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                _active={{ transform: 'scale(0.97)' }}
                transition="all 0.15s ease-out"
              >
                Next
              </Button>
            )}
          </Flex>
        </Box>

        {/* ── Question dots navigator ── */}
        <Flex wrap="wrap" gap={1.5} mt={8} justify="center">
          {questions.map((q, idx) => {
            const ans    = answers[q.id];
            const done   = !!(ans?.mostOptionId && ans?.leastOptionId);
            const active = idx === currentQuestionIndex;

            return (
              <Box
                key={q.id}
                as="button"
                onClick={() => dispatch(goToQuestion(idx))}
                w="26px" h="26px"
                borderRadius="md"
                fontSize="10px"
                fontWeight="800"
                border="1px solid"
                borderColor={active ? NAVY : done ? 'teal.400' : '#DADADA'}
                bg={active ? NAVY : done ? MINT : 'white'}
                color={active ? 'white' : done ? 'teal.700' : 'gray.400'}
                transition="all 0.15s"
                _hover={{ borderColor: NAVY, color: active ? 'white' : NAVY, transform: 'scale(1.08)' }}
                aria-label={`Question ${idx + 1}`}
                aria-current={active ? 'step' : undefined}
              >
                {done && !active ? '✓' : idx + 1}
              </Box>
            );
          })}
        </Flex>

      </Container>
    </Box>
  );
};

export default AssessmentPage;

