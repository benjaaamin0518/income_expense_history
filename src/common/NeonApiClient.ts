import {
  accessTokenAuthRequest,
  accessTokenAuthResponse,
  BorrowedUser,
  deleteIncomeExpenseHistoryRequest,
  deleteIncomeExpenseHistoryResponse,
  getBorrowedUsersRequest,
  getBorrowedUsersResponse,
  getIncomeExpenseHistoryApiRequest,
  getIncomeExpenseHistoryRequest,
  getIncomeExpenseHistoryResponse,
  getInvitationsRequest,
  getInvitationsResponse,
  getMonthlyReportRequest,
  getMonthlyReportResponse,
  incomeExpenseHistory,
  insertBorrowedUserRequest,
  insertBorrowedUserResponse,
  insertIncomeExpenseHistoryRequest,
  insertIncomeExpenseHistoryResponse,
  insertInvitationRequest,
  insertInvitationResponse,
  insertUserInfoRequest,
  insertUserInfoResponse,
  loginAuthApiRequest,
  loginAuthApiResponse,
  loginAuthRequest,
  loginAuthResponse,
  monthlyReport,
  UserInvitation,
} from "../type/NeonApiInterface";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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
          window.location.href = location.host;
          window.location.reload();
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
          window.location.href = location.host;
          window.location.reload();
        });
    } catch (e) {
      console.error(e);
    } finally {
      return incomeExpenseHistory;
    }
  }
  public async getInvitation(param: getInvitationsRequest) {
    let statusCode = 200;
    let resultInvitation: UserInvitation = {
      id: 0,
      invitation_code: "",
      expires_at: "",
      created_at: "",
      borrowed_user_id: 0,
    };
    let resultUser: BorrowedUser = {
      id: 0,
      name: "",
      email: null,
      status: "pending",
      created_at: "",
    };
    try {
      const options: AxiosRequestConfig<getInvitationsRequest> = {
        url: `${this._backendApiUrl}/api/v1/get/invitation`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<getInvitationsResponse>,
        getInvitationsRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            const { invitation, user } = res.data.result;
            resultInvitation = invitation;
            resultUser = user;
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return { invitation: resultInvitation, user: resultUser };
    }
  }
  public async getBorrowedUsers(param: getBorrowedUsersRequest) {
    let statusCode = 200;
    let borrowedUsers: BorrowedUser[] = [];
    try {
      const options: AxiosRequestConfig<getBorrowedUsersRequest> = {
        url: `${this._backendApiUrl}/api/v1/get/borrowedUsers`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<getBorrowedUsersResponse>,
        getBorrowedUsersRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            borrowedUsers = res.data.result;
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
          window.location.href = location.host;
          window.location.reload();
        });
    } catch (e) {
      console.error(e);
    } finally {
      return borrowedUsers;
    }
  }
  public async insertBorrowedUser(param: insertBorrowedUserRequest) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<insertBorrowedUserRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/insertBorrowedUser`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<insertBorrowedUserResponse>,
        insertBorrowedUserRequest
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
  public async insertInvitation(param: insertInvitationRequest) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<insertInvitationRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/insertInvitation`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<insertInvitationResponse>,
        insertInvitationRequest
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
  public async insertUserInfo(param: insertUserInfoRequest) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<insertUserInfoRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/insertUserInfo`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<insertUserInfoResponse>,
        insertUserInfoRequest
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
}
export { NeonClientApi };
