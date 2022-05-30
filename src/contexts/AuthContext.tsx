import SplashScreen from 'components/common/SplashScreen';
import useForceUpdate from 'hooks/useForceUpdate';
import jwtDecode from 'jwt-decode';
import { createContext, FC, useEffect, useState } from 'react';
import { apiLogin, LoginParams, LoginResponse } from 'services/auth';
import { UserInfo } from 'types/user';
import LocalStorage from 'utils/LocalStorage';
import SessionStorage from 'utils/SessionStorage';

type DecodeUserInfo = {
  name: string;
  email: string;
  image?: string;
};
interface State {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}
export interface AuthContextValue extends State {
  login: (data: LoginParams) => Promise<LoginResponse>;
  logout: () => void;
  onForceUpdate: () => void;
}

const initialAuthState: State = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  AuthContext.displayName = 'AuthContext';
}

const AuthProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialAuthState);
  const [rerender, forceUpdate] = useForceUpdate();

  const login = async (params: LoginParams) => {
    const { username, password } = params;

    //call api to get accessToken, refreshToken
    const res = await apiLogin({
      username,
      password,
    });

    if (res.access_token) {
      const { access_token, refresh_token } = res;
      if (LocalStorage.get('rememberMe')) {
        LocalStorage.set('accessToken', access_token, forceUpdate);
        LocalStorage.set('refreshToken', refresh_token);
      } else {
        SessionStorage.set('accessToken', access_token, forceUpdate);
        SessionStorage.set('refreshToken', refresh_token);
      }
    }

    return res;
  };

  const logout = () => {
    LocalStorage.remove('accessToken', forceUpdate);
    LocalStorage.remove('refreshToken');
    SessionStorage.remove('accessToken', forceUpdate);
    SessionStorage.remove('refreshToken');
  };

  //get user from accessToken
  useEffect(() => {
    const onAuthStateChanged = async () => {
      try {
        const accessToken =
          LocalStorage.get('accessToken') || SessionStorage.get('accessToken');
        if (accessToken) {
          const { email, name } = jwtDecode<DecodeUserInfo>(accessToken);
          setState({
            user: { email, name },
            isAuthenticated: true,
            isInitialized: true,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isInitialized: true,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    };

    onAuthStateChanged();
  }, [rerender]);

  if (!state.isInitialized) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        onForceUpdate: forceUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext as default, AuthProvider };
