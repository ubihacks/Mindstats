import { Button, Image,Box, Text, Flex, HStack, Link, VStack, AspectRatio, Container, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { Footer } from "../component/shared/Footer";
import TopNavigationMenu from "../component/shared/TopNavigationMenu/TopNavigationMenu";



export default function landingPage() {
  return (
    <>
    <TopNavigationMenu />
    <Container py={{ base: '2', md: '6' }} maxW='9xl' px={8}>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center"  justifyItems={'center'}>
      <Box maxW="600px" height="500px" overflow="hidden" borderRadius={'lg'} >
            <Image
              objectFit="cover"
              src="https://tinyurl.com/yeyjvptc"
              alt="Lady at work"
              width="100%"
              height="100%"
            />
          </Box>
        <Stack spacing={{ base: '8', md: '12' }} justifyContent="center">
          <Stack spacing={{ base: '4', md: '6' }}>
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium" >
              DISC Workplace Behaviour Assessment
            </Text>
            <Heading size={{ base: '2xl', md: '4xl' }} fontWeight="bold" >
              A better self-awareness can create a happier workplace.
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600">
              There are reasons why some are so aggressive at work, some are chill, some are slow and some think too much at work. What are you? Find out more with our workplace-focused behavioural assessment for free.
            </Text>
          </Stack>
        
            <Button bg="brand.50" size="lg" color='white' width={'fit-content'}>
              Start Free Assessment
            </Button>
           
        
        </Stack>
      </SimpleGrid>
   
 

    
   
  </Container>
  <Footer />
  </>
  )
}