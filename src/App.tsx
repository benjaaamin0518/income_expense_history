import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth, auth as accessTokenAuth } from "./hooks/useAuth";
import { useEffect, useLayoutEffect, useState } from "react";
import { userInfo } from "os";

function App() {
  let { isAuthenticated, auth } = useAuth();
  useEffect(() => {
    console.log(localStorage.getItem("income-expense-history-accessToken"));
    (async () => {
      const isAuthenticated = await accessTokenAuth();
      isAuthenticated && auth();
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
