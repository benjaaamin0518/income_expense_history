import { motion } from "framer-motion";
import DebtRepaymentRatio from "./DebtRepaymentRatio";
import IncomeExpenseChart from "./IncomeExpenseChart";
import TransactionHistory from "./TransactionHistory";
import { UserSelect } from "./UserSelect";

export function LendingGroup() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <UserSelect mode="lending" />
      </div>
      <DebtRepaymentRatio />
      <IncomeExpenseChart />
      <TransactionHistory />
    </motion.div>
  );
}