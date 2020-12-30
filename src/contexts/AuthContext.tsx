import React, {
  Context,
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { postRequest } from '../postRequest';

interface ContextObject {
  setUserToken: Dispatch<null | string>;
  user: User | null;
  loggedIn: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  friends?: number[];
  created_at: string;
  modified_at: string;
}

const UserContext: Context<ContextObject> = createContext({} as ContextObject);

export const useAuthContext = () => {
  return useContext(UserContext);
};

export const AuthContext: React.FC<{}> = ({ children }) => {
  // This is so messy
  const [userToken, setUserToken] = useState<null | string>(localStorage.getItem('auth'));
  const loggedIn = userToken !== null;

  const [user, setUser] = useState<User | null>(null);

  const checkValidToken = useCallback(
    async token => {
      const data = await postRequest('/auth/token', { auth: token });

      if (!data || !data.ok) {
        setUserToken(null);
        setUser(null);

        localStorage.removeItem('auth');
        return;
      }

      if (data.user) {
        setUser(data.user);
      }

      if (token) {
        localStorage.setItem('auth', token);
      } else {
        localStorage.removeItem('auth');
      }
    },
    [setUser]
  );

  const onStorageChange = useCallback(
    (e: StorageEvent) => {
      if (e.key === 'auth') {
        // if (!e.newValue) {
        //   setUser(null);
        //   setUserToken(null);
        // }
        checkValidToken(e.newValue);
      }
    },
    [checkValidToken]
  );

  useEffect(() => {
    checkValidToken(userToken);
  }, [userToken, checkValidToken]);

  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  });

  return (
    <UserContext.Provider value={{ setUserToken, user, loggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
