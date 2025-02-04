import { create } from "zustand";
import { NeonClientApi } from "../common/NeonApiClient";
import {
  getMonthlyReportResponse,
  incomeExpenseHistory,
  monthlyReport,
} from "../type/NeonApiInterface";

interface AuthState {
  monthlyReport: monthlyReport;
  setMonthlyReport: (obj: monthlyReport) => void;
  incomeExpenseHistory: incomeExpenseHistory[];
  setIncomeExpenseHistory: (obj: incomeExpenseHistory[]) => void;
}
const client = new NeonClientApi();
export const getMonthlyReport: () => Promise<monthlyReport> = async () => {
  try {
    const result = await client.getMonthlyReport({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
    });
    return result;
  } catch (error) {
    return [];
  }
};
export const getIncomeExpenseHistory: () => Promise<
  incomeExpenseHistory[]
> = async () => {
  try {
    const result = await client.getIncomeExpenseHistory({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
    });
    return result;
  } catch (error) {
    return [];
  }
};
export const useDashBoard = create<AuthState>((set) => ({
  monthlyReport: [],
  setMonthlyReport: (obj) => {
    set({ monthlyReport: obj });
  },
  incomeExpenseHistory: [],
  setIncomeExpenseHistory: (obj) => {
    set({ incomeExpenseHistory: obj });
  },
}));
