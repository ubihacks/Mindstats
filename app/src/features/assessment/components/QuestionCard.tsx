/**
 * QuestionCard — Light Professional (Desing.md)
 * Row: white · hover: mint · Most selected: navy fill · Least: purple fill
 * Both Most and Least rows highlight independently with their own accent colors.
 */
import React from 'react';
import { Box, Button, Flex, HStack, Text, Heading } from '@chakra-ui/react';
import type { Question, QuestionAnswer } from '../../../types';

const NAVY         = '#003366';
const MINT         = '#E8F3ED';
const PURPLE       = '#553C9A';  // Chakra purple.700
const PURPLE_BG    = '#FAF5FF';  // Chakra purple.50
const NAVY_BG      = '#EBF0F8';  // Navy tinted bg for Most row

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
            border="1.5px solid"
            borderColor={isMost ? NAVY : isLeast ? PURPLE : '#DADADA'}
            bg={isMost ? NAVY_BG : isLeast ? PURPLE_BG : 'white'}
            transition="all 0.15s ease-out"
            _hover={{ borderColor: isMost ? NAVY : isLeast ? PURPLE : NAVY, bg: isMost ? NAVY_BG : isLeast ? PURPLE_BG : MINT }}
            role="group"
          >
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={isMost ? NAVY : isLeast ? PURPLE : 'gray.700'}
              fontWeight={isMost || isLeast ? '600' : '400'}
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

              {/* Least — purple filled when selected */}
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
                bg={isLeast ? PURPLE : 'transparent'}
                color={isLeast ? 'white' : 'gray.500'}
                borderColor={isLeast ? PURPLE : '#DADADA'}
                _hover={{ bg: isLeast ? '#44337A' : PURPLE_BG, borderColor: PURPLE, color: isLeast ? 'white' : PURPLE }}
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

