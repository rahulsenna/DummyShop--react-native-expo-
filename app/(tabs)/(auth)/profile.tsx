import { useSession } from '@/app/ctx';
import { getUser } from '@/src/apis';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  // add other user fields if necessary
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { signOut, session } = useSession();

  useEffect(() => {
    if (!session)
      router.replace('/login')
  }, [session]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data: User = await getUser(session!);
        console.log("data: ", data);
        setUser(data);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#841584" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.image }} style={styles.profileImage} />
      <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
      <Text style={styles.username}>@{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.gender}>{user.gender}</Text>
      {/* Render other user fields as necessary */}
      <Button title='Logout' onPress={signOut}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  gender: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default UserProfile;

