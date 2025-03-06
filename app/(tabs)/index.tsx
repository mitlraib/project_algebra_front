import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import Cookies from 'js-cookie';

export default function Index() {
  const [user, setUser] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get('userToken');
    setUser(token || null);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return null; // מחכה לוודא אם המשתמש מחובר
  }

  return user ? <Redirect href="/(tabs)/Dashboard" /> : <Redirect href="/authentication/Login" />;
}
