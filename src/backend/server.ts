import express, { response } from "express";
import cors from "cors";
import { NeonApi } from "./NeonApi";
import {
  accessTokenAuthRequest,
  deleteIncomeExpenseHistoryApiRequest,
  deleteIncomeExpenseHistoryApiResponse,
  getMonthlyReportApiRequest,
  getMonthlyReportApiResponse,
  getMonthlyReportRequest,
  getMonthlyReportResponse,
  insertIncomeExpenseHistoryApiRequest,
  insertIncomeExpenseHistoryApiResponse,
  loginAuthApiRequest,
  loginAuthApiResponse,
} from "../type/NeonApiInterface";
const app = express();
const neonApi = new NeonApi();
// CORSの設定
const corsOptions = {
  origin: process.env.REACT_APP_FRONTEND_URL, // フロントエンドのURLを環境変数から取得
  credentials: true, // クレデンシャルを含むリクエストを許可する
};
// アクセストークン認証(ラッパー関数)
const initAccessTokenAuth = async (
  userInfo: accessTokenAuthRequest["userInfo"]
) => {
  const result = await neonApi.accessTokenAuth(userInfo);
  const isSuccess = result !== "error";
  if (!isSuccess) throw { message: "アクセストークンの認証に失敗しました。" };
  return result;
};
// CORS設定とJSONパーサーをミドルウェアとして適用
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// ログイン認証を行う(成功時アクセストークンを返却する)
app.post(
  "/api/v1/auth/login",
  async (req: loginAuthApiRequest, res: loginAuthApiResponse) => {
    try {
      const result = await neonApi.loginAuth(req.body);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.get(
  "/api/v1/get/monthlyReport",
  async (req: getMonthlyReportApiRequest, res: getMonthlyReportApiResponse) => {
    try {
      const { userInfo } = req.body;
      const userId = await initAccessTokenAuth(userInfo);
      const result = await neonApi.getMonthlyReport();
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/insertIncomeExpenseHistory",
  async (
    req: insertIncomeExpenseHistoryApiRequest,
    res: insertIncomeExpenseHistoryApiResponse
  ) => {
    try {
      const { userInfo, ...left } = req.body;
      const userId = await initAccessTokenAuth(userInfo);
      const result = await neonApi.insertIncomeExpenseHistory(userId, left);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/deleteIncomeExpenseHistory",
  async (
    req: deleteIncomeExpenseHistoryApiRequest,
    res: deleteIncomeExpenseHistoryApiResponse
  ) => {
    try {
      const { userInfo, id } = req.body;
      const userId = await initAccessTokenAuth(userInfo);
      const result = await neonApi.deleteIncomeExpenseHistory(userId, id);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.listen(4200, () => {
  console.log(`port ${4200} でサーバー起動中`);
});
