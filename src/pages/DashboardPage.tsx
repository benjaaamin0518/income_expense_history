import DebtRepaymentRatio from "../components/DebtRepaymentRatio";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import TransactionHistory from "../components/TransactionHistory";
import { UserNav } from "../components/UserNav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b dark:border-slate-800">
        <div className="px-8 flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            借金ダッシュボード
          </h1>
          <UserNav />
        </div>
      </header>
      <main className="px-8 py-8 space-y-8">
        <div className="grid gap-8">
          <DebtRepaymentRatio />
          <IncomeExpenseChart />
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
}
