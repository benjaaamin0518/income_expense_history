import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  createBorrowedUser,
  getBorrowedUsers,
} from "../hooks/useBorrowedUsers";
import { useBorrowedUsers } from "../hooks/useBorrowedUsers";
import { Loader2, UserPlus, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AddBorrowedUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBorrowedUserDialog({
  open,
  onOpenChange,
}: AddBorrowedUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingEmail, setExistingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setBorrowedUsers } = useBorrowedUsers();

  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createBorrowedUser(name, email);
      const users = await getBorrowedUsers();
      setBorrowedUsers(users);
      onOpenChange(false);
      setName("");
      setEmail("");
      setExistingEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createBorrowedUser("", existingEmail);
      const users = await getBorrowedUsers();
      setBorrowedUsers(users);
      onOpenChange(false);
      setName("");
      setEmail("");
      setExistingEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>借りたユーザーを追加</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              新規ユーザー
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              既存ユーザー
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <form onSubmit={handleNewUserSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス(任意)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    追加中...
                  </>
                ) : (
                  "追加"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="existing">
            <form onSubmit={handleExistingUserSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingEmail">メールアドレス</Label>
                <Input
                  id="existingEmail"
                  type="email"
                  value={existingEmail}
                  onChange={(e) => setExistingEmail(e.target.value)}
                  required
                  placeholder="既存ユーザーのメールアドレス"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    追加中...
                  </>
                ) : (
                  "追加"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
