"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export default function DebtRepaymentRatio() {
  const debtRepaymentRatio = 65;

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
            <Progress value={debtRepaymentRatio} className="h-3" />
            <p className="text-sm text-muted-foreground">
              残り返済額: ¥1,500,000
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
