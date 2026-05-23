import React from 'react';
import {
  Box, Flex, Heading, Text, Button, VStack, HStack, Icon,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdHome, MdSearch } from 'react-icons/md';

const MotionBox  = motion(Box);
const MotionText = motion(Text);

// Inline SVG illustration — abstract "lost compass" in brand palette
const LostCompassIllustration: React.FC = () => (
  <svg
    width="280"
    height="200"
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Background blobs */}
    <ellipse cx="140" cy="160" rx="110" ry="24" fill="#efeded" />

    {/* Large circle (compass body) */}
    <circle cx="140" cy="90" r="72" fill="#f5f3f3" stroke="#e4e2e2" strokeWidth="2" />
    <circle cx="140" cy="90" r="58" fill="white" stroke="#efeded" strokeWidth="1.5" />

    {/* Tick marks */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const r1 = 50;
      const r2 = i % 2 === 0 ? 56 : 53;
      return (
        <line
          key={deg}
          x1={140 + r1 * Math.sin(rad)}
          y1={90 - r1 * Math.cos(rad)}
          x2={140 + r2 * Math.sin(rad)}
          y2={90 - r2 * Math.cos(rad)}
          stroke="#c3c6d1"
          strokeWidth={i % 2 === 0 ? 2 : 1}
          strokeLinecap="round"
        />
      );
    })}

    {/* Compass needle — tilted/lost */}
    <g transform="translate(140,90) rotate(38)">
      {/* North (navy) */}
      <polygon points="0,-36 5,4 -5,4" fill="#003366" opacity="0.9" />
      {/* South (teal) */}
      <polygon points="0,36 5,-4 -5,-4" fill="#006a6a" opacity="0.9" />
      {/* Center pin */}
      <circle cx="0" cy="0" r="5" fill="white" stroke="#e4e2e2" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="2.5" fill="#003366" />
    </g>

    {/* Cardinal letters — slightly faded to show "lost" */}
    <text x="140" y="44" textAnchor="middle" fill="#c3c6d1" fontSize="11" fontWeight="700" fontFamily="Montserrat, sans-serif">N</text>
    <text x="140" y="145" textAnchor="middle" fill="#c3c6d1" fontSize="11" fontWeight="700" fontFamily="Montserrat, sans-serif">S</text>
    <text x="198" y="94" textAnchor="middle" fill="#c3c6d1" fontSize="11" fontWeight="700" fontFamily="Montserrat, sans-serif">E</text>
    <text x="83" y="94" textAnchor="middle" fill="#c3c6d1" fontSize="11" fontWeight="700" fontFamily="Montserrat, sans-serif">W</text>

    {/* Question marks floating around */}
    <text x="44"  y="42"  fill="#006a6a" fontSize="22" fontWeight="700" opacity="0.18" fontFamily="Montserrat, sans-serif">?</text>
    <text x="222" y="60"  fill="#003366" fontSize="18" fontWeight="700" opacity="0.15" fontFamily="Montserrat, sans-serif">?</text>
    <text x="56"  y="148" fill="#003366" fontSize="14" fontWeight="700" opacity="0.12" fontFamily="Montserrat, sans-serif">?</text>
    <text x="210" y="148" fill="#006a6a" fontSize="20" fontWeight="700" opacity="0.14" fontFamily="Montserrat, sans-serif">?</text>
  </svg>
);

const NotFoundPage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <Flex
      minH="100vh"
      bg="slate.50"
      align="center"
      justify="center"
      px={{ base: 6, md: 10 }}
      position="relative"
      overflow="hidden"
    >
      {/* Soft background blobs — tonal, no harsh colors */}
      <Box
        position="absolute"
        top="-120px"
        left="-100px"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="brand.700"
        opacity={0.04}
        filter="blur(80px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-80px"
        right="-80px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="teal.600"
        opacity={0.04}
        filter="blur(70px)"
        pointerEvents="none"
      />

      <VStack spacing={0} maxW="480px" w="full" textAlign="center">

        {/* Illustration */}
        <MotionBox
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          mb={6}
        >
          <LostCompassIllustration />
        </MotionBox>

        {/* 404 number */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Text
            fontFamily="heading"
            fontWeight="800"
            fontSize={{ base: '80px', md: '96px' }}
            lineHeight="1"
            letterSpacing="-0.04em"
            bgGradient="linear(to-br, brand.700, teal.600)"
            bgClip="text"
            mb={4}
          >
            404
          </Text>
        </MotionBox>

        {/* Headline */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Heading
            size="lg"
            fontWeight="700"
            color="slate.800"
            letterSpacing="-0.02em"
            mb={3}
          >
            You've lost your bearings
          </Heading>
        </MotionBox>

        {/* Sub-copy */}
        <MotionText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          color="slate.500"
          fontSize="sm"
          lineHeight="1.7"
          mb={8}
          px={4}
        >
          The page{' '}
          <Text
            as="code"
            fontSize="xs"
            fontFamily="mono"
            bg="slate.200"
            color="brand.700"
            px={1.5}
            py={0.5}
            borderRadius="sm"
          >
            {location.pathname}
          </Text>{' '}
          doesn't exist or has been moved. Use the compass below to find your way back.
        </MotionText>

        {/* CTA buttons */}
        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          w="full"
        >
          <HStack spacing={3} justify="center" flexWrap="wrap">
            <Button
              colorScheme="brand"
              size="md"
              leftIcon={<Icon as={MdHome} boxSize={4} />}
              onClick={() => navigate('/dashboard')}
              minW="160px"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              leftIcon={<Icon as={MdArrowBack} boxSize={4} />}
              onClick={() => navigate(-1)}
              minW="120px"
            >
              Go Back
            </Button>
          </HStack>
        </MotionBox>

        {/* Helpful links */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          mt={10}
          w="full"
        >
          <Text fontSize="xs" fontWeight="600" color="slate.400" textTransform="uppercase" letterSpacing="0.06em" mb={3} fontFamily="heading">
            Common destinations
          </Text>
          <HStack spacing={0} justify="center" flexWrap="wrap">
            {[
              { label: 'Projects', path: '/projects' },
              { label: 'Reports',  path: '/reports'  },
              { label: 'Billing',  path: '/billing'  },
            ].map((link, i) => (
              <React.Fragment key={link.path}>
                {i > 0 && (
                  <Box w="1px" h="12px" bg="slate.200" mx={3} />
                )}
                <Text
                  as="button"
                  fontSize="sm"
                  fontWeight="600"
                  color="brand.700"
                  _hover={{ color: 'teal.600', textDecoration: 'underline' }}
                  cursor="pointer"
                  transition="color 0.15s"
                  onClick={() => navigate(link.path)}
                >
                  <HStack spacing={1} display="inline-flex" align="center">
                    <Icon as={MdSearch} boxSize={3} />
                    <span>{link.label}</span>
                  </HStack>
                </Text>
              </React.Fragment>
            ))}
          </HStack>
        </MotionBox>

      </VStack>
    </Flex>
  );
};

export default NotFoundPage;
