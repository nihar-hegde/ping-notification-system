"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { UserList } from "@/components/UserList";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { LogoutButton } from "@/components/LogoutButton";

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    socket.connect();
    socket.emit("join", localStorage.getItem("username"));

    socket.on("userList", (userList: string[]) => {
      setUsers(userList);
    });

    socket.on("notification", ({ from, message }) => {
      toast(`${from}: ${message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  const handlePing = (username: string) => {
    socket.emit("ping", {
      to: username,
      from: localStorage.getItem("username"),
    });
  };

  const handlePingAll = () => {
    socket.emit("ping", { to: "all", from: localStorage.getItem("username") });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      <div className="flex gap-4 items-center justify-center mb-8">
        <h1 className="text-2xl font-bold">Ping Notification System</h1>
        <LogoutButton />
      </div>
      <div className="flex-grow">
        <UserList users={users} onPing={handlePing} />
      </div>
      <div className="flex justify-center mt-8 mb-4">
        <Button onClick={handlePingAll}>Ping All Users</Button>
      </div>
      <Toaster />
    </div>
  );
}
