
import { Box, Stack, Heading, Button , Text, List, ListItem, Center} from '@chakra-ui/react'

export default function PricingCard (plan) {

  
    console.log(plan)

  return (
    <Box >

<Heading size="md" fontWeight="bold" mb={5} textAlign={'center'}>
                {plan.plan.title}
              </Heading>
    <Box
    key={plan.title}
      bg="bg.surface"
      borderWidth="1px"
      borderRadius="2xl"
      boxShadow="sm"
      px={{ base: '6', md: '8' }}
      py="8"
      width="full"
      maxW="lg"
      height={500}
    
    >
      <Stack spacing={{ base: '10', md: '10' }} textAlign="center">
        <Stack align="center">
        <Text fontSize="3xl" fontWeight="bold" >
                USD {plan.plan.price}
                <Text as="span" fontSize="lg" fontWeight="normal" >
                  /{plan.plan.billingPeriod}
                </Text>
              </Text>
              <Text  mt={2}>
                {plan.plan.users} users
              </Text>
              <Button variant={'primary'} mt={4} w={'fit-content'} px={5}>
                {plan.plan.buttonText}
              </Button>
              <List spacing="2">
          {plan.plan.description.map((feature) => (
            <ListItem key={feature} color="fg.muted">
              <Center >
                <Text>{feature}</Text>
              </Center>
            </ListItem>
          ))}
        </List>
              
        
        </Stack>
       
     
      </Stack>
    </Box>
    </Box>
    
  )
}