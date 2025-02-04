import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import DebtRepaymentRatio from "../components/DebtRepaymentRatio";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import TransactionHistory from "../components/TransactionHistory";
import { UserNav } from "../components/UserNav";
import {
  getIncomeExpenseHistory,
  getMonthlyReport,
  useDashBoard,
} from "../hooks/useDashBoard";

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
  const [isLoading, setIsLoading] = useState(true);
  const {
    setMonthlyReport,
    monthlyReport,
    setIncomeExpenseHistory,
    incomeExpenseHistory,
  } = useDashBoard();

  useEffect(() => {
    // データ取得のシミュレーション
    (async () => {
      const monthlyReport = await getMonthlyReport();
      setMonthlyReport(monthlyReport);
      const incomeExpenseHistory = await getIncomeExpenseHistory();
      setIncomeExpenseHistory(incomeExpenseHistory);
      setIsLoading(false);
    })();
  }, [isLoading]);

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
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            借金ダッシュボード
          </motion.h1>
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
          animate="visible"
          className="grid gap-8">
          <motion.div variants={itemVariants}>
            <DebtRepaymentRatio />
          </motion.div>

          <motion.div variants={itemVariants}>
            <IncomeExpenseChart />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TransactionHistory />
          </motion.div>
        </motion.div>
      </main>

      {/* スクロールインジケーター */}
      <motion.div
        className="fixed bottom-8 right-8 bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg cursor-pointer hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </motion.div>
    </div>
  );
}
