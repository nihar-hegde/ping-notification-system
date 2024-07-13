import { UserCard } from "./UserCard";

interface UserListProps {
  users: string[];
  onPing: (username: string) => void;
}

export function UserList({ users, onPing }: UserListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user} username={user} onPing={onPing} />
      ))}
    </div>
  );
}
