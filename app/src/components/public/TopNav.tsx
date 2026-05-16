import React, { useState } from 'react';
import {
  Box, Flex, HStack, Button, Image, IconButton,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerBody, VStack, useDisclosure, Text,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAppSelector } from '../../app/hooks';

const NAV_LINKS = [
  { label: 'About',   to: '/about'   },
  { label: 'Pricing', to: '/pricing' },
];

const TopNav: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <Box
      as="nav"
      bg="#003366"
      position="sticky"
      top={0}
      zIndex={100}
      borderBottom="1px solid"
      borderColor="rgba(255,255,255,0.10)"
    >
      <Flex
        maxW="1280px"
        mx="auto"
        px={{ base: 5, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <HStack spacing={2} cursor="pointer" onClick={() => navigate('/')}>
          <Image src="/mindstat-favicon.svg" h="28px" w="28px" alt="Mindstat" />
          <Image
            src="/mindstats-logo.svg"
            h="20px"
            filter="brightness(0) invert(1)"
            alt="Mindstat"
          />
        </HStack>

        {/* Desktop nav */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {NAV_LINKS.map((item) => (
            <Button
              key={item.to}
              as={RouterLink}
              to={item.to}
              variant="ghost"
              size="sm"
              color={location.pathname === item.to ? 'white' : 'whiteAlpha.700'}
              fontWeight={location.pathname === item.to ? '700' : '500'}
              fontSize="sm"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              borderRadius="md"
            >
              {item.label}
            </Button>
          ))}
        </HStack>

        {/* CTA */}
        <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
          {user ? (
            <Button
              as={RouterLink}
              to="/dashboard"
              size="sm"
              bg="white"
              color="gray.900"
              fontWeight="700"
              borderRadius="md"
              _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
              _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
              transition="all 0.15s"
            >
              Go to App
            </Button>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                size="sm"
                color="whiteAlpha.800"
                fontWeight="600"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                borderRadius="md"
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                size="sm"
                bg="white"
                color="gray.900"
                fontWeight="700"
                borderRadius="md"
                _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
                _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
                transition="all 0.15s"
              >
                Get Started
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile hamburger */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          color="white"
          size="md"
          onClick={onOpen}
          _hover={{ bg: 'whiteAlpha.100' }}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#003366" borderLeft="1px solid" borderColor="rgba(255,255,255,0.10)">
          <DrawerCloseButton color="white" />
          <DrawerBody pt={16}>
            <VStack spacing={2} align="stretch">
              {NAV_LINKS.map((item) => (
                <Button
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  variant="ghost"
                  color="whiteAlpha.800"
                  fontWeight="600"
                  justifyContent="flex-start"
                  onClick={onClose}
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  borderRadius="md"
                >
                  {item.label}
                </Button>
              ))}
              <Box pt={4} borderTop="1px solid" borderColor="whiteAlpha.200">
                <Button
                  as={RouterLink}
                  to={user ? '/dashboard' : '/login'}
                  variant="ghost"
                  color="whiteAlpha.800"
                  fontWeight="600"
                  justifyContent="flex-start"
                  w="full"
                  onClick={onClose}
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  borderRadius="md"
                >
                  {user ? 'Go to App' : 'Sign In'}
                </Button>
                {!user && (
                  <Button
                    as={RouterLink}
                    to="/register"
                    bg="white"
                    color="gray.900"
                    fontWeight="700"
                    w="full"
                    mt={2}
                    onClick={onClose}
                    _hover={{ bg: 'gray.100' }}
                    borderRadius="md"
                  >
                    Get Started
                  </Button>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default TopNav;
