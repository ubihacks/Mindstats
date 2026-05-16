import React from 'react';
import {
  Box, VStack, HStack, Text, Button, Heading,
  Flex, Icon, Badge,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';
import type { Question, QuestionAnswer } from '../../../types';

interface QuestionCardProps {
  question: Question;
  answer: QuestionAnswer | undefined;
  onMostSelect: (optionId: string) => void;
  onLeastSelect: (optionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onMostSelect,
  onLeastSelect,
}) => {
  const isComplete = !!(answer?.mostOptionId && answer?.leastOptionId);

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1.5px solid"
      borderColor={isComplete ? 'teal.200' : 'slate.200'}
      p={{ base: 6, md: 8 }}
      transition="border-color 0.25s, box-shadow 0.25s"
      boxShadow={isComplete ? 'card-focus' : 'card'}
    >
      {/* Question header */}
      <Flex justify="space-between" align="flex-start" mb={6}>
        <VStack align="start" spacing={1} flex={1} mr={4}>
          <Text fontSize="xs" fontWeight="700" color="brand.400" textTransform="uppercase" letterSpacing="0.1em">
            Question {question.id} of 28
          </Text>
          <Heading size="sm" fontWeight="700" color="slate.800" lineHeight="1.5">
            {question.title}
          </Heading>
        </VStack>
        {isComplete ? (
          <Box
            w={8} h={8} bg="teal.50" borderRadius="full"
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0}
          >
            <Icon as={CheckCircleIcon} color="teal.600" boxSize={4} />
          </Box>
        ) : (
          <Box
            w={8} h={8} bg="slate.50" borderRadius="full"
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0}
          >
            <Text fontSize="xs" fontWeight="700" color="slate.400">
              {answer?.mostOptionId && answer?.leastOptionId ? '✓' : answer?.mostOptionId || answer?.leastOptionId ? '½' : '?'}
            </Text>
          </Box>
        )}
      </Flex>

      {/* Column headers */}
      <HStack spacing={3} mb={3} justify="flex-end" pr={1}>
        <HStack spacing={1}>
          <Icon as={MdThumbUp} color="teal.500" boxSize={3.5} />
          <Text fontSize="xs" fontWeight="700" color="teal.600" textTransform="uppercase" letterSpacing="0.08em">
            Most
          </Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={MdThumbDown} color="brand.400" boxSize={3.5} />
          <Text fontSize="xs" fontWeight="700" color="brand.600" textTransform="uppercase" letterSpacing="0.08em">
            Least
          </Text>
        </HStack>
      </HStack>

      {/* Options */}
      <VStack spacing={2.5} align="stretch">
        {question.options.map((option) => {
          const isMost   = answer?.mostOptionId   === option.id;
          const isLeast  = answer?.leastOptionId  === option.id;
          const isActive = isMost || isLeast;

          return (
            <Flex
              key={option.id}
              align="center"
              gap={3}
              p={3.5}
              borderRadius="xl"
              border="1.5px solid"
              borderColor={
                isMost  ? 'teal.200'  :
                isLeast ? 'brand.200' :
                'slate.200'
              }
              bg={
                isMost  ? 'teal.50'  :
                isLeast ? 'brand.50' :
                'white'
              }
              transition="all 0.15s"
              _hover={{ borderColor: isActive ? undefined : 'slate.200', bg: isActive ? undefined : 'slate.50' }}
              cursor="default"
            >
              {/* Option label */}
              <Text
                flex={1}
                fontSize="sm"
                fontWeight={isActive ? '600' : '400'}
                color={
                  isMost  ? 'teal.700'  :
                  isLeast ? 'brand.700' :
                  'slate.700'
                }
                lineHeight="1.5"
              >
                {option.text}
              </Text>

              {/* Most / Least toggle buttons */}
              <HStack spacing={2} flexShrink={0}>
                {/* MOST button — teal per design spec */}
                <Button
                  size="xs"
                  h={8}
                  w={8}
                  p={0}
                  borderRadius="md"
                  variant={isMost ? 'solid' : 'outline'}
                  bg={isMost ? 'teal.600' : 'transparent'}
                  color={isMost ? 'white' : 'slate.400'}
                  borderColor={isMost ? 'teal.600' : 'slate.300'}
                  onClick={() => onMostSelect(option.id)}
                  aria-label={`Mark "${option.text}" as Most`}
                  aria-pressed={isMost}
                  _hover={{ bg: isMost ? 'teal.700' : 'teal.50', borderColor: 'teal.400', color: isMost ? 'white' : 'teal.600' }}
                  _active={{ transform: 'scale(0.9)' }}
                  transition="all 0.12s"
                  fontWeight="800"
                  fontSize="10px"
                >
                  M
                </Button>

                {/* LEAST button — navy per design spec */}
                <Button
                  size="xs"
                  h={8}
                  w={8}
                  p={0}
                  borderRadius="md"
                  variant={isLeast ? 'solid' : 'outline'}
                  bg={isLeast ? 'brand.700' : 'transparent'}
                  color={isLeast ? 'white' : 'slate.400'}
                  borderColor={isLeast ? 'brand.700' : 'slate.300'}
                  onClick={() => onLeastSelect(option.id)}
                  aria-label={`Mark "${option.text}" as Least`}
                  aria-pressed={isLeast}
                  _hover={{ bg: isLeast ? 'brand.800' : 'brand.50', borderColor: 'brand.400', color: isLeast ? 'white' : 'brand.700' }}
                  _active={{ transform: 'scale(0.9)' }}
                  transition="all 0.12s"
                  fontWeight="800"
                  fontSize="10px"
                >
                  L
                </Button>
              </HStack>
            </Flex>
          );
        })}
      </VStack>

      {/* Completion hint */}
      {!isComplete && (
        <Flex mt={4} justify="center">
          <Text fontSize="xs" color="slate.400">
            {!answer?.mostOptionId && !answer?.leastOptionId
              ? 'Select one Most (M) and one Least (L)'
              : !answer?.mostOptionId
              ? 'Now select a Most (M)'
              : 'Now select a Least (L)'}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default QuestionCard;
