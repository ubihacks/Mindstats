import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, VStack, Text, Spinner, Button, Heading, Alert, AlertIcon,
  Image, Flex, HStack, Icon, Badge, Divider,
} from '@chakra-ui/react';
import { CheckCircleIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { MdBarChart } from 'react-icons/md';
import { supabase } from '../lib/supabaseClient';

const NAVY = '#001e40';

const DISC_COLOR: Record<string, string> = { D: '#E53E3E', I: '#D69E2E', S: '#38A169', C: '#3182CE' };
const DISC_LABEL: Record<string, string> = {
  D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness',
};

type PageStatus = 'loading' | 'valid' | 'completed' | 'expired' | 'invalid';
interface DiscScores { D: number; I: number; S: number; C: number }

const InvitePage: React.FC = () => {
  const { token }  = useParams<{ token: string }>();
  const navigate   = useNavigate();

  const [status, setStatus]             = useState<PageStatus>('loading');
  const [candidateName, setCandidateName] = useState('');
  const [roleTitle, setRoleTitle]       = useState('');
  const [roleId, setRoleId]             = useState('');
  const [reportUrl, setReportUrl]       = useState<string | null>(null);
  const [discScores, setDiscScores]     = useState<DiscScores | null>(null);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    const validate = async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, invite_status, expires_at, role_id, report_url, disc_scores, share_report_with_candidate, hiring_roles(title)')
        .eq('invite_token', token)
        .maybeSingle();

      if (error || !data) { setStatus('invalid'); return; }

      // Completed — show result screen
      if (data.invite_status === 'COMPLETED') {
        setCandidateName(data.name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRoleTitle((data.hiring_roles as any)?.title ?? 'this role');
        if (data.share_report_with_candidate && data.report_url) {
          setReportUrl(data.report_url);
        }
        if (data.disc_scores) setDiscScores(data.disc_scores as DiscScores);
        setStatus('completed');
        return;
      }

      const expired = new Date(data.expires_at) < new Date();
      if (expired || data.invite_status === 'EXPIRED') { setStatus('expired'); return; }

      setCandidateName(data.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRoleTitle((data.hiring_roles as any)?.title ?? 'this role');
      setRoleId(data.role_id);
      setStatus('valid');
    };

    validate();
  }, [token]);

  const handleStart = () => {
    sessionStorage.setItem('candidate_invite_token', token!);
    navigate(`/assess/${roleId}/candidate`);
  };

  const primaryTrait = discScores
    ? (Object.entries(discScores).sort((a, b) => b[1] - a[1])[0][0])
    : null;

  return (
    <Flex minH="100vh" bg="#f7f8fa" align="center" justify="center" px={4} py={10}>
      <Box bg="white" borderRadius="2xl" boxShadow="lg" p={10} maxW="480px" w="full" textAlign="center">
        <Image src="/mindstats-logo.svg" h="22px" mx="auto" mb={8} />

        {/* ── Loading ── */}
        {status === 'loading' && (
          <VStack spacing={4}>
            <Spinner size="lg" color={NAVY} thickness="3px" />
            <Text color="gray.500" fontSize="sm">Validating your invite…</Text>
          </VStack>
        )}

        {/* ── Valid: start assessment ── */}
        {status === 'valid' && (
          <VStack spacing={6}>
            <Box bg="#E8F3ED" borderRadius="full" px={4} py={1}>
              <Text fontSize="xs" fontWeight="700" color="#1a6b3a" textTransform="uppercase" letterSpacing="0.08em">
                Behavioural Assessment
              </Text>
            </Box>
            <VStack spacing={1}>
              <Heading size="md" fontWeight="800" color={NAVY} letterSpacing="-0.03em">
                Hi, {candidateName}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                You've been invited to complete a DISC assessment for
              </Text>
              <Text fontSize="sm" fontWeight="700" color="gray.800">{roleTitle}</Text>
            </VStack>
            <VStack spacing={2} w="full" bg="gray.50" borderRadius="xl" p={4} textAlign="left">
              <Text fontSize="xs" color="gray.500">· 28 questions · ~10 minutes</Text>
              <Text fontSize="xs" color="gray.500">· No right or wrong answers</Text>
              <Text fontSize="xs" color="gray.500">· Choose what feels most and least like you</Text>
            </VStack>
            <Button bg={NAVY} color="white" borderRadius="full" fontWeight="700" size="lg" w="full"
              onClick={handleStart} _hover={{ bg: '#002952' }}>
              Start Assessment
            </Button>
          </VStack>
        )}

        {/* ── Completed ── */}
        {status === 'completed' && (
          <VStack spacing={6}>
            {/* Success check */}
            <Box bg="green.50" borderRadius="full" p={4} border="6px solid" borderColor="green.100">
              <Icon as={CheckCircleIcon} boxSize={9} color="green.500" />
            </Box>

            <VStack spacing={1}>
              <Heading size="md" fontWeight="800" color={NAVY} letterSpacing="-0.03em">
                Assessment Complete
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Hi {candidateName}, you've completed the DISC assessment for
              </Text>
              <Text fontSize="sm" fontWeight="700" color="gray.800">{roleTitle}</Text>
            </VStack>

            {/* DISC scores summary */}
            {discScores && primaryTrait && (
              <>
                <Divider />
                <Box w="full" textAlign="left">
                  <HStack mb={3}>
                    <Icon as={MdBarChart} color="gray.400" />
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em">
                      Your Behavioural Profile
                    </Text>
                  </HStack>

                  <Box
                    bg={`${DISC_COLOR[primaryTrait]}10`}
                    border="1px solid" borderColor={`${DISC_COLOR[primaryTrait]}30`}
                    borderRadius="xl" p={4} mb={3}
                  >
                    <HStack justify="space-between">
                      <Box>
                        <Text fontSize="10px" color="gray.500" fontWeight="600" mb={0.5}>Primary Style</Text>
                        <Text fontSize="lg" fontWeight="800" color={DISC_COLOR[primaryTrait]}>
                          {DISC_LABEL[primaryTrait]}
                        </Text>
                      </Box>
                      <Box
                        w="40px" h="40px" borderRadius="lg" bg={DISC_COLOR[primaryTrait]}
                        display="flex" alignItems="center" justifyContent="center"
                        fontSize="lg" fontWeight="800" color="white"
                      >
                        {primaryTrait}
                      </Box>
                    </HStack>
                  </Box>

                  <HStack spacing={2} flexWrap="wrap">
                    {(Object.entries(discScores) as [string, number][])
                      .sort((a, b) => b[1] - a[1])
                      .map(([t, s]) => (
                        <Badge key={t}
                          bg={`${DISC_COLOR[t]}15`} color={DISC_COLOR[t]}
                          borderRadius="full" px={2.5} fontSize="10px" fontWeight="700"
                        >
                          {t}: {s > 0 ? `+${s}` : s}
                        </Badge>
                      ))}
                  </HStack>
                </Box>
                <Divider />
              </>
            )}

            {/* Report section */}
            {reportUrl ? (
              <VStack spacing={3} w="full">
                <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
                  ✓ Your Report is Ready
                </Badge>
                <Button
                  as="a" href={reportUrl} target="_blank" rel="noopener noreferrer"
                  leftIcon={<DownloadIcon />} bg={NAVY} color="white" borderRadius="full"
                  fontWeight="700" w="full" _hover={{ bg: '#002952' }}
                >
                  View / Download Report
                </Button>
              </VStack>
            ) : (
              <Box bg="blue.50" borderRadius="xl" p={4} w="full" textAlign="left">
                <HStack spacing={3}>
                  <Icon as={ExternalLinkIcon} color="blue.400" boxSize={4} flexShrink={0} />
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="blue.700">Report Being Prepared</Text>
                    <Text fontSize="xs" color="blue.500" mt={0.5}>
                      The HR team is reviewing your results. You'll receive your report once it's ready.
                    </Text>
                  </Box>
                </HStack>
              </Box>
            )}
          </VStack>
        )}

        {/* ── Expired ── */}
        {status === 'expired' && (
          <VStack spacing={4}>
            <Alert status="warning" borderRadius="xl">
              <AlertIcon />
              <Text fontSize="sm">This invite link has expired.</Text>
            </Alert>
            <Text fontSize="xs" color="gray.400">Please contact the company to request a new invite.</Text>
          </VStack>
        )}

        {/* ── Invalid ── */}
        {status === 'invalid' && (
          <VStack spacing={4}>
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              <Text fontSize="sm">This invite link is invalid.</Text>
            </Alert>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default InvitePage;

