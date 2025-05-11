import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth, auth as accessTokenAuth } from "./hooks/useAuth";
import { useEffect, useLayoutEffect, useState } from "react";
import { userInfo } from "os";
import RegisterPage from "./pages/RegisterPage";

function App() {
  let { isAuthenticated, auth } = useAuth();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    console.log(localStorage.getItem("income-expense-history-accessToken"));
    const code = searchParams.get("code");
    if (code) return;
    (async () => {
      const {isAuthenticated, borrowedUserId} = await accessTokenAuth();
      isAuthenticated && auth(borrowedUserId);
    })();
  }, []);
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            useAuth().isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            useAuth().isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
