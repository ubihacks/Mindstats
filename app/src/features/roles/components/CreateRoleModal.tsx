import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, VStack, SimpleGrid, useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createRole } from '../rolesSlice';

const schema = z.object({
  title: z.string().min(2, 'Role title is required'),
  jobLevel: z.string().min(1, 'Job level is required'),
  function: z.string().min(1, 'Function is required'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoleModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { status } = useAppSelector((s) => s.roles);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const result = await dispatch(
      createRole({ ...data, companyId: user.id })
    );
    if (createRole.fulfilled.match(result)) {
      toast({ title: 'Role created successfully', status: 'success', position: 'top', duration: 3000 });
      reset();
      onClose();
    } else {
      toast({ title: 'Failed to create role', status: 'error', position: 'top', duration: 4000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="xl">
        <ModalHeader fontWeight="800" fontSize="lg" pt={6} color="slate.900" letterSpacing="-0.03em">Create Hiring Role</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel fontWeight="600" fontSize="sm">Role Title</FormLabel>
                <Input {...register('title')} placeholder="e.g. Senior Software Engineer"
                  _focus={{ borderColor: 'blue.500' }} />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={!!errors.jobLevel}>
                  <FormLabel fontWeight="600" fontSize="sm">Job Level</FormLabel>
                  <Input {...register('jobLevel')} placeholder="e.g. Manager"
                    _focus={{ borderColor: 'blue.500' }} />
                  <FormErrorMessage>{errors.jobLevel?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.function}>
                  <FormLabel fontWeight="600" fontSize="sm">Function</FormLabel>
                  <Input {...register('function')} placeholder="e.g. Engineering"
                    _focus={{ borderColor: 'blue.500' }} />
                  <FormErrorMessage>{errors.function?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose} color="slate.500" _hover={{ bg: 'slate.100' }}>Cancel</Button>
            <Button
              type="submit"
              bg="brand.600"
              color="white"
              isLoading={status === 'loading'}
              loadingText="Creating…"
              fontWeight="700"
              _hover={{ bg: 'brand.700' }}
            >
              Create Role
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoleModal;
