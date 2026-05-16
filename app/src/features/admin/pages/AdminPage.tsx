import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, Flex, VStack, HStack, Table, Thead,
  Tbody, Tr, Th, Td, TableContainer, Button, Badge, Skeleton,
  Avatar, Select, useToast, SimpleGrid, Icon,
  IconButton, Tooltip, Alert, AlertIcon,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, Divider,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EmailIcon } from '@chakra-ui/icons';
import { MdPeople, MdBusiness, MdCreditCard } from 'react-icons/md';
import { supabase } from '../../../lib/supabaseClient';
import { useAppSelector } from '../../../app/hooks';
import type { UserRole } from '../../../types';

interface CompanyUser {
  id: string;
  email: string;
  role: UserRole;
  company_name: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);
  const { credits } = useAppSelector((s) => s.billing);
  const toast = useToast();
  const inviteModal = useDisclosure();

  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('HR');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (user?.companyDomain) loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_domain', user?.companyDomain)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data ?? []);
    } catch {
      toast({ title: 'Failed to load users', status: 'error', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      // auth.admin.inviteUserByEmail requires service_role key (server-only).
      // Instead, send a magic-link OTP — works with anon key and delivers
      // an email the recipient clicks to set their password and join.
      const { error } = await supabase.auth.signInWithOtp({
        email: inviteEmail,
        options: {
          shouldCreateUser: true,
          data: {
            role: inviteRole,
            company_name: user?.companyName,
            company_domain: user?.companyDomain,
          },
        },
      });
      if (error) throw error;
      toast({ title: `Invitation sent to ${inviteEmail}`, status: 'success', position: 'top', duration: 3000 });
      setInviteEmail('');
      inviteModal.onClose();
      loadUsers();
    } catch (err: unknown) {
      toast({ title: (err as Error).message ?? 'Failed to invite user', status: 'error', position: 'top' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUser = async (userId: string, email: string) => {
    if (userId === user?.id) {
      toast({ title: 'You cannot remove yourself', status: 'warning', position: 'top' });
      return;
    }
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: `${email} removed`, status: 'success', position: 'top', duration: 3000 });
    } catch {
      toast({ title: 'Failed to remove user', status: 'error', position: 'top' });
    }
  };

  const roleConfig: Record<UserRole, { scheme: string; label: string }> = {
    ADMIN:          { scheme: 'purple', label: 'Admin' },
    HR:             { scheme: 'blue',   label: 'HR' },
    HIRING_MANAGER: { scheme: 'green',  label: 'Hiring Mgr' },
  };

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const hrCount    = users.filter((u) => u.role === 'HR').length;

  return (
    <Box>
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            Admin Portal
          </Heading>
          <Text color="slate.500" fontSize="sm">
            Manage users and company settings for @{user?.companyDomain}
          </Text>
        </VStack>

        <Button
          leftIcon={<AddIcon boxSize={3} />}
          bg="brand.600"
          color="white"
          fontWeight="700"
          onClick={inviteModal.onOpen}
          _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
          _active={{ bg: 'brand.800' }}
          transition="all 0.15s"
        >
          Invite User
        </Button>
      </Flex>

      {/* ── Stats ── */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        {[
          { label: 'Total Users',  value: users.length,   icon: MdPeople,     cs: 'brand' },
          { label: 'Admins + HR', value: `${adminCount} + ${hrCount}`, icon: MdBusiness, cs: 'teal' },
          { label: 'Credits Pool', value: credits,        icon: MdCreditCard, cs: 'green' },
        ].map(({ label, value, icon, cs }) => (
          <Box
            key={label}
            bg="white"
            borderRadius="2xl"
            p={6}
            boxShadow="card"
            border="1px solid"
            borderColor="slate.100"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" top={0} left={0} right={0} h="3px" bg={`${cs}.700`} borderTopRadius="2xl" />
            <Flex justify="space-between" align="flex-start">
              <Box>
                <Text fontSize="xs" fontWeight="700" color="slate.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                  {label}
                </Text>
                {loading ? (
                  <Skeleton h="32px" w="60px" />
                ) : (
                  <Text fontSize="2xl" fontWeight="800" color="slate.800" letterSpacing="-0.04em">
                    {value}
                  </Text>
                )}
              </Box>
              <Box bg={`${cs}.50`} borderRadius="xl" p={2.5}>
                <Icon as={icon} color={`${cs}.600`} boxSize={5} />
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* ── Team Members Table ── */}
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="card"
        border="1px solid"
        borderColor="slate.100"
        overflow="hidden"
      >
        <Box px={6} py={4} borderBottom="1px solid" borderColor="slate.50">
          <Text fontSize="sm" fontWeight="700" color="slate.900">Team Members</Text>
          <Text fontSize="xs" color="slate.400">
            All users registered under @{user?.companyDomain}
          </Text>
        </Box>

        <TableContainer>
          <Table variant="simple">
            <Thead bg="slate.50">
              <Tr>
                <Th py={3.5}>User</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
                <Th w={12} />
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Td key={j}><Skeleton h="20px" borderRadius="md" /></Td>
                    ))}
                  </Tr>
                ))
              ) : users.map((u) => {
                const rc = roleConfig[u.role] ?? roleConfig['HR'];
                return (
                  <Tr key={u.id} _hover={{ bg: 'slate.50' }} transition="background 0.15s">
                    <Td>
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          name={u.email}
                          bg="brand.600"
                          color="white"
                          fontSize="xs"
                          fontWeight="700"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="600" color="slate.900">{u.email}</Text>
                          {u.id === user?.id && (
                            <Text fontSize="xs" color="brand.500" fontWeight="600">You</Text>
                          )}
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={rc.scheme}
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        fontSize="xs"
                        fontWeight="700"
                      >
                        {rc.label}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="slate.500">
                        {new Date(u.created_at).toLocaleDateString('en-MY', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </Text>
                    </Td>
                    <Td>
                      {u.id !== user?.id && (
                        <Tooltip label="Remove user" hasArrow>
                          <IconButton
                            aria-label="Remove user"
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            color="slate.400"
                            onClick={() => handleRemoveUser(u.id, u.email)}
                            _hover={{ bg: 'red.50', color: 'red.500' }}
                          />
                        </Tooltip>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── Invite Modal ── */}
      <Modal isOpen={inviteModal.isOpen} onClose={inviteModal.onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
        <ModalContent borderRadius="2xl" boxShadow="xl">
          <ModalHeader fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            Invite Team Member
          </ModalHeader>
          <ModalCloseButton color="slate.400" />
          <ModalBody pb={2}>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="xl" fontSize="sm" py={3}>
                <AlertIcon />
                <Text fontSize="xs" color="slate.600">
                  The user must verify their <strong>@{user?.companyDomain}</strong> email to join.
                </Text>
              </Alert>
              <FormControl>
                <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                  Email Address
                </FormLabel>
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={`name@${user?.companyDomain}`}
                  size="lg"
                  bg="slate.50"
                  border="1.5px solid"
                  borderColor="slate.200"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>
                  Role
                </FormLabel>
                <Select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  size="lg"
                  bg="slate.50"
                  border="1.5px solid"
                  borderColor="slate.200"
                >
                  <option value="HR">HR</option>
                  <option value="HIRING_MANAGER">Hiring Manager</option>
                  <option value="ADMIN">Admin</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} pt={5}>
            <Button
              variant="ghost"
              onClick={inviteModal.onClose}
              color="slate.500"
              _hover={{ bg: 'slate.100' }}
            >
              Cancel
            </Button>
            <Button
              bg="brand.600"
              color="white"
              leftIcon={<EmailIcon />}
              isLoading={isInviting}
              loadingText="Sending…"
              onClick={handleInviteUser}
              fontWeight="700"
              _hover={{ bg: 'brand.700' }}
            >
              Send Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminPage;
