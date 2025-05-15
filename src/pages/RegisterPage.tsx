import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { getInvitationByCode } from "../hooks/useBorrowedUsers";
import { BorrowedUser, UserInvitation } from "../type/NeonApiInterface";
import { NeonClientApi } from "../common/NeonApiClient";
import {useAuth} from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<UserInvitation | null>(null);
  const [user, setUser] = useState<BorrowedUser | null>(null);
  const client = new NeonClientApi();
  const { login } = useAuth();

  useEffect(() => {
    const loadInvitation = async () => {
      const code = searchParams.get("code");
      if (!code) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getInvitationByCode(code);
        if (!result) {
          setError("無効な招待コードです。");
          setIsLoading(false);
          return;
        }

        const { invitation, user } = result;
        const now = new Date();
        const expiresAt = new Date(invitation.expires_at);

        if (now > expiresAt) {
          setError("招待の有効期限が切れています。");
          setIsLoading(false);
          return;
        }

        setInvitation(invitation);
        setUser(user);
        setIsLoading(false);
      } catch (err) {
        setError("招待情報の取得に失敗しました。");
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const form = new FormData(e.currentTarget);
      let email = user?.email || form.get("email")!.valueOf().toString();
      let name = form.get("name") ? form.get("name")!.valueOf().toString() : null;
      let password = form.get("password")!.valueOf().toString();
      let password2 = form.get("password2")!.valueOf().toString();
      const code = searchParams.get("code");

      if (password !== password2) {
        setError("パスワードが一致していません。");
        setIsLoading(false);
        return;
      }

      const result = await client.insertUserInfo({
        code: code!,
        email: email!,
        password: password!,
      ...(name ? {name} : {})
      });
      if (result !== 200) {
        setError("登録に失敗しました。");
        setIsLoading(false);
        return;
      }
      await login(email, password);
      navigate("/login");
    } catch (err) {
      setError("登録に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}>
        <Card className="w-full max-w-md border-2 dark:border-slate-800 backdrop-blur-sm bg-background/95">
          <CardHeader className="space-y-4 dark:bg-slate-900/50">
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}>
              <div className="rounded-full bg-primary/10 p-3 ring-2 ring-primary/20">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-center font-bold">
              アカウント登録
            </CardTitle>
            <CardDescription className="text-center text-base">
              {isLoading
                ? "招待情報を確認中..."
                : error
                ? "エラーが発生しました"
                : `${user ? `${user?.name}さんの` : ``}登録情報を入力してください`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error ? (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <br></br>
              </>
            ) : (
              <></>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error !== "パスワードが一致していません。" && error !== null ? (
              <></>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={user?.email || ""}
                    placeholder="example@example.com"
                    required
                    disabled={isLoading || (user?.email || "") !== ""}
                  />
                </motion.div>
                {user?.name ? <></> :
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}>
                  <Label htmlFor="email">ユーザー名</Label>
                  <Input
                      id="name"
                      type="text"
                      name="name"
                      defaultValue={""}
                      placeholder="テスト 太郎"
                      required
                      disabled={isLoading}
                  />
                </motion.div>
                }
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}>
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}>
                  <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="password2"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        登録中...
                      </motion.div>
                    ) : (
                      "登録"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center p-6 dark:bg-slate-900/30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}>
              <Button
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => navigate("/login")}>
                すでにアカウントをお持ちの方はこちら
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
