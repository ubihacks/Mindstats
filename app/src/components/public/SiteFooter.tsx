import React from 'react';
import {
  Box, Container, Flex, HStack, VStack, Text, Button,
  SimpleGrid, Stack, Image, Divider, Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const COMPANY_LINKS = [
  { label: 'Home',       to: '/'        },
  { label: 'About',      to: '/about'   },
  { label: 'Pricing',    to: '/pricing' },
  { label: 'Sign In',    to: '/login'   },
  { label: 'Get Started', to: '/register' },
];

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '#' },
  { label: 'Cookie Policy',      to: '#' },
  { label: 'Privacy Policy',     to: '#' },
  { label: 'Refund Policy',      to: '#' },
];

const SiteFooter: React.FC = () => (
  <Box as="footer" bg="#003366" color="white" borderTop="1px solid rgba(255,255,255,0.10)" role="contentinfo">
    <Container maxW="1280px" px={{ base: 5, md: 8 }}>
      {/* Main footer grid */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        py={{ base: 12, md: 16 }}
        gap={10}
      >
        {/* Brand column */}
        <Stack spacing={5} maxW={{ lg: '320px' }}>
          <HStack spacing={2}>
            <Image src="/mindstat-favicon.svg" h="28px" w="28px" alt="Mindstat" />
            <Image
              src="/mindstats-logo.svg"
              h="20px"
              filter="brightness(0) invert(1)"
              alt="Mindstat"
            />
          </HStack>
          <Text fontSize="sm" color="whiteAlpha.600" lineHeight="1.7">
            Mindstat is a B2B behavioural intelligence platform that matches
            candidates to hiring managers using the DISC framework — so you
            hire with confidence, not guesswork.
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400" fontWeight="600" letterSpacing="0.05em">
            BEHAVIOURAL INTELLIGENCE PLATFORM
          </Text>
        </Stack>

        {/* Link columns */}
        <SimpleGrid columns={{ base: 2, md: 2 }} gap={8}>
          <Stack spacing={4}>
            <Text
              fontSize="xs"
              fontWeight="700"
              color="whiteAlpha.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Company
            </Text>
            <Stack spacing={2}>
              {COMPANY_LINKS.map((link) => (
                <Button
                  key={link.label}
                  as={RouterLink}
                  to={link.to}
                  variant="link"
                  size="sm"
                  color="whiteAlpha.700"
                  fontWeight="500"
                  justifyContent="flex-start"
                  _hover={{ color: 'white', textDecoration: 'none' }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Stack>

          <Stack spacing={4}>
            <Text
              fontSize="xs"
              fontWeight="700"
              color="whiteAlpha.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Legal
            </Text>
            <Stack spacing={2}>
              {LEGAL_LINKS.map((link) => (
                <Button
                  key={link.label}
                  as={RouterLink}
                  to={link.to}
                  variant="link"
                  size="sm"
                  color="whiteAlpha.700"
                  fontWeight="500"
                  justifyContent="flex-start"
                  _hover={{ color: 'white', textDecoration: 'none' }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      </Flex>

      <Divider borderColor="whiteAlpha.200" />

      {/* Bottom bar */}
      <Flex
        py={6}
        justify="space-between"
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap={3}
      >
        <Text fontSize="xs" color="whiteAlpha.500">
          &copy; {new Date().getFullYear()} Mindstat, Inc. All rights reserved.
        </Text>
        <Text fontSize="xs" color="whiteAlpha.400">
          Built for modern hiring teams.
        </Text>
      </Flex>
    </Container>
  </Box>
);

export default SiteFooter;
