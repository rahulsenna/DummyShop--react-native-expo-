import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(acc)',
};

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="(acc)" options={{ title: "Profile" }} />
            <Stack.Screen
                name="login"
                options={{
                    presentation: 'modal',
                    title: "Login"
                }}
            />
        </Stack>
    );
}
