import { Request, Response } from "express";

export type loginAuthRequest = {
  userId: string;
  password: string;
};

export type IncomeExpenseType = "0" | "1"; // 0: repayment, 1: debt
export type InsertBorrowedUserType = "new" | "exists"; // 0: repayment, 1: debt
export type TransactionMode = "borrowing" | "lending";
export type ProcessedType = "done" | "pending" | "rejected";
export type TaskProcessedType = Exclude<ProcessedType, "rejected"> | "error";
export type BorrowedUser = {
  id: number;
  name: string;
  email: string | null;
  status: "pending" | "active";
  created_at: string;
};

export type UserInvitation = {
  id: number;
  invitation_code: string;
  expires_at: string;
  created_at: string;
  borrowed_user_id: number;
};

export type loginAuthApiRequest = Request<loginAuthRequest>;
export type loginAuthResponse =
  | {
      status: number;
      result: { accessToken: string; borrowedUserId: number | null };
    }
  | { error: string; status: number };
export type loginAuthApiResponse = Response<loginAuthResponse>;
export type accessTokenAuthRequest = {
  userInfo: { accessToken: string };
};
export type getBorrowedUsersRequest = accessTokenAuthRequest;
export type getBorrowedUsersResponse =
  | {
      status: number;
      result: BorrowedUser[];
    }
  | { error: string; status: number };

export type createBorrowedUserRequest = accessTokenAuthRequest & {
  name: string;
  email?: string;
};

export type createInvitationRequest = accessTokenAuthRequest & {
  borrowed_user_id: string;
};

export type getMonthlyReportRequest = accessTokenAuthRequest & {
  borrowed_user_id?: string;
  mode?: TransactionMode;
};

export type getMonthlyReportApiRequest = Request<getMonthlyReportRequest>;
export type monthlyReportEx = {
  taskId: number;
  status: TaskProcessedType;
  monthlyReport: monthlyReport;
};
export type getMonthlyReportResponse =
  | {
      result: monthlyReportEx;
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
  reasoning: string;
}[];

export type incomeExpenseHistory = {
  price: number;
  date: string;
  description: string;
  type: IncomeExpenseType;
  id: number;
  borrowed_user_id?: string;
  borrowed_user_name?: string;
  created_by?: number;
  status?: ProcessedType;
};

export type insertIncomeExpenseHistoryRequest = accessTokenAuthRequest &
  Omit<incomeExpenseHistory, "id"> & {
    mode: TransactionMode;
    selectedUserId: string | null;
  };

export type predict = {
  month: string;
  repayment: number;
  debt: number;
  reasoning: string;
};

export type predictionTask = {
  id: number;
  task_name: string;
  user_id: number;
  borrowed_user_id: number;
  mode: TransactionMode;
  status: TaskProcessedType;
  predictions_ids: Array<number>;
  created_at: string;
};

export type predictions = {
  predictions: predict[];
  isCached: boolean;
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
  borrowed_user_id: string | null;
  mode: TransactionMode;
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

export type updateStatusDoneRequest = accessTokenAuthRequest & {
  id: number;
  borrowed_user_id: string | null;
  mode: TransactionMode;
};
export type updateStatusDoneApiRequest = Request<updateStatusDoneRequest>;
export type updateStatusDoneResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type updateStatusDoneApiResponse = Response<updateStatusDoneResponse>;

export type getIncomeExpenseHistoryRequest = accessTokenAuthRequest & {
  borrowed_user_id?: string;
  mode?: TransactionMode;
};
export type getIncomeExpenseHistoryApiRequest =
  Request<getIncomeExpenseHistoryRequest>;
export type getIncomeExpenseHistoryResponse =
  | {
      result: incomeExpenseHistory[];
      status: number;
    }
  | { error: string; status: number };
export type getPredictRequest = accessTokenAuthRequest & {
  predict_task_id: number;
};
export type getPredictApiRequest = Request<getPredictRequest>;
export type getPredictApiResponse = Response<getPredictResponse>;
export type getPredictResponse =
  | {
      result: "success" | "error";
      status: number;
    }
  | { error: string; status: number };
export type getIncomeExpenseHistoryApiResponse =
  Response<getIncomeExpenseHistoryResponse>;
export type accessTokenAuthApiRequest = Request<accessTokenAuthRequest>;
export type accessTokenAuthResponse =
  | { status: number; result: { borrowedUserId: number | null } }
  | { error: string; status: number };
export type accessTokenAuthApiResponse = Response<accessTokenAuthResponse>;

export type getInvitationsRequest = { code: string };
export type getInvitationsApiRequest = Request<getInvitationsRequest>;
export type getInvitationsResponse =
  | {
      status: number;
      result: { invitation: UserInvitation; user: BorrowedUser };
    }
  | { error: string; status: number };
export type getInvitationsApiResponse = Response<getInvitationsResponse>;

export type getBorrowedUsersApiRequest = Request<getBorrowedUsersRequest>;
export type getBorrowedUsersApiResponse = Response<getBorrowedUsersResponse>;

export type insertBorrowedUserRequest = accessTokenAuthRequest &
  Omit<BorrowedUser, "id"> & { mode: InsertBorrowedUserType };
export type insertBorrowedUserApiRequest = Request<insertBorrowedUserRequest>;
export type insertBorrowedUserResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertBorrowedUserApiResponse =
  Response<insertBorrowedUserResponse>;

export type insertInvitationRequest = accessTokenAuthRequest &
  Omit<UserInvitation, "id">;
export type insertInvitationApiRequest = Request<insertInvitationRequest>;
export type insertInvitationResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertInvitationApiResponse = Response<insertInvitationResponse>;

export type insertUserInfoRequest = {
  code: string;
  email: string;
  password: string;
  name?: string;
};
export type insertUserInfoApiRequest = Request<insertUserInfoRequest>;
export type insertUserInfoResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertUserInfoApiResponse = Response<insertUserInfoResponse>;
