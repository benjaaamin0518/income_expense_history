import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  CalendarIcon,
  MoreHorizontal,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

type Transaction = {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
};

const defaultTransactions: Transaction[] = [
  {
    id: 1,
    date: new Date(2024, 2, 15),
    description: "給与",
    amount: 320000,
    type: "income",
  },
  {
    id: 2,
    date: new Date(2024, 2, 15),
    description: "家賃",
    amount: 85000,
    type: "expense",
  },
  // ... 他の取引データ
];

function AddTransactionDialog({
  onAdd,
}: {
  onAdd: (transaction: Omit<Transaction, "id">) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 送信処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onAdd({
        date,
        type,
        description,
        amount: Number(amount),
      });

      // フォームをリセット
      setDate(new Date());
      setType("expense");
      setDescription("");
      setAmount("");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          取引を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規取引の追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">日付</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ja })
                  ) : (
                    <span>日付を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">種類</Label>
            <Select
              value={type}
              onValueChange={(value: "income" | "expense") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="種類を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">収入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">説明</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="取引の説明を入力"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">金額</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-10"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}>
                    ⚬
                  </motion.div>
                  追加中...
                </motion.div>
              ) : (
                "追加"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTransactionDialog({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>取引を削除</AlertDialogTitle>
          <AlertDialogDescription>
            以下の取引を削除してもよろしいですか？
            <br />
            {format(transaction.date, "yyyy年MM月dd日", { locale: ja })}の
            {transaction.description}（¥{transaction.amount.toLocaleString()}）
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600">
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TransactionHistory() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    transaction: Transaction | null;
  }>({
    isOpen: false,
    transaction: null,
  });

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setDeleteDialog({
      isOpen: true,
      transaction,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.transaction) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== deleteDialog.transaction!.id)
      );
      setDeleteDialog({ isOpen: false, transaction: null });
    }
  };

  const years = Array.from(
    new Set(transactions.map((t) => t.date.getFullYear().toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const currentYearTransactions = transactions.filter(
    (t) => t.date.getFullYear().toString() === selectedYear
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}>
      <Card className="overflow-hidden border-2 dark:border-slate-800">
        <CardHeader className="dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <CardTitle>取引履歴</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="年を選択" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddTransactionDialog onAdd={handleAddTransaction} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>日付</TableHead>
                  <TableHead>説明</TableHead>
                  <TableHead>種類</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {currentYearTransactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {format(transaction.date, "MM月dd日 (E)", {
                          locale: ja,
                        })}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            transaction.type === "income"
                              ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          }>
                          {transaction.type === "income" ? "収入" : "支出"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-emerald-500"
                              : "text-red-500"
                          }>
                          ¥{transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteClick(transaction)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {deleteDialog.transaction && (
        <DeleteTransactionDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, transaction: null })}
          onConfirm={handleDeleteConfirm}
          transaction={deleteDialog.transaction}
        />
      )}
    </motion.div>
  );
}
