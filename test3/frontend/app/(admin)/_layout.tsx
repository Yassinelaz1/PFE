import { Slot, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem("role");
      setIsAdmin(role === "admin");
    };
    checkRole();
  }, []);

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}
