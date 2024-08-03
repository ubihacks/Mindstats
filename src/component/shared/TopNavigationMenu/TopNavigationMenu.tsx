import { Box, Button, ButtonGroup, Container, HStack, useBreakpointValue, useDisclosure, Text, Image } from "@chakra-ui/react";
import { ToggleButton } from "./ToggleButton";
import { MobileDrawer } from "./MobileDrawer ";
import Logo from "/mindstats.svg"; 
import { Link } from "react-router-dom";

export default function TopNavigationMenu() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mobileNavbar = useDisclosure();
  const menuItems: { label: string, link: string }[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Assessment', link: '/assessment' },
    { label: 'Pricing', link: '/pricing' },
    { label: 'Contact', link: '/contact' },
  ];

  return (
    <Box as="nav" bg="brand.50" boxShadow="md" position="sticky" top="0" zIndex="sticky" py={2} px={16}>
      <Box position="relative" zIndex="tooltip">
        <Container py="4" maxW={'9xl'}>
          <HStack justify="space-between">
            <Image src={Logo} alt="Logo" h="16" /> {/* Add the SVG logo */}
            {isDesktop ? (
              <>
                <ButtonGroup size="lg" variant="link" spacing="14">
                  {menuItems.map((item) => (
                    <Button as={Link} to={item.link} key={item.label} fontSize="xl" fontWeight="md" color="white">{item.label}</Button>
                  ))}
                </ButtonGroup>
                <Button  size="md" variant="outline-thin" borderRadius='12' px={8} >Sign Up</Button>
              </>
            ) : (
              <>
                <ToggleButton
                  onClick={mobileNavbar.onToggle}
                  isOpen={mobileNavbar.isOpen}
                  aria-label="Open Menu"
                  color="white"
                />
                <MobileDrawer isOpen={mobileNavbar.isOpen} onClose={mobileNavbar.onClose} />
              </>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
