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
   
      <Container bg="gray.50" py={10} mt={10} borderRadius="md">
        <Heading size="md" mb={6} textAlign="center" fontWeight="bold" mx={'auto'} >
        Discover how you see yourself, how others perceive you, and your
        ideal professional image through a workplace assessment.
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} py={10}>
          <Stack spacing={4} align="center" textAlign="center">
            <Image
              src="https://via.placeholder.com/100"
              alt="Public behaviour"
              boxSize="100px"
            />
            <Heading size="sm" fontWeight="bold">Public behaviour</Heading>
            <Text fontSize="sm" maxW="200px">
              Describes how individuals behave, communicate, and engage with others in social interactions involving strangers or the general public.
            </Text>
          </Stack>
          <Stack spacing={4} align="center" textAlign="center">
            <Image
              src="https://via.placeholder.com/100"
              alt="Private behaviour"
              boxSize="100px"
            />
            <Heading size="sm">Private behaviour</Heading>
            <Text fontSize="sm" maxW="200px">
              How individuals act in intimate or personal settings, in the presence of people known to them, a more familiar group, or when alone.
            </Text>
          </Stack>
          <Stack spacing={4} align="center" textAlign="center">
            <Image
              src="https://via.placeholder.com/100"
              alt="Perceived behaviour"
              boxSize="100px"
            />
            <Heading size="sm">Perceived behaviour</Heading>
            <Text fontSize="sm" maxW="200px">
              How an individual's behaviour is viewed by others, based on observations, interactions, and impressions.
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>
     
     <Box p={20}>
     <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center"  justifyItems={'center'}>
     
     <Stack spacing={{ base: '8', md: '12' }} justifyContent="center">
       <Stack spacing={{ base: '4', md: '6' }}>
         <Heading size={{ base: 'md', md: 'lg' }} fontWeight="bold" >
         Study reveals that a whopping
85% of individuals lack a true
understanding of themselves.
         </Heading>
         <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600">
         Boost your self-awareness in just 30
         minutes, and it's completely f
         </Text>
       </Stack>
     
         <Button bg="brand.50" size="lg" color='white' width={'fit-content'}>
           Start Free Assessment
         </Button>
        
     
     </Stack>
     <Box maxW="600px" height="500px" overflow="hidden" borderRadius={'lg'} >
         <Image
           objectFit="cover"
           src="https://tinyurl.com/yeyjvptc"
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
  )
}