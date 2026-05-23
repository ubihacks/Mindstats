import React, { useEffect, useState } from 'react';
import {
  Box, Button, Heading, HStack, VStack, Text, Flex,
  SimpleGrid, Skeleton, Tooltip, Icon, useDisclosure, Divider,
  Alert, AlertIcon, Tag,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { MdWork, MdPeople, MdCheckCircle } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRoles } from '../rolesSlice';
import { useNavigate } from 'react-router-dom';

import CreateRoleModal from '../components/CreateRoleModal';
import type { HiringRole } from '../../../types';
import InviteCandidateModal from '../components/InviteCandidateModal';

const MotionBox = motion(Box);

const RolesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { roles, status } = useAppSelector((s) => s.roles);
  const { credits } = useAppSelector((s) => s.billing);

  const createModal = useDisclosure();
  const candidateModal = useDisclosure();

  const [activeRole, setActiveRole] = useState<HiringRole | null>(null);

  useEffect(() => {
    // DataBootstrap handles initial load — only re-fetch if empty
    if (user?.id && roles.length === 0) dispatch(fetchRoles(user.id));
  }, [user]);

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
            Projects
          </Heading>
          <Text color="slate.500" fontSize="sm">
            {roles.length} project{roles.length !== 1 ? 's' : ''}
          </Text>
        </VStack>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Tooltip
            label={credits < 1 ? 'Insufficient credits — purchase a plan first' : 'Create a new project'}
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
              New Project
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
              <Heading size="md" color="slate.700" fontWeight="700">No projects yet</Heading>
              <Text color="slate.400" fontSize="sm">Create your first project to start inviting candidates</Text>
            </VStack>
            <Button
              bg="brand.600"
              color="white"
              mt={2}
              onClick={createModal.onOpen}
              leftIcon={<AddIcon boxSize={3} />}
              _hover={{ bg: 'brand.700' }}
            >
              Create Project
            </Button>
          </VStack>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {roles.map((role, idx) => {
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
                borderColor="slate.200"
                overflow="hidden"
                _hover={{ boxShadow: 'card-hover', transform: 'translateY(-2px)' }}
                style={{ transition: 'all 0.2s ease' }}
              >
                {/* Status accent bar */}
                <Box h="3px" bg="brand.500" />

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
                        w="full"
                        leftIcon={<Icon as={MdWork} boxSize={3} />}
                        onClick={() => navigate(`/projects/${role.id}`)}
                        fontWeight="600"
                        borderColor="slate.200"
                        color="slate.700"
                        _hover={{ bg: 'slate.50', borderColor: 'slate.300' }}
                      >
                        View Details
                      </Button>
                      <Button
                          size="sm"
                          w="full"
                          bg="green.500"
                          color="white"
                          leftIcon={<Icon as={MdPeople} boxSize={3} />}
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
        <InviteCandidateModal isOpen={candidateModal.isOpen} onClose={candidateModal.onClose} role={activeRole} />
      )}
    </Box>
  );
};

export default RolesPage;
