import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DataBootstrap from '../DataBootstrap';

const AppShell: React.FC = () => {
  return (
    <Flex minH="100vh" bg="dark.900">
      <DataBootstrap />
      <Sidebar />
      <Box
        ml="240px"
        flex={1}
        p={{ base: 6, md: 8, lg: 10 }}
        maxW="1440px"
        w="full"
        minH="100vh"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AppShell;
