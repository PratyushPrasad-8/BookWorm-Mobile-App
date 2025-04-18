import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth:true,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch("https://bookworm-6hcc.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "something went wrong");

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (!token || !userJson)
        throw new Error(data.message || "something went wrong");
      set({ user: JSON.parse(userJson), token: token });
    } catch (error) {
      console.log("checkAuth error", error);
      
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch("https://bookworm-6hcc.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "something went wrong");

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
