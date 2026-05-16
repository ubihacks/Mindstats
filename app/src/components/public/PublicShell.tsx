import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SiteFooter from './SiteFooter';

const PublicShell: React.FC = () => (
  <Box minH="100vh" display="flex" flexDirection="column" bg="slate.50">
    <TopNav />
    <Box flex={1}>
      <Outlet />
    </Box>
    <SiteFooter />
  </Box>
);

export default PublicShell;
