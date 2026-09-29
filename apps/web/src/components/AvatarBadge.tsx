import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

interface AvatarBadgeProps {
  name: string | null;
  avatar_url?: string | null;
}

export const AvatarBadge = ({ name }: AvatarBadgeProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("saldo");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Badge className="gap-2 p-5 bg-white text-primary">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback className="text-white bg-primary">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
          className="cursor-pointer"
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              render={<Link to="/dashboard" />}
            >
              <User />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {name}
    </Badge>
  );
};
