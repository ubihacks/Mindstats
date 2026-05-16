/**
 * QuestionCard — Light Professional (Desing.md)
 * Row: white · hover: mint · Most selected: navy fill · Least: navy outline
 */
import React from 'react';
import { Box, Button, Flex, HStack, Text, Heading } from '@chakra-ui/react';
import type { Question, QuestionAnswer } from '../../../types';

const NAVY = '#003366';
const MINT = '#E8F3ED';

interface QuestionCardProps {
  question:      Question;
  answer:        QuestionAnswer | undefined;
  onMostSelect:  (optionId: string) => void;
  onLeastSelect: (optionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question, answer, onMostSelect, onLeastSelect,
}) => (
  <Box>
    <Heading
      fontFamily="heading"
      fontSize={{ base: '2xl', md: '3xl' }}
      fontWeight="800"
      color={NAVY}
      letterSpacing="-0.03em"
      mb={8}
    >
      {question.title}
    </Heading>

    <Box display="flex" flexDirection="column" gap={3}>
      {question.options.map((option) => {
        const isMost  = answer?.mostOptionId  === option.id;
        const isLeast = answer?.leastOptionId === option.id;

        return (
          <Flex
            key={option.id}
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            gap={4}
            px={5} py={4}
            borderRadius="xl"
            border="1px solid"
            borderColor={isMost ? NAVY : '#DADADA'}
            bg={isMost ? '#EEF3FF' : 'white'}
            transition="all 0.15s ease-out"
            _hover={{ borderColor: NAVY, bg: MINT }}
            role="group"
          >
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={isMost ? NAVY : 'gray.700'}
              fontWeight={isMost ? '600' : '400'}
              lineHeight="1.6"
              flex={1}
            >
              {option.text}
            </Text>

            <HStack spacing={2} flexShrink={0}>
              {/* Most — navy filled when selected */}
              <Button
                size="sm"
                borderRadius="full"
                px={5} h="34px"
                fontFamily="heading"
                fontWeight="700"
                fontSize="xs"
                letterSpacing="0.04em"
                border="1px solid"
                onClick={() => onMostSelect(option.id)}
                bg={isMost ? NAVY : 'transparent'}
                color={isMost ? 'white' : 'gray.500'}
                borderColor={isMost ? NAVY : '#DADADA'}
                _hover={{ bg: isMost ? '#002952' : MINT, borderColor: NAVY, color: isMost ? 'white' : NAVY }}
                _active={{ transform: 'scale(0.96)' }}
                transition="all 0.15s ease-out"
              >
                Most
              </Button>

              {/* Least — navy outline when selected */}
              <Button
                size="sm"
                borderRadius="full"
                px={5} h="34px"
                fontFamily="heading"
                fontWeight="700"
                fontSize="xs"
                letterSpacing="0.04em"
                border="1px solid"
                onClick={() => onLeastSelect(option.id)}
                bg={isLeast ? '#f3f3f4' : 'transparent'}
                color={isLeast ? NAVY : 'gray.500'}
                borderColor={isLeast ? NAVY : '#DADADA'}
                _hover={{ bg: MINT, borderColor: NAVY, color: NAVY }}
                _active={{ transform: 'scale(0.96)' }}
                transition="all 0.15s ease-out"
              >
                Least
              </Button>
            </HStack>
          </Flex>
        );
      })}
    </Box>
  </Box>
);

export default QuestionCard;

