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

/** Minimal shape read from disc_results for the completion screen. */
interface DiscDimResult {
  most: number;
  least: number;
  perceived: number;
  public_intensity: number;
  public_percent: number;
}
interface DiscResultRow {
  scores: Record<'D' | 'I' | 'S' | 'C', DiscDimResult>;
  public_profile: string;
  public_label: string;
  alignment_type: string;
  stress_scale: number;
}

const InvitePage: React.FC = () => {
  const { token }  = useParams<{ token: string }>();
  const navigate   = useNavigate();

  const [status, setStatus]                 = useState<PageStatus>('loading');
  const [candidateName, setCandidateName]   = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [roleTitle, setRoleTitle]           = useState('');
  const [roleId, setRoleId]                 = useState('');
  const [reportUrl, setReportUrl]           = useState<string | null>(null);
  const [discResult, setDiscResult]         = useState<DiscResultRow | null>(null);
  const [debugError, setDebugError]         = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      void Promise.resolve().then(() => setStatus('invalid'));
      return;
    }

    const validate = async () => {
      // Minimal select — avoid columns that may not exist or FK joins that may fail
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, email, invite_status, expires_at, role_id')
        .eq('invite_token', token)
        .maybeSingle();

      if (error) {
        console.error('[InvitePage] candidates query error:', error);
        setDebugError(`DB error: ${error.message} (code: ${error.code})`);
        setStatus('invalid');
        return;
      }
      if (!data) {
        console.warn('[InvitePage] no candidate found for token:', token);
        setDebugError(`No row found for token: ${token}`);
        setStatus('invalid');
        return;
      }

      // Fetch role title separately (avoids FK naming issues)
      const { data: roleData } = await supabase
        .from('hiring_roles')
        .select('title')
        .eq('id', data.role_id)
        .maybeSingle();

      // Completed — show result screen
      if (data.invite_status === 'COMPLETED') {
        setCandidateName(data.name);
        setRoleTitle(roleData?.title ?? 'this role');

        // Try fetching report_url (exists only if migration ran)
        const { data: fullCandidate } = await supabase
          .from('candidates')
          .select('report_url, share_report_with_candidate')
          .eq('id', data.id)
          .maybeSingle();
        if (fullCandidate?.share_report_with_candidate && fullCandidate?.report_url) {
          setReportUrl(fullCandidate.report_url);
        }

        // Fetch DISC result from disc_results by respondent_email
        if (data.email) {
          const { data: dr } = await supabase
            .from('disc_results')
            .select('scores, public_profile, public_label, alignment_type, stress_scale')
            .eq('respondent_email', data.email)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (dr) setDiscResult(dr as DiscResultRow);
        }

        setStatus('completed');
        return;
      }

      const expired = new Date(data.expires_at) < new Date();
      if (expired || data.invite_status === 'EXPIRED') { setStatus('expired'); return; }

      setCandidateName(data.name);
      setCandidateEmail(data.email ?? '');
      setRoleTitle(roleData?.title ?? 'this role');
      setRoleId(data.role_id);
      setStatus('valid');
    };

    validate();
  }, [token]);

  const handleStart = () => {
    // Persist identity for the assessment page (scoring needs name + email)
    sessionStorage.setItem('candidate_invite_token', token!);
    sessionStorage.setItem('candidate_name',  candidateName);
    sessionStorage.setItem('candidate_email', candidateEmail);
    navigate(`/assess/${roleId}/candidate`);
  };

  const primaryTrait = discResult
    ? (discResult.public_profile[0] as 'D' | 'I' | 'S' | 'C')
    : null;

  const handleDownloadResults = () => {
    if (!discResult) return;
    const dims = (['D', 'I', 'S', 'C'] as const)
      .slice()
      .sort((a, b) => discResult.scores[b].public_percent - discResult.scores[a].public_percent);

    const rows = [
      ['DISC Behavioural Assessment Results'],
      [`Candidate,${candidateName}`],
      [`Profile,${discResult.public_label} (${discResult.public_profile})`],
      [`Alignment,${discResult.alignment_type}`],
      [],
      ['Dimension', 'Label', 'Most Selections', 'Least Selections', 'Perceived', 'Public Intensity', 'Public %'],
      ...dims.map((d) => {
        const s = discResult.scores[d];
        return [
          d,
          DISC_LABEL[d],
          s.most,
          s.least,
          s.perceived,
          s.public_intensity,
          `${Math.round(s.public_percent * 100)}%`,
        ];
      }),
    ];

    const csv  = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `disc-results-${candidateName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

            {/* DISC profile summary */}
            {discResult && primaryTrait && (
              <>
                <Divider />
                <Box w="full" textAlign="left">
                  <HStack mb={3}>
                    <Icon as={MdBarChart} color="gray.400" />
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em">
                      Your Behavioural Profile
                    </Text>
                  </HStack>

                  {/* Primary profile card */}
                  <Box
                    bg={`${DISC_COLOR[primaryTrait]}10`}
                    border="1px solid" borderColor={`${DISC_COLOR[primaryTrait]}30`}
                    borderRadius="xl" p={4} mb={3}
                  >
                    <HStack justify="space-between">
                      <Box>
                        <Text fontSize="10px" color="gray.500" fontWeight="600" mb={0.5}>Public Style</Text>
                        <Text fontSize="lg" fontWeight="800" color={DISC_COLOR[primaryTrait]}>
                          {discResult.public_label}
                        </Text>
                        <Text fontSize="xs" color="gray.400" mt={0.5}>
                          {discResult.alignment_type}
                        </Text>
                      </Box>
                      <Box
                        w="40px" h="40px" borderRadius="lg" bg={DISC_COLOR[primaryTrait]}
                        display="flex" alignItems="center" justifyContent="center"
                        fontSize="lg" fontWeight="800" color="white"
                      >
                        {discResult.public_profile}
                      </Box>
                    </HStack>
                  </Box>

                  {/* Per-dimension bars */}
                  <VStack spacing={2} align="stretch">
                    {((['D', 'I', 'S', 'C'] as const)
                      .slice()
                      .sort((a, b) => discResult.scores[b].public_percent - discResult.scores[a].public_percent)
                    ).map((t) => (
                      <Box key={t}>
                        <HStack justify="space-between" mb={0.5}>
                          <Text fontSize="10px" fontWeight="700" color={DISC_COLOR[t]}>
                            {t} — {DISC_LABEL[t]}
                          </Text>
                          <Text fontSize="10px" color="gray.400">
                            {Math.round(discResult.scores[t].public_percent * 100)}%
                          </Text>
                        </HStack>
                        <Box h="4px" bg="gray.100" borderRadius="full" overflow="hidden">
                          <Box
                            h="full" bg={DISC_COLOR[t]} borderRadius="full"
                            w={`${Math.round(discResult.scores[t].public_percent * 100)}%`}
                          />
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                </Box>
                <Divider />
              </>
            )}

            {/* Download scores + report section */}
            <VStack spacing={3} w="full">
              {discResult && (
                <Button
                  leftIcon={<DownloadIcon />} variant="outline" borderRadius="full"
                  fontWeight="700" w="full" borderColor="gray.200" color="gray.700"
                  onClick={handleDownloadResults}
                  _hover={{ bg: 'gray.50', borderColor: NAVY, color: NAVY }}
                >
                  Download My Results (CSV)
                </Button>
              )}
              {reportUrl ? (
                <>
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
                </>
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
            {debugError && (
              <Box bg="gray.50" borderRadius="lg" p={3} w="full" textAlign="left">
                <Text fontSize="10px" color="gray.400" fontFamily="mono" wordBreak="break-all">{debugError}</Text>
              </Box>
            )}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default InvitePage;

