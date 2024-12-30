import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Sohbetler',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="new/page"
        options={{
          title: 'Yeni Sohbet',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="[id]/page"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
} 