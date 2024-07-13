import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  username: string;
  onPing: (username: string) => void;
}

export function UserCard({ username, onPing }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onPing(username)}>Ping</Button>
      </CardContent>
    </Card>
  );
}
