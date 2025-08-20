"use client";

import { AuthProvider } from "../app/context/authContext";

export default function AuthWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
