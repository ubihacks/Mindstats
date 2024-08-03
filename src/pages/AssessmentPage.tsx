import {
  Container,
  VStack,
  Heading,
  Stack,
  Input,
  Select,
  Checkbox,
  Button,
  Text,
} from "@chakra-ui/react";
import TopNavigationMenu from "../component/shared/TopNavigationMenu/TopNavigationMenu";
import { Footer } from "../component/shared/Footer";

export default function AssessmentPage() {
  return (
    <>
      <TopNavigationMenu />
      <Container maxW="container.md" py={10}>
        <VStack spacing={5} align="center">
          <Heading as="h1" size="lg" fontWeight="bold" textAlign="center">
            A Tailored Workplace Behavioural Assessment.
          </Heading>
          <Text textAlign="center">
            The information below is to provide a personalised report and a
            tailored assessment questionnaire according to your position,
            industry, and role. We don't save any of these information unless
            you choose to.
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            width="100%"
          >
            <Input placeholder="First name" />
            <Input placeholder="Last name" />
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            width="100%"
          >
            <Select placeholder="Position">
              <option value="position1">Position 1</option>
              <option value="position2">Position 2</option>
            </Select>
            <Select placeholder="Industry">
              <option value="industry1">Industry 1</option>
              <option value="industry2">Industry 2</option>
            </Select>
          </Stack>

          <Select placeholder="Role" width="100%">
            <option value="role1">Role 1</option>
            <option value="role2">Role 2</option>
          </Select>

          <Checkbox alignSelf="flex-start">
            By selecting this box, you are confirming your acceptance of the
            disclaimer outlined in the{" "}
            <a href="#" style={{ color: "blue" }}>
              terms and conditions
            </a>
            ,{" "}
            <a href="#" style={{ color: "blue" }}>
              cookie policy
            </a>
            , and{" "}
            <a href="#" style={{ color: "blue" }}>
              privacy policy
            </a>
            .
          </Checkbox>

          <Button colorScheme="blue" size="lg" mt={4}>
            Begin Now
          </Button>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
