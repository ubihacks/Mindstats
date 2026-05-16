import React, { useState } from 'react';
import {
  Box, Button, Heading, Text, VStack, HStack, SimpleGrid,
  Badge, Flex, Icon, Container, useToast, Checkbox, CheckboxGroup,
  Divider, Progress, Image,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';

// DISC trait options per dimension
const DISC_TRAITS: Record<string, { label: string; traits: string[] }> = {
  D: {
    label: 'Dominance (Drive & Results)',
    traits: [
      'Takes charge and makes decisions quickly',
      'Thrives in competitive environments',
      'Direct and to-the-point communication',
      'Comfortable challenging the status quo',
      'High sense of urgency',
    ],
  },
  I: {
    label: 'Influence (People & Enthusiasm)',
    traits: [
      'Builds rapport easily with others',
      'Enthusiastic and motivates the team',
      'Persuasive communicator',
      'Creative and idea-generating',
      'Collaborative and optimistic',
    ],
  },
  S: {
    label: 'Steadiness (Patience & Support)',
    traits: [
      'Calm and composed under pressure',
      'Consistent and reliable performer',
      'Supportive team player',
      'Patient and good listener',
      'Prefers stable, predictable environment',
    ],
  },
  C: {
    label: 'Conscientiousness (Accuracy & Quality)',
    traits: [
      'Analytical and detail-oriented',
      'Values accuracy over speed',
      'Follows processes and standards',
      'Asks clarifying questions before acting',
      'High personal quality standards',
    ],
  },
};

const HMDemandPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [selected, setSelected] = useState<Record<string, string[]>>({
    D: [], I: [], S: [], C: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSelected = Object.values(selected).flat().length;

  const handleChange = (dim: string, values: string[]) => {
    setSelected((prev) => ({ ...prev, [dim]: values }));
  };

  const handleSubmit = async () => {
    if (totalSelected < 3) {
      toast({ title: 'Select at least 3 traits', status: 'warning', position: 'top', duration: 3000 });
      return;
    }
    if (!roleId) return;
    setSubmitting(true);
    try {
      const behaviouralDemand = { traits: selected };

      const { error } = await supabase
        .from('hiring_roles')
        .update({
          behavioural_demand: behaviouralDemand,
          hiring_manager_status: 'COMPLETED',
        })
        .eq('id', roleId);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: err.message ?? 'Submission failed', status: 'error', position: 'top' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Flex minH="100vh" bg="slate.50" align="center" justify="center" p={6}>
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="card-hover"
          p={12}
          maxW="480px"
          w="full"
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient="linear(to-r, brand.400, purple.400)" />
          <VStack spacing={5}>
            <HStack spacing={2} color="brand.600" fontWeight="800" fontSize="lg">
              <Image src="/mindstats-logo.svg" h="24px" alt="Mindstat" />
            </HStack>
            <Box bg="green.50" borderRadius="full" p={5} border="6px solid" borderColor="green.100">
              <Icon as={CheckCircleIcon} boxSize={10} color="green.500" />
            </Box>
            <VStack spacing={2}>
              <Heading size="md" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
                Demand Profile Submitted!
              </Heading>
              <Text color="slate.500" fontSize="sm" lineHeight="1.8">
                Thank you. The HR team will now be able to invite candidates for this role.
              </Text>
            </VStack>
            <Badge bg="brand.50" color="brand.700" borderRadius="xl" px={4} py={2} fontSize="xs" fontWeight="700">
              {totalSelected} traits selected ✓
            </Badge>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Box bg="slate.50" minH="100vh" pb={20}>
      {/* Header */}
      <Box position="sticky" top={0} zIndex={10} bg="white" borderBottom="1px solid" borderColor="slate.100" boxShadow="0 1px 3px rgba(0,0,0,0.06)">
        <Container maxW="2xl" py={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <HStack spacing={3}>
              <Image src="/mindstat-favicon.svg" h="32px" w="32px" alt="Mindstat" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="700" color="slate.900" letterSpacing="-0.02em">
                  Role Behavioural Demand
                </Text>
                <Text fontSize="xs" color="slate.500">Select the traits you need in this candidate</Text>
              </VStack>
            </HStack>
            <Badge bg="brand.50" color="brand.700" borderRadius="full" px={3} fontWeight="700" fontSize="xs">
              {totalSelected} selected
            </Badge>
          </Flex>
          <Progress value={Math.min((totalSelected / 8) * 100, 100)} size="xs" colorScheme="purple" bg="slate.100" borderRadius="full" />
        </Container>
      </Box>

      <Container maxW="2xl" pt={8}>
        <VStack spacing={4} align="stretch" mb={8}>
          <Heading size="md" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            What behavioural traits does this role demand?
          </Heading>
          <Text color="slate.500" fontSize="sm">
            Select all traits that apply. You must pick at least 3. This defines the ideal behavioural profile for the candidate.
          </Text>
        </VStack>

        <VStack spacing={5} align="stretch">
          {Object.entries(DISC_TRAITS).map(([dim, { label, traits }]) => (
            <Box key={dim} bg="white" borderRadius="2xl" border="1px solid" borderColor="slate.100" boxShadow="card" overflow="hidden">
              <Flex
                px={5} py={3}
                bg={selected[dim].length > 0 ? 'brand.50' : 'slate.50'}
                borderBottom="1px solid"
                borderColor={selected[dim].length > 0 ? 'brand.100' : 'slate.100'}
                align="center"
                justify="space-between"
              >
                <HStack spacing={2.5}>
                  <Box
                    w={7} h={7} bg="brand.600" color="white" borderRadius="lg"
                    display="flex" alignItems="center" justifyContent="center"
                    fontSize="xs" fontWeight="800"
                  >
                    {dim}
                  </Box>
                  <Text fontWeight="700" fontSize="sm" color="slate.900">{label}</Text>
                </HStack>
                {selected[dim].length > 0 && (
                  <Badge bg="brand.100" color="brand.700" borderRadius="full" fontSize="xs" fontWeight="700" px={2}>
                    {selected[dim].length} selected
                  </Badge>
                )}
              </Flex>

              <Box p={5}>
                <CheckboxGroup value={selected[dim]} onChange={(vals) => handleChange(dim, vals as string[])}>
                  <VStack align="stretch" spacing={2.5}>
                    {traits.map((trait) => (
                      <Checkbox
                        key={trait}
                        value={trait}
                        colorScheme="purple"
                        size="md"
                      >
                        <Text fontSize="sm" color="slate.700" fontWeight="500">{trait}</Text>
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </Box>
            </Box>
          ))}
        </VStack>

        <Box
          position="sticky"
          bottom={6}
          mt={8}
          bg="white"
          borderRadius="2xl"
          boxShadow="card-hover"
          border="1px solid"
          borderColor="slate.100"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="700" color="slate.900">
                {totalSelected} trait{totalSelected !== 1 ? 's' : ''} selected
              </Text>
              <Text fontSize="xs" color="slate.400">Minimum 3 required</Text>
            </VStack>
            <Button
              bg="brand.600"
              color="white"
              fontWeight="700"
              px={8}
              isLoading={submitting}
              loadingText="Submitting…"
              isDisabled={totalSelected < 3}
              onClick={handleSubmit}
              _hover={{ bg: 'brand.700', boxShadow: 'brand-glow', transform: 'translateY(-1px)' }}
              _disabled={{ opacity: 0.5 }}
              transition="all 0.15s"
            >
              Submit Demand Profile
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default HMDemandPage;
