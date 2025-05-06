import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { createInvitation, useBorrowedUsers } from "../hooks/useBorrowedUsers";
import QRCode from "qrcode";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrowedUserId: string;
  borrowedUserName: string;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  borrowedUserId,
  borrowedUserName,
}: InviteUserDialogProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { borrowedUsers } = useBorrowedUsers();

  useEffect(() => {
    if (open) {
      const user = borrowedUsers.find(
        (u) => u.id.toString() === borrowedUserId
      );
      if (user?.status === "active") {
        setError("このユーザーは既に登録済みです。");
        setIsLoading(false);
        return;
      }
      generateInvitation();
    }
  }, [open, borrowedUserId, borrowedUsers]);

  const generateInvitation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const invitation = await createInvitation(borrowedUserId);
      if (invitation) {
        const inviteUrl = `${window.location.origin}/register?code=${invitation.invitation_code}`;
        const qr = await QRCode.toDataURL(inviteUrl);
        setQrCode(qr);
      } else {
        throw new Error("招待の作成に失敗しました");
      }
    } catch (err) {
      setError("招待の作成に失敗しました。後でもう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const user = borrowedUsers.find((u) => u.id.toString() === borrowedUserId);
  const isRegistered = user?.status === "active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{borrowedUserName} さんを招待</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isRegistered ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center">このユーザーは既に登録済みです</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCode} alt="招待QRコード" className="w-64 h-64" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                このQRコードは1時間有効です
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
