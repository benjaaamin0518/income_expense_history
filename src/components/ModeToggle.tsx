import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { TransactionMode } from "../type/NeonApiInterface";
import { isMobile } from "react-device-detect";
import {
  getIncomeExpenseHistory,
  getMonthlyReport,
  useDashBoard,
} from "../hooks/useDashBoard";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { useBorrowedUsers } from "../hooks/useBorrowedUsers";

export function ModeToggle() {
  const { mode, setMode, setIncomeExpenseHistory } = useDashBoard();
  const { borrowedUsers, selectedUserId, setSelectedUserId, setBorrowedUsers } =
    useBorrowedUsers();
  const { setMonthlyReport } = useDashBoard();
  return (
    <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        className={`relative rounded-full px-4 transition-colors ${
          mode === "borrowing"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary/80"
        }`}
        onClick={async () => {
          const report = await getMonthlyReport(selectedUserId!, "borrowing");
          setMonthlyReport(report);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
            selectedUserId!,
            "borrowing"
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          setMode("borrowing");
        }}>
        {mode === "borrowing" && (
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-0 bg-background rounded-full border border-border/50 shadow-sm"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <Wallet className="mr-2 h-4 w-4" />
        {isMobile ? "" : "借入管理"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`relative rounded-full px-4 transition-colors ${
          mode === "lending"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary/80"
        }`}
        onClick={async () => {
          const report = await getMonthlyReport(selectedUserId!, "lending");
          setMonthlyReport(report);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
            selectedUserId!,
            "lending"
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          setMode("lending");
        }}>
        {mode === "lending" && (
          <motion.div
            layoutId="mode-pill"
            className="absolute inset-0 bg-background rounded-full border border-border/50 shadow-sm"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <ArrowLeftRight className="mr-2 h-4 w-4" />
        {isMobile ? "" : "貸付管理"}
      </Button>
    </div>
  );
}
