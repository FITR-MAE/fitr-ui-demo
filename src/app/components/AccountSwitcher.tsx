import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, Plus, LogOut, Building2, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useAccounts, type Account } from "./AccountProvider";
import { usePressFeedback } from "./motion";
import { cn } from "./ui/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AccountSwitcher({ open, onOpenChange }: Props) {
  const { accounts, activeAccountId, activeAccount, setActive, addAccount, logout } = useAccounts();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const accountTap = usePressFeedback(0.98);
  const addTap = usePressFeedback(0.98);
  const logoutTap = usePressFeedback(0.98);
  const navigate = useNavigate();

  const handleSelect = (account: Account) => {
    setActive(account.id);
    onOpenChange(false);
    navigate("/profile");
  };

  const handleAdd = () => {
    addAccount();
    onOpenChange(false);
    navigate("/profile");
    toast("Added a new personal account", { description: "Switched to the new account." });
  };

  const handleLogoutConfirm = () => {
    setConfirmOpen(false);
    onOpenChange(false);
    logout();
    toast(`Logged out of ${activeAccount.name}`, {
      description: "You've been signed out of this session.",
    });
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent className="mx-auto max-w-2xl rounded-t-2xl">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base font-semibold">Accounts</DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              Switch between accounts, add a new one, or log out.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2 space-y-2">
            {accounts.map((account) => {
              const isActive = account.id === activeAccountId;
              const TypeIcon = account.type === "business" ? Building2 : UserIcon;
              return (
                <motion.button
                  key={account.id}
                  type="button"
                  onClick={() => handleSelect(account)}
                  {...accountTap}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                    isActive ? "border-border bg-accent/40" : "border-border bg-card hover:bg-muted/60",
                  )}
                >
                  <div
                    className={cn(
                      "relative h-12 w-12 shrink-0 overflow-hidden rounded-full",
                      isActive
                        ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-background"
                        : "ring-1 ring-border",
                    )}
                  >
                    <ImageWithFallback src={account.avatar} alt={account.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{account.name}</p>
                      <span className="app-chip inline-flex items-center gap-1">
                        <TypeIcon className="h-3 w-3" />
                        {account.type === "business" ? "Business" : "Personal"}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{account.handle}</p>
                  </div>
                  {isActive && <Check className="h-4 w-4 shrink-0 text-foreground" />}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-1 flex flex-col gap-2 p-4 pt-2">
            <motion.button
              type="button"
              onClick={handleAdd}
              {...addTap}
              className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-3 text-left hover:bg-muted/60"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Add another account</p>
                <p className="text-xs text-muted-foreground">Create a new personal profile for the demo.</p>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setConfirmOpen(true)}
              {...logoutTap}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:bg-muted/60"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-destructive">Log out</p>
                <p className="text-xs text-muted-foreground">End this session and return to the default account.</p>
              </div>
            </motion.button>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of {activeAccount.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This is a demo — logging out will simply return you to the default account
              ({accounts[0].name}). No real session will be ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}