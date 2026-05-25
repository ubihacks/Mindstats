import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, VStack, Text, Switch, HStack,
  Alert, AlertIcon, useToast, Box, InputGroup, InputRightElement,
  IconButton, Select,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { inviteCandidate } from '../rolesSlice';
import { deductOneCredit } from '../../billing/billingSlice';
import type { HiringRole } from '../../../types';

const JOB_LEVELS = [
  'Fresh Grad (Internship)',
  'Entry Level (Office & Admin.)',
  'Junior Level (Executive)',
  'Mid Level (Managerial)',
  'Senior Level (Leadership)',
] as const;

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  jobLevel: z.string().min(1, 'Job level is required'),
  shareReport: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: HiringRole;
}

const InviteCandidateModal: React.FC<Props> = ({ isOpen, onClose, role }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { status } = useAppSelector((s) => s.roles);
  const { credits } = useAppSelector((s) => s.billing);

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shareReport: true, jobLevel: '' },
  });

  const shareReport = watch('shareReport');

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setInviteLink(null);
    setCopied(false);
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const result = await dispatch(
      inviteCandidate({
        roleId: role.id,
        name: data.name,
        email: data.email,
        companyId: user.id,
        shareReport: data.shareReport,
      })
    );
    if (inviteCandidate.fulfilled.match(result)) {
      const token = (result.payload as { inviteToken: string }).inviteToken;
      const link = `${window.location.origin}/invite/${token}?tier=${encodeURIComponent(data.jobLevel)}`;
      setInviteLink(link);
      dispatch(deductOneCredit());
      reset();
    } else {
      toast({
        title: 'Failed to invite candidate',
        description: result.payload as string,
        status: 'error',
        position: 'top',
        duration: 4000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader fontWeight="700" fontSize="lg" pt={6}>
          {inviteLink ? '✓ Candidate Invited' : 'Invite Candidate'}
        </ModalHeader>
        <ModalCloseButton />

        {inviteLink ? (
          <>
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Text fontSize="sm">Invite created. Share this link with the candidate — it expires in <strong>14 days</strong>.</Text>
                </Alert>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2} textTransform="uppercase" letterSpacing="0.06em">Assessment Link</Text>
                  <InputGroup>
                    <Input
                      value={inviteLink}
                      isReadOnly
                      bg="gray.50"
                      fontSize="xs"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'blue.400' }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Copy link"
                        icon={copied ? <CheckIcon color="green.500" /> : <CopyIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize="xs" color="gray.400" mt={1}>No login required — candidate can open this link directly.</Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button bg="#001e40" color="white" borderRadius="full" fontWeight="700" onClick={handleClose} _hover={{ bg: '#002952' }}>
                Done
              </Button>
            </ModalFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="lg" py={2}>
                  <AlertIcon />
                  <Text fontSize="xs">
                    1 credit is deducted when the invitation is sent.
                    Balance: <strong>{credits}</strong>
                  </Text>
                </Alert>

                <Text fontSize="sm" color="slate.600" bg="slate.50" borderRadius="lg" p={3} w="full">
                  Role: <strong>{role.title}</strong> · {role.jobLevel}
                </Text>

                <FormControl isInvalid={!!errors.jobLevel}>
                  <FormLabel fontWeight="600" fontSize="sm">Job Level</FormLabel>
                  <Select {...register('jobLevel')} placeholder="Select job level"
                    _focus={{ borderColor: 'blue.500' }}>
                    {JOB_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.jobLevel?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.name}>
                  <FormLabel fontWeight="600" fontSize="sm">Candidate Name</FormLabel>
                  <Input {...register('name')} placeholder="Jane Doe"
                    _focus={{ borderColor: 'blue.500' }} />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="600" fontSize="sm">Email Address</FormLabel>
                  <Input {...register('email')} type="email" placeholder="candidate@email.com"
                    _focus={{ borderColor: 'blue.500' }} />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={0}>
                      <FormLabel fontWeight="600" fontSize="sm" mb={0}>Share Report with Candidate</FormLabel>
                      <Text fontSize="xs" color="slate.400">Send a copy of the report to the candidate</Text>
                    </VStack>
                    <Switch
                      colorScheme="purple"
                      isChecked={shareReport}
                      onChange={(e) => setValue('shareReport', e.target.checked)}
                    />
                  </HStack>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="ghost" onClick={handleClose} color="slate.500" _hover={{ bg: 'slate.100' }}>Cancel</Button>
              <Button
                type="submit"
                bg="brand.600"
                color="white"
                isLoading={status === 'loading'}
                loadingText="Sending…"
                fontWeight="700"
              isDisabled={credits < 1}
              _hover={{ bg: 'brand.700' }}
              _disabled={{ opacity: 0.5 }}
            >
              Send Invite (−1 Credit)
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InviteCandidateModal;
