"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Disconnect socket
    socket.disconnect();

    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
