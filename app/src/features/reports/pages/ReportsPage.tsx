import React, { useEffect, useState } from 'react';
import {
  Box, Button, Flex, Heading, HStack, VStack, Text, Badge,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Skeleton,
  IconButton, Tooltip, useDisclosure, Select, Icon,
} from '@chakra-ui/react';
import { DownloadIcon, AttachmentIcon } from '@chakra-ui/icons';
import { MdAssignment, MdFilterList } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchReports } from '../reportsSlice';
import { fetchRoles } from '../../roles/rolesSlice';
import ReportUploadModal from '../components/ReportUploadModal';
import { format } from 'date-fns';

const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { reports, status } = useAppSelector((s) => s.reports);
  const { roles } = useAppSelector((s) => s.roles);
  const uploadModal = useDisclosure();
  const [filterRoleId, setFilterRoleId] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchReports(user.id));
      if (roles.length === 0) dispatch(fetchRoles(user.id));
    }
  }, [user]);

  const filtered = filterRoleId
    ? reports.filter((r) => r.roleId === filterRoleId)
    : reports;

  const isLoading = status === 'loading';

  return (
    <Box>
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <VStack align="start" spacing={0.5}>
          <Heading size="lg" fontWeight="800" color="slate.900" letterSpacing="-0.03em">
            Reports
          </Heading>
          <Text color="slate.500" fontSize="sm">
            {filtered.length} report{filtered.length !== 1 ? 's' : ''} · Upload and manage assessment reports
          </Text>
        </VStack>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Button
            leftIcon={<AttachmentIcon />}
            bg="brand.600"
            color="white"
            onClick={uploadModal.onOpen}
            fontWeight="700"
            _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: 'brand-glow' }}
            _active={{ bg: 'brand.800' }}
            transition="all 0.15s"
          >
            Upload Report
          </Button>
        )}
      </Flex>

      {/* ── Filters ── */}
      <HStack
        mb={6}
        spacing={3}
        bg="white"
        p={4}
        borderRadius="xl"
        border="1px solid"
        borderColor="slate.100"
        boxShadow="card"
      >
        <Icon as={MdFilterList} color="slate.400" boxSize={4} />
        <Select
          placeholder="All Roles"
          maxW="300px"
          value={filterRoleId}
          onChange={(e) => setFilterRoleId(e.target.value)}
          size="sm"
          borderRadius="lg"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.title} — {r.function}</option>
          ))}
        </Select>
        {filterRoleId && (
          <Button
            size="sm"
            variant="ghost"
            color="slate.500"
            onClick={() => setFilterRoleId('')}
            _hover={{ bg: 'slate.100' }}
          >
            Clear
          </Button>
        )}
      </HStack>

      {/* ── Reports Table ── */}
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="card"
        border="1px solid"
        borderColor="slate.100"
        overflow="hidden"
      >
        <TableContainer>
          <Table variant="simple">
            <Thead bg="slate.50">
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
                  <Tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Td key={j}><Skeleton h="20px" borderRadius="md" /></Td>
                    ))}
                  </Tr>
                ))
              ) : filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={16}>
                    <VStack spacing={3} color="slate.400">
                      <Icon as={MdAssignment} boxSize={10} color="slate.200" />
                      <Text fontSize="sm">No reports uploaded yet</Text>
                      {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                        <Button
                          size="sm"
                          bg="brand.600"
                          color="white"
                          leftIcon={<AttachmentIcon />}
                          onClick={uploadModal.onOpen}
                          _hover={{ bg: 'brand.700' }}
                        >
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
                    <Tr key={report.id} _hover={{ bg: 'slate.50' }} transition="background 0.15s">
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="600" color="slate.900">{role?.title ?? '—'}</Text>
                          <Text fontSize="xs" color="slate.400">{role?.function}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        {candidate ? (
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="500" color="slate.900">{candidate.name}</Text>
                            <Text fontSize="xs" color="slate.400">{candidate.email}</Text>
                          </VStack>
                        ) : (
                          <Badge bg="purple.50" color="purple.700" borderRadius="full" fontSize="xs" fontWeight="600" px={2.5}>
                            Hiring Manager
                          </Badge>
                        )}
                      </Td>
                      <Td>
                        <Badge
                          bg={isPdf ? 'red.50' : 'green.50'}
                          color={isPdf ? 'red.700' : 'green.700'}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="700"
                          px={2.5}
                        >
                          {report.fileType}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="500" color="slate.700">
                            {format(new Date(report.uploadedAt), 'dd MMM yyyy')}
                          </Text>
                          <Text fontSize="xs" color="slate.400">
                            {format(new Date(report.uploadedAt), 'HH:mm')}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="slate.600">{report.uploadedBy}</Text>
                      </Td>
                      <Td>
                        <Tooltip label="Download report" hasArrow>
                          <IconButton
                            aria-label="Download report"
                            icon={<DownloadIcon />}
                            size="sm"
                            variant="ghost"
                            color="brand.600"
                            as="a"
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            _hover={{ bg: 'brand.50', color: 'brand.700' }}
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

      <ReportUploadModal isOpen={uploadModal.isOpen} onClose={uploadModal.onClose} roles={roles} />
    </Box>
  );
};

export default ReportsPage;
