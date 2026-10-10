import { createContext, useEffect, useState } from 'react';
import { account } from '../services/appwrite';
import { logout as logoutService } from '../features/auth/services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkUser(); }, []);

  async function checkUser() {
    try {
      const u = await account.get();
      setUser(u);
      setRole(u.prefs?.role || 'student');
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await logoutService();
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
}