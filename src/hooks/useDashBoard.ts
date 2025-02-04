import { create } from "zustand";
import { NeonClientApi } from "../common/NeonApiClient";
import {
  getMonthlyReportResponse,
  monthlyReport,
} from "../type/NeonApiInterface";

interface AuthState {
  monthlyReport: monthlyReport;
  setMonthlyReport: (obj: monthlyReport) => void;
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
export const useDashBoard = create<AuthState>((set) => ({
  monthlyReport: [],
  setMonthlyReport: (obj) => {
    set({ monthlyReport: obj });
  },
}));
