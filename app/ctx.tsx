import React, { useEffect, useMemo, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { removeAuthToken, setAuthToken } from '@/src/apis';


const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}>({
  signIn: (token: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isLoggedIn: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [state, setState] = useState({
    isLoading: true,
    isLoggedIn: false,
    session: null as string | null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let session = null;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          session = credentials.password;
          // await setAuthToken(session);
        }
      } catch (e) {
        console.error(e);
      }

      setState({ isLoading: false, isLoggedIn: session ? true : false, session });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async ( token: string ) => {
        await Keychain.setGenericPassword('user', token);
        setState({ ...state, isLoggedIn: true, session: token });
        await setAuthToken(token);
        console.log("signIn--token: ", token);
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        setState({ ...state, isLoggedIn: false, session: null });
        await removeAuthToken();
      },
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
      session: state.session 
    }),
    [state]
  );
  
  
  return (
  <AuthContext.Provider value={authContext}>
      {props.children}
  </AuthContext.Provider>
  );
}

