import React, { useRef, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Select, VStack, Text, Box, HStack,
  Icon, useToast, Alert, AlertIcon,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { uploadReport } from '../reportsSlice';
import type { HiringRole } from '../../../types';


const schema = z.object({
  roleId: z.string().min(1, 'Please select a role'),
  candidateId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roles: HiringRole[];
  preselectedResultId?: string | null;
}

const ReportUploadModal: React.FC<Props> = ({ isOpen, onClose, roles }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { status } = useAppSelector((s) => s.reports);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedRoleId = watch('roleId');
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    const ext = file?.name.split('.').pop()?.toLowerCase();
    if (file && (ext === 'pdf' || ext === 'xlsx' || ext === 'xls')) {
      setSelectedFile(file);
    } else {
      toast({ title: 'Only PDF or Excel files allowed', status: 'warning', position: 'top' });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile || !user) {
      toast({ title: 'Please select a file', status: 'warning', position: 'top' });
      return;
    }
    const role = roles.find((r) => r.id === data.roleId);
    const candidate = role?.candidates.find((c) => c.id === data.candidateId);
    const result = await dispatch(
      uploadReport({
        file: selectedFile,
        roleId: data.roleId,
        candidateId: data.candidateId ?? null,
        companyId: user.id,
        uploadedBy: user.email,
        shareWithCandidate: candidate?.shareReportWithCandidate ?? false,
      })
    );
    if (uploadReport.fulfilled.match(result)) {
      toast({ title: 'Report uploaded successfully', status: 'success', position: 'top', duration: 3000 });
      reset();
      setSelectedFile(null);
      onClose();
    } else {
      toast({ title: 'Upload failed', status: 'error', position: 'top', duration: 4000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="xl">
        <ModalHeader fontWeight="800" fontSize="lg" pt={6} color="slate.900" letterSpacing="-0.03em">Upload Report</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="lg" py={2}>
                <AlertIcon />
                <Text fontSize="xs">
                  Reports are manually generated. Upload PDF or Excel files to the correct role/candidate folder.
                </Text>
              </Alert>

              <FormControl isInvalid={!!errors.roleId}>
                <FormLabel fontWeight="600" fontSize="sm">Hiring Role</FormLabel>
                <Select {...register('roleId')} placeholder="Select role"
                  _focus={{ borderColor: 'blue.500' }}>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.title} — {r.function}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.roleId?.message}</FormErrorMessage>
              </FormControl>

              {selectedRole && (
                <FormControl>
                  <FormLabel fontWeight="600" fontSize="sm">Candidate (optional — leave empty for HM report)</FormLabel>
                  <Select {...register('candidateId')} placeholder="Project Manager Report"
                    _focus={{ borderColor: 'blue.500' }}>
                    {selectedRole.candidates.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Drag-and-drop upload zone */}
              <Box
                border="2px dashed"
                borderColor={dragOver ? 'brand.400' : selectedFile ? 'green.400' : 'slate.200'}
                borderRadius="xl"
                bg={dragOver ? 'brand.50' : selectedFile ? 'green.50' : 'slate.50'}
                p={6}
                w="full"
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Icon as={AttachmentIcon} boxSize={8} color={selectedFile ? 'green.500' : 'slate.300'} mb={3} />
                {selectedFile ? (
                  <VStack spacing={0}>
                    <Text fontSize="sm" fontWeight="700" color="green.600">{selectedFile.name}</Text>
                    <Text fontSize="xs" color="gray.400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={0}>
                    <Text fontSize="sm" fontWeight="600" color="slate.600">Drop file here or click to browse</Text>
                    <Text fontSize="xs" color="slate.400">PDF or Excel (.xlsx, .xls)</Text>
                  </VStack>
                )}
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose} color="slate.500" _hover={{ bg: 'slate.100' }}>Cancel</Button>
            <Button
              type="submit"
              bg="brand.600"
              color="white"
              isLoading={status === 'loading'}
              loadingText="Uploading…"
              fontWeight="700"
              isDisabled={!selectedFile}
              _hover={{ bg: 'brand.700' }}
              _disabled={{ opacity: 0.5 }}
            >
              Upload Report
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ReportUploadModal;
