import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/app/ctx';
import { login } from '@/src/apis';
import { router } from 'expo-router';

const LoginPage: React.FC = () => {

  const { signIn, session } = useSession();

  useEffect(() => {
    if (session)
      router.replace('/profile')
  }, [session]);

  const loginValidationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is Required'),
    password: Yup.string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const { token } = await login(values.username, values.password);
      signIn(token);
    } catch (error: any) {
      Alert.alert(error.response?.data?.error || 'Login failed');
      console.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ username: 'isabellad', password: 'isabelladpass' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Username"
              style={styles.input}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            {errors.username && touched.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
            <TextInput
              placeholder="Password"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button onPress={() => handleSubmit()} title="Login" color="#841584" />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
});

export default LoginPage;
