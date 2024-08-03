import {
  Box,
  Button,
  Heading,
  VStack,
  Image,
  Text,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Footer } from "../component/shared/Footer";
import TopNavigationMenu from "../component/shared/TopNavigationMenu/TopNavigationMenu";
import image from "/6.jpg";
import ladyAtWorkImage from "/5.jpg";

function AboutPage() {
  return (
    <>
      <TopNavigationMenu />

      <VStack spacing={10} align="center">
        <Image src={image} alt="Header Image" objectFit={"cover"} />

        <VStack spacing={4} textAlign="center" px={40}>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Personality ≠ Behaviour.
          </Heading>
          <Heading size="xl">
            Find out your workplace behaviour in just 15 mins.
          </Heading>
          <Text fontSize="xl" textAlign={"justify"}>
            While personality tests assess enduring traits to gauge cultural
            fit, focusing on general characteristics, workplace behavioral
            assessments evaluate job-specific behaviors and competencies,
            predicting performance through situational responses. It also offers
            detailed, job-related insights, making them more predictive of
            actual job performance.
          </Text>
          <Button size="lg">Start Assessment Now</Button>
          <Text fontSize="sm">No registration required.</Text>
        </VStack>
        <Box
          maxW="8xl"
          mx="auto"
          my={20}
          px={{ base: "4", md: "10", lg: "16" }}
          py={{ base: "6", md: "10", lg: "16" }}
          borderRadius={"70"}
          bg={"background.50"}
        >
          <Heading
            size="md"
            mb={6}
            textAlign="center"
            fontWeight="bold"
            mx={"auto"}
          >
            An introverted personality can behave extrovertly at work because
            people adapt their behaviours to fit job demand.
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} py={10}>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={ladyAtWorkImage}
                alt="Public behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Proven DISC model
                </Heading>
                <Text fontSize="lg" textAlign={"justify"}>
                  Created by William Moulton Marston in 1928, DISC serves as the
                  foundation for numerous prominent assessment providers in
                  existence today.
                </Text>
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={ladyAtWorkImage}
                alt="Private behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Job-specific assessment
                </Heading>
                <Text fontSize="md" textAlign={"justify"}>
                  MindStats conducts behavioural assessments using job and
                  industryspecific scenarios to generate detailed workplace
                  behavioural reports
                </Text>
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={ladyAtWorkImage}
                alt="Perceived behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Workplace behaviour
                </Heading>
                <Text fontSize="lg" textAlign={"justify"}>
                  The report helps you to understand yourself. Increased
                  self-awareness can promote healthier interpersonal
                  relationship at work.
                </Text>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Box>
      </VStack>

      <Footer />
    </>
  );
}

export default AboutPage;
