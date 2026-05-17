import React, { useEffect, useState } from 'react';
import {
  Box, Button, Flex, Heading, HStack, VStack, Text, Badge,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Skeleton,
  IconButton, Tooltip, useDisclosure, Select, Icon, Tabs, TabList,
  Tab, TabPanels, TabPanel,
} from '@chakra-ui/react';
import { DownloadIcon, AttachmentIcon } from '@chakra-ui/icons';
import { MdAssignment, MdFilterList, MdBarChart } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchReports, fetchAssessmentResults } from '../reportsSlice';
import { fetchRoles } from '../../roles/rolesSlice';
import ReportUploadModal from '../components/ReportUploadModal';
import { format } from 'date-fns';
import type { DiscScores } from '../../../types';

const NAVY = '#001e40';

const DISC_COLOR: Record<keyof DiscScores, string> = {
  D: '#E53E3E', I: '#D69E2E', S: '#38A169', C: '#3182CE',
};
const DISC_LABEL: Record<keyof DiscScores, string> = {
  D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness',
};

const DiscBadge: React.FC<{ trait: keyof DiscScores; score: number }> = ({ trait, score }) => (
  <Tooltip label={DISC_LABEL[trait]} hasArrow>
    <Box
      display="inline-flex" alignItems="center" gap="4px"
      bg={`${DISC_COLOR[trait]}15`} border="1px solid" borderColor={`${DISC_COLOR[trait]}40`}
      borderRadius="full" px={2.5} py={0.5}
    >
      <Box w="8px" h="8px" borderRadius="full" bg={DISC_COLOR[trait]} flexShrink={0} />
      <Text fontSize="10px" fontWeight="800" color={DISC_COLOR[trait]}>{trait}</Text>
      <Text fontSize="10px" fontWeight="600" color="gray.600">{score > 0 ? `+${score}` : score}</Text>
    </Box>
  </Tooltip>
);

const downloadCSV = (rows: object[], filename: string) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { reports, status, assessmentResults, resultsStatus } = useAppSelector((s) => s.reports);
  const { roles } = useAppSelector((s) => s.roles);
  const uploadModal = useDisclosure();
  const [filterRoleId, setFilterRoleId] = useState('');
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchReports(user.id));
      dispatch(fetchAssessmentResults(user.id));
      if (roles.length === 0) dispatch(fetchRoles(user.id));
    }
  }, [user]);

  const filtered = filterRoleId
    ? reports.filter((r) => r.roleId === filterRoleId)
    : reports;

  const filteredResults = filterRoleId
    ? assessmentResults.filter((r) => r.roleId === filterRoleId)
    : assessmentResults;

  const isLoading        = status === 'loading';
  const isResultsLoading = resultsStatus === 'loading';

  return (
    <Box>
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <Heading size="lg" fontWeight="800" color="gray.900" letterSpacing="-0.03em">
            Reports
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Manage assessment results and uploaded reports
          </Text>
        </VStack>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Button
            leftIcon={<AttachmentIcon />}
            bg={NAVY} color="white"
            onClick={uploadModal.onOpen}
            fontWeight="700" borderRadius="full"
            _hover={{ bg: '#002952', transform: 'translateY(-1px)' }}
            transition="all 0.15s"
          >
            Upload Report
          </Button>
        )}
      </Flex>

      {/* ── Role filter ── */}
      <HStack mb={6} spacing={3} bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100">
        <Icon as={MdFilterList} color="gray.400" boxSize={4} />
        <Select
          placeholder="All Roles" maxW="300px" value={filterRoleId}
          onChange={(e) => setFilterRoleId(e.target.value)} size="sm" borderRadius="lg"
        >
          {roles.map((r) => <option key={r.id} value={r.id}>{r.title} — {r.function}</option>)}
        </Select>
        {filterRoleId && (
          <Button size="sm" variant="ghost" color="gray.500" onClick={() => setFilterRoleId('')}>Clear</Button>
        )}
      </HStack>

      {/* ── Tabs ── */}
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={6} gap={2}>
          <Tab fontWeight="700" fontSize="sm" _selected={{ bg: NAVY, color: 'white' }}>
            <HStack spacing={2}>
              <Icon as={MdAssignment} boxSize={4} />
              <Text>Uploaded Reports</Text>
              <Badge borderRadius="full" px={2} fontSize="10px"
                bg={NAVY} color="white" ml={1}>{filtered.length}</Badge>
            </HStack>
          </Tab>
          <Tab fontWeight="700" fontSize="sm" _selected={{ bg: NAVY, color: 'white' }}>
            <HStack spacing={2}>
              <Icon as={MdBarChart} boxSize={4} />
              <Text>Assessment Results</Text>
              <Badge borderRadius="full" px={2} fontSize="10px"
                bg={NAVY} color="white" ml={1}>{filteredResults.length}</Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>

          {/* ── TAB 1: Uploaded Reports ── */}
          <TabPanel p={0}>
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th py={3.5}>Role</Th>
                      <Th>Candidate</Th>
                      <Th>Type</Th>
                      <Th>Uploaded</Th>
                      <Th>Uploaded By</Th>
                      <Th w={12} />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <Tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                          <Td key={j}><Skeleton h="20px" borderRadius="md" /></Td>
                        ))}</Tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={16}>
                          <VStack spacing={3} color="gray.400">
                            <Icon as={MdAssignment} boxSize={10} color="gray.200" />
                            <Text fontSize="sm">No reports uploaded yet</Text>
                            {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                              <Button size="sm" bg={NAVY} color="white" leftIcon={<AttachmentIcon />}
                                onClick={uploadModal.onOpen} _hover={{ bg: '#002952' }}>
                                Upload First Report
                              </Button>
                            )}
                          </VStack>
                        </Td>
                      </Tr>
                    ) : (
                      filtered.map((report) => {
                        const role      = roles.find((r) => r.id === report.roleId);
                        const candidate = role?.candidates.find((c) => c.id === report.candidateId);
                        const isPdf     = report.fileType === 'PDF';
                        return (
                          <Tr key={report.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="600" color="gray.900">{role?.title ?? '—'}</Text>
                                <Text fontSize="xs" color="gray.400">{role?.function}</Text>
                              </VStack>
                            </Td>
                            <Td>
                              {candidate ? (
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="500" color="gray.900">{candidate.name}</Text>
                                  <Text fontSize="xs" color="gray.400">{candidate.email}</Text>
                                </VStack>
                              ) : (
                                <Badge bg="purple.50" color="purple.700" borderRadius="full" fontSize="xs" fontWeight="600" px={2.5}>
                                  Hiring Manager
                                </Badge>
                              )}
                            </Td>
                            <Td>
                              <Badge bg={isPdf ? 'red.50' : 'green.50'} color={isPdf ? 'red.700' : 'green.700'}
                                borderRadius="md" fontSize="xs" fontWeight="700" px={2.5}>
                                {report.fileType}
                              </Badge>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="500" color="gray.700">
                                  {format(new Date(report.uploadedAt), 'dd MMM yyyy')}
                                </Text>
                                <Text fontSize="xs" color="gray.400">{format(new Date(report.uploadedAt), 'HH:mm')}</Text>
                              </VStack>
                            </Td>
                            <Td><Text fontSize="sm" color="gray.600">{report.uploadedBy}</Text></Td>
                            <Td>
                              <Tooltip label="Download report" hasArrow>
                                <IconButton aria-label="Download" icon={<DownloadIcon />} size="sm" variant="ghost"
                                  color="blue.600" as="a" href={report.fileUrl} target="_blank" rel="noopener noreferrer"
                                  _hover={{ bg: 'blue.50' }} />
                              </Tooltip>
                            </Td>
                          </Tr>
                        );
                      })
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          {/* ── TAB 2: Assessment Results ── */}
          <TabPanel p={0}>
            <Flex justify="flex-end" mb={3}>
              {filteredResults.length > 0 && (
                <Button size="sm" leftIcon={<DownloadIcon />} variant="outline" fontWeight="700" borderRadius="full"
                  onClick={() => downloadCSV(
                    filteredResults.map((r) => ({
                      candidate:  r.candidateName,
                      email:      r.candidateEmail,
                      role:       r.roleTitle,
                      D:          r.discScores?.D ?? '',
                      I:          r.discScores?.I ?? '',
                      S:          r.discScores?.S ?? '',
                      C:          r.discScores?.C ?? '',
                      submitted:  r.submittedAt,
                    })),
                    'assessment-results.csv'
                  )}
                  _hover={{ bg: 'gray.50' }}
                >
                  Export CSV
                </Button>
              )}
            </Flex>

            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th py={3.5}>Candidate</Th>
                      <Th>Role</Th>
                      <Th>DISC Scores</Th>
                      <Th>Primary Style</Th>
                      <Th>Submitted</Th>
                      <Th w={12} />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isResultsLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <Tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                          <Td key={j}><Skeleton h="20px" borderRadius="md" /></Td>
                        ))}</Tr>
                      ))
                    ) : filteredResults.length === 0 ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={16}>
                          <VStack spacing={3} color="gray.400">
                            <Icon as={MdBarChart} boxSize={10} color="gray.200" />
                            <Text fontSize="sm">No completed assessments yet</Text>
                          </VStack>
                        </Td>
                      </Tr>
                    ) : (
                      filteredResults.map((result) => {
                        const scores     = result.discScores;
                        const primaryKey = scores
                          ? (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as keyof DiscScores)
                          : null;

                        return (
                          <Tr key={result.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="600" color="gray.900">{result.candidateName}</Text>
                                <Text fontSize="xs" color="gray.400">{result.candidateEmail}</Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Text fontSize="sm" fontWeight="500" color="gray.700">{result.roleTitle}</Text>
                            </Td>
                            <Td>
                              {scores ? (
                                <HStack spacing={1} flexWrap="wrap">
                                  {(Object.entries(scores) as [keyof DiscScores, number][])
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([t, s]) => <DiscBadge key={t} trait={t} score={s} />)}
                                </HStack>
                              ) : <Text fontSize="xs" color="gray.300">—</Text>}
                            </Td>
                            <Td>
                              {primaryKey ? (
                                <Badge
                                  bg={`${DISC_COLOR[primaryKey]}15`} color={DISC_COLOR[primaryKey]}
                                  borderRadius="full" px={2.5} fontSize="xs" fontWeight="700"
                                >
                                  {primaryKey} — {DISC_LABEL[primaryKey]}
                                </Badge>
                              ) : '—'}
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {format(new Date(result.submittedAt), 'dd MMM yyyy')}
                              </Text>
                            </Td>
                            <Td>
                              <Tooltip label="Upload report for this candidate" hasArrow>
                                <IconButton
                                  aria-label="Upload report"
                                  icon={<AttachmentIcon />}
                                  size="sm" variant="ghost" color="blue.600"
                                  onClick={() => { setActiveResultId(result.id); uploadModal.onOpen(); }}
                                  _hover={{ bg: 'blue.50' }}
                                />
                              </Tooltip>
                            </Td>
                          </Tr>
                        );
                      })
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ReportUploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => { uploadModal.onClose(); setActiveResultId(null); }}
        roles={roles}
        preselectedResultId={activeResultId}
      />
    </Box>
  );
};

export default ReportsPage;

