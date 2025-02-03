'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const data = [
  {
    month: '1月',
    income: 320000,
    expense: 240000,
    accumulated: 80000,
    predicted: false,
  },
  {
    month: '2月',
    income: 350000,
    expense: 220000,
    accumulated: 210000,
    predicted: false,
  },
  {
    month: '3月',
    income: 330000,
    expense: 280000,
    accumulated: 260000,
    predicted: false,
  },
  {
    month: '4月',
    income: 340000,
    expense: 250000,
    accumulated: 350000,
    predicted: true,
  },
  {
    month: '5月',
    income: 360000,
    expense: 230000,
    accumulated: 480000,
    predicted: true,
  },
  {
    month: '6月',
    income: 380000,
    expense: 260000,
    accumulated: 600000,
    predicted: true,
  },
].map((item) => ({
  ...item,
  total: item.income + item.accumulated,
}));

export default function IncomeExpenseChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-2 dark:border-slate-800">
        <CardHeader className="dark:bg-slate-900/50">
          <CardTitle>収支推移</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
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
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(239, 68, 68)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                  {/* 予測データ用のパターン */}
                  <pattern
                    id="predictionPattern"
                    patternUnits="userSpaceOnUse"
                    width="4"
                    height="4"
                  >
                    <path
                      d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <XAxis
                  dataKey="month"
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
                    `${name}${props.payload.predicted ? '（予測）' : ''}`,
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow:
                      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <ReferenceLine
                  x="4月"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    value: '予測開始',
                    position: 'top',
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="収入"
                  stackId="1"
                  stroke="rgb(34, 197, 94)"
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="支出"
                  stackId="0"
                  stroke="rgb(239, 68, 68)"
                  fill="url(#colorExpense)"
                  strokeWidth={2}
                  fillOpacity={1}
                />
                {/* 予測部分の斜線パターン */}
                <Area
                  type="monotone"
                  dataKey={(data) =>
                    data.predicted
                      ? data.expense >= data.income
                        ? data.expense
                        : data.income
                      : null
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
                      height="4"
                    >
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
              総収入額: ¥{data[data.length - 1].income.toLocaleString()}
            </div>
            <div>
              総支出額: ¥{data[data.length - 1].expense.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
