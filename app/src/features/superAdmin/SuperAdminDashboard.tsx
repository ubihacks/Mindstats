import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Skeleton,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge,
  Icon, Flex, Input, InputGroup, InputLeftElement, Button,
  useToast, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Tooltip,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, useDisclosure, Stat, StatLabel,
  StatNumber, StatHelpText, Divider, Select,
} from '@chakra-ui/react';
import { SearchIcon, EditIcon } from '@chakra-ui/icons';
import {
  MdBusiness, MdPeople, MdCreditCard, MdTrendingUp, MdVerified,
} from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllCompanies, updateCompanyCredits, type CompanyOverview } from './superAdminSlice';

const PLAN_COLORS: Record<string, string> = {
  ON_DEMAND: 'gray',
  STEADY:    'blue',
  GROWTH:    'purple',
  SCALE:     'green',
};

const StatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string; isLoading?: boolean;
}> = ({ label, value, sub, icon, accent, isLoading }) => (
  <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="gray.100">
    <Flex justify="space-between" align="flex-start">
      <Box>
        <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={1}>
          {label}
        </Text>
        {isLoading ? <Skeleton h="36px" w="80px" /> : (
          <Text fontSize="3xl" fontWeight="800" color="gray.900" letterSpacing="-0.04em" lineHeight="1">
            {value}
          </Text>
        )}
        {sub && !isLoading && <Text fontSize="xs" color="gray.400" mt={1}>{sub}</Text>}
      </Box>
      <Box bg={`${accent}18`} borderRadius="xl" p={3}>
        <Icon as={icon} boxSize={6} color={accent} />
      </Box>
    </Flex>
  </Box>
);

const SuperAdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { companies, status } = useAppSelector((s) => s.superAdmin);
  const isLoading = status === 'loading';

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [editTarget, setEditTarget] = useState<CompanyOverview | null>(null);
  const [newCredits, setNewCredits] = useState(0);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  const filtered = companies.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase());
    const matchPlan = !planFilter || c.currentPlan === planFilter;
    return matchSearch && matchPlan;
  });

  // Aggregate stats
  const totalCredits   = companies.reduce((s, c) => s + c.credits, 0);
  const totalUsers     = companies.reduce((s, c) => s + c.userCount, 0);
  const totalRoles     = companies.reduce((s, c) => s + c.roleCount, 0);
  const paidCompanies  = companies.filter((c) => c.currentPlan && c.currentPlan !== 'ON_DEMAND').length;

  const openEdit = (co: CompanyOverview) => {
    setEditTarget(co);
    setNewCredits(co.credits);
    onOpen();
  };

  const handleSaveCredits = async () => {
    if (!editTarget) return;
    setSaving(true);
    const result = await dispatch(updateCompanyCredits({ companyId: editTarget.id, credits: newCredits }));
    setSaving(false);
    if (updateCompanyCredits.fulfilled.match(result)) {
      toast({ title: `Credits updated for ${editTarget.name}`, status: 'success', position: 'top', duration: 3000 });
      onClose();
    } else {
      toast({ title: 'Failed to update credits', status: 'error', position: 'top' });
    }
  };

  return (
    <Box p={{ base: 6, md: 10 }}>
      {/* Header */}
      <Flex justify="space-between" align="flex-end" mb={8}>
        <Box>
          <Text fontSize="xs" fontWeight="700" color="red.500" textTransform="uppercase" letterSpacing="0.1em" mb={1}>
            Super Admin
          </Text>
          <Heading size="lg" fontWeight="800" color="gray.900" letterSpacing="-0.03em">
            Product Overview
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {companies.length} company workspace{companies.length !== 1 ? 's' : ''} onboarded
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={MdTrendingUp} />}
          size="sm"
          variant="outline"
          borderColor="gray.200"
          color="gray.600"
          fontWeight="600"
          onClick={() => dispatch(fetchAllCompanies())}
          isLoading={isLoading}
          loadingText="Refreshing…"
          _hover={{ bg: 'gray.50' }}
        >
          Refresh
        </Button>
      </Flex>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard label="Companies"     value={companies.length} sub={`${paidCompanies} on paid plans`}  icon={MdBusiness}    accent="blue.500"   isLoading={isLoading} />
        <StatCard label="Total Users"   value={totalUsers}       sub="across all workspaces"              icon={MdPeople}      accent="purple.500" isLoading={isLoading} />
        <StatCard label="Credits Held"  value={totalCredits}     sub="remaining across all companies"     icon={MdCreditCard}  accent="green.500"  isLoading={isLoading} />
        <StatCard label="Active Roles"  value={totalRoles}       sub="hiring roles created"               icon={MdVerified}    accent="orange.500" isLoading={isLoading} />
      </SimpleGrid>

      {/* Filters */}
      <HStack mb={4} spacing={3}>
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search company or domain…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: 'blue.400' }}
          />
        </InputGroup>
        <Select
          maxW="180px"
          placeholder="All plans"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          _focus={{ borderColor: 'blue.400' }}
        >
          <option value="ON_DEMAND">On Demand</option>
          <option value="STEADY">Steady</option>
          <option value="GROWTH">Growth</option>
          <option value="SCALE">Scale</option>
        </Select>
      </HStack>

      {/* Companies Table */}
      <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em" py={3}>Company</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em">Plan</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em" isNumeric>Credits</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em" isNumeric>Used</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em" isNumeric>Users</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em" isNumeric>Roles</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em">Onboarded</Th>
                <Th fontSize="10px" color="gray.500" letterSpacing="0.08em"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Tr key={i}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <Td key={j}><Skeleton h="16px" w="80px" /></Td>
                      ))}
                    </Tr>
                  ))
                : filtered.map((co) => (
                    <Tr key={co.id} _hover={{ bg: 'gray.50' }} transition="background 0.1s">
                      <Td py={3}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="700" color="gray.900" fontSize="sm">{co.name}</Text>
                          <Text fontSize="xs" color="gray.400">{co.domain}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={PLAN_COLORS[co.currentPlan ?? ''] ?? 'gray'}
                          borderRadius="full"
                          px={2}
                          fontSize="10px"
                          fontWeight="700"
                        >
                          {co.currentPlan ?? 'No plan'}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        <Text fontWeight="700" color={co.credits === 0 ? 'red.500' : co.credits < 3 ? 'orange.500' : 'green.600'} fontSize="sm">
                          {co.credits}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" color="gray.500">{co.usedCredits}</Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" color="gray.700">{co.userCount}</Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" color="gray.700">{co.roleCount}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="xs" color="gray.400">
                          {new Date(co.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                      </Td>
                      <Td>
                        <Tooltip label="Edit credits" hasArrow>
                          <Button
                            size="xs"
                            variant="ghost"
                            color="blue.500"
                            leftIcon={<EditIcon />}
                            onClick={() => openEdit(co)}
                            _hover={{ bg: 'blue.50' }}
                          >
                            Credits
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </Table>
        </TableContainer>
        {!isLoading && filtered.length === 0 && (
          <Flex justify="center" py={12}>
            <Text color="gray.400" fontSize="sm">No companies match your search.</Text>
          </Flex>
        )}
      </Box>

      {/* Edit Credits Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontWeight="800" fontSize="lg" pt={6} letterSpacing="-0.03em">
            Edit Credits
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="full" bg="gray.50" borderRadius="xl" p={4}>
                <Stat>
                  <StatLabel fontSize="xs" color="gray.500">Company</StatLabel>
                  <StatNumber fontSize="lg" fontWeight="700" color="gray.900">{editTarget?.name}</StatNumber>
                  <StatHelpText fontSize="xs">{editTarget?.domain}</StatHelpText>
                </Stat>
                <Divider my={3} />
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.500">Current credits</Text>
                  <Text fontWeight="700" color="gray.900">{editTarget?.credits}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm" mt={1}>
                  <Text color="gray.500">Used credits</Text>
                  <Text fontWeight="600" color="gray.600">{editTarget?.usedCredits}</Text>
                </HStack>
              </Box>
              <Box w="full">
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Set new credit balance</Text>
                <NumberInput
                  value={newCredits}
                  onChange={(_, val) => setNewCredits(isNaN(val) ? 0 : val)}
                  min={0}
                  max={9999}
                  size="lg"
                >
                  <NumberInputField bg="gray.50" border="1.5px solid" borderColor="gray.200" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose} color="gray.500">Cancel</Button>
            <Button
              bg="blue.600"
              color="white"
              fontWeight="700"
              isLoading={saving}
              loadingText="Saving…"
              onClick={handleSaveCredits}
              _hover={{ bg: 'blue.700' }}
            >
              Save Credits
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SuperAdminDashboard;
