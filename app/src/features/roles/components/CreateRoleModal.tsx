import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, VStack, SimpleGrid, useToast,
  HStack, Box, Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createRole } from '../rolesSlice';

const schema = z.object({
  title: z.string().min(2, 'Project title is required'),
  jobLevel: z.string().min(1, 'This field is required'),
  function: z.string().min(1, 'Function is required'),
});

type FormData = z.infer<typeof schema>;
type ProjectType = 'HIRING' | 'INTERNAL';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoleModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { status } = useAppSelector((s) => s.roles);
  const [projectType, setProjectType] = useState<ProjectType>('HIRING');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const isHiring = projectType === 'HIRING';

  // Field 2 & 3 labels depend on project type
  const field2Label       = isHiring ? 'Job Level'   : 'Team';
  const field2Placeholder = isHiring ? 'e.g. Manager' : 'e.g. Product Team';
  const field3Label       = isHiring ? 'Function'    : 'Department';
  const field3Placeholder = isHiring ? 'e.g. Engineering' : 'e.g. Operations';

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const result = await dispatch(
      createRole({ ...data, companyId: user.id })
    );
    if (createRole.fulfilled.match(result)) {
      toast({ title: 'Project created successfully', status: 'success', position: 'top', duration: 3000 });
      reset();
      setProjectType('HIRING');
      onClose();
    } else {
      toast({ title: 'Failed to create project', status: 'error', position: 'top', duration: 4000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="xl">
        <ModalHeader fontWeight="800" fontSize="lg" pt={6} color="slate.900" letterSpacing="-0.03em">
          Create Project
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>

              {/* ── Project Type Toggle ── */}
              <FormControl>
                <FormLabel fontWeight="600" fontSize="sm">Project Type</FormLabel>
                <HStack spacing={0} borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden" w="full">
                  {(['HIRING', 'INTERNAL'] as ProjectType[]).map((t) => (
                    <Box
                      key={t}
                      flex={1} py={2} textAlign="center" cursor="pointer"
                      bg={projectType === t ? 'blue.600' : 'white'}
                      color={projectType === t ? 'white' : 'gray.600'}
                      fontWeight="700" fontSize="sm"
                      transition="all 0.15s"
                      onClick={() => setProjectType(t)}
                      _hover={projectType !== t ? { bg: 'gray.50' } : {}}
                    >
                      <Text>{t === 'HIRING' ? 'Hiring' : 'Internal'}</Text>
                    </Box>
                  ))}
                </HStack>
              </FormControl>

              {/* ── Project Title ── */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel fontWeight="600" fontSize="sm">Project Title</FormLabel>
                <Input
                  {...register('title')}
                  placeholder={isHiring ? 'e.g. Senior Software Engineer' : 'e.g. Q3 Expansion Initiative'}
                  _focus={{ borderColor: 'blue.500' }}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                {/* ── Field 2: Job Level / Team ── */}
                <FormControl isInvalid={!!errors.jobLevel}>
                  <FormLabel fontWeight="600" fontSize="sm">{field2Label}</FormLabel>
                  <Input {...register('jobLevel')} placeholder={field2Placeholder}
                    _focus={{ borderColor: 'blue.500' }} />
                  <FormErrorMessage>{errors.jobLevel?.message}</FormErrorMessage>
                </FormControl>

                {/* ── Field 3: Function / Department ── */}
                <FormControl isInvalid={!!errors.function}>
                  <FormLabel fontWeight="600" fontSize="sm">{field3Label}</FormLabel>
                  <Input {...register('function')} placeholder={field3Placeholder}
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
              Create Project
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoleModal;
