import React, { useState } from 'react';
import {
  Box, Button, Container, Flex, Heading, HStack, Icon,
  List, ListIcon, ListItem, SimpleGrid, Text, VStack, Badge,
  ButtonGroup,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { MdStar } from 'react-icons/md';
import { PLANS } from '../features/billing/billingSlice';
import type { PlanType, PaymentCycle } from '../types';

const MotionBox = motion(Box);

interface PlanCardProps {
  planKey: PlanType;
  cycle: PaymentCycle;
  isPopular?: boolean;
}

const FEATURES: Record<PlanType, string[]> = {
  ON_DEMAND: [
    '1 credit per month',
    'Up to 2 users',
    'No credit rollover',
    'Email support (3 business days)',
    'Full DISC report per assessment',
    '2-week candidate link expiry',
    'Credit refund on unused links',
  ],
  STEADY: [
    '5 credits per month',
    'Up to 4 users',
    'Roll over up to 5 credits',
    'Email support (48 hours)',
    'Full DISC report per assessment',
    '2-week candidate link expiry',
    'Credit refund on unused links',
  ],
  GROWTH: [
    '15 credits per month',
    'Up to 8 users',
    'Roll over up to 30 credits',
    'Priority email (24 hours)',
    'Full DISC report per assessment',
    '2-week candidate link expiry',
    'Credit refund on unused links',
    'Admin team management portal',
  ],
  SCALE: [
    '30 credits per month',
    'Up to 20 users',
    'Roll over up to 90 credits',
    'Dedicated support (12 hours)',
    'Full DISC report per assessment',
    '2-week candidate link expiry',
    'Credit refund on unused links',
    'Admin team management portal',
    'Advanced analytics dashboard',
  ],
};

const PlanCard: React.FC<PlanCardProps> = ({ planKey, cycle, isPopular }) => {
  const plan = PLANS[planKey];
  const price = cycle === 'YEARLY'
    ? Math.round(plan.priceYearly / 12)
    : plan.priceMonthly;
  const savings = cycle === 'YEARLY'
    ? Math.round(((plan.priceMonthly * 12 - plan.priceYearly) / (plan.priceMonthly * 12)) * 100)
    : 0;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      h="full"
    >
      <Box
        bg={isPopular ? 'brand.800' : 'white'}
        border="1.5px solid"
        borderColor={isPopular ? 'teal.500' : 'slate.200'}
        borderRadius="2xl"
        p={8}
        h="full"
        position="relative"
        boxShadow={isPopular ? '0 8px 32px rgba(0,51,102,0.25)' : 'card'}
        _hover={{ transform: 'translateY(-4px)', boxShadow: isPopular ? '0 12px 40px rgba(0,51,102,0.35)' : 'card-hover' }}
        transition="all 0.25s ease"
      >
        {isPopular && (
          <Badge
            position="absolute"
            top="-12px"
            left="50%"
            transform="translateX(-50%)"
            bg="teal.500"
            color="white"
            fontSize="10px"
            fontWeight="800"
            px={4} py={1.5}
            borderRadius="full"
            letterSpacing="0.06em"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            Most Popular
          </Badge>
        )}

        <VStack align="stretch" spacing={6} h="full">
          {/* Plan name */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="700"
              color={isPopular ? 'teal.300' : 'brand.700'}
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={1}
            >
              {plan.name}
            </Text>
            <HStack align="baseline" spacing={1}>
              <Text
                fontFamily="heading"
                fontSize="4xl"
                fontWeight="800"
                color={isPopular ? 'white' : 'slate.800'}
                letterSpacing="-0.04em"
                lineHeight="1"
              >
                ${price}
              </Text>
              <Text fontSize="sm" color={isPopular ? 'whiteAlpha.600' : 'slate.500'} fontWeight="500">
                /mo
              </Text>
            </HStack>
            {cycle === 'YEARLY' && savings > 0 && (
              <Badge
                bg={isPopular ? 'teal.900' : 'teal.50'}
                color={isPopular ? 'teal.300' : 'teal.700'}
                fontSize="10px"
                fontWeight="700"
                px={2} py={0.5}
                borderRadius="full"
                mt={2}
                display="inline-block"
              >
                Save {savings}% yearly
              </Badge>
            )}
            {cycle === 'MONTHLY' && (
              <Text fontSize="xs" color={isPopular ? 'whiteAlpha.500' : 'slate.400'} mt={1}>
                Billed monthly · Cancel anytime
              </Text>
            )}
          </Box>

          {/* User & credit limits */}
          <Box
            bg={isPopular ? 'whiteAlpha.100' : 'slate.50'}
            borderRadius="xl"
            p={4}
          >
            <HStack justify="space-between">
              <Text fontSize="sm" color={isPopular ? 'whiteAlpha.700' : 'slate.600'}>
                Credits / month
              </Text>
              <Text
                fontSize="sm"
                fontWeight="700"
                color={isPopular ? 'white' : 'slate.800'}
              >
                {plan.creditsPerMonth}
              </Text>
            </HStack>
            <HStack justify="space-between" mt={2}>
              <Text fontSize="sm" color={isPopular ? 'whiteAlpha.700' : 'slate.600'}>
                Max users
              </Text>
              <Text
                fontSize="sm"
                fontWeight="700"
                color={isPopular ? 'white' : 'slate.800'}
              >
                {plan.maxUsers}
              </Text>
            </HStack>
            <HStack justify="space-between" mt={2}>
              <Text fontSize="sm" color={isPopular ? 'whiteAlpha.700' : 'slate.600'}>
                Rollover credits
              </Text>
              <Text
                fontSize="sm"
                fontWeight="700"
                color={isPopular ? 'white' : 'slate.800'}
              >
                {plan.maxRolloverCredits === 0 ? 'None' : `Up to ${plan.maxRolloverCredits}`}
              </Text>
            </HStack>
          </Box>

          {/* Feature list */}
          <List spacing={2.5} flex={1}>
            {FEATURES[planKey].map((f) => (
              <ListItem key={f} display="flex" alignItems="flex-start" gap={2}>
                <Icon
                  as={CheckIcon}
                  color={isPopular ? 'teal.400' : 'teal.600'}
                  boxSize={3.5}
                  mt={0.5}
                  flexShrink={0}
                />
                <Text
                  fontSize="sm"
                  color={isPopular ? 'whiteAlpha.800' : 'slate.700'}
                  lineHeight="1.5"
                >
                  {f}
                </Text>
              </ListItem>
            ))}
          </List>

          {/* CTA */}
          <Button
            as={RouterLink}
            to="/register"
            w="full"
            size="md"
            bg={isPopular ? 'teal.500' : 'brand.700'}
            color="white"
            fontWeight="700"
            borderRadius="md"
            rightIcon={<ArrowForwardIcon />}
            _hover={{
              bg: isPopular ? 'teal.400' : 'brand.800',
              transform: 'translateY(-1px)',
            }}
            transition="all 0.15s ease"
          >
            Get Started
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const PublicPricingPage: React.FC = () => {
  const [cycle, setCycle] = useState<PaymentCycle>('MONTHLY');

  return (
    <Box>
      {/* ── Header ─────────────────────────────────────────── */}
      <Box bg="brand.800" py={{ base: 16, md: 20 }}>
        <Container maxW="860px" px={{ base: 5, md: 8 }} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
              mb={5}
              display="inline-block"
            >
              Simple, transparent pricing
            </Badge>
            <Heading
              fontFamily="heading"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
              mb={4}
            >
              Purchase individually or bulk credits for your team.
            </Heading>
            <Text color="whiteAlpha.600" fontSize="md" mb={8}>
              No hidden costs. Credit refunds on unused links. Cancel anytime.
            </Text>

            {/* Billing toggle */}
            <Flex justify="center">
              <ButtonGroup
                bg="whiteAlpha.100"
                borderRadius="full"
                p={1}
                spacing={0}
              >
                <Button
                  size="sm"
                  borderRadius="full"
                  px={5}
                  bg={cycle === 'MONTHLY' ? 'white' : 'transparent'}
                  color={cycle === 'MONTHLY' ? 'brand.800' : 'whiteAlpha.700'}
                  fontWeight="700"
                  onClick={() => setCycle('MONTHLY')}
                  _hover={{ bg: cycle === 'MONTHLY' ? 'white' : 'whiteAlpha.100' }}
                  transition="all 0.15s"
                >
                  Monthly
                </Button>
                <Button
                  size="sm"
                  borderRadius="full"
                  px={5}
                  bg={cycle === 'YEARLY' ? 'white' : 'transparent'}
                  color={cycle === 'YEARLY' ? 'brand.800' : 'whiteAlpha.700'}
                  fontWeight="700"
                  onClick={() => setCycle('YEARLY')}
                  _hover={{ bg: cycle === 'YEARLY' ? 'white' : 'whiteAlpha.100' }}
                  transition="all 0.15s"
                >
                  Yearly
                  <Badge
                    ml={2}
                    bg="teal.500"
                    color="white"
                    fontSize="9px"
                    fontWeight="800"
                    px={1.5}
                    borderRadius="full"
                  >
                    Save up to 10%
                  </Badge>
                </Button>
              </ButtonGroup>
            </Flex>
          </MotionBox>
        </Container>
      </Box>

      {/* ── Pricing cards ──────────────────────────────────── */}
      <Box bg="slate.50" py={{ base: 14, md: 20 }}>
        <Container maxW="1280px" px={{ base: 5, md: 8 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} alignItems="start">
            <PlanCard planKey="ON_DEMAND" cycle={cycle} />
            <PlanCard planKey="STEADY"    cycle={cycle} />
            <PlanCard planKey="GROWTH"    cycle={cycle} isPopular />
            <PlanCard planKey="SCALE"     cycle={cycle} />
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── Credit logic explainer ─────────────────────────── */}
      <Box bg="white" py={{ base: 14, md: 20 }}>
        <Container maxW="860px" px={{ base: 5, md: 8 }}>
          <VStack spacing={6} textAlign="center" mb={12}>
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
              How Credits Work
            </Badge>
            <Heading
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="700"
              color="slate.800"
              letterSpacing="-0.025em"
            >
              Fair, transparent credit logic
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {[
              {
                step: '01',
                title: '1 credit = 1 candidate',
                body: 'Each credit unlocks one candidate assessment link. The project manager assessment is always free.',
                cs: 'brand',
              },
              {
                step: '02',
                title: '2-week link expiry',
                body: 'Candidate invite links expire after 14 days. Unused credits are automatically refunded to your pool.',
                cs: 'teal',
              },
              {
                step: '03',
                title: 'First domain = 10 free credits',
                body: 'The first user to register from your company domain receives 10 free credits to get started.',
                cs: 'green',
              },
            ].map((item) => (
              <Box
                key={item.step}
                bg="slate.50"
                borderRadius="2xl"
                p={6}
                border="1px solid"
                borderColor="slate.200"
              >
                <Text
                  fontFamily="heading"
                  fontSize="3xl"
                  fontWeight="800"
                  color={`${item.cs}.100`}
                  lineHeight="1"
                  mb={3}
                >
                  {item.step}
                </Text>
                <Heading
                  size="sm"
                  fontFamily="heading"
                  fontWeight="700"
                  color="slate.800"
                  mb={2}
                >
                  {item.title}
                </Heading>
                <Text fontSize="sm" color="slate.600" lineHeight="1.7">
                  {item.body}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── CTA ───────────────────────────────────────────── */}
      <Box bg="brand.800" py={{ base: 14, md: 16 }}>
        <Container maxW="600px" px={{ base: 5, md: 8 }} textAlign="center">
          <Heading
            fontFamily="heading"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.025em"
            mb={4}
          >
            Start with 10 free credits
          </Heading>
          <Text color="whiteAlpha.600" mb={8}>
            The first user from your company domain gets 10 credits on signup — no credit card needed.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            bg="teal.600"
            color="white"
            fontWeight="700"
            borderRadius="md"
            rightIcon={<ArrowForwardIcon />}
            _hover={{ bg: 'teal.500', transform: 'translateY(-2px)' }}
            transition="all 0.15s ease"
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicPricingPage;
