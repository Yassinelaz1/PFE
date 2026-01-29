import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirige immédiatement vers le vrai dashboard dans (admin)
    router.replace('/(admin)/dashboard');
  }, []);

  return null; // rien à afficher
}
