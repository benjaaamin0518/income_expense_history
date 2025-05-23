import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useDashBoard, getMonthlyReport } from "../hooks/useDashBoard";
import { useBorrowedUsers } from "../hooks/useBorrowedUsers";
import { useEffect, useState } from "react";
import { monthlyReport } from "../type/NeonApiInterface";

export default function IncomeExpenseChart() {
  const nowDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const { mode, setMonthlyReport, monthlyReport } = useDashBoard();

  const [diffMonth, setDiffMonth] = useState(0);
  useEffect(() => {
    if (monthlyReport && monthlyReport.length > 0) {
      const date = new Date(monthlyReport[monthlyReport.length - 1].month);
      let diffMonth = (date.getFullYear() - nowDate.getFullYear()) * 12;
      diffMonth -= nowDate.getMonth() + 1;
      diffMonth += date.getMonth() + 1;
      setDiffMonth(diffMonth);
    }
  }, [monthlyReport]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}>
      <Card className="overflow-hidden border-2 dark:border-slate-800">
        <CardHeader className="dark:bg-slate-900/50">
          <CardTitle>収支推移</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyReport}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(34, 197, 94)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(34, 197, 94)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(239, 68, 68)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(239, 68, 68)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                  <pattern
                    id="predictionPattern"
                    patternUnits="userSpaceOnUse"
                    width="4"
                    height="4">
                    <path
                      d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2 "
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <XAxis
                  dataKey={(data: monthlyReport[number]) =>
                    new Date(data.month).getMonth() + 1 + "月"
                  }
                  stroke="hsl(var(--muted-foreground))"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `¥${value.toLocaleString()}`,
                    `${name}${
                      nowDate < new Date(props.payload.month) ? "（予測）" : ""
                    }`,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <ReferenceLine
                  x={nowDate.getMonth() + 1 + "月"}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    value: "予測開始",
                    position: "top",
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={(data: monthlyReport[number]) =>
                    nowDate <= new Date(data.month)
                      ? data.income || data.incomePrediction
                      : data.income
                  }
                  name={mode === "borrowing" ? "返済" : "返済"}
                  stackId="0"
                  stroke="rgb(34, 197, 94)"
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey={(data: monthlyReport[number]) =>
                    nowDate <= new Date(data.month)
                      ? data.expense || data.expensePrediction
                      : data.expense
                  }
                  name={mode === "borrowing" ? "借入" : "貸付"}
                  stackId="1"
                  stroke="rgb(239, 68, 68)"
                  fill="url(#colorExpense)"
                  strokeWidth={2}
                  fillOpacity={1}
                />
                {/* 予測部分の斜線パターン */}
                <Area
                  type="monotone"
                  tooltipType="none"
                  dataKey={(data: monthlyReport[number]) =>
                    nowDate <= new Date(data.month)
                      ? (data.expense || data.expensePrediction) >=
                        (data.income || data.incomePrediction)
                        ? data.expense || data.expensePrediction
                        : data.income || data.incomePrediction
                      : null
                  }
                  stackId="2"
                  fill="url(#predictionPattern)"
                  stroke="none"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey={(data: monthlyReport[number]) =>
                    (data.reasoning || "").split("。").map((p, index, arr) =>
                      p !== "" ? (
                        p
                          .split("、")
                          .map((p2, index2, arr2) =>
                            p2 !== "" ? (
                              <div key={index}>
                                <p>
                                  {arr2.length - 1 == index2
                                    ? p2 + "。"
                                    : p2 + "、"}
                                </p>
                              </div>
                            ) : (
                              <></>
                            )
                          )
                          .flat()
                      ) : (
                        <></>
                      )
                    )
                  }
                  stackId="2"
                  fill="url(#predictionPattern)"
                  stroke="none"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 bg-muted-foreground/50" />
                <span>予測データ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-foreground/10">
                  <svg width="16" height="16" className="text-foreground/30">
                    <pattern
                      id="diagonalPattern"
                      patternUnits="userSpaceOnUse"
                      width="4"
                      height="4">
                      <path
                        d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="16" height="16" fill="url(#diagonalPattern)" />
                  </svg>
                </div>
                <span>予測部分</span>
              </div>
            </div>
            <div>
              {mode === "borrowing" ? "総返済額" : "総貸付額"}: ¥
              {monthlyReport && monthlyReport.length > 0
                ? monthlyReport[monthlyReport.length - 1 - diffMonth]
                  ? monthlyReport[
                      monthlyReport.length - 1 - diffMonth
                    ].income.toLocaleString()
                  : 0
                : 0}
            </div>
            <div>
              {mode === "borrowing" ? "総借入額" : "総返済額"}: ¥
              {monthlyReport && monthlyReport.length > 0
                ? monthlyReport[monthlyReport.length - 1 - diffMonth]
                  ? monthlyReport[
                      monthlyReport.length - 1 - diffMonth
                    ].expense.toLocaleString()
                  : 0
                : 0}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
