import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, VStack, Text, Spinner, Button, Heading, Alert, AlertIcon, Image, Flex,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';

const NAVY = '#001e40';

const InvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'invalid'>('loading');
  const [candidateName, setCandidateName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    const validate = async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, invite_status, expires_at, role_id, hiring_roles(title)')
        .eq('invite_token', token)
        .maybeSingle();

      if (error || !data) { setStatus('invalid'); return; }

      const expired = new Date(data.expires_at) < new Date();
      if (expired || data.invite_status === 'EXPIRED') { setStatus('expired'); return; }
      if (data.invite_status === 'COMPLETED') { setStatus('expired'); return; }

      setCandidateName(data.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRoleTitle((data.hiring_roles as any)?.title ?? 'this role');
      setRoleId(data.role_id);
      setStatus('valid');
    };

    validate();
  }, [token]);

  const handleStart = () => {
    // Store token so AssessmentPage can use it without auth
    sessionStorage.setItem('candidate_invite_token', token!);
    navigate(`/assess/${roleId}/candidate`);
  };

  return (
    <Flex minH="100vh" bg="#f7f8fa" align="center" justify="center" px={4}>
      <Box bg="white" borderRadius="2xl" boxShadow="lg" p={10} maxW="440px" w="full" textAlign="center">
        <Image src="/mindstats-logo.svg" h="22px" mx="auto" mb={8} />

        {status === 'loading' && (
          <VStack spacing={4}>
            <Spinner size="lg" color={NAVY} thickness="3px" />
            <Text color="gray.500" fontSize="sm">Validating your invite…</Text>
          </VStack>
        )}

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
            <Button
              bg={NAVY} color="white" borderRadius="full" fontWeight="700" size="lg" w="full"
              onClick={handleStart} _hover={{ bg: '#002952' }}
            >
              Start Assessment
            </Button>
          </VStack>
        )}

        {status === 'expired' && (
          <VStack spacing={4}>
            <Alert status="warning" borderRadius="xl">
              <AlertIcon />
              <Text fontSize="sm">This invite link has expired or has already been used.</Text>
            </Alert>
            <Text fontSize="xs" color="gray.400">Please contact the company to request a new invite.</Text>
          </VStack>
        )}

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
