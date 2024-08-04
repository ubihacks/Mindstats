import { Box, Button, ButtonGroup, Container, HStack, useBreakpointValue, useDisclosure, Image } from "@chakra-ui/react";
import { ToggleButton } from "./ToggleButton";
import { MobileDrawer } from "./MobileDrawer ";
import Logo from "/mindstats.svg"; 
import { Link, useNavigate } from "react-router-dom";

export default function TopNavigationMenu() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mobileNavbar = useDisclosure();
  const navigate = useNavigate();
  
  const menuItems: { label: string, link: string }[] = [

    { label: 'About', link: '/about' },
    { label: 'Assessment', link: '/assessment' },
    { label: 'Pricing', link: '/pricing' },
   
  ];

  return (
    <Box as="nav" bg="brand.50" boxShadow="md" position="sticky" top="0" zIndex="sticky" py={2} px={16}>
      <Box position="relative" zIndex="tooltip">
        <Container py="4" maxW={'9xl'}>
          <HStack justify="space-between">
            <Image src={Logo} alt="Logo" h="16" onClick={() => navigate('/')} cursor={'pointer'}/> {/* Add the SVG logo */}
            {isDesktop ? (
              <>
                <ButtonGroup size="lg" variant="link" spacing="14">
                  {menuItems.map((item) => (
                    <Button as={Link} to={item.link} key={item.label} fontSize="xl" fontWeight="md" color="white">{item.label}</Button>
                  ))}
                </ButtonGroup>
                <Button  size="md" variant="outline-thin"  px={8} >Sign Up</Button>
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
