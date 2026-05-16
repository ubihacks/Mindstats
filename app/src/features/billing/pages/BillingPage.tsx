import React, { useEffect } from 'react';
import {
  Box, SimpleGrid, Heading, Text, VStack, HStack, Button,
  Badge, Divider, Flex, Tooltip, List, ListItem, ListIcon,
  Switch, useToast, Alert, AlertIcon, Skeleton, Icon, Progress,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { CheckIcon, StarIcon } from '@chakra-ui/icons';
import { MdCreditCard, MdBolt, MdSupportAgent, MdPeople } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { purchasePlan, setPaymentCycle, PLANS } from '../billingSlice';
import type { PlanType } from '../../../types';

const formatRM = (n: number) =>
  `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 0 })}`;

const PLAN_ORDER: PlanType[] = ['ON_DEMAND', 'STEADY', 'GROWTH', 'SCALE'];

const PLAN_ICONS: Record<PlanType, React.ElementType> = {
  ON_DEMAND: MdBolt,
  STEADY: MdCreditCard,
  GROWTH: MdSupportAgent,
  SCALE: MdPeople,
};

const PLAN_COLORS: Record<PlanType, { accent: string; bg: string; text: string }> = {
  ON_DEMAND: { accent: '#6366F1', bg: '#EEF2FF', text: '#4338CA' },
  STEADY:    { accent: '#0EA5E9', bg: '#F0F9FF', text: '#0369A1' },
  GROWTH:    { accent: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
  SCALE:     { accent: '#EC4899', bg: '#FDF2F8', text: '#BE185D' },
};

const BillingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { currentPlan, paymentCycle, credits, usedCredits, status } = useAppSelector((s) => s.billing);

  // DataBootstrap handles billing fetch — no useEffect needed here

  const handlePurchase = async (planType: PlanType) => {
    if (!user) return;
    const result = await dispatch(purchasePlan({ companyId: user.id, plan: planType, cycle: paymentCycle }));
    if (purchasePlan.fulfilled.match(result)) {
      toast({ title: 'Plan activated!', status: 'success', position: 'top', duration: 3000 });
    } else {
      toast({ title: 'Purchase failed', status: 'error', position: 'top', duration: 4000 });
    }
  };

  const isLoading = status === 'loading';

  return (
    <Box>
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            Billing & Plans
          </Heading>
          <Text color="slate.500" fontSize="sm">Manage your subscription and assessment credits</Text>
        </VStack>
      </Flex>

      {/* ── Current Plan Stats ── */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={10}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height="100px" borderRadius="2xl" />)
        ) : (
          <>
            <Box bg="white" borderRadius="2xl" p={6} boxShadow="card" border="1px solid" borderColor="slate.100">
              <Text fontSize="xs" fontWeight="700" color="slate.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                Available Credits
              </Text>
              <Text fontSize="3xl" fontWeight="800" color="brand.600" letterSpacing="-0.04em" mb={1}>
                {credits}
              </Text>
              <Progress
                value={Math.min((credits / Math.max(credits + usedCredits, 1)) * 100, 100)}
                size="xs"
                colorScheme={credits > 5 ? 'green' : credits > 0 ? 'yellow' : 'red'}
                bg="slate.100"
                borderRadius="full"
                mt={2}
              />
              <Text fontSize="xs" color="slate.400" mt={1}>{usedCredits} used</Text>
            </Box>

            <Box bg="white" borderRadius="2xl" p={6} boxShadow="card" border="1px solid" borderColor="slate.100">
              <Text fontSize="xs" fontWeight="700" color="slate.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                Current Plan
              </Text>
              <Text fontSize="2xl" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                {currentPlan ? PLANS[currentPlan].name : 'No Plan'}
              </Text>
              <Text fontSize="xs" color="slate.400" mt={1}>
                {paymentCycle === 'MONTHLY' ? 'Monthly billing' : 'Annual billing'}
              </Text>
            </Box>

            <Box bg="white" borderRadius="2xl" p={6} boxShadow="card" border="1px solid" borderColor="slate.100">
              <Text fontSize="xs" fontWeight="700" color="slate.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                Team Size
              </Text>
              <Text fontSize="3xl" fontWeight="800" color="slate.900" letterSpacing="-0.04em">
                {currentPlan ? PLANS[currentPlan].maxUsers : '—'}
              </Text>
              <Text fontSize="xs" color="slate.400" mt={1}>Unlimited hiring managers</Text>
            </Box>
          </>
        )}
      </SimpleGrid>

      {/* ── Billing Toggle ── */}
      <Flex
        align="center"
        gap={4}
        mb={8}
        justify="center"
        bg="white"
        borderRadius="2xl"
        py={4}
        px={8}
        boxShadow="card"
        border="1px solid"
        borderColor="slate.100"
        maxW="400px"
        mx="auto"
      >
        <Text fontWeight="700" fontSize="sm" color={paymentCycle === 'MONTHLY' ? 'slate.900' : 'slate.400'}>
          Monthly
        </Text>
        <Switch
          colorScheme="purple"
          size="lg"
          isChecked={paymentCycle === 'YEARLY'}
          onChange={(e) => dispatch(setPaymentCycle(e.target.checked ? 'YEARLY' : 'MONTHLY'))}
        />
        <HStack spacing={2}>
          <Text fontWeight="700" fontSize="sm" color={paymentCycle === 'YEARLY' ? 'slate.900' : 'slate.400'}>
            Yearly
          </Text>
          <Badge bg="green.50" color="green.700" borderRadius="full" px={2} py={0.5} fontSize="xs" fontWeight="700">
            Save 20%
          </Badge>
        </HStack>
      </Flex>

      {/* ── Plan Cards ── */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
        {PLAN_ORDER.map((planType) => {
          const plan         = PLANS[planType];
          const isCurrentPlan = currentPlan === planType;
          const isPopular    = planType === 'GROWTH';
          const colors       = PLAN_COLORS[planType];
          const planIcon     = PLAN_ICONS[planType];
          const monthlyPrice = paymentCycle === 'YEARLY'
            ? Math.round(plan.priceYearly / 12)
            : plan.priceMonthly;

          return (
            <Box
              key={planType}
              bg="white"
              borderRadius="2xl"
              boxShadow={isCurrentPlan ? 'card-hover' : 'card'}
              border="1.5px solid"
              borderColor={isCurrentPlan ? colors.accent : isPopular ? 'purple.100' : 'slate.100'}
              overflow="hidden"
              position="relative"
              _hover={{ boxShadow: 'card-hover', transform: 'translateY(-3px)' }}
              transition="all 0.2s"
            >
              {/* Popular badge */}
              {isPopular && (
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                >
                  <Badge
                    bg="purple.600"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    ✦ POPULAR
                  </Badge>
                </Box>
              )}

              {/* Plan header */}
              <Box p={5} pb={4}>
                <HStack spacing={3} mb={3}>
                  <Box
                    w={9} h={9}
                    bg={colors.bg}
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={planIcon} color={colors.accent} boxSize={5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="800" fontSize="md" color="slate.900">{plan.name}</Text>
                    <Text fontSize="xs" color="slate.400">{plan.supportLabel}</Text>
                  </VStack>
                </HStack>

                <HStack align="baseline" spacing={1} mb={1}>
                  <Text fontSize="2xl" fontWeight="800" color={colors.accent} letterSpacing="-0.04em">
                    {formatRM(monthlyPrice)}
                  </Text>
                  <Text fontSize="xs" color="slate.400" fontWeight="600">/mo</Text>
                </HStack>

                {paymentCycle === 'YEARLY' && (
                  <Text fontSize="xs" color="green.600" fontWeight="600">
                    {formatRM(plan.priceYearly)}/year · save {formatRM(plan.priceMonthly * 12 - plan.priceYearly)}
                  </Text>
                )}
              </Box>

              <Divider borderColor="slate.50" />

              <Box p={5} pt={4}>
                <List spacing={2.5} fontSize="sm" mb={5}>
                  {[
                    { icon: MdBolt, text: `${plan.creditsPerMonth} credit${plan.creditsPerMonth !== 1 ? 's' : ''}/month` },
                    { icon: MdPeople, text: `${plan.maxUsers} users` },
                    { icon: CheckIcon, text: `${plan.maxRolloverCredits} rollover credits max` },
                    { icon: CheckIcon, text: `${plan.responseTime} response` },
                  ].map(({ icon, text }) => (
                    <ListItem key={text}>
                      <HStack spacing={2.5}>
                        <Box
                          w={5} h={5} bg={colors.bg} borderRadius="md"
                          display="flex" alignItems="center" justifyContent="center"
                          flexShrink={0}
                        >
                          <ListIcon as={icon} color={colors.accent} m={0} boxSize={3} />
                        </Box>
                        <Text color="slate.600" fontSize="xs" fontWeight="500">{text}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>

                <Tooltip
                  label={isCurrentPlan ? 'This is your current active plan' : ''}
                  hasArrow
                  isDisabled={!isCurrentPlan}
                >
                  <Button
                    w="full"
                    size="md"
                    bg={isCurrentPlan ? 'transparent' : colors.accent}
                    color={isCurrentPlan ? colors.accent : 'white'}
                    border={isCurrentPlan ? '1.5px solid' : 'none'}
                    borderColor={isCurrentPlan ? colors.accent : 'transparent'}
                    isLoading={status === 'loading'}
                    loadingText="Processing…"
                    onClick={() => handlePurchase(planType)}
                    isDisabled={isCurrentPlan}
                    fontWeight="700"
                    _hover={{ opacity: isCurrentPlan ? 1 : 0.9, transform: isCurrentPlan ? 'none' : 'translateY(-1px)' }}
                    _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
                    transition="all 0.15s"
                  >
                    {isCurrentPlan ? '✓ Current Plan' : 'Activate Plan'}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>

      <Alert status="info" borderRadius="xl" mt={8} border="1px solid" borderColor="blue.100">
        <AlertIcon />
        <Text fontSize="sm" color="slate.600">
          For annual payments, invoice and bank transfer options are available. Contact support to arrange.
          Plan downgrades take effect at end of cycle. No refunds.
        </Text>
      </Alert>
    </Box>
  );
};

export default BillingPage;
