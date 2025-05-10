import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ModeToggle } from "../components/ModeToggle";
import { BorrowingGroup } from "../components/BorrowingGroup";
import { LendingGroup } from "../components/LendingGroup";
import {
  getIncomeExpenseHistory,
  getMonthlyReport,
  useDashBoard,
} from "../hooks/useDashBoard";
import { UserNav } from "../components/UserNav";
import { useBorrowedUsers } from "../hooks/useBorrowedUsers";
import { isMobile } from "react-device-detect";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DashboardPage() {
  const {
    setMonthlyReport,
    monthlyReport,
    setIncomeExpenseHistory,
    incomeExpenseHistory,
    mode,
    setMode,
    isLoading,
    setIsLoading,
  } = useDashBoard();
  const { borrowedUsers, selectedUserId, setSelectedUserId, setBorrowedUsers } =
    useBorrowedUsers();
  useEffect(() => {
    setIsLoading(true);
    // データ取得のシミュレーション
    (async () => {
      setSelectedUserId("all");
      setMonthlyReport([]);
      setIncomeExpenseHistory([]);
      setMode("borrowing");
      const monthlyReport = await getMonthlyReport();
      setMonthlyReport(monthlyReport);
      const incomeExpenseHistory = await getIncomeExpenseHistory();
      setIncomeExpenseHistory(incomeExpenseHistory);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            データを読み込んでいます...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b dark:border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-8 flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4">
            {isMobile ? (
              <></>
            ) : (
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                借金ダッシュボード
              </h1>
            )}
            <ModeToggle />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}>
            <UserNav />
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          <AnimatePresence mode="wait">
            {mode === "borrowing" ? <BorrowingGroup /> : <LendingGroup />}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
