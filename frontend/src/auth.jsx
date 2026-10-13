import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());

  const clear = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Restore the session if a token is stored.
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(clear)
      .finally(() => setReady(true));
  }, [clear]);

  // Any 401 from the API signs the admin out.
  useEffect(() => {
    window.addEventListener('paw:unauthorized', clear);
    return () => window.removeEventListener('paw:unauthorized', clear);
  }, [clear]);

  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      /* token may already be invalid */
    }
    clear();
  };

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}
