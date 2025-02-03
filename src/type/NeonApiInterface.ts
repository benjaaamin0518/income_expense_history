import { Request, Response } from "express";

export type loginAuthRequest = {
  userId: string;
  password: string;
};
/**
 * 収入　＝ 0
 * 支出　＝　1
 */
export type IncomeExpenseType = "0" | "1";
export type loginAuthApiRequest = Request<loginAuthRequest>;
export type loginAuthResponse =
  | { status: number; result: { accessToken: string } }
  | { error: string; status: number };
export type loginAuthApiResponse = Response<loginAuthResponse>;
export type accessTokenAuthRequest = {
  userInfo: { accessToken: string };
};
export type getMonthlyReportRequest = accessTokenAuthRequest;
export type getMonthlyReportApiRequest = Request<getMonthlyReportRequest>;
export type getMonthlyReportResponse =
  | {
      result: monthlyReport;
      status: number;
    }
  | { error: string; status: number };
export type getMonthlyReportApiResponse = Response<getMonthlyReportResponse>;
export type monthlyReport = {
  month: string;
  income: number;
  expense: number;
  incomePrediction: number;
  expensePrediction: number;
}[];

export type insertIncomeExpenseHistoryRequest = accessTokenAuthRequest & {
  price: number;
  date: string;
  description: string;
  type: IncomeExpenseType;
};
export type insertIncomeExpenseHistoryApiRequest =
  Request<insertIncomeExpenseHistoryRequest>;
export type insertIncomeExpenseHistoryResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertIncomeExpenseHistoryApiResponse =
  Response<insertIncomeExpenseHistoryResponse>;

export type deleteIncomeExpenseHistoryRequest = accessTokenAuthRequest & {
  id: number;
};
export type deleteIncomeExpenseHistoryApiRequest =
  Request<deleteIncomeExpenseHistoryRequest>;
export type deleteIncomeExpenseHistoryResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type deleteIncomeExpenseHistoryApiResponse =
  Response<deleteIncomeExpenseHistoryResponse>;
