import {
  accessTokenAuthRequest,
  accessTokenAuthResponse,
  deleteIncomeExpenseHistoryRequest,
  deleteIncomeExpenseHistoryResponse,
  getIncomeExpenseHistoryApiRequest,
  getIncomeExpenseHistoryRequest,
  getIncomeExpenseHistoryResponse,
  getMonthlyReportRequest,
  getMonthlyReportResponse,
  incomeExpenseHistory,
  insertIncomeExpenseHistoryRequest,
  insertIncomeExpenseHistoryResponse,
  loginAuthApiRequest,
  loginAuthApiResponse,
  loginAuthRequest,
  loginAuthResponse,
  monthlyReport,
} from "../type/NeonApiInterface";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { error } from "console";
import { useNavigate } from "react-router-dom";
class NeonClientApi {
  private _backendApiUrl: string;

  constructor() {
    this._backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || "";
  }
  /**
   *セッションストレージに格納されている情報を取得する。
   * @returns セッションストレージに格納されているユーザーIDとアクセストークン
   */
  public getSessionStorage() {
    // データの取得
    const accessToken =
      localStorage.getItem("income-expense-history-accessToken") || "";
    console.log(accessToken);
    return { accessToken };
  }
  /**
   * ログイン認証を行うメソッド
   * 成功時にアクセストークン情報をセッションストレージに格納する。
   * @returns {Promise<loginAuthResponse['status']>}
   *
   */
  public async loginAuth(param: loginAuthRequest) {
    localStorage.removeItem("income-expense-history-accessToken");
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<loginAuthRequest> = {
        url: `${this._backendApiUrl}/api/v1/auth/login`,
        method: "POST",
        data: param,
      };
      await axios<any, AxiosResponse<loginAuthResponse>, loginAuthRequest>(
        options
      )
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            const accessToken = res.data.result.accessToken;
            // データの保存
            localStorage.setItem(
              "income-expense-history-accessToken",
              accessToken
            );
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return statusCode;
    }
  }
  public async accessTokenAuth(param: accessTokenAuthRequest) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<accessTokenAuthRequest> = {
        url: `${this._backendApiUrl}/api/v1/auth/accessToken`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<accessTokenAuthResponse>,
        accessTokenAuthRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return statusCode;
    }
  }
  public async getMonthlyReport(param: getMonthlyReportRequest) {
    let statusCode = 200;
    let monthlyReport: monthlyReport = [];
    try {
      const options: AxiosRequestConfig<getMonthlyReportRequest> = {
        url: `${this._backendApiUrl}/api/v1/get/monthlyReport`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<getMonthlyReportResponse>,
        getMonthlyReportRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            monthlyReport = res.data.result;
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return monthlyReport;
    }
  }
  public async insertIncomeExpenseHistory(
    param: insertIncomeExpenseHistoryRequest
  ) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<insertIncomeExpenseHistoryRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/insertIncomeExpenseHistory`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<insertIncomeExpenseHistoryResponse>,
        insertIncomeExpenseHistoryRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return statusCode;
    }
  }
  public async deleteIncomeExpenseHistory(
    param: deleteIncomeExpenseHistoryRequest
  ) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<deleteIncomeExpenseHistoryRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/deleteIncomeExpenseHistory`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<deleteIncomeExpenseHistoryResponse>,
        deleteIncomeExpenseHistoryRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return statusCode;
    }
  }
  public async getIncomeExpenseHistory(param: getIncomeExpenseHistoryRequest) {
    let statusCode = 200;
    let incomeExpenseHistory: incomeExpenseHistory[] = [];
    try {
      const options: AxiosRequestConfig<getIncomeExpenseHistoryRequest> = {
        url: `${this._backendApiUrl}/api/v1/get/incomeExpenseHistory`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<getIncomeExpenseHistoryResponse>,
        getIncomeExpenseHistoryRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            incomeExpenseHistory = res.data.result;
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return incomeExpenseHistory;
    }
  }
}
export { NeonClientApi };
