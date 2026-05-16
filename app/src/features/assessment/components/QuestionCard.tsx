import React from 'react';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import type { Question, QuestionAnswer } from '../../../types';

interface QuestionCardProps {
  question: Question;
  answer: QuestionAnswer | undefined;
  onMostSelect:  (optionId: string) => void;
  onLeastSelect: (optionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onMostSelect,
  onLeastSelect,
}) => (
  <Box>
    {/* Section title */}
    <Text
      fontFamily="heading"
      fontSize={{ base: '2xl', md: '3xl' }}
      fontWeight="800"
      color="white"
      letterSpacing="-0.03em"
      mb={8}
    >
      {question.title}
    </Text>

    {/* Option rows */}
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
            px={5}
            py={4}
            borderRadius="xl"
            border="1px solid"
            borderColor={
              isMost  ? 'brand.600'      :
              isLeast ? 'whiteAlpha.200' :
              'whiteAlpha.80'
            }
            bg={
              isMost  ? 'rgba(37,99,235,0.08)'  :
              isLeast ? 'rgba(255,255,255,0.03)' :
              'transparent'
            }
            transition="all 0.15s ease-out"
            _hover={{ borderColor: 'whiteAlpha.200', bg: 'rgba(255,255,255,0.04)' }}
            role="group"
          >
            {/* Statement text */}
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={isMost ? 'white' : 'gray.300'}
              fontWeight={isMost ? '500' : '400'}
              lineHeight="1.6"
              flex={1}
            >
              {option.text}
            </Text>

            {/* Most / Least buttons */}
            <HStack spacing={2} flexShrink={0}>
              {/* Most */}
              <Button
                size="sm"
                borderRadius="full"
                px={5}
                h="34px"
                fontFamily="heading"
                fontWeight="700"
                fontSize="xs"
                letterSpacing="0.04em"
                border="1px solid"
                onClick={() => onMostSelect(option.id)}
                bg={isMost ? 'brand.600' : 'transparent'}
                color={isMost ? 'white' : 'whiteAlpha.600'}
                borderColor={isMost ? 'brand.600' : 'whiteAlpha.200'}
                _hover={{
                  bg:          isMost ? 'brand.700' : 'whiteAlpha.50',
                  borderColor: isMost ? 'brand.700' : 'whiteAlpha.400',
                  color:       isMost ? 'white'     : 'white',
                }}
                _active={{ transform: 'scale(0.96)' }}
                transition="all 0.15s ease-out"
              >
                Most
              </Button>

              {/* Least */}
              <Button
                size="sm"
                borderRadius="full"
                px={5}
                h="34px"
                fontFamily="heading"
                fontWeight="700"
                fontSize="xs"
                letterSpacing="0.04em"
                border="1px solid"
                onClick={() => onLeastSelect(option.id)}
                bg={isLeast ? 'rgba(255,255,255,0.10)' : 'transparent'}
                color={isLeast ? 'white' : 'whiteAlpha.600'}
                borderColor={isLeast ? 'whiteAlpha.400' : 'whiteAlpha.200'}
                _hover={{
                  bg:          'whiteAlpha.100',
                  borderColor: 'whiteAlpha.400',
                  color:       'white',
                }}
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

