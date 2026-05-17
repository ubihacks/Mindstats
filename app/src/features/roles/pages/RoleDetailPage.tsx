import React, { useState, useRef } from 'react';
import {
  Box, Heading, Text, VStack, HStack, Flex, Badge, Button, Avatar,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, Icon,
  Divider, SimpleGrid, Skeleton, Tooltip, useDisclosure, IconButton,
  useToast, InputGroup, InputRightElement, Input,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  ArrowBackIcon, EmailIcon, CopyIcon, CheckIcon, AddIcon, DeleteIcon,
} from '@chakra-ui/icons';
import { MdWork, MdPeople, MdCheckCircle, MdPending, MdTimer } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { deleteCandidate } from '../rolesSlice';
import InviteCandidateModal from '../components/InviteCandidateModal';
import type { Candidate } from '../../../types';

const NAVY = '#001e40';

const STATUS_CONFIG: Record<string, { colorScheme: string; label: string; icon: React.ElementType }> = {
  PENDING:   { colorScheme: 'orange', label: 'Pending',   icon: MdTimer       },
  COMPLETED: { colorScheme: 'green',  label: 'Completed', icon: MdCheckCircle },
  EXPIRED:   { colorScheme: 'red',    label: 'Expired',   icon: MdPending     },
};

const HM_STATUS: Record<string, { colorScheme: string; label: string }> = {
  IDLE:        { colorScheme: 'gray',   label: 'Not Started'   },
  IN_PROGRESS: { colorScheme: 'orange', label: 'In Progress'   },
  COMPLETED:   { colorScheme: 'green',  label: 'Completed'     },
};

/* ── Stat Card ── */
const InfoCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; color: string }> = ({
  label, value, icon, color,
}) => (
  <Box bg="white" borderRadius="xl" p={5} border="1px solid" borderColor="gray.100">
    <HStack spacing={3}>
      <Box bg={`${color}.50`} borderRadius="lg" p={2.5}>
        <Icon as={icon} boxSize={5} color={`${color}.500`} />
      </Box>
      <Box>
        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.06em">{label}</Text>
        <Text fontSize="xl" fontWeight="800" color="gray.900" letterSpacing="-0.03em">{value}</Text>
      </Box>
    </HStack>
  </Box>
);

/* ── Copy Cell ── */
const CopyLink: React.FC<{ token: string }> = ({ token }) => {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/invite/${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InputGroup size="xs" maxW="240px">
      <Input value={link} isReadOnly bg="gray.50" fontSize="10px" borderColor="gray.200" />
      <InputRightElement>
        <IconButton
          aria-label="Copy invite link"
          icon={copied ? <CheckIcon color="green.500" /> : <CopyIcon />}
          size="xs" variant="ghost" onClick={handleCopy}
        />
      </InputRightElement>
    </InputGroup>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   ROLE DETAIL PAGE
══════════════════════════════════════════════════════════════════════════ */
const RoleDetailPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { roles, status } = useAppSelector((s) => s.roles);
  const { user } = useAppSelector((s) => s.auth);
  const candidateModal = useDisclosure();
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [confirmCandidate, setConfirmCandidate] = useState<Candidate | null>(null);
  const deleteDialog = useDisclosure();
  const cancelRef    = useRef<HTMLButtonElement>(null);

  const openDeleteConfirm = (c: Candidate) => {
    setConfirmCandidate(c);
    deleteDialog.onOpen();
  };

  const role = roles.find((r) => r.id === roleId);
  const isLoading = status === 'loading' && !role;

  const hmStatus = HM_STATUS[role?.hiringManagerStatus ?? 'IDLE'];

  const handleDelete = async (candidateId: string) => {
    if (!role || !user) return;
    deleteDialog.onClose();
    setDeletingId(candidateId);
    const result = await dispatch(deleteCandidate({ candidateId, roleId: role.id, companyId: user.id }));
    setDeletingId(null);
    setConfirmCandidate(null);
    if (deleteCandidate.fulfilled.match(result)) {
      toast({ title: 'Invite deleted', description: '1 credit has been refunded.', status: 'success', position: 'top', duration: 3000 });
    } else {
      toast({ title: 'Delete failed', description: result.payload as string, status: 'error', position: 'top', duration: 4000 });
    }
  };

  const pending   = role?.candidates.filter((c) => c.inviteStatus === 'PENDING').length ?? 0;
  const completed = role?.candidates.filter((c) => c.inviteStatus === 'COMPLETED').length ?? 0;
  const expired   = role?.candidates.filter((c) => c.inviteStatus === 'EXPIRED').length ?? 0;

  if (!isLoading && !role) {
    return (
      <Box py={20} textAlign="center">
        <Text color="gray.400" fontSize="lg">Role not found.</Text>
        <Button mt={4} variant="ghost" leftIcon={<ArrowBackIcon />} onClick={() => navigate('/roles')}>
          Back to Roles
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Back + Header ── */}
      <Button
        variant="ghost" leftIcon={<ArrowBackIcon />} size="sm" color="gray.500"
        mb={6} onClick={() => navigate('/roles')} _hover={{ bg: 'gray.100' }}
      >
        All Roles
      </Button>

      {isLoading ? (
        <VStack spacing={4} align="stretch">
          <Skeleton h="40px" w="300px" />
          <Skeleton h="20px" w="200px" />
        </VStack>
      ) : (
        <>
          {/* ── Title row ── */}
          <Flex justify="space-between" align="flex-start" mb={8} flexWrap="wrap" gap={4}>
            <Box>
              <Text fontSize="xs" fontFamily="mono" color="gray.400" mb={1}>#{role!.uniqueCode}</Text>
              <Heading size="xl" fontWeight="800" color={NAVY} letterSpacing="-0.04em" mb={2}>
                {role!.title}
              </Heading>
              <HStack spacing={2} flexWrap="wrap">
                <Tag size="sm" bg="blue.50" color="blue.700" fontWeight="600" borderRadius="full">{role!.jobLevel}</Tag>
                <Tag size="sm" bg="purple.50" color="purple.700" fontWeight="600" borderRadius="full">{role!.function}</Tag>
                <Badge colorScheme={hmStatus.colorScheme} borderRadius="full" px={2.5} fontWeight="700">{hmStatus.label}</Badge>
              </HStack>
            </Box>
            <Button
              leftIcon={<AddIcon boxSize={3} />} bg={NAVY} color="white"
              borderRadius="full" fontWeight="700" onClick={candidateModal.onOpen}
              _hover={{ bg: '#002952' }}
            >
              Invite Candidate
            </Button>
          </Flex>

          {/* ── Stats ── */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
            <InfoCard label="Total Invited"   value={role!.candidates.length} icon={MdPeople}      color="blue"   />
            <InfoCard label="Pending"         value={pending}                 icon={MdTimer}       color="orange" />
            <InfoCard label="Completed"       value={completed}               icon={MdCheckCircle} color="green"  />
            <InfoCard label="Expired"         value={expired}                 icon={MdPending}     color="red"    />
          </SimpleGrid>

          {/* ── Hiring Manager section ── */}
          <Box bg="white" borderRadius="xl" p={6} border="1px solid" borderColor="gray.100" mb={6}>
            <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" mb={4}>
              Hiring Manager
            </Text>
            {role!.hiringManagerName ? (
              <HStack spacing={4}>
                <Avatar size="sm" name={role!.hiringManagerName} bg={NAVY} color="white" />
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="gray.900">{role!.hiringManagerName}</Text>
                  <Text fontSize="xs" color="gray.400">{role!.hiringManagerEmail}</Text>
                </Box>
                <Badge colorScheme={hmStatus.colorScheme} borderRadius="full" px={2.5} ml="auto" fontWeight="700">
                  Assessment: {hmStatus.label}
                </Badge>
              </HStack>
            ) : (
              <HStack color="gray.400" spacing={2}>
                <Icon as={EmailIcon} />
                <Text fontSize="sm">No Hiring Manager assigned yet.</Text>
              </HStack>
            )}
          </Box>

          <Divider mb={6} />

          {/* ── Candidates table ── */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="sm" fontWeight="700" color="gray.900">Candidates</Heading>
                <Text fontSize="xs" color="gray.400" mt={0.5}>
                  {role!.candidates.length} candidate{role!.candidates.length !== 1 ? 's' : ''} invited
                </Text>
              </Box>
            </Flex>

            {role!.candidates.length === 0 ? (
              <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" py={16} textAlign="center">
                <Icon as={MdWork} boxSize={8} color="gray.200" mb={3} />
                <Text color="gray.400" fontSize="sm">No candidates invited yet.</Text>
                <Button mt={4} size="sm" bg={NAVY} color="white" borderRadius="full" fontWeight="700"
                  leftIcon={<AddIcon boxSize={3} />} onClick={candidateModal.onOpen} _hover={{ bg: '#002952' }}>
                  Invite First Candidate
                </Button>
              </Box>
            ) : (
              <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontSize="10px" color="gray.500" py={3}>Candidate</Th>
                        <Th fontSize="10px" color="gray.500">Status</Th>
                        <Th fontSize="10px" color="gray.500">Invited</Th>
                        <Th fontSize="10px" color="gray.500">Expires</Th>
                        <Th fontSize="10px" color="gray.500">Invite Link</Th>
                        <Th w={10} />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {role!.candidates.map((c: Candidate) => {
                        const st = STATUS_CONFIG[c.inviteStatus] ?? STATUS_CONFIG['PENDING'];
                        const isExpired = new Date(c.expiresAt) < new Date();
                        return (
                          <Tr key={c.id} _hover={{ bg: 'gray.50' }}>
                            <Td py={3}>
                              <HStack spacing={2}>
                                <Avatar size="xs" name={c.name} bg="gray.200" />
                                <Box>
                                  <Text fontWeight="600" fontSize="sm" color="gray.900">{c.name}</Text>
                                  <Text fontSize="xs" color="gray.400">{c.email}</Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={isExpired && c.inviteStatus !== 'COMPLETED' ? 'red' : st.colorScheme}
                                borderRadius="full" px={2} fontSize="10px" fontWeight="700"
                              >
                                <HStack spacing={1}>
                                  <Icon as={isExpired && c.inviteStatus !== 'COMPLETED' ? MdTimer : st.icon} boxSize={2.5} />
                                  <Text>{isExpired && c.inviteStatus !== 'COMPLETED' ? 'Expired' : st.label}</Text>
                                </HStack>
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="xs" color="gray.500">
                                {new Date(c.invitedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="xs" color={isExpired ? 'red.400' : 'gray.500'}>
                                {new Date(c.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </Text>
                            </Td>
                            <Td>
                              {c.inviteStatus === 'PENDING' && !isExpired
                                ? <CopyLink token={c.inviteToken} />
                                : <Text fontSize="xs" color="gray.300">—</Text>
                              }
                            </Td>
                            <Td>
                              {c.inviteStatus === 'PENDING' && !isExpired && (
                                <Tooltip label="Delete invite" hasArrow>
                                  <IconButton
                                    aria-label="Delete invite"
                                    icon={<DeleteIcon />}
                                    size="xs" variant="ghost" color="red.400"
                                    isLoading={deletingId === c.id}
                                    _hover={{ bg: 'red.50', color: 'red.600' }}
                                    onClick={() => openDeleteConfirm(c)}
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
            )}
          </Box>
        </>
      )}

      {role && (
        <InviteCandidateModal
          isOpen={candidateModal.isOpen}
          onClose={candidateModal.onClose}
          role={role}
        />
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(4px)" bg="blackAlpha.300">
          <AlertDialogContent borderRadius="2xl" boxShadow="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="800" color="gray.900" letterSpacing="-0.02em" pt={6}>
              Delete Invite?
            </AlertDialogHeader>
            <AlertDialogBody>
              <VStack align="start" spacing={3}>
                {confirmCandidate && (
                  <HStack spacing={3} bg="gray.50" borderRadius="lg" p={3} w="full">
                    <Avatar size="sm" name={confirmCandidate.name} bg="gray.200" />
                    <Box>
                      <Text fontWeight="700" fontSize="sm" color="gray.900">{confirmCandidate.name}</Text>
                      <Text fontSize="xs" color="gray.400">{confirmCandidate.email}</Text>
                    </Box>
                  </HStack>
                )}
                <Text fontSize="sm" color="gray.600">
                  This will permanently delete the invite link and <Text as="span" fontWeight="700" color="gray.800">refund 1 credit</Text> back to your company pool.
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter gap={3} pb={6}>
              <Button ref={cancelRef} variant="ghost" onClick={deleteDialog.onClose} fontWeight="700">
                Cancel
              </Button>
              <Button
                colorScheme="red" fontWeight="700" borderRadius="full"
                isLoading={!!deletingId}
                onClick={() => confirmCandidate && handleDelete(confirmCandidate.id)}
              >
                Delete Invite
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default RoleDetailPage;
