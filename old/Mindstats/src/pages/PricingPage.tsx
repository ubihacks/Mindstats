import {
  Container,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Flex,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { Component } from "react";
import PricingCard from "../component/shared/PricingCard";
import TopNavigationMenu from "../component/shared/TopNavigationMenu/TopNavigationMenu";
import { Footer } from "../component/shared/Footer";

const pricingPlans = [
  {
    title: "Individual Report",
    price: 5,
    billingPeriod: "report",
    users: 1,
    buttonText: "Sign up",
    description: ["One full report."],
  },
  {
    title: "Starter Plan",
    price: 48,
    billingPeriod: "month",
    users: 2,
    buttonText: "Subscribe now",
    description: [
      "36% savings.",
      "15 credits/month.",
      "Monthly billing.",
      "Cancel anytime.",
      "360 reports storage.",
      "Export reports in PDF.",
      "1 credit = 1 assessment.",
      "1 credit = USD3.20",
    ],
  },
  {
    title: "Growth Plan",
    price: 118,
    billingPeriod: "month",
    users: 5,
    buttonText: "Subscribe now",
    description: [
      "53% savings.",
      "50 credits/month.",
      "Monthly billing.",
      "Cancel anytime.",
      "360 reports storage.",
      "Export reports in PDF.",
      "1 credit = 1 assessment.",
      "1 credit = USD2.36",
    ],
  },
  {
    title: "Power Plan",
    price: 488,
    billingPeriod: "month",
    users: 20,
    buttonText: "Subscribe now",
    description: [
      "60% savings.",
      "200 credits/month.",
      "Monthly billing.",
      "Cancel anytime.",
      "7,200 reports storage.",
      "Export reports in PDF.",
      "1 credit = 1 assessment.",
      "1 credit = USD2.44",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
    <TopNavigationMenu/>
    <Container maxW="9xl" py={10}>
      <VStack spacing={4} textAlign="center">
        <Heading>Simple Pricing</Heading>
        <Text>
          Nothing is too small, Purchase individually or bulk credits for
          professional hiring team. No hidden cost!
        </Text>
        <Flex justify="center">
          <ButtonGroup>
            <Button colorScheme="blue">Monthly billing</Button>
            <Button>Annually billing</Button>
          </ButtonGroup>
        </Flex>
      </VStack>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} py={10}>
        {pricingPlans.map((plan) => (
          <PricingCard plan={plan} />
        ))}
      </SimpleGrid>

      <VStack mt={10} textAlign="center">
        <Text fontWeight="bold" fontSize="lg">
          Still not sure? Start{" "}
          <Text as="span" color="blue.500">
            7 days
          </Text>{" "}
          free trial.
        </Text>
        <Text>We’ll remind you to cancel if that’s not for you.</Text>
      </VStack>
    </Container>
    <Footer/>
    </>
  );
}
