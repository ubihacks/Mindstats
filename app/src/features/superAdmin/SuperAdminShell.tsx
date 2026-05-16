import React from 'react';
import {
  Box, Flex, VStack, Text, HStack, Icon, Button, Image, Avatar,
  Badge, Divider,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  MdDashboard, MdBusiness, MdLogout, MdSupervisorAccount,
  MdBarChart,
} from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';

const NAV = [
  { label: 'Overview',  to: '/super-admin',          icon: MdDashboard        },
  { label: 'Companies', to: '/super-admin/companies', icon: MdBusiness         },
  { label: 'Analytics', to: '/super-admin/analytics', icon: MdBarChart         },
  { label: 'Users',     to: '/super-admin/users',     icon: MdSupervisorAccount },
];

const SuperAdminShell: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <Flex minH="100vh">
      {/* ── Sidebar ── */}
      <Box
        w="240px"
        minH="100vh"
        bg="#001e40"
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        display="flex"
        flexDirection="column"
        zIndex={100}
        borderRight="1px solid"
        borderColor="whiteAlpha.100"
      >
        {/* Brand */}
        <Box px={4} pt={6} pb={4}>
          <HStack spacing={2} mb={1}>
            <Image src="/mindstat-favicon.svg" h="28px" w="28px" alt="Mindstat" />
            <Image src="/mindstats-logo.svg" h="20px" filter="brightness(0) invert(1)" alt="Mindstat" />
          </HStack>
          <Badge
            bg="red.900"
            color="red.300"
            fontSize="9px"
            fontWeight="700"
            px={2}
            py={0.5}
            borderRadius="full"
            letterSpacing="0.08em"
            ml={0.5}
          >
            SUPER ADMIN
          </Badge>
        </Box>

        <Divider borderColor="whiteAlpha.100" />

        {/* Nav */}
        <VStack spacing={0.5} align="stretch" flex={1} px={3} py={4}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/super-admin'}>
              {({ isActive }) => (
                <HStack
                  px={3} py={2.5}
                  borderRadius="xl"
                  bg={isActive ? 'whiteAlpha.100' : 'transparent'}
                  color={isActive ? 'white' : 'whiteAlpha.600'}
                  fontWeight={isActive ? '600' : '500'}
                  fontSize="sm"
                  transition="all 0.15s"
                  _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                  cursor="pointer"
                >
                  {isActive && (
                    <Box w="3px" h="16px" bg="red.400" borderRadius="full" position="absolute" left={0} />
                  )}
                  <Icon as={item.icon} boxSize={4} />
                  <Text>{item.label}</Text>
                </HStack>
              )}
            </NavLink>
          ))}
        </VStack>

        <Divider borderColor="whiteAlpha.100" />

        {/* Footer */}
        <Box px={4} py={4}>
          <HStack spacing={3} mb={3}>
            <Avatar size="xs" name={user?.email} bg="red.700" color="white" />
            <Box flex={1} minW={0}>
              <Text fontSize="xs" fontWeight="600" color="white" isTruncated>{user?.email}</Text>
              <Text fontSize="10px" color="whiteAlpha.500">Super Admin</Text>
            </Box>
          </HStack>
          <Button
            leftIcon={<Icon as={MdLogout} />}
            variant="ghost"
            size="sm"
            w="full"
            justifyContent="flex-start"
            color="whiteAlpha.500"
            fontWeight="500"
            onClick={handleLogout}
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
          >
            Sign out
          </Button>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box ml="240px" flex={1} minH="100vh" bg="gray.50" p={{ base: 6, md: 8, lg: 10 }}>
        <Box maxW="1400px" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default SuperAdminShell;
