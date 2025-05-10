import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Loader2, AlertCircle, XCircle } from "lucide-react";
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
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const email = (
        e.currentTarget.elements.namedItem("email") as HTMLInputElement
      ).value;
      const password = (
        e.currentTarget.elements.namedItem("password") as HTMLInputElement
      ).value;

      try {
        const response = await login(email, password);
        if (response == 200) {
          navigate("/");
        } else {
          throw new Error("メールアドレスまたはパスワードが正しくありません。");
        }
      } catch (error) {
        console.log(error);
        throw new Error("メールアドレスまたはパスワードが正しくありません。");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました。");
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
              借金ダッシュボード
            </CardTitle>
            <CardDescription className="text-center text-base">
              アカウントにログインして借金返済の進捗を管理しましょう
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="relative mb-6">
                  <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/50 rounded-lg p-4 pr-12">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm text-destructive">
                        <p className="font-semibold mb-1">ログインエラー</p>
                        <p>{error}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="absolute top-4 right-4 text-destructive/70 hover:text-destructive transition-colors">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  placeholder="example@example.com"
                  required
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:ring-2 ${
                    error ? "border-destructive" : "focus:ring-primary"
                  }`}
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}>
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:ring-2 ${
                    error ? "border-destructive" : "focus:ring-primary"
                  }`}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-[1.02]"
                  disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      ログイン中...
                    </motion.div>
                  ) : (
                    "ログイン"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-6 dark:bg-slate-900/30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}>
              <Button
                variant="link"
                onClick={() => navigate("/register")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors">
                アカウントをお持ちでない方はこちら
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
