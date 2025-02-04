import { Pool } from "pg";
import {
  accessTokenAuthRequest,
  insertIncomeExpenseHistoryRequest,
  loginAuthRequest,
} from "../type/NeonApiInterface";
import { createHash, randomBytes } from "crypto";
import * as jwt from "jsonwebtoken";
require("dotenv").config();
export class NeonApi {
  private pool = new Pool({
    host: process.env.REACT_APP_DB_HOST,
    user: process.env.REACT_APP_DB_USER,
    database: process.env.REACT_APP_DB_NAME,
    password: process.env.REACT_APP_DB_PASSWORD,
    port: parseInt(process.env.REACT_APP_DB_PORT || "5432"),
    ssl: true,
  });
  private salt = process.env.REACT_APP_DB_SALT;
  private config = {
    expiresIn: 1000,
    algorithm: "HS256",
  } as const;
  /**
   *
   * @param param0 loginAuthRequest ユーザーIDとパスワードが格納されている
   * @returns accessToken アクセストークンを返却する
   */
  public async loginAuth({ userId, password }: loginAuthRequest) {
    // レスポンス内容(初期値)
    const response = { accessToken: "" };
    // リクエスト.パスワード + リクエスト.パスワード(ソルト値)」でハッシュ値を作成
    const hashPassword = createHash("sha256")
      .update(password + this.salt)
      .digest("hex");
    // リクエスト.ユーザーIDとハッシュ値(user_info.password)と一致するユーザー情報を返却する。
    const query = `
        SELECT
            *
        FROM
            user_info
        WHERE
            password = $1
            AND user_id = $2;
    `;
    const { rows } = await this.pool.query(query, [hashPassword, userId]);
    // ユーザー情報が存在する場合、アクセストークンを返却する
    // 存在しない場合、エラーメッセージを返却する。
    if (rows.length === 0)
      throw { message: "ユーザーIDもしくはパスワードが間違っています。" };
    // アクセストークン作成
    const randomStr = randomBytes(16).toString("hex");
    // 「ランダム文字列(16バイト) + リクエスト.ユーザーID(ソルト値)」でハッシュ値を作成
    const saltedRandomStr = randomStr + this.salt;
    const newAccessToken = createHash("sha256")
      .update(saltedRandomStr)
      .digest("hex");
    // 作成したハッシュ値をアクセストークンとしてsupabaseの任意のレコードに格納する。
    const { rows: updateRows } = await this.pool.query(
      "UPDATE user_info SET access_token = $1 WHERE user_id = $2 RETURNING id",
      [newAccessToken, userId]
    );
    if (updateRows.length === 0)
      throw { message: "ログイン認証に失敗しました。" };
    const id = updateRows[0]["id"];
    if (!id) throw { message: "ログイン認証に失敗しました。" };
    const peyload = {
      id: id,
      accessToken: newAccessToken,
    };
    response.accessToken = jwt.sign(peyload, this.salt || "", this.config);
    return response;
  }
  /**
   *
   * @param param0 accessTokenAuthRequest["userInfo"] APIを実行するユーザー情報(ユーザーID、アクセストークン)
   * @returns　"success" or "error"
   */
  public async accessTokenAuth({
    accessToken,
  }: accessTokenAuthRequest["userInfo"]) {
    // レスポンス内容(初期値)
    let response: "success" | "error" | string = "error";
    let { id, accessToken: decodedAccessToken } = jwt.verify(
      accessToken,
      this.salt || ""
    ) as { id: string; accessToken: string };
    // ユーザーID、アクセストークンが一致するユーザー情報を取得する。
    const { rows } = await this.pool.query(
      `SELECT * FROM user_info WHERE id = $1 AND access_token = $2;`,
      [id, decodedAccessToken]
    );
    if (rows.length === 0) {
      response = "error";
      return response;
    }
    response = id;
    return response;
  }
  public async getMonthlyReport(id: string) {
    const query = {
      text: `
with
  time_ranges as (
    select
      generate_series as from_date,
      generate_series + '1 month'::interval as to_date
    from
      generate_series(
        (
          date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month
        ),
        date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month,
        '1 month'
      )
  ),
  monthly_report as (
    select
      from_date,
      coalesce(income_history.sum_income, 0) as sum_income,
      coalesce(expense_history.sum_expense, 0) as sum_expense
    from
      time_ranges
      left join (
        select
          SUM(income_expense_history.price) as sum_income,
          from_date as income_from_date
        from
          time_ranges
          left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)
          and income_expense_history.type = '0'
          and income_expense_history.user_id = $1
        group by
          from_date
        order by
          from_date
      ) as income_history on income_history.income_from_date = from_date
      left join (
        select
          SUM(income_expense_history.price) as sum_expense,
          from_date as expense_from_date
        from
          time_ranges
          left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)
          and income_expense_history.type = '1'
          and income_expense_history.user_id = $1
        group by
          from_date
        order by
          from_date
      ) as expense_history on expense_history.expense_from_date = from_date
  ) (
    select
      to_char(from_date, 'YYYY-MM') as month,
      case
        when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income
        else 0
      end as sum_income,
      case
        when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense
        else 0
      end as sum_expense,
      case
        when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then (
          avg_monthly_report_income.avg_income * extract(
            month
            from
              AGE (from_date, date_trunc('month', CURRENT_TIMESTAMP))
          )
        ) + sum_income
        else 0
      end as income_prediction,
      case
        when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then (
          avg_monthly_report_expense.avg_expense * extract(
            month
            from
              AGE (from_date, date_trunc('month', CURRENT_TIMESTAMP))
          )
        ) + sum_expense
        else 0
      end as expense_prediction
    from
      monthly_report
      left join (
        select
          coalesce(
            round((max(sum_income) - min(sum_income)) / count(*)),
            0
          ) as avg_income
        from
          monthly_report
        where
          sum_income >= 0
          and monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP)
        limit
          1
      ) as avg_monthly_report_income on monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP)
      left join (
        select
          coalesce(
            round((max(sum_expense) - min(sum_expense)) / count(*)),
            0
          ) as avg_expense
        from
          monthly_report
        where
          sum_expense >= 0
          and monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP)
        limit
          1
      ) as avg_monthly_report_expense on monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP)
    where
      monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) - interval '4' month
);
      `,
    };
    const { rows } = await this.pool.query(query, [id]);
    const result = rows.reduce((prev, current) => {
      prev.push({
        month: current.month,
        income: Number(current.sum_income),
        expense: Number(current.sum_expense),
        incomePrediction: Number(current.income_prediction),
        expensePrediction: Number(current.expense_prediction),
      });
      return prev;
    }, []);
    return result;
  }
  /**
   *
   * @param param0 userId,削除に必要な情報(id)
   * @returns　"success" or "error"
   */
  public async deleteIncomeExpenseHistory(userId: string, id: number) {
    // レスポンス内容(初期値)
    let response: "success" | "error" = "success";
    // いんんさーとを行う
    const { rows } = await this.pool.query(
      `DELETE FROM "public"."income_expense_history" WHERE user_id = $1 AND id = $2 RETURNING id;`,
      [userId, id]
    );
    if (rows.length === 0) {
      response = "error";
    }
    return response;
  }
  /**
   *
   * @param param0 userId,作成に必要な情報(price, description, created_at)
   * @returns　"success" or "error"
   */
  public async insertIncomeExpenseHistory(
    userId: string,
    updateObj: Omit<insertIncomeExpenseHistoryRequest, "userInfo">
  ) {
    // レスポンス内容(初期値)
    let response: "success" | "error" = "success";
    // いんんさーとを行う
    const { rows } = await this.pool.query(
      `INSERT INTO "public"."income_expense_history" ( "created_at", "price", "type", "description", "user_id") VALUES ( $1, $2, $3, $4, $5) RETURNING id;`,
      [
        updateObj.date,
        updateObj.price,
        updateObj.type,
        updateObj.description,
        userId,
      ]
    );
    if (rows.length === 0) {
      response = "error";
    }
    return response;
  }
  public async getIncomeExpenseHistory(id: string) {
    const query = {
      text: `
        SELECT
          *
        FROM
          income_expense_history
        where
          user_id = $1
        order by created_at desc;
      `,
    };
    const { rows } = await this.pool.query(query, [id]);
    const result = rows.reduce((prev, current) => {
      prev.push({
        price: Number(current.price),
        type: current.type,
        description: current.description,
        date: current.created_at,
        id: current.id,
      });
      return prev;
    }, []);
    return result;
  }
}
