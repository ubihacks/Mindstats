import React, { useEffect, useState } from 'react';
import {
  Box, Button, Heading, HStack, VStack, Text, Badge, Flex,
  SimpleGrid, Skeleton, Tooltip, Icon, useDisclosure, Divider,
  Alert, AlertIcon, Tag, TagLabel, Avatar, Table, Thead, Tbody,
  Tr, Th, Td, TableContainer, IconButton, useToast, Progress,
} from '@chakra-ui/react';
import { AddIcon, LockIcon, UnlockIcon, EmailIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { MdWork, MdPeople, MdCheckCircle } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRoles, selectRole } from '../rolesSlice';

import CreateRoleModal from '../components/CreateRoleModal';
import InviteHiringManagerModal from '../components/InviteHiringManagerModal';
import type { HiringRole } from '../../../types';
import InviteCandidateModal from '../components/InviteCandidateModal';

const MotionBox = motion(Box);

const STEP_LABELS = ['Create Role', 'HM Assessment', 'Invite Candidates'];

const statusConfig: Record<string, { colorScheme: string; label: string; step: number }> = {
  IDLE:        { colorScheme: 'gray',   label: 'Not Started',   step: 0 },
  IN_PROGRESS: { colorScheme: 'orange', label: 'HM In Progress', step: 1 },
  COMPLETED:   { colorScheme: 'teal',   label: 'Completed',      step: 2 },
};

const RolesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { roles, status, selectedRoleId } = useAppSelector((s) => s.roles);
  const { credits } = useAppSelector((s) => s.billing);

  const createModal = useDisclosure();
  const hmModal = useDisclosure();
  const candidateModal = useDisclosure();

  const [activeRole, setActiveRole] = useState<HiringRole | null>(null);

  useEffect(() => {
    // DataBootstrap handles initial load — only re-fetch if empty
    if (user?.id && roles.length === 0) dispatch(fetchRoles(user.id));
  }, [user]);

  const handleOpenHMModal = (role: HiringRole) => {
    setActiveRole(role);
    hmModal.onOpen();
  };

  const handleOpenCandidateModal = (role: HiringRole) => {
    setActiveRole(role);
    candidateModal.onOpen();
  };

  const isLoading = status === 'loading';

  return (
    <Box>
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            Hiring Roles
          </Heading>
          <Text color="slate.500" fontSize="sm">
            {roles.length} role{roles.length !== 1 ? 's' : ''} · Manage assessments and candidates
          </Text>
        </VStack>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Tooltip
            label={credits < 1 ? 'Insufficient credits — purchase a plan first' : 'Create a new hiring role'}
            hasArrow
          >
            <Button
              leftIcon={<AddIcon boxSize={3} />}
              bg="brand.600"
              color="white"
              onClick={createModal.onOpen}
              isDisabled={credits < 1}
              fontWeight="700"
              _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
              _active={{ bg: 'brand.800' }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed', transform: 'none' }}
              transition="all 0.15s"
            >
              New Role
            </Button>
          </Tooltip>
        )}
      </Flex>

      {/* ── Low Credits Banner ── */}
      {credits <= 2 && credits >= 0 && (
        <Alert
          status="warning"
          borderRadius="xl"
          mb={6}
          border="1px solid"
          borderColor="orange.200"
        >
          <AlertIcon />
          <Text fontSize="sm">
            You have <Text as="strong">{credits} credit{credits !== 1 ? 's' : ''}</Text> remaining.{' '}
            <Text as="span" color="brand.600" fontWeight="600" cursor="pointer"
              onClick={() => {}}>
              Purchase more →
            </Text>
          </Text>
        </Alert>
      )}

      {/* ── Roles Grid ── */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="280px" borderRadius="2xl" />
          ))}
        </SimpleGrid>
      ) : roles.length === 0 ? (
        <Box
          bg="white"
          borderRadius="2xl"
          border="2px dashed"
          borderColor="slate.200"
          p={16}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box
              w={14} h={14} bg="brand.50" borderRadius="2xl"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdWork} color="brand.400" boxSize={7} />
            </Box>
            <VStack spacing={1}>
              <Heading size="md" color="slate.700" fontWeight="700">No roles yet</Heading>
              <Text color="slate.400" fontSize="sm">Create your first hiring role to start the assessment workflow</Text>
            </VStack>
            <Button
              bg="brand.600"
              color="white"
              mt={2}
              onClick={createModal.onOpen}
              leftIcon={<AddIcon boxSize={3} />}
              _hover={{ bg: 'brand.700' }}
            >
              Create Role
            </Button>
          </VStack>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {roles.map((role, idx) => {
            const sc = statusConfig[role.hiringManagerStatus] ?? statusConfig['IDLE'];
            const isUnlocked = true; // Gatekeeper temporarily disabled
            const hmInvited = role.hiringManagerStatus !== 'IDLE';

            return (
              <MotionBox
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="card"
                border="1px solid"
                borderColor={isUnlocked ? 'teal.100' : 'slate.200'}
                overflow="hidden"
                _hover={{ boxShadow: 'card-hover', transform: 'translateY(-2px)' }}
                style={{ transition: 'all 0.2s ease' }}
              >
                {/* Status accent bar — uses token-based solid colors */}
                <Box
                  h="3px"
                  bg={
                    isUnlocked ? 'teal.500' :
                    role.hiringManagerStatus === 'IN_PROGRESS' ? 'orange.400' :
                    'slate.200'
                  }
                />

                <Box p={5}>
                  {/* Header */}
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <Box flex={1} mr={3}>
                      <Text fontSize="xs" color="slate.400" fontFamily="mono" mb={1}>
                        #{role.uniqueCode}
                      </Text>
                      <Heading size="sm" fontWeight="700" color="slate.900" noOfLines={2}>
                        {role.title}
                      </Heading>
                    </Box>
                    <Badge
                      colorScheme={sc.colorScheme}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="700"
                      px={2.5}
                      py={0.5}
                      flexShrink={0}
                    >
                      {sc.label}
                    </Badge>
                  </Flex>

                  {/* Tags */}
                  <HStack spacing={2} mb={4} flexWrap="wrap">
                    <Tag size="sm" bg="brand.50" color="brand.700" fontWeight="600" borderRadius="full">
                      {role.jobLevel}
                    </Tag>
                    <Tag size="sm" bg="purple.50" color="purple.700" fontWeight="600" borderRadius="full">
                      {role.function}
                    </Tag>
                  </HStack>

                  {/* Workflow Progress */}
                  <Box bg="slate.50" borderRadius="xl" p={3} mb={4}>
                    <Text fontSize="xs" fontWeight="700" color="slate.500" mb={2.5} textTransform="uppercase" letterSpacing="0.06em">
                      Workflow
                    </Text>
                    <VStack spacing={1.5} align="stretch">
                      {STEP_LABELS.map((step, i) => {
                        const done = sc.step > i;
                        const active = sc.step === i;
                        return (
                          <HStack key={step} spacing={2.5}>
                            <Box
                              w={5} h={5} borderRadius="full"
                              bg={done ? 'green.500' : active ? 'brand.500' : 'slate.200'}
                              display="flex" alignItems="center" justifyContent="center"
                              flexShrink={0}
                            >
                              {done ? (
                                <Icon as={MdCheckCircle} color="white" boxSize={3.5} />
                              ) : (
                                <Text fontSize="8px" fontWeight="800" color={active ? 'white' : 'slate.400'}>
                                  {i + 1}
                                </Text>
                              )}
                            </Box>
                            <Text
                              fontSize="xs"
                              fontWeight={active ? '700' : '500'}
                              color={done ? 'green.600' : active ? 'brand.600' : 'slate.400'}
                            >
                              {step}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  </Box>

                  {/* HM Info */}
                  {role.hiringManagerName && (
                    <HStack mb={4} bg="slate.50" borderRadius="lg" px={3} py={2}>
                      <Avatar size="xs" name={role.hiringManagerName} bg="brand.600" color="white" />
                      <VStack align="start" spacing={0} flex={1} overflow="hidden">
                        <Text fontSize="xs" fontWeight="600" color="slate.700" noOfLines={1}>
                          {role.hiringManagerName}
                        </Text>
                        <Text fontSize="xs" color="slate.400" noOfLines={1}>
                          {role.hiringManagerEmail}
                        </Text>
                      </VStack>
                      <Icon
                        as={isUnlocked ? UnlockIcon : LockIcon}
                        color={isUnlocked ? 'green.500' : 'slate.300'}
                        boxSize={3.5}
                      />
                    </HStack>
                  )}

                  {/* Stats row */}
                  <HStack justify="space-between" mb={4}>
                    <HStack spacing={1.5} color="slate.500">
                      <Icon as={MdPeople} boxSize={4} />
                      <Text fontSize="xs" fontWeight="600">
                        {role.candidates?.length ?? 0} candidate{(role.candidates?.length ?? 0) !== 1 ? 's' : ''}
                      </Text>
                    </HStack>
                  </HStack>

                  <Divider borderColor="slate.100" mb={4} />

                  {/* Action Buttons */}
                  {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                    <VStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        w="full"
                        leftIcon={<EmailIcon boxSize={3} />}
                        onClick={() => handleOpenHMModal(role)}
                        isDisabled={hmInvited}
                        fontWeight="600"
                        borderColor="slate.200"
                        color={hmInvited ? 'slate.400' : 'slate.700'}
                        _hover={{ bg: 'slate.50', borderColor: 'slate.300' }}
                        _disabled={{ opacity: 0.5 }}
                      >
                        {hmInvited ? '✓ HM Invited' : 'Invite Hiring Manager'}
                      </Button>

                      <Button
                          size="sm"
                          w="full"
                          bg="green.500"
                          color="white"
                          leftIcon={<UnlockIcon boxSize={3} />}
                          onClick={() => handleOpenCandidateModal(role)}
                          fontWeight="600"
                          _hover={{ bg: 'green.600', transform: 'translateY(-1px)' }}
                          transition="all 0.15s"
                        >
                          Invite Candidate
                        </Button>
                    </VStack>
                  )}
                </Box>
              </MotionBox>
            );
          })}
        </SimpleGrid>
      )}

      {/* Modals */}
      <CreateRoleModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
      {activeRole && (
        <>
          <InviteHiringManagerModal isOpen={hmModal.isOpen} onClose={hmModal.onClose} role={activeRole} />
          <InviteCandidateModal isOpen={candidateModal.isOpen} onClose={candidateModal.onClose} role={activeRole} />
        </>
      )}
    </Box>
  );
};

export default RolesPage;
