import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Skeleton,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge,
  Icon, Flex, Input, InputGroup, InputLeftElement, Button,
  useToast, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Tooltip,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, useDisclosure, Stat, StatLabel,
  StatNumber, StatHelpText, Divider, Select, FormControl, FormLabel,
  Progress,
} from '@chakra-ui/react';
import { SearchIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import {
  MdBusiness, MdPeople, MdCreditCard, MdTrendingUp, MdVerified, MdRefresh,
} from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAllCompanies, fetchAllUsers,
  updateCompanyCredits, createCompany, createUser,
  type CompanyOverview,
} from './superAdminSlice';

/* ── constants ─────────────────────────────────────────────────────────── */
const NAVY = '#001e40';

const PLAN_COLORS: Record<string, string> = {
  ON_DEMAND: 'gray',
  STEADY:    'blue',
  GROWTH:    'purple',
  SCALE:     'green',
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:    'red',
  ADMIN:          'orange',
  HR:             'blue',
  HIRING_MANAGER: 'purple',
};

/* ── shared sub-components ─────────────────────────────────────────────── */
const StatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string; isLoading?: boolean;
}> = ({ label, value, sub, icon, accent, isLoading }) => (
  <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
    <Flex justify="space-between" align="flex-start">
      <Box>
        <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={1}>{label}</Text>
        {isLoading
          ? <Skeleton h="32px" w="72px" />
          : <Text fontSize="2xl" fontWeight="800" color="gray.900" letterSpacing="-0.04em" lineHeight="1">{value}</Text>
        }
        {sub && !isLoading && <Text fontSize="xs" color="gray.400" mt={1}>{sub}</Text>}
      </Box>
      <Box bg={`${accent}.50`} borderRadius="lg" p={2.5}>
        <Icon as={icon} boxSize={5} color={`${accent}.500`} />
      </Box>
    </Flex>
  </Box>
);

const SectionHeader: React.FC<{
  title: string; subtitle: string; action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <Flex justify="space-between" align="flex-end" mb={6}>
    <Box>
      <Text fontSize="xs" fontWeight="700" color="red.500" textTransform="uppercase" letterSpacing="0.1em" mb={0.5}>Super Admin</Text>
      <Heading size="lg" fontWeight="800" color="gray.900" letterSpacing="-0.03em">{title}</Heading>
      <Text fontSize="sm" color="gray.500" mt={0.5}>{subtitle}</Text>
    </Box>
    {action}
  </Flex>
);

/* ══════════════════════════════════════════════════════════════════════════
   OVERVIEW VIEW
══════════════════════════════════════════════════════════════════════════ */
const OverviewView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, status } = useAppSelector((s) => s.superAdmin);
  const isLoading = status === 'loading';

  const totalCredits  = companies.reduce((s, c) => s + c.credits, 0);
  const totalUsers    = companies.reduce((s, c) => s + c.userCount, 0);
  const totalRoles    = companies.reduce((s, c) => s + c.roleCount, 0);
  const paidCompanies = companies.filter((c) => c.currentPlan && c.currentPlan !== 'ON_DEMAND').length;

  return (
    <>
      <SectionHeader
        title="Product Overview"
        subtitle={`${companies.length} company workspace${companies.length !== 1 ? 's' : ''} onboarded`}
        action={
          <Button
            leftIcon={<Icon as={MdRefresh} />} size="sm" variant="outline"
            borderColor="gray.200" color="gray.600" fontWeight="600"
            onClick={() => dispatch(fetchAllCompanies())}
            isLoading={isLoading}
            _hover={{ bg: 'gray.50' }}
          >
            Refresh
          </Button>
        }
      />

      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard label="Companies"    value={companies.length} sub={`${paidCompanies} on paid plans`} icon={MdBusiness}   accent="blue"   isLoading={isLoading} />
        <StatCard label="Total Users"  value={totalUsers}       sub="across all workspaces"            icon={MdPeople}     accent="purple" isLoading={isLoading} />
        <StatCard label="Credits Held" value={totalCredits}     sub="remaining across all companies"   icon={MdCreditCard} accent="green"  isLoading={isLoading} />
        <StatCard label="Active Roles" value={totalRoles}       sub="hiring roles created"             icon={MdVerified}   accent="orange" isLoading={isLoading} />
      </SimpleGrid>

      {/* Plan breakdown */}
      <Box bg="white" borderRadius="xl" p={6} border="1px solid" borderColor="gray.100" mb={6}>
        <Text fontWeight="700" fontSize="sm" color="gray.700" mb={4}>Plan Distribution</Text>
        {(['ON_DEMAND', 'STEADY', 'GROWTH', 'SCALE'] as const).map((plan) => {
          const count = companies.filter((c) => (c.currentPlan ?? 'ON_DEMAND') === plan).length;
          const pct   = companies.length ? Math.round((count / companies.length) * 100) : 0;
          return (
            <Box key={plan} mb={3}>
              <Flex justify="space-between" mb={1}>
                <HStack spacing={2}>
                  <Badge colorScheme={PLAN_COLORS[plan]} borderRadius="full" fontSize="10px">{plan}</Badge>
                  <Text fontSize="xs" color="gray.500">{count} co{count !== 1 ? 's' : ''}</Text>
                </HStack>
                <Text fontSize="xs" fontWeight="700" color="gray.700">{pct}%</Text>
              </Flex>
              <Progress value={pct} colorScheme={PLAN_COLORS[plan]} size="xs" borderRadius="full" bg="gray.100" />
            </Box>
          );
        })}
      </Box>

      {/* Recent companies mini-table */}
      <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" overflow="hidden">
        <Box px={5} py={4} borderBottom="1px solid" borderColor="gray.100">
          <Text fontWeight="700" fontSize="sm" color="gray.700">Recent Workspaces</Text>
        </Box>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="10px" color="gray.500" py={3}>Company</Th>
                <Th fontSize="10px" color="gray.500">Plan</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Credits</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Users</Th>
                <Th fontSize="10px" color="gray.500">Onboarded</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Tr key={i}>{Array.from({ length: 5 }).map((__, j) => <Td key={j}><Skeleton h="14px" w="80px" /></Td>)}</Tr>
                  ))
                : companies.slice(0, 8).map((co) => (
                    <Tr key={co.id} _hover={{ bg: 'gray.50' }}>
                      <Td py={3}>
                        <Text fontWeight="600" fontSize="sm" color="gray.900">{co.name}</Text>
                        <Text fontSize="xs" color="gray.400">{co.domain}</Text>
                      </Td>
                      <Td><Badge colorScheme={PLAN_COLORS[co.currentPlan ?? ''] ?? 'gray'} borderRadius="full" fontSize="10px">{co.currentPlan ?? 'No plan'}</Badge></Td>
                      <Td isNumeric><Text fontWeight="700" fontSize="sm" color={co.credits === 0 ? 'red.500' : 'green.600'}>{co.credits}</Text></Td>
                      <Td isNumeric><Text fontSize="sm" color="gray.600">{co.userCount}</Text></Td>
                      <Td><Text fontSize="xs" color="gray.400">{new Date(co.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text></Td>
                    </Tr>
                  ))
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   COMPANIES VIEW  (full table + Add Company)
══════════════════════════════════════════════════════════════════════════ */
const CompaniesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast    = useToast();
  const { companies, status } = useAppSelector((s) => s.superAdmin);
  const isLoading = status === 'loading';

  const [search,     setSearch]     = useState('');
  const [planFilter, setPlanFilter] = useState('');

  // Edit credits modal
  const editDisc  = useDisclosure();
  const [editTarget,  setEditTarget]  = useState<CompanyOverview | null>(null);
  const [newCredits,  setNewCredits]  = useState(0);
  const [saving,      setSaving]      = useState(false);

  // Add company modal
  const addDisc = useDisclosure();
  const [form, setForm] = useState({ name: '', domain: '', website: '', credits: 10, plan: '' });
  const [adding, setAdding] = useState(false);

  const filtered = companies.filter((c) => {
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase());
    const mp = !planFilter || c.currentPlan === planFilter;
    return ms && mp;
  });

  const openEdit = (co: CompanyOverview) => { setEditTarget(co); setNewCredits(co.credits); editDisc.onOpen(); };

  const handleSaveCredits = async () => {
    if (!editTarget) return;
    setSaving(true);
    const result = await dispatch(updateCompanyCredits({ companyId: editTarget.id, credits: newCredits }));
    setSaving(false);
    if (updateCompanyCredits.fulfilled.match(result)) {
      toast({ title: `Credits updated for ${editTarget.name}`, status: 'success', position: 'top', duration: 3000 });
      editDisc.onClose();
    } else {
      toast({ title: 'Failed to update credits', status: 'error', position: 'top' });
    }
  };

  const handleAddCompany = async () => {
    if (!form.name.trim() || !form.domain.trim()) {
      toast({ title: 'Company name and domain are required', status: 'warning', position: 'top' });
      return;
    }
    setAdding(true);
    const result = await dispatch(createCompany(form));
    setAdding(false);
    if (createCompany.fulfilled.match(result)) {
      toast({ title: `${form.name} workspace created`, status: 'success', position: 'top', duration: 3000 });
      setForm({ name: '', domain: '', website: '', credits: 10, plan: '' });
      addDisc.onClose();
    } else {
      toast({ title: (result.payload as string) ?? 'Failed to create company', status: 'error', position: 'top' });
    }
  };

  return (
    <>
      <SectionHeader
        title="Companies"
        subtitle={`${companies.length} workspace${companies.length !== 1 ? 's' : ''} registered`}
        action={
          <HStack spacing={2}>
            <Button
              leftIcon={<Icon as={MdRefresh} />} size="sm" variant="outline"
              borderColor="gray.200" color="gray.600" fontWeight="600"
              onClick={() => dispatch(fetchAllCompanies())} isLoading={isLoading}
              _hover={{ bg: 'gray.50' }}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<AddIcon />} size="sm" bg={NAVY} color="white"
              fontWeight="700" borderRadius="full"
              onClick={addDisc.onOpen}
              _hover={{ bg: '#002952' }}
            >
              Add Company
            </Button>
          </HStack>
        }
      />

      {/* Filters */}
      <HStack mb={4} spacing={3}>
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
          <Input placeholder="Search name or domain…" value={search} onChange={(e) => setSearch(e.target.value)}
            bg="white" borderColor="gray.200" _focus={{ borderColor: 'blue.400' }} />
        </InputGroup>
        <Select maxW="180px" placeholder="All plans" value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          bg="white" borderColor="gray.200" _focus={{ borderColor: 'blue.400' }}>
          <option value="ON_DEMAND">On Demand</option>
          <option value="STEADY">Steady</option>
          <option value="GROWTH">Growth</option>
          <option value="SCALE">Scale</option>
        </Select>
      </HStack>

      {/* Full table */}
      <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="10px" color="gray.500" py={3}>Company</Th>
                <Th fontSize="10px" color="gray.500">Plan</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Credits</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Used</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Users</Th>
                <Th fontSize="10px" color="gray.500" isNumeric>Roles</Th>
                <Th fontSize="10px" color="gray.500">Onboarded</Th>
                <Th fontSize="10px" color="gray.500"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Tr key={i}>{Array.from({ length: 8 }).map((__, j) => <Td key={j}><Skeleton h="14px" w="80px" /></Td>)}</Tr>
                  ))
                : filtered.map((co) => (
                    <Tr key={co.id} _hover={{ bg: 'gray.50' }} transition="background 0.1s">
                      <Td py={3}>
                        <Text fontWeight="700" color="gray.900" fontSize="sm">{co.name}</Text>
                        <Text fontSize="xs" color="gray.400">{co.domain}</Text>
                      </Td>
                      <Td><Badge colorScheme={PLAN_COLORS[co.currentPlan ?? ''] ?? 'gray'} borderRadius="full" px={2} fontSize="10px" fontWeight="700">{co.currentPlan ?? 'No plan'}</Badge></Td>
                      <Td isNumeric><Text fontWeight="700" color={co.credits === 0 ? 'red.500' : co.credits < 3 ? 'orange.500' : 'green.600'} fontSize="sm">{co.credits}</Text></Td>
                      <Td isNumeric><Text fontSize="sm" color="gray.500">{co.usedCredits}</Text></Td>
                      <Td isNumeric><Text fontSize="sm" color="gray.700">{co.userCount}</Text></Td>
                      <Td isNumeric><Text fontSize="sm" color="gray.700">{co.roleCount}</Text></Td>
                      <Td><Text fontSize="xs" color="gray.400">{new Date(co.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text></Td>
                      <Td>
                        <Tooltip label="Edit credits" hasArrow>
                          <Button size="xs" variant="ghost" color="blue.500" leftIcon={<EditIcon />}
                            onClick={() => openEdit(co)} _hover={{ bg: 'blue.50' }}>
                            Credits
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))
              }
            </Tbody>
          </Table>
        </TableContainer>
        {!isLoading && filtered.length === 0 && (
          <Flex justify="center" py={12}><Text color="gray.400" fontSize="sm">No companies match your search.</Text></Flex>
        )}
      </Box>

      {/* ── Edit Credits Modal ── */}
      <Modal isOpen={editDisc.isOpen} onClose={editDisc.onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontWeight="800" fontSize="lg" pt={6} letterSpacing="-0.03em">Edit Credits</ModalHeader>
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
                <NumberInput value={newCredits} onChange={(_, val) => setNewCredits(isNaN(val) ? 0 : val)} min={0} max={9999} size="lg">
                  <NumberInputField bg="gray.50" border="1.5px solid" borderColor="gray.200" />
                  <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                </NumberInput>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2} pb={6}>
            <Button variant="ghost" onClick={editDisc.onClose} size="sm">Cancel</Button>
            <Button bg={NAVY} color="white" size="sm" borderRadius="full" fontWeight="700"
              isLoading={saving} onClick={handleSaveCredits} _hover={{ bg: '#002952' }}>
              Save Credits
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Add Company Modal ── */}
      <Modal isOpen={addDisc.isOpen} onClose={addDisc.onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontWeight="800" fontSize="lg" pt={6} letterSpacing="-0.03em">Add New Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Company Name</FormLabel>
                <Input placeholder="Acme Corp" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Domain</FormLabel>
                <Input placeholder="acme.com" value={form.domain}
                  onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Website URL</FormLabel>
                <Input placeholder="https://acme.com" value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }} />
              </FormControl>
              <HStack w="full" spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Initial Credits</FormLabel>
                  <NumberInput value={form.credits} onChange={(_, val) => setForm((f) => ({ ...f, credits: isNaN(val) ? 0 : val }))} min={0} max={9999}>
                    <NumberInputField bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }} />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Plan</FormLabel>
                  <Select placeholder="No plan" value={form.plan}
                    onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                    bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }}>
                    <option value="ON_DEMAND">On Demand</option>
                    <option value="STEADY">Steady</option>
                    <option value="GROWTH">Growth</option>
                    <option value="SCALE">Scale</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2} pb={6}>
            <Button variant="ghost" onClick={addDisc.onClose} size="sm">Cancel</Button>
            <Button bg={NAVY} color="white" size="sm" borderRadius="full" fontWeight="700"
              isLoading={adding} loadingText="Creating…"
              onClick={handleAddCompany} _hover={{ bg: '#002952' }}>
              Create Workspace
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   ANALYTICS VIEW
══════════════════════════════════════════════════════════════════════════ */
const AnalyticsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, status } = useAppSelector((s) => s.superAdmin);
  const isLoading = status === 'loading';

  const totalCredits = companies.reduce((s, c) => s + c.credits, 0);
  const totalUsed    = companies.reduce((s, c) => s + c.usedCredits, 0);
  const totalUsers   = companies.reduce((s, c) => s + c.userCount, 0);
  const totalRoles   = companies.reduce((s, c) => s + c.roleCount, 0);

  const topByCredits = [...companies].sort((a, b) => b.credits - a.credits).slice(0, 8);
  const maxCredits   = topByCredits[0]?.credits || 1;

  return (
    <>
      <SectionHeader
        title="Analytics"
        subtitle="Usage and distribution across all workspaces"
        action={
          <Button leftIcon={<Icon as={MdRefresh} />} size="sm" variant="outline"
            borderColor="gray.200" color="gray.600" fontWeight="600"
            onClick={() => dispatch(fetchAllCompanies())} isLoading={isLoading}
            _hover={{ bg: 'gray.50' }}>
            Refresh
          </Button>
        }
      />

      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard label="Total Credits" value={totalCredits} sub="remaining (all cos)"      icon={MdCreditCard}  accent="green"  isLoading={isLoading} />
        <StatCard label="Credits Used"  value={totalUsed}   sub="consumed assessments"      icon={MdTrendingUp}  accent="orange" isLoading={isLoading} />
        <StatCard label="Total Users"   value={totalUsers}  sub="across all workspaces"     icon={MdPeople}      accent="purple" isLoading={isLoading} />
        <StatCard label="Hiring Roles"  value={totalRoles}  sub="roles created"             icon={MdVerified}    accent="blue"   isLoading={isLoading} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Credit usage rate */}
        <Box bg="white" borderRadius="xl" p={6} border="1px solid" borderColor="gray.100">
          <Text fontWeight="700" fontSize="sm" color="gray.700" mb={1}>Credit Utilisation</Text>
          <Text fontSize="xs" color="gray.400" mb={4}>Used vs. held across the platform</Text>
          {isLoading ? <Skeleton h="40px" /> : (
            <>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="xs" color="gray.500">{totalUsed} used</Text>
                <Text fontSize="xs" fontWeight="700" color="gray.700">
                  {totalCredits + totalUsed > 0 ? Math.round((totalUsed / (totalCredits + totalUsed)) * 100) : 0}%
                </Text>
              </Flex>
              <Progress
                value={totalCredits + totalUsed > 0 ? (totalUsed / (totalCredits + totalUsed)) * 100 : 0}
                colorScheme="blue" size="sm" borderRadius="full" bg="gray.100"
              />
              <HStack mt={3} spacing={4} fontSize="xs" color="gray.400">
                <HStack spacing={1}><Box w={2} h={2} borderRadius="full" bg="blue.400" /><Text>Used</Text></HStack>
                <HStack spacing={1}><Box w={2} h={2} borderRadius="full" bg="gray.200" /><Text>Remaining</Text></HStack>
              </HStack>
            </>
          )}
        </Box>

        {/* Plan breakdown */}
        <Box bg="white" borderRadius="xl" p={6} border="1px solid" borderColor="gray.100">
          <Text fontWeight="700" fontSize="sm" color="gray.700" mb={1}>Plan Distribution</Text>
          <Text fontSize="xs" color="gray.400" mb={4}>Companies per pricing tier</Text>
          {(['ON_DEMAND', 'STEADY', 'GROWTH', 'SCALE'] as const).map((plan) => {
            const count = companies.filter((c) => (c.currentPlan ?? 'ON_DEMAND') === plan).length;
            const pct   = companies.length ? Math.round((count / companies.length) * 100) : 0;
            return (
              <Box key={plan} mb={3}>
                <Flex justify="space-between" mb={0.5}>
                  <HStack spacing={2}>
                    <Badge colorScheme={PLAN_COLORS[plan]} borderRadius="full" fontSize="9px">{plan}</Badge>
                    <Text fontSize="xs" color="gray.500">{count}</Text>
                  </HStack>
                  <Text fontSize="xs" fontWeight="700" color="gray.600">{pct}%</Text>
                </Flex>
                <Progress value={pct} colorScheme={PLAN_COLORS[plan]} size="xs" borderRadius="full" bg="gray.100" />
              </Box>
            );
          })}
        </Box>

        {/* Top companies by credits */}
        <Box bg="white" borderRadius="xl" p={6} border="1px solid" borderColor="gray.100" gridColumn={{ lg: 'span 2' }}>
          <Text fontWeight="700" fontSize="sm" color="gray.700" mb={1}>Top Companies by Credits Remaining</Text>
          <Text fontSize="xs" color="gray.400" mb={4}>Credit balance across top 8 workspaces</Text>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h="28px" mb={2} />)
            : topByCredits.map((co) => (
                <Box key={co.id} mb={3}>
                  <Flex justify="space-between" mb={0.5}>
                    <Text fontSize="xs" fontWeight="600" color="gray.700">{co.name}</Text>
                    <Text fontSize="xs" fontWeight="700" color="green.600">{co.credits} credits</Text>
                  </Flex>
                  <Progress value={(co.credits / maxCredits) * 100} colorScheme="green" size="xs" borderRadius="full" bg="gray.100" />
                </Box>
              ))
          }
        </Box>
      </SimpleGrid>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   USERS VIEW
══════════════════════════════════════════════════════════════════════════ */
const UsersView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, usersStatus, companies } = useAppSelector((s) => s.superAdmin);
  const isLoading = usersStatus === 'loading';
  const toast = useToast();

  const [search, setSearch] = useState('');
  const addDisc = useDisclosure();
  const [adding, setAdding] = useState(false);
  const [userForm, setUserForm] = useState({
    email: '', password: '', companyDomain: '', role: 'HR',
  });

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(fetchAllUsers());
    if (companies.length === 0) dispatch(fetchAllCompanies());
  }, [dispatch, usersStatus, companies.length]);

  const filtered = users.filter((u) =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.companyName.toLowerCase().includes(search.toLowerCase()) ||
    u.companyDomain.toLowerCase().includes(search.toLowerCase())
  );

  const roleCount: Record<string, number> = {};
  users.forEach((u) => { roleCount[u.role] = (roleCount[u.role] ?? 0) + 1; });

  const handleAddUser = async () => {
    if (!userForm.email || !userForm.password || !userForm.companyDomain) {
      toast({ title: 'Email, password and company are required.', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setAdding(true);
    const matched = companies.find((c) => c.domain === userForm.companyDomain);
    const result = await dispatch(createUser({
      email:         userForm.email.trim().toLowerCase(),
      password:      userForm.password,
      companyName:   matched?.name ?? userForm.companyDomain,
      companyDomain: userForm.companyDomain,
      role:          userForm.role,
    }));
    setAdding(false);
    if (createUser.fulfilled.match(result)) {
      toast({ title: 'User created', description: userForm.email, status: 'success', duration: 3000, isClosable: true });
      setUserForm({ email: '', password: '', companyDomain: '', role: 'HR' });
      addDisc.onClose();
    } else {
      toast({ title: 'Failed to create user', description: result.payload as string, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <>
      <SectionHeader
        title="Users"
        subtitle={`${users.length} user${users.length !== 1 ? 's' : ''} across all workspaces`}
        action={
          <HStack spacing={2}>
            <Button leftIcon={<Icon as={MdRefresh} />} size="sm" variant="outline"
              borderColor="gray.200" color="gray.600" fontWeight="600"
              onClick={() => dispatch(fetchAllUsers())} isLoading={isLoading}
              _hover={{ bg: 'gray.50' }}>
              Refresh
            </Button>
            <Button leftIcon={<AddIcon />} size="sm" bg={NAVY} color="white"
              borderRadius="full" fontWeight="700"
              onClick={addDisc.onOpen} _hover={{ bg: '#002952' }}>
              Add User
            </Button>
          </HStack>
        }
      />

      {/* Role summary pills */}
      <HStack spacing={3} mb={6} flexWrap="wrap">
        {Object.entries(roleCount).map(([role, count]) => (
          <HStack key={role} bg="white" border="1px solid" borderColor="gray.200" borderRadius="full" px={3} py={1} spacing={2}>
            <Badge colorScheme={ROLE_COLORS[role] ?? 'gray'} borderRadius="full" fontSize="9px">{role}</Badge>
            <Text fontSize="xs" fontWeight="700" color="gray.700">{count}</Text>
          </HStack>
        ))}
      </HStack>

      {/* Search */}
      <InputGroup maxW="360px" mb={4}>
        <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
        <Input placeholder="Search email, company or domain…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="white" borderColor="gray.200" _focus={{ borderColor: 'blue.400' }} />
      </InputGroup>

      <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="10px" color="gray.500" py={3}>Email</Th>
                <Th fontSize="10px" color="gray.500">Company</Th>
                <Th fontSize="10px" color="gray.500">Domain</Th>
                <Th fontSize="10px" color="gray.500">Role</Th>
                <Th fontSize="10px" color="gray.500">Joined</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Tr key={i}>{Array.from({ length: 5 }).map((__, j) => <Td key={j}><Skeleton h="14px" w="100px" /></Td>)}</Tr>
                  ))
                : filtered.map((u) => (
                    <Tr key={u.id} _hover={{ bg: 'gray.50' }}>
                      <Td py={3}><Text fontWeight="600" fontSize="sm" color="gray.900">{u.email}</Text></Td>
                      <Td><Text fontSize="sm" color="gray.700">{u.companyName}</Text></Td>
                      <Td><Text fontSize="xs" color="gray.400">{u.companyDomain}</Text></Td>
                      <Td>
                        <Badge colorScheme={ROLE_COLORS[u.role] ?? 'gray'} borderRadius="full" px={2} fontSize="10px" fontWeight="700">
                          {u.role}
                        </Badge>
                      </Td>
                      <Td><Text fontSize="xs" color="gray.400">{new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text></Td>
                    </Tr>
                  ))
              }
            </Tbody>
          </Table>
        </TableContainer>
        {!isLoading && filtered.length === 0 && (
          <Flex justify="center" py={12}><Text color="gray.400" fontSize="sm">No users match your search.</Text></Flex>
        )}
      </Box>

      {/* ── Add User Modal ── */}
      <Modal isOpen={addDisc.isOpen} onClose={addDisc.onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontWeight="800" fontSize="lg" pt={6} letterSpacing="-0.03em">Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="jane@acme.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Temporary Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Min 8 characters"
                  value={userForm.password}
                  onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Company</FormLabel>
                <Select
                  placeholder="Select a company…"
                  value={userForm.companyDomain}
                  onChange={(e) => setUserForm((f) => ({ ...f, companyDomain: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }}
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.domain}>{c.name} ({c.domain})</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Role</FormLabel>
                <Select
                  value={userForm.role}
                  onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
                  bg="#f3f3f4" borderColor="gray.200" _focus={{ bg: 'white', borderColor: NAVY }}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="HR">HR</option>
                  <option value="HIRING_MANAGER">Hiring Manager</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2} pb={6}>
            <Button variant="ghost" onClick={addDisc.onClose} size="sm">Cancel</Button>
            <Button bg={NAVY} color="white" size="sm" borderRadius="full" fontWeight="700"
              isLoading={adding} loadingText="Creating…"
              onClick={handleAddUser} _hover={{ bg: '#002952' }}>
              Create User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   ROOT — route-aware switcher
══════════════════════════════════════════════════════════════════════════ */
const SuperAdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { status } = useAppSelector((s) => s.superAdmin);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAllCompanies());
  }, [dispatch, status]);

  if (pathname.startsWith('/super-admin/companies')) return <CompaniesView />;
  if (pathname.startsWith('/super-admin/analytics')) return <AnalyticsView />;
  if (pathname.startsWith('/super-admin/users'))     return <UsersView />;
  return <OverviewView />;
};

export default SuperAdminDashboard;

