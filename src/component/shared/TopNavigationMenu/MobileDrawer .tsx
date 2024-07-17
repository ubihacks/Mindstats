import { Button, Drawer, DrawerBody, DrawerContent, DrawerProps, Stack } from '@chakra-ui/react'

export const MobileDrawer = (props: Omit<DrawerProps, 'children'>) => (
  <Drawer placement="top" {...props}>
    <DrawerContent>
      <DrawerBody mt="16">
        <Stack spacing="6" align="stretch">
          {['Components', 'Pricing', 'Marketplace', 'Support'].map((item) => (
            <Button key={item} size="lg" variant="text" colorScheme="gray">
              {item}
            </Button>
          ))}
          <Button>Sign Up</Button>
        </Stack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)