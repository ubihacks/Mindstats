import {
  Button,
  Image,
  Box,
  Text,
  Container,
  Heading,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Footer } from "../component/shared/Footer";
import TopNavigationMenu from "../component/shared/TopNavigationMenu/TopNavigationMenu";
import mainImage from "/12.jpg";
import SelfAwarenessAI from "/self-awareness-ai.jpg";
import PublicBehaviour from "/public-behaviour.jpg";
import PrivateBehaviour from "/private-behaviour.jpg";
import PerceivedBehaviour from "/perceived-behaviour.jpg";

export default function landingPage() {
  return (
    <>
      <TopNavigationMenu />
      <Container py={{ base: "2", md: "6" }} maxW="9xl" px={5}>
        <Stack
          direction={"row"}
          spacing={20}
          justifyContent="center"
          alignItems="center"
          py={10}
        >
          <Box maxW="750px" height="550px" overflow="hidden" borderRadius={35}>
            <Image
              objectFit="cover"
              src={mainImage}
              alt="Lady at work"
              width="100%"
              height="100%"
            />
          </Box>
          <Stack maxW="650px" spacing={3} justifyContent="center">
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
              DISC Workplace Behavior Assessment
            </Text>
            <Heading size={{ base: "lg", md: "lg" }} fontWeight="extrabold">
              A better self-awareness can create a happier workplace.
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} textAlign={"justify"}>
              There are reasons why some are so aggressive at work, some are
              chill, some are slow and some think too much at work. What are
              you? Find out more with our workplace-focused behavioural
              assessment for free.
            </Text>
            <Button variant={"primary"} size="lg" width={"fit-content"} my={2}>
              Take a Free Assessment Now
            </Button>
          </Stack>
        </Stack>

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
            Discover how you see yourself, how others perceive you, and your
            ideal professional image through a workplace assessment.
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} py={10}>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={PublicBehaviour}
                alt="Public behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Public behaviour
                </Heading>
                <Text fontSize="lg" textAlign={"justify"}>
                  Describes how individuals behave, communicate, and engage with
                  others in social interactions involving strangers or the
                  general public.
                </Text>
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={PrivateBehaviour}
                alt="Private behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Private behaviour
                </Heading>
                <Text fontSize="md" textAlign={"justify"}>
                  How individuals act in intimate or personal settings, in the
                  presence of people known to them, a more familiar group, or
                  when alone.
                </Text>
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Image
                borderRadius={"35"}
                src={PerceivedBehaviour}
                alt="Perceived behaviour"
                h="72"
                objectFit="cover"
              />
              <Stack px={6} pr={12}>
                <Heading size="sm" fontWeight="bold">
                  Perceived behaviour
                </Heading>
                <Text fontSize="lg" textAlign={"justify"}>
                  How an individual's behaviour is viewed by others, based on
                  observations, interactions, and impressions.
                </Text>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Box>

        <Box
          maxW="8xl"
          mx="auto"
          my={5}
          px={{ base: "4", md: "8", lg: "12" }}
          py={{ base: "6", md: "8", lg: "12" }}
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            alignItems="center"
            justifyItems={"center"}
          >
            <Stack spacing={{ base: "8", md: "12" }} justifyContent="center">
              <Stack spacing={"2"} px={20}>
                <Heading size={"md"} fontWeight="bold">
                  Study reveals that a whopping 85% of individuals lack a true
                  understanding of themselves.
                </Heading>
                <Text fontSize={"2xl"} textAlign={"justify"}>
                  Boost your self-awareness in just 30 minutes, and it's
                  completely free!
                </Text>
              </Stack>

              <Button
                variant={"primary"}
                size="lg"
                width={"fit-content"}
                mx={20}
              >
                Start Free Assessment
              </Button>
            </Stack>
            <Box
              maxW="900px"
              height="550px"
              overflow="hidden"
              borderRadius={"lg"}
            >
              <Image
                borderRadius={"35"}
                objectFit="cover"
                src={SelfAwarenessAI}
                alt="Lady at work"
                width="100%"
                height="100%"
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
