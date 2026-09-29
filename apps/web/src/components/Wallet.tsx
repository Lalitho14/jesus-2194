import { WalletIcon } from "lucide-react";
import { Button } from "./ui/button";
import WalletForm from "./WalletForm";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";

export default function Wallet() {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { user } = useAuth();
  const balance = user?.balance ?? 0;

  return (
    <div className="flex items-center px-1 bg-primary-foreground">
      $ {balance.toFixed(2)}
      <Button
        size="icon"
        variant="outline"
        className="hover:text-primary"
        onClick={() => setIsOpenDialog(true)}
      >
        <WalletIcon />
      </Button>

      <WalletForm
        open={isOpenDialog}
        onSuccess={() => {
          setIsOpenDialog(false);
        }}
        onOpenChange={setIsOpenDialog}
      />
    </div>
  )
}