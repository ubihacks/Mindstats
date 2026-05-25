import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, VStack, Text, useToast, Alert, AlertIcon,
  InputGroup, InputRightElement, IconButton, Box, Tooltip,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { inviteHiringManager } from '../rolesSlice';
import { isCompanyEmail } from '../../auth/authSlice';
import type { HiringRole } from '../../../types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z
    .string()
    .email('Invalid email')
    .refine(isCompanyEmail, 'Only company email addresses allowed'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: HiringRole;
}

const InviteHiringManagerModal: React.FC<Props> = ({ isOpen, onClose, role }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { status } = useAppSelector((s) => s.roles);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const result = await dispatch(
      inviteHiringManager({
        roleId: role.id,
        email: data.email,
        name: data.name,
        companyId: user.id,
      })
    );
    if (inviteHiringManager.fulfilled.match(result)) {
      const link = `${window.location.origin}/assess/${role.id}/hiring-manager`;
      setInviteLink(link);
      reset();
    } else {
      toast({
        title: 'Failed to invite',
        description: result.payload as string,
        status: 'error',
        position: 'top',
        duration: 4000,
      });
    }
  };

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setInviteLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="xl">
        <ModalHeader fontWeight="800" fontSize="lg" pt={6} color="slate.900" letterSpacing="-0.03em">
          {inviteLink ? '✓ PM Invited — Copy Link' : 'Invite Project Manager'}
        </ModalHeader>
        <ModalCloseButton color="slate.400" />

        {inviteLink ? (
          <>
            <ModalBody pb={2}>
              <VStack spacing={4}>
                <Alert status="success" borderRadius="xl" fontSize="sm">
                  <AlertIcon />
                  <Text fontSize="xs">
                    Project manager invited for <strong>{role.title}</strong>. An email has been sent. Share the link below:
                  </Text>
                </Alert>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="slate.500" mb={1.5} textTransform="uppercase" letterSpacing="0.05em">
                    Assessment Link
                  </Text>
                  <InputGroup size="md">
                    <Input
                      value={inviteLink}
                      isReadOnly
                      fontSize="xs"
                      bg="slate.50"
                      border="1.5px solid"
                      borderColor="slate.200"
                      pr="4.5rem"
                    />
                    <InputRightElement w="4.5rem">
                      <Tooltip label={copied ? 'Copied!' : 'Copy link'} hasArrow>
                        <IconButton
                          aria-label="Copy link"
                          icon={copied ? <CheckIcon /> : <CopyIcon />}
                          size="sm"
                          bg={copied ? 'green.500' : 'brand.600'}
                          color="white"
                          onClick={handleCopy}
                          _hover={{ bg: copied ? 'green.600' : 'brand.700' }}
                        />
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize="xs" color="slate.400" mt={1.5}>
                    Send this link to the project manager. They'll fill out the project behavioural demand form.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button bg="brand.600" color="white" fontWeight="700" onClick={handleClose} _hover={{ bg: 'brand.700' }}>
                Done
              </Button>
            </ModalFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={2}>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="xl" py={3}>
                  <AlertIcon />
                  <Text fontSize="xs">
                    The project manager will receive an email with their assessment link. No credits are deducted.
                  </Text>
                </Alert>
                <Text fontSize="sm" color="slate.600" bg="slate.50" borderRadius="lg" p={3} w="full">
                  Role: <strong>{role.title}</strong> · {role.jobLevel} · {role.function}
                </Text>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>Full Name</FormLabel>
                  <Input {...register('name')} placeholder="John Smith" size="lg" bg="slate.50" border="1.5px solid" borderColor="slate.200" />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="600" fontSize="sm" color="slate.700" mb={1.5}>Company Email</FormLabel>
                  <Input {...register('email')} type="email" placeholder="manager@company.com" size="lg" bg="slate.50" border="1.5px solid" borderColor="slate.200" />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap={3} pt={5}>
              <Button variant="ghost" onClick={handleClose} color="slate.500" _hover={{ bg: 'slate.100' }}>Cancel</Button>
              <Button
                type="submit"
                bg="brand.600"
                color="white"
                isLoading={status === 'loading'}
                loadingText="Sending…"
                fontWeight="700"
                _hover={{ bg: 'brand.700' }}
              >
                Send Invite
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InviteHiringManagerModal;
