

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
  ArrowBackIcon, EmailIcon, CopyIcon, CheckIcon, AddIcon, DeleteIcon, RepeatIcon, DownloadIcon,
} from '@chakra-ui/icons';
import { MdWork, MdPeople, MdCheckCircle, MdPending, MdTimer } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { deleteCandidate, fetchRoles } from '../rolesSlice';
import InviteCandidateModal from '../components/InviteCandidateModal';
import type { Candidate } from '../../../types';

const NAVY = '#001e40';

const STATUS_CONFIG: Record<string, { colorScheme: string; label: string; icon: React.ElementType }> = {
  PENDING:   { colorScheme: 'orange', label: 'Awaiting Assessment', icon: MdTimer       },
  COMPLETED: { colorScheme: 'green',  label: 'Assessment Complete', icon: MdCheckCircle },
  EXPIRED:   { colorScheme: 'red',    label: 'Link Expired',        icon: MdPending     },
};

const DISC_COLOR: Record<string, string> = {
  D: '#E53E3E', I: '#D69E2E', S: '#38A169', C: '#3182CE',
};
const DISC_LABEL: Record<string, string> = {
  D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness',
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
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

  const handleDownloadResponses = async (c: Candidate) => {
    if (!role) return;
    setDownloadingId(c.id);
    try {
      const { data, error } = await (await import('../../../lib/supabaseClient')).supabase
        .from('assessment_responses')
        .select('answers, submitted_at')
        .eq('role_id', role.id)
        .eq('respondent_id', c.inviteToken)
        .eq('assessment_type', 'CANDIDATE')
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        toast({ title: 'No responses found', status: 'warning', position: 'top', duration: 3000 });
        return;
      }

      const { DISC_QUESTIONS } = await import('../../assessment/data/questions');
      const traitMap: Record<string, string> = { a: 'D (Dominance)', b: 'I (Influence)', c: 'S (Steadiness)', d: 'C (Conscientiousness)' };
      const answers: any[] = typeof data.answers === 'string' ? JSON.parse(data.answers) : data.answers;
      const escape = (s = '') => `"${String(s).replace(/"/g, '""')}"`;

      const rows = [
        ['Q#', 'Topic', 'Most — Text', 'Most — Trait', 'Least — Text', 'Least — Trait'].join(','),
        [`Candidate: ${c.name}`, `Email: ${c.email}`, `Submitted: ${new Date(data.submitted_at).toLocaleString()}`, '', '', ''].join(','),
        ...answers.map((ans: any) => {
          const q = DISC_QUESTIONS.find((q) => q.id === ans.questionId);
          if (!q) return '';
          const mostOpt  = q.options.find((o) => o.id === ans.mostOptionId);
          const leastOpt = q.options.find((o) => o.id === ans.leastOptionId);
          return [
            q.id, escape(q.title),
            escape(mostOpt?.text),  traitMap[ans.mostOptionId?.slice(-1)  ?? ''] ?? '',
            escape(leastOpt?.text), traitMap[ans.leastOptionId?.slice(-1) ?? ''] ?? '',
          ].join(',');
        }).filter(Boolean),
      ];

      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `disc-responses-${c.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

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
              <Tooltip label="Refresh candidate statuses" hasArrow>
                <IconButton
                  aria-label="Refresh"
                  icon={<RepeatIcon />}
                  size="sm" variant="ghost" color="gray.500"
                  isLoading={status === 'loading'}
                  onClick={() => user && dispatch(fetchRoles(user.id))}
                  _hover={{ bg: 'gray.100', color: NAVY }}
                />
              </Tooltip>
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
                        <Th fontSize="10px" color="gray.500">Assessment</Th>
                        <Th fontSize="10px" color="gray.500">DISC Profile</Th>
                        <Th fontSize="10px" color="gray.500">Report</Th>
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
                            {/* Assessment status */}
                            <Td>
                              <Badge
                                colorScheme={isExpired && c.inviteStatus !== 'COMPLETED' ? 'red' : st.colorScheme}
                                borderRadius="full" px={2.5} py={0.5} fontSize="10px" fontWeight="700"
                              >
                                <HStack spacing={1}>
                                  <Icon as={isExpired && c.inviteStatus !== 'COMPLETED' ? MdTimer : st.icon} boxSize={2.5} />
                                  <Text>{isExpired && c.inviteStatus !== 'COMPLETED' ? 'Link Expired' : st.label}</Text>
                                </HStack>
                              </Badge>
                            </Td>

                            {/* DISC primary trait */}
                            <Td>
                              {c.discScores ? (() => {
                                const primary = (Object.entries(c.discScores) as [string, number][]).sort((a, b) => b[1] - a[1])[0][0];
                                return (
                                  <Tooltip label={DISC_LABEL[primary]} hasArrow>
                                    <HStack spacing={1.5} display="inline-flex">
                                      <Box
                                        w="20px" h="20px" borderRadius="md" flexShrink={0}
                                        bg={DISC_COLOR[primary]} color="white"
                                        display="flex" alignItems="center" justifyContent="center"
                                        fontSize="10px" fontWeight="800"
                                      >
                                        {primary}
                                      </Box>
                                      <Text fontSize="xs" fontWeight="600" color="gray.600">{DISC_LABEL[primary]}</Text>
                                    </HStack>
                                  </Tooltip>
                                );
                              })() : (
                                <Text fontSize="xs" color="gray.300">—</Text>
                              )}
                            </Td>

                            {/* Report status */}
                            <Td>
                              {c.inviteStatus === 'COMPLETED' ? (
                                c.reportUrl ? (
                                  <Badge colorScheme="green" borderRadius="full" px={2.5} fontSize="10px" fontWeight="700">
                                    Uploaded
                                  </Badge>
                                ) : (
                                  <Badge colorScheme="gray" borderRadius="full" px={2.5} fontSize="10px" fontWeight="700">
                                    Pending Review
                                  </Badge>
                                )
                              ) : (
                                <Text fontSize="xs" color="gray.300">—</Text>
                              )}
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
                              <HStack spacing={1}>
                                {c.inviteStatus === 'COMPLETED' && (
                                  <Tooltip label="Download assessment responses (CSV)" hasArrow>
                                    <IconButton
                                      aria-label="Download responses"
                                      icon={<DownloadIcon />}
                                      size="xs" variant="ghost" color="blue.400"
                                      isLoading={downloadingId === c.id}
                                      _hover={{ bg: 'blue.50', color: 'blue.600' }}
                                      onClick={() => handleDownloadResponses(c)}
                                    />
                                  </Tooltip>
                                )}
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
                              </HStack>
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
