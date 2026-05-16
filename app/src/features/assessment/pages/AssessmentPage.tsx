import React, { useEffect } from 'react';
import {
  Box, Button, Flex, Heading, HStack, Progress, Text, VStack,
  useToast, Badge, Container, Image,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setMostChoice, setLeastChoice, goToNextQuestion,
  goToPreviousQuestion, goToQuestion, submitAssessment, resetAssessment,
} from '../assessmentSlice';
import QuestionCard from '../components/QuestionCard';

const AssessmentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { roleId, type } = useParams<{ roleId: string; type: 'hiring-manager' | 'candidate' }>();

  const { questions, answers, currentQuestionIndex, status, submittedAt } =
    useAppSelector((s) => s.assessment);
  const { user } = useAppSelector((s) => s.auth);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer   = currentQuestion ? answers[currentQuestion.id] : undefined;

  const completedCount  = Object.values(answers).filter((a) => a.mostOptionId && a.leastOptionId).length;
  const progressPercent = (completedCount / questions.length) * 100;
  const isCurrentComplete = !!(currentAnswer?.mostOptionId && currentAnswer?.leastOptionId);
  const isLastQuestion    = currentQuestionIndex === questions.length - 1;
  const allComplete       = completedCount === questions.length;

  useEffect(() => {
    if (submittedAt) {
      toast({
        title: 'Assessment submitted!',
        description: 'Thank you for completing the assessment.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      dispatch(resetAssessment());
      navigate('/assessment/complete');
    }
  }, [submittedAt]);

  const handleSubmit = async () => {
    if (!allComplete) {
      toast({
        title: 'Incomplete assessment',
        description: `Please answer all ${questions.length} questions before submitting.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    if (!roleId || !user) return;
    dispatch(submitAssessment({
      roleId,
      assessmentType: type === 'hiring-manager' ? 'HIRING_MANAGER' : 'CANDIDATE',
      respondentId: user.id,
    }));
  };

  if (!currentQuestion) return null;

  return (
    <Box bg="slate.50" minH="100vh" pb={20}>
      {/* ── Sticky Header ── */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px solid"
        borderColor="slate.100"
        boxShadow="0 1px 3px rgba(0,0,0,0.06)"
      >
        <Container maxW="2xl" py={4}>
          <Flex justify="space-between" align="center" mb={3}>
            <HStack spacing={3}>
              <Image src="/mindstat-favicon.svg" h="32px" w="32px" alt="Mindstat" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="700" color="slate.900" letterSpacing="-0.02em">
                  DISC Behavioural Assessment
                </Text>
                <Text fontSize="xs" color="slate.500">
                  {type === 'hiring-manager' ? 'Role Behavioural Profile' : 'Candidate Assessment'}
                </Text>
              </VStack>
            </HStack>
            <Badge
              bg={allComplete ? 'green.50' : 'brand.50'}
              color={allComplete ? 'green.700' : 'brand.700'}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="700"
            >
              {completedCount} / {questions.length} answered
            </Badge>
          </Flex>

          <Progress
            value={progressPercent}
            colorScheme={allComplete ? 'green' : 'purple'}
            borderRadius="full"
            size="sm"
            bg="slate.100"
            transition="all 0.4s"
          />
        </Container>
      </Box>

      <Container maxW="2xl" pt={8}>
        {/* ── Question Navigation Dots ── */}
        <Flex wrap="wrap" gap={1.5} mb={6} justify="center">
          {questions.map((q, idx) => {
            const ans  = answers[q.id];
            const done = !!(ans?.mostOptionId && ans?.leastOptionId);
            const active = idx === currentQuestionIndex;
            return (
              <Box
                key={q.id}
                as="button"
                onClick={() => dispatch(goToQuestion(idx))}
                w="26px"
                h="26px"
                borderRadius="md"
                fontSize="10px"
                fontWeight="800"
                border="1.5px solid"
                borderColor={active ? 'brand.500' : done ? 'green.400' : 'slate.200'}
                bg={active ? 'brand.600' : done ? 'green.100' : 'white'}
                color={active ? 'white' : done ? 'green.700' : 'slate.400'}
                transition="all 0.15s"
                _hover={{ borderColor: active ? 'brand.500' : 'brand.300', transform: 'scale(1.05)' }}
                aria-label={`Question ${idx + 1}`}
                aria-current={active ? 'step' : undefined}
              >
                {done && !active ? '✓' : idx + 1}
              </Box>
            );
          })}
        </Flex>

        {/* ── Question Card ── */}
        <QuestionCard
          question={currentQuestion}
          answer={currentAnswer}
          onMostSelect={(optionId) => dispatch(setMostChoice({ questionId: currentQuestion.id, optionId }))}
          onLeastSelect={(optionId) => dispatch(setLeastChoice({ questionId: currentQuestion.id, optionId }))}
        />

        {/* ── Navigation Controls ── */}
        <Flex justify="space-between" mt={6} align="center">
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            color="slate.500"
            isDisabled={currentQuestionIndex === 0}
            onClick={() => dispatch(goToPreviousQuestion())}
            _hover={{ bg: 'slate.100', color: 'slate.800' }}
            fontWeight="600"
          >
            Previous
          </Button>

          <Text fontSize="sm" color="slate.400" fontWeight="600">
            {currentQuestionIndex + 1} / {questions.length}
          </Text>

          {isLastQuestion ? (
            <Button
              bg={allComplete ? 'green.500' : 'slate.200'}
              color={allComplete ? 'white' : 'slate.400'}
              isLoading={status === 'loading'}
              loadingText="Submitting…"
              onClick={handleSubmit}
              isDisabled={!allComplete}
              leftIcon={<CheckCircleIcon />}
              fontWeight="700"
              _hover={{ bg: allComplete ? 'green.600' : undefined, transform: allComplete ? 'translateY(-1px)' : 'none' }}
              _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
              transition="all 0.15s"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              rightIcon={<ArrowForwardIcon />}
              bg="brand.600"
              color="white"
              isDisabled={!isCurrentComplete}
              onClick={() => dispatch(goToNextQuestion())}
              fontWeight="700"
              _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
              _disabled={{ opacity: 0.5, bg: 'slate.200', color: 'slate.400', cursor: 'not-allowed', transform: 'none' }}
              transition="all 0.15s"
            >
              Next
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default AssessmentPage;
