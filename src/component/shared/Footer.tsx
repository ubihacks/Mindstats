import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import Logo from "/mindstats.svg"; 

const links = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "#" },
      { label: "About Us", href: "#" },
      { label: "Assessment", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  },
];

export const Footer = () => (
  <Box bg="#0b3e80" color="white">
    <Container as="footer" role="contentinfo" maxW="9xl" px={16}>
      <Stack
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        py={{ base: "12", md: "16" }}
        spacing="10"
      >
        <Stack spacing={{ base: "6", md: "8" }} align="start">
        <Image src={Logo} alt="Logo" h="16" />
          <Text fontSize={{ base: "md", md: "lg" }} width={{ base: "full", md: "md" }}>
            Mindstats is an online assessment tool designed to assist
            individuals in enhancing their self-awareness and understanding of
            their work behaviour, thereby improving their interpersonal skills.
          </Text>
        </Stack>
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          gap="8"
          width={{ base: "full", lg: "auto" }}
        >
          {links.map((group, idx) => (
            <Stack key={idx} spacing="4" minW={{ lg: "40" }}>
              <Text fontSize="2xl" fontWeight="semibold" color="white">
                {group.title}
              </Text>
              <Stack spacing="3" shouldWrapChildren>
                {group.links.map((link, idx) => (
                  <Button
                    key={idx}
                    as="a"
                    size={'lg'}
                    variant="link"
                    href={link.href}
                    color="whiteAlpha.800"
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
      <Divider borderColor="whiteAlpha.600" />
      <Stack
        pt="8"
        pb="12"
        justify="space-between"
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
      >
        <Text fontSize="sm" color="whiteAlpha.800">
          &copy; {new Date().getFullYear()} MindStat, Inc. All rights reserved.
        </Text>
        <ButtonGroup variant="link" spacing="4">
          {/* Social Media Icons can go here */}
        </ButtonGroup>
      </Stack>
    </Container>
  </Box>
);
