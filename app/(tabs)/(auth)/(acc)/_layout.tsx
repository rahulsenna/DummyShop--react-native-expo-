import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useSession } from "@/app/ctx";

// export const unstable_settings = {initialRouteName: 'profile',};

const AccLayout = () => {

    const { session, isLoading } = useSession();
    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="login" />;
      }
    
    // This layout can be deferred because it's not the root layout.
    return <Stack screenOptions={{ headerShown: false }} />;
}

export default AccLayout;