import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Plus, Mail, CheckCircle2, Users } from "lucide-react";
import { useBorrowedUsers, getBorrowedUsers } from "../hooks/useBorrowedUsers";
import { AddBorrowedUserDialog } from "./AddBorrowedUserDialog";
import { InviteUserDialog } from "./InviteUserDialog";
import { useState } from "react";
import { TransactionMode } from "../type/NeonApiInterface";
import {
  getIncomeExpenseHistory,
  getMonthlyReport,
  useDashBoard,
} from "../hooks/useDashBoard";

interface UserSelectProps {
  mode: TransactionMode;
}

export function UserSelect({ mode }: UserSelectProps) {
  const { borrowedUsers, selectedUserId, setSelectedUserId, setBorrowedUsers } =
    useBorrowedUsers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { setMonthlyReport, setIncomeExpenseHistory, setIsLoading } =
    useDashBoard();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getBorrowedUsers();
      setBorrowedUsers(users);
      if (!selectedUserId) {
        setSelectedUserId("all");
      }
    };
    loadUsers();
  }, []);

  const selectedUser = borrowedUsers.find(
    (u) => u.id.toString() === selectedUserId,
  );

  return (
    <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
      <div className="relative flex items-center">
        <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedUserId || ""}
          onValueChange={async (e) => {
            if (e) {
              setIsLoading(true);
              const report = await getMonthlyReport(e, mode);
              const getReportInterval = setInterval(async () => {
                const report = await getMonthlyReport(e, mode);
                console.log("check-transactionHistory");
                if (report.status == "done" || report.status == "error") {
                  clearInterval(getReportInterval);
                  setMonthlyReport(report.monthlyReport);
                }
              }, 10000);

              setMonthlyReport(report.monthlyReport);
              const incomeExpenseHistory = await getIncomeExpenseHistory(
                e,
                mode,
              );
              setIncomeExpenseHistory(incomeExpenseHistory);
              setIsLoading(false);
            }
            setSelectedUserId(e);
          }}>
          <SelectTrigger className="w-[240px] pl-9 rounded-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
            <SelectValue
              placeholder={
                mode === "borrowing"
                  ? "借りたユーザーを選択"
                  : "貸したユーザーを選択"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全てのユーザー</SelectItem>
            {borrowedUsers.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                <div className="flex items-center gap-2">
                  {user.name}
                  {user.status === "active" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-background hover:text-primary"
          onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>

        {selectedUser && selectedUser.status === "pending" && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-background hover:text-primary"
            onClick={() => setIsInviteDialogOpen(true)}>
            <Mail className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AddBorrowedUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {selectedUser && (
        <InviteUserDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          borrowedUserId={selectedUser.id.toString()}
          borrowedUserName={selectedUser.name}
        />
      )}
    </div>
  );
}
