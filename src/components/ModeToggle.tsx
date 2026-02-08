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
  const { setMonthlyReport, setIsLoading } = useDashBoard();
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
          setIsLoading(true);
          const report = await getMonthlyReport(selectedUserId!, "borrowing");
          localStorage.setItem(
            "income-expense-history-waitTaskId",
            report.taskId.toString(),
          );
          const getReportInterval = setInterval(async () => {
            const report = await getMonthlyReport(selectedUserId!, "borrowing");
            console.log("check-transactionHistory");
            const isWaitTask =
              localStorage.getItem("income-expense-history-waitTaskId") ==
              report.taskId.toString();
            if (
              report.status == "done" ||
              report.status == "error" ||
              !isWaitTask
            ) {
              clearInterval(getReportInterval);
              if (isWaitTask) setMonthlyReport(report.monthlyReport);
            }
          }, 10000);

          setMonthlyReport(report.monthlyReport);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
            selectedUserId!,
            "borrowing",
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          setMode("borrowing");
          setIsLoading(false);
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
          setIsLoading(true);
          const report = await getMonthlyReport(selectedUserId!, "lending");
          localStorage.setItem(
            "income-expense-history-waitTaskId",
            report.taskId.toString(),
          );
          const getReportInterval = setInterval(async () => {
            const report = await getMonthlyReport(selectedUserId!, "lending");
            console.log("check-transactionHistory");
            const isWaitTask =
              localStorage.getItem("income-expense-history-waitTaskId") ==
              report.taskId.toString();
            if (
              report.status == "done" ||
              report.status == "error" ||
              !isWaitTask
            ) {
              clearInterval(getReportInterval);
              if (isWaitTask) setMonthlyReport(report.monthlyReport);
            }
          }, 10000);
          setMonthlyReport(report.monthlyReport);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
            selectedUserId!,
            "lending",
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          setMode("lending");
          setIsLoading(false);
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
