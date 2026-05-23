import React from 'react';
import {
  Box, Flex, VStack, Text, HStack, Icon, Divider, Avatar,
  Button, Badge, Tooltip, Progress, Image,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdWork, MdCreditCard, MdAssignment,
  MdAdminPanelSettings, MdLogout,
} from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  to: '/dashboard', icon: MdDashboard },
  { label: 'Projects',   to: '/projects',  icon: MdWork,               roles: ['ADMIN', 'HR', 'HIRING_MANAGER'] },
  { label: 'Reports',    to: '/reports',   icon: MdAssignment,         roles: ['ADMIN', 'HR', 'HIRING_MANAGER'] },
  { label: 'Billing',    to: '/billing',   icon: MdCreditCard,         roles: ['ADMIN'] },
  { label: 'Admin',      to: '/admin',     icon: MdAdminPanelSettings, roles: ['ADMIN'] },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { credits } = useAppSelector((s) => s.billing);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const creditHealth = credits > 5 ? 'green' : credits > 0 ? 'yellow' : 'red';
  const creditPct = Math.min((credits / 10) * 100, 100);

  return (
    <Box
      w="240px"
      minH="100vh"
      bg="brand.800"
      display="flex"
      flexDirection="column"
      py={5}
      px={3}
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      zIndex={100}
      borderRight="1px solid"
      borderColor="whiteAlpha.100"
    >
      {/* Brand */}
      <Box mb={8} px={3} pt={1}>
        <HStack spacing={2} mb={0.5}>
          <Image src="/mindstats-logo.svg" h="22px" filter="brightness(0) invert(1)" alt="Mindstat" />
        </HStack>
        <Text fontSize="xs" color="whiteAlpha.500" pl={0} letterSpacing="0.02em">
          Behavioural Intelligence
        </Text>
      </Box>

      {/* Nav section label */}
      <Text
        fontSize="10px"
        fontWeight="700"
        color="whiteAlpha.400"
        letterSpacing="0.1em"
        textTransform="uppercase"
        px={3}
        mb={2}
      >
        Navigation
      </Text>

      {/* Nav items */}
      <VStack spacing={0.5} align="stretch" flex={1}>
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <HStack
                px={3}
                py={2.5}
                borderRadius="xl"
                bg={isActive ? 'whiteAlpha.100' : 'transparent'}
                color={isActive ? 'white' : 'whiteAlpha.600'}
                fontWeight={isActive ? '600' : '500'}
                transition="all 0.15s"
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                cursor="pointer"
                position="relative"
                role="group"
              >
                {isActive && (
                  <Box
                    position="absolute"
                    left={0}
                    top="20%"
                    bottom="20%"
                    w="3px"
                    bg="teal.400"
                    borderRadius="full"
                  />
                )}
                <Icon
                  as={item.icon}
                  boxSize={5}
                  color={isActive ? 'teal.300' : 'whiteAlpha.500'}
                  _groupHover={{ color: 'white' }}
                  transition="color 0.15s"
                />
                <Text fontSize="sm" letterSpacing="-0.01em">{item.label}</Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* Credits */}
      <Box
        mx={1}
        mb={3}
        bg="whiteAlpha.50"
        borderRadius="xl"
        px={3}
        py={3}
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <HStack justify="space-between" mb={1.5}>
          <Text fontSize="xs" fontWeight="600" color="whiteAlpha.600">Credits</Text>
          <Badge
            fontSize="10px"
            px={2}
            colorScheme={creditHealth}
            borderRadius="full"
          >
            {credits > 5 ? 'Healthy' : credits > 0 ? 'Low' : 'Empty'}
          </Badge>
        </HStack>
        <HStack justify="space-between" mb={2} align="baseline">
          <Text fontSize="2xl" fontWeight="800" color="white" letterSpacing="-0.04em">
            {credits}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400">available</Text>
        </HStack>
        <Progress
          value={creditPct}
          size="xs"
          colorScheme={creditHealth}
          bg="whiteAlpha.200"
          borderRadius="full"
        />
      </Box>

      <Divider borderColor="whiteAlpha.100" mb={3} />

      {/* User info */}
      <HStack spacing={3} mb={2} px={2}>
        <Avatar
          size="sm"
          name={user?.companyName ?? user?.email}
          bg="brand.600"
          color="brand.100"
          fontSize="xs"
          fontWeight="700"
        />
        <VStack align="start" spacing={0} flex={1} overflow="hidden">
          <Text
            fontSize="xs"
            fontWeight="700"
            color="white"
            noOfLines={1}
            letterSpacing="-0.01em"
          >
            {user?.companyName}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400" noOfLines={1}>
            {user?.email}
          </Text>
        </VStack>
      </HStack>

      <Tooltip label="Sign out" hasArrow placement="right">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon as={MdLogout} boxSize={4} />}
          onClick={handleLogout}
          color="whiteAlpha.500"
          justifyContent="flex-start"
          w="full"
          borderRadius="xl"
          _hover={{ bg: 'red.900', color: 'red.300' }}
          _focusVisible={{ boxShadow: 'none', outline: '2px solid', outlineColor: 'brand.400' }}
          fontSize="sm"
          fontWeight="500"
        >
          Sign Out
        </Button>
      </Tooltip>
    </Box>
  );
};

export default Sidebar;
