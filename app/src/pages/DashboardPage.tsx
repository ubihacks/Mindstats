import React, { useEffect } from 'react';
import {
  Box, SimpleGrid, Heading, Text, VStack, HStack, Flex,
  Badge, Button, Skeleton, Icon, Divider,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Tag, Tooltip, Progress,
} from '@chakra-ui/react';
import { LockIcon, UnlockIcon, AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { MdWork, MdPeople, MdCreditCard, MdPendingActions, MdTrendingUp } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchRoles } from '../features/roles/rolesSlice';
import { format } from 'date-fns';

const MotionBox = motion(Box);

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  colorScheme: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, colorScheme, isLoading }) => (
  <Box
    bg="white"
    borderRadius="2xl"
    p={6}
    boxShadow="card"
    border="1px solid"
    borderColor="slate.100"
    _hover={{ boxShadow: 'card-hover', transform: 'translateY(-2px)' }}
    transition="all 0.2s ease"
    position="relative"
    overflow="hidden"
  >
    {/* Accent bar — 3px top stripe per design spec */}
    <Box
      position="absolute"
      top={0} left={0} right={0}
      h="3px"
      bg={`${colorScheme}.700`}
      borderTopRadius="2xl"
    />

    <Flex justify="space-between" align="flex-start">
      <Box flex={1}>
        <Text
          fontSize="11px"
          fontWeight="700"
          color="slate.500"
          textTransform="uppercase"
          letterSpacing="0.06em"
          mb={2}
          fontFamily="heading"
        >
          {label}
        </Text>
        {isLoading ? (
          <Skeleton h="36px" w="80px" borderRadius="md" />
        ) : (
          <Text fontSize="3xl" fontWeight="800" color="slate.800" letterSpacing="-0.04em" lineHeight="1">
            {value}
          </Text>
        )}
        {sub && !isLoading && (
          <Text fontSize="xs" color="slate.500" mt={1.5}>{sub}</Text>
        )}
      </Box>
      <Box
        bg={`${colorScheme}.50`}
        borderRadius="xl"
        p={3}
        flexShrink={0}
      >
        <Icon as={icon} boxSize={6} color={`${colorScheme}.600`} />
      </Box>
    </Flex>
  </Box>
);

const statusConfig: Record<string, { colorScheme: string; label: string }> = {
  IDLE:        { colorScheme: 'gray',   label: 'Not Started' },
  IN_PROGRESS: { colorScheme: 'orange', label: 'In Progress' },
  COMPLETED:   { colorScheme: 'teal',   label: 'Completed'   },
};

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { roles, status: rolesStatus } = useAppSelector((s) => s.roles);
  const { credits, currentPlan, usedCredits, status: billingStatus } = useAppSelector((s) => s.billing);

  const isLoading = rolesStatus === 'loading' || billingStatus === 'loading';

  useEffect(() => {
    // DataBootstrap in AppShell handles initial load.
    // Re-fetch roles here only if navigating back and store is stale.
    if (user?.id && roles.length === 0) dispatch(fetchRoles(user.id));
  }, [user]);

  const totalCandidates = roles.reduce((acc, r) => acc + (r.candidates?.length ?? 0), 0);
  const completedRoles  = roles.filter((r) => r.hiringManagerStatus === 'COMPLETED').length;
  const pendingHM       = roles.filter((r) => r.hiringManagerStatus === 'IN_PROGRESS').length;
  const creditUsagePct  = usedCredits > 0 ? Math.min((credits / (credits + usedCredits)) * 100, 100) : 100;

  return (
    <Box>
      {/* ── Page Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <HStack spacing={2}>
            <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
              Dashboard
            </Heading>
            {currentPlan && (
              <Badge bg="brand.50" color="brand.700" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
                {currentPlan.replace('_', ' ')}
              </Badge>
            )}
          </HStack>
          <Text color="slate.500" fontSize="sm">
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </Text>
        </VStack>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Button
            leftIcon={<AddIcon boxSize={3} />}
            colorScheme="brand"
            onClick={() => navigate('/roles')}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.15s ease"
          >
            New Role
          </Button>
        )}
      </Flex>

      {/* ── Stats Row ── */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5} mb={8}>
        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard label="Active Roles" value={roles.length} sub={`${completedRoles} completed`}
            icon={MdWork} colorScheme="brand" isLoading={isLoading} />
        </MotionBox>
        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <StatCard label="Total Candidates" value={totalCandidates} sub="All-time invitations"
            icon={MdPeople} colorScheme="teal" isLoading={isLoading} />
        </MotionBox>
        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <StatCard label="Credits Left" value={credits} sub={currentPlan ? `${usedCredits} used` : 'No active plan'}
            icon={MdCreditCard}
            colorScheme={credits > 5 ? 'green' : credits > 0 ? 'orange' : 'red'}
            isLoading={isLoading} />
        </MotionBox>
        <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <StatCard label="HM Pending" value={pendingHM} sub="Awaiting completion"
            icon={MdPendingActions} colorScheme="orange" isLoading={isLoading} />
        </MotionBox>
      </SimpleGrid>

      {/* ── Credit Usage Bar ── */}
      {(credits + usedCredits) > 0 && (
        <Box bg="white" borderRadius="2xl" p={5} boxShadow="card" border="1px solid" borderColor="slate.100" mb={8}>
          <Flex justify="space-between" align="center" mb={3}>
            <HStack spacing={2}>
              <Icon as={MdTrendingUp} color="brand.500" />
              <Text fontSize="sm" fontWeight="700" color="slate.700">Credit Usage</Text>
            </HStack>
            <Text fontSize="sm" color="slate.500">
              <Text as="span" fontWeight="700" color="slate.900">{credits}</Text>
              {' '}of{' '}
              <Text as="span" fontWeight="700" color="slate.900">{credits + usedCredits}</Text>
              {' '}remaining
            </Text>
          </Flex>
          <Progress
            value={creditUsagePct}
            size="sm"
            colorScheme={credits > 5 ? 'teal' : credits > 0 ? 'orange' : 'red'}
            bg="slate.200"
            borderRadius="full"
          />
        </Box>
      )}

      {/* ── Recent Roles Table ── */}
      <Box bg="white" borderRadius="2xl" boxShadow="card" border="1px solid" borderColor="slate.100" overflow="hidden">
        <Flex px={6} py={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="slate.50">
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="700" color="slate.900">Recent Hiring Roles</Text>
            <Text fontSize="xs" color="slate.400">Gatekeeper status overview</Text>
          </VStack>
          <Button
            size="sm"
            variant="ghost"
            color="brand.700"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/roles')}
            _hover={{ bg: 'brand.50', color: 'brand.800' }}
            fontWeight="600"
          >
            View All
          </Button>
        </Flex>

        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="slate.50">
              <Tr>
                <Th py={3}>Role</Th>
                <Th>HM Status</Th>
                <Th>Candidates</Th>
                <Th>Gate</Th>
                <Th>Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Td key={j}><Skeleton h="16px" borderRadius="md" /></Td>
                    ))}
                  </Tr>
                ))
              ) : roles.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={12} color="slate.400">
                    <VStack spacing={2}>
                      <Icon as={MdWork} boxSize={8} color="slate.200" />
                      <Text fontSize="sm">No roles created yet</Text>
                    </VStack>
                  </Td>
                </Tr>
              ) : roles.slice(0, 6).map((role) => {
                const sc = statusConfig[role.hiringManagerStatus] ?? statusConfig['IDLE'];
                return (
                  <Tr
                    key={role.id}
                    _hover={{ bg: 'slate.50' }}
                    cursor="pointer"
                    onClick={() => navigate('/roles')}
                    transition="background 0.15s"
                  >
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="600" color="slate.800">{role.title}</Text>
                        <Text fontSize="xs" color="slate.500">{role.function} · {role.jobLevel}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={sc.colorScheme}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="700"
                        px={2.5}
                        py={0.5}
                      >
                        {sc.label}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="600" color="slate.700">
                        {role.candidates?.length ?? 0}
                      </Text>
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          role.hiringManagerStatus === 'COMPLETED'
                            ? 'Candidate invites unlocked'
                            : 'Locked — awaiting HM assessment'
                        }
                        hasArrow
                      >
                        <Box display="inline-flex" alignItems="center">
                          <Icon
                            as={role.hiringManagerStatus === 'COMPLETED' ? UnlockIcon : LockIcon}
                            color={role.hiringManagerStatus === 'COMPLETED' ? 'green.500' : 'slate.300'}
                            boxSize={4}
                          />
                        </Box>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text fontSize="xs" color="slate.400">
                        {role.createdAt ? format(new Date(role.createdAt), 'dd MMM yyyy') : '—'}
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DashboardPage;
