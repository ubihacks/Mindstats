import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, VStack, Text, Switch, HStack,
  Alert, AlertIcon, useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { inviteCandidate } from '../rolesSlice';
import type { HiringRole } from '../../../types';


const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
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

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shareReport: true },
  });

  const shareReport = watch('shareReport');

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
      toast({
        title: 'Candidate invited',
        description: `Assessment link sent to ${data.email}. Expires in 14 days.`,
        status: 'success',
        position: 'top',
        duration: 4000,
      });
      reset();
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader fontWeight="700" fontSize="lg" pt={6}>Invite Candidate</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="lg" py={2}>
                <AlertIcon />
                <Text fontSize="xs">
                  Deducts <strong>1 credit</strong> now. Credit refunded if unused after 14 days.
                  Balance: <strong>{credits}</strong>
                </Text>
              </Alert>

              <Text fontSize="sm" color="slate.600" bg="slate.50" borderRadius="lg" p={3} w="full">
                Role: <strong>{role.title}</strong> · {role.jobLevel}
              </Text>

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
            <Button variant="ghost" onClick={onClose} color="slate.500" _hover={{ bg: 'slate.100' }}>Cancel</Button>
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
      </ModalContent>
    </Modal>
  );
};

export default InviteCandidateModal;
