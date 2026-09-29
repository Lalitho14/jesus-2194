import { useAuth } from "@/auth/AuthProvider";
import { Skeleton } from "./ui/skeleton";
import { AvatarBadge } from "./AvatarBadge";

export default function NavBar() {
  const { user, isLoading } = useAuth();

  return (
    <nav className="bg-primary flex items-center justify-between p-5 rounded-2xl">
      <h1>Snail races</h1>
      {isLoading && !user ? (
        <Skeleton className="rounded-2xl h-10 w-35 bg-white" />
      ) : (
        user && <AvatarBadge name={user.name} />
      )}
    </nav>
  );
}
