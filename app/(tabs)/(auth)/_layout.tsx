import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useSession } from "@/app/ctx";

// export const unstable_settings = {initialRouteName: 'profile',};

const AuthLayout = () => {

    const { session, isLoading } = useSession();
    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Stack>
            {session == null ? (
                <>
                    <Stack.Screen name="login" options={{ title: "Login", presentation: 'modal', }} />
                </>
            ) : (
                <>
                    <Stack.Screen name="profile" options={{ title: "Account" }} />
                </>
            )}
        </Stack>
    );
}

export default AuthLayout;