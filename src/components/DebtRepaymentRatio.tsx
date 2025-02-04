"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useDashBoard } from "../hooks/useDashBoard";
import { useEffect, useState } from "react";
export default function DebtRepaymentRatio() {
  const nowDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const { monthlyReport } = useDashBoard();
  const [debtRepaymentRatio, setDebtRepaymentRatio] = useState(0);
  const [remainingDebt, setRemainingDebt] = useState("");
  useEffect(() => {
    if (monthlyReport && monthlyReport.length > 0) {
      const date = new Date(monthlyReport[monthlyReport.length - 1].month);
      let diffMonth = (date.getFullYear() - nowDate.getFullYear()) * 12;
      diffMonth -= nowDate.getMonth() + 1;
      diffMonth += date.getMonth() + 1;
      const expense =
        monthlyReport && monthlyReport.length > 0
          ? monthlyReport[monthlyReport.length - 1 - diffMonth]
            ? monthlyReport[monthlyReport.length - 1 - diffMonth].expense
            : 0
          : 0;
      const income =
        monthlyReport && monthlyReport.length > 0
          ? monthlyReport[monthlyReport.length - 1 - diffMonth]
            ? monthlyReport[monthlyReport.length - 1 - diffMonth].income
            : 0
          : 0;
      setRemainingDebt((expense - income).toLocaleString());
      setDebtRepaymentRatio(
        isNaN(Math.round((income / expense) * 100 * 100) / 100)
          ? 0
          : !isFinite(Math.round((income / expense) * 100 * 100) / 100)
          ? 100
          : Math.round((income / expense) * 100 * 100) / 100
      );
    }
  }, [monthlyReport]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-2 dark:border-slate-800">
        <CardHeader className="dark:bg-slate-900/50">
          <CardTitle>借金返済率</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold tracking-tight">
                {debtRepaymentRatio}%
              </span>
              <span className="text-sm text-muted-foreground">目標: 100%</span>
            </div>
            <Progress
              value={
                debtRepaymentRatio >= 100
                  ? 100
                  : isNaN(debtRepaymentRatio)
                  ? 0
                  : !isFinite(debtRepaymentRatio)
                  ? 100
                  : debtRepaymentRatio
              }
              className="h-3"
            />
            <p className="text-sm text-muted-foreground">
              残り返済額: {remainingDebt}円
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
