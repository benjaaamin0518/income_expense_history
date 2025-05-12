import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  CalendarIcon,
  Trash2,
  DollarSign,
  CheckCircle2,
  FilterIcon,
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
import {incomeExpenseHistory, ProcessedType} from "../type/NeonApiInterface";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  getIncomeExpenseHistory,
  getMonthlyReport,
  useDashBoard,
} from "../hooks/useDashBoard";
import { useBorrowedUsers } from "../hooks/useBorrowedUsers";
import { NeonClientApi } from "../common/NeonApiClient";
import { isMobile } from "react-device-detect";
import { useAuth } from "../hooks/useAuth";
const statusLabels:{[key in Exclude<ProcessedType, "done">]: string} = {
    "pending": "未承諾",
    "rejected": "却下",
} as const;
function AddTransactionDialog({
  onAdd,
}: {
  onAdd: (transaction: Omit<incomeExpenseHistory, "id">) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<"0" | "1">("0");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { borrowedUsers } = useBorrowedUsers();
  const { mode } = useDashBoard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedUserId == "") {
        alert("ユーザーを選択してください。");
        return;
      }
      if (date == "") {
        alert("日付を入力してください。");
        return;
      }
      const selectedUser = borrowedUsers.find(
        (u) => u.id.toString() === selectedUserId
      );
      onAdd({
        date,
        type: mode === "lending" ? (type === "0" ? "1" : "0") : type,
        description,
        price: Number(price),
        borrowed_user_id: selectedUserId,
        borrowed_user_name: selectedUser?.name,
      });

      setDate("");
      setType("0");
      setDescription("");
      setPrice("");
      setSelectedUserId("");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setDate("");
        setType("0");
        setDescription("");
        setPrice("");
        setSelectedUserId("");
        setIsOpen(open);
      }}>
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
            <Label htmlFor="borrowedUser">
              {mode === "borrowing" ? "借りたユーザー" : "貸したユーザー"}
            </Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              required>
              <SelectTrigger>
                <SelectValue placeholder="ユーザーを選択" />
              </SelectTrigger>
              <SelectContent>
                {borrowedUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                    {user.status === "pending" && " (未登録)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                    format(new Date(date), "PPP", { locale: ja })
                  ) : (
                    <span>日付を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(date) => date && setDate(date.toISOString())}
                  required
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">種類</Label>
            <Select
              value={type}
              onValueChange={(value: "0" | "1") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="種類を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">
                  {mode === "borrowing" ? "返済" : "貸付"}
                </SelectItem>
                <SelectItem value="1">
                  {mode === "borrowing" ? "借入" : "返済"}
                </SelectItem>
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
  transaction: incomeExpenseHistory;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>取引を削除</AlertDialogTitle>
          <AlertDialogDescription>
            以下の取引を削除してもよろしいですか？
            <br />
            {format(new Date(transaction.date), "yyyy年MM月dd日", {
              locale: ja,
            })}
            の{transaction.description}（¥{transaction.price.toLocaleString()}）
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
function ApprovalTransactionDialog({
 isOpen,
 onClose,
 onConfirm,
 transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: incomeExpenseHistory;
}) {
  return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>取引を承認</AlertDialogTitle>
            <AlertDialogDescription>
              以下の取引を承認してもよろしいですか？
              <br />
              {format(new Date(transaction.date), "yyyy年MM月dd日", {
                locale: ja,
              })}
              の{transaction.description}（¥{transaction.price.toLocaleString()}）
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
                onClick={onConfirm}
                className="bg-blue-500 hover:bg-blue-600">
              承認
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
function RejectedTransactionDialog({
 isOpen,
 onClose,
 onConfirm,
 transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: incomeExpenseHistory;
}) {
  return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>取引を却下</AlertDialogTitle>
            <AlertDialogDescription>
              以下の取引を却下してもよろしいですか？
              <br />
              {format(new Date(transaction.date), "yyyy年MM月dd日", {
                locale: ja,
              })}
              の{transaction.description}（¥{transaction.price.toLocaleString()}）
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
                onClick={onConfirm}
                className="bg-white hover:bg-white">
              却下
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
function RependingTransactionDialog({
 isOpen,
 onClose,
 onConfirm,
 transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: incomeExpenseHistory;
}) {
  return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>取引を再申請</AlertDialogTitle>
            <AlertDialogDescription>
              以下の取引を再申請してもよろしいですか？
              <br />
              {format(new Date(transaction.date), "yyyy年MM月dd日", {
                locale: ja,
              })}
              の{transaction.description}（¥{transaction.price.toLocaleString()}）
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
                onClick={onConfirm}
                className="bg-white hover:bg-white">
              再申請
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<incomeExpenseHistory[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    transaction: incomeExpenseHistory | null;
  }>({
    isOpen: false,
    transaction: null,
  });
  const [approvalDialog, setApprovalDialog] = useState<{
    isOpen: boolean;
    transaction: incomeExpenseHistory | null;
  }>({
    isOpen: false,
    transaction: null,
  });
  const [rejectedDialog, setRejectedDialog] = useState<{
    isOpen: boolean;
    transaction: incomeExpenseHistory | null;
  }>({
    isOpen: false,
    transaction: null,
  });
  const [rependingDialog, setRependingDialog] = useState<{
    isOpen: boolean;
    transaction: incomeExpenseHistory | null;
  }>({
    isOpen: false,
    transaction: null,
  });

  const {
    mode,
    setIncomeExpenseHistory,
    setMonthlyReport,
    incomeExpenseHistory,
    monthlyReport,
    setIsLoading,
  } = useDashBoard();
  const {borrowedUserId} = useAuth();

  const { selectedUserId } = useBorrowedUsers();

  useEffect(() => {
    if (incomeExpenseHistory) {
      const filteredTransactions =
        selectedUserId === "all"
          ? incomeExpenseHistory.filter((t) => {
              const transactionYear = new Date(t.date).getFullYear().toString();
              return transactionYear === selectedYear;
            })
          : incomeExpenseHistory.filter((t) => {
              const transactionYear = new Date(t.date).getFullYear().toString();
              return (
                t.borrowed_user_id === selectedUserId &&
                transactionYear === selectedYear
              );
            });
      setTransactions(filteredTransactions);
    }
  }, [selectedUserId, incomeExpenseHistory, selectedYear]);

  const handleAddTransaction = async (
    newTransaction: Omit<incomeExpenseHistory, "id">
  ) => {
    const client = new NeonClientApi();
    const statusCode = await client.insertIncomeExpenseHistory({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
      ...newTransaction,
      mode,
    });
    if (transactions && statusCode === 200) {
      if (selectedUserId) {
        setIsLoading(true);
        const incomeExpenseHistory = await getIncomeExpenseHistory(
          selectedUserId,
          mode
        );
        setIncomeExpenseHistory(incomeExpenseHistory);
        const monthlyReport = await getMonthlyReport(selectedUserId, mode);
        setMonthlyReport(monthlyReport);
        setIsLoading(false);
        return;
      }
    }
  };

  const handleDeleteClick = (transaction: incomeExpenseHistory) => {
    setDeleteDialog({
      isOpen: true,
      transaction,
    });
  };
  const handleApprovalClick = (transaction: incomeExpenseHistory) => {
    setApprovalDialog({
      isOpen: true,
      transaction,
    });
  };
  const handleRejectedClick = (transaction: incomeExpenseHistory) => {
    setRejectedDialog({
      isOpen: true,
      transaction,
    });
  };
  const handleRependingClick = (transaction: incomeExpenseHistory) => {
    setRependingDialog({
      isOpen: true,
      transaction,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.transaction) {
      const client = new NeonClientApi();
      const statusCode = await client.deleteIncomeExpenseHistory({
        userInfo: {
          accessToken:
            localStorage.getItem("income-expense-history-accessToken") || "",
        },
        id: Number(deleteDialog.transaction!.id),
      });
      if (statusCode === 200) {
        if (selectedUserId) {
          setIsLoading(true);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
            selectedUserId,
            mode
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          const monthlyReport = await getMonthlyReport(selectedUserId, mode);
          setMonthlyReport(monthlyReport);
          setDeleteDialog({ isOpen: false, transaction: null });
          setIsLoading(false);
        }
      }
    }
  };
  const handleApprovalConfirm = async () => {
    if (approvalDialog.transaction) {
      const client = new NeonClientApi();
      const statusCode = await client.updateStatusDone({
        userInfo: {
          accessToken:
              localStorage.getItem("income-expense-history-accessToken") || "",
        },
        id: Number(approvalDialog.transaction!.id),
      });
      if (statusCode === 200) {
        if (selectedUserId) {
          setIsLoading(true);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
              selectedUserId,
              mode
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          const monthlyReport = await getMonthlyReport(selectedUserId, mode);
          setMonthlyReport(monthlyReport);
          setApprovalDialog({ isOpen: false, transaction: null });
          setIsLoading(false);
        }
      }
    }
  };
  const handleRejectedConfirm = async () => {
    if (rejectedDialog.transaction) {
      const client = new NeonClientApi();
      const statusCode = await client.updateStatusRejected({
        userInfo: {
          accessToken:
              localStorage.getItem("income-expense-history-accessToken") || "",
        },
        id: Number(rejectedDialog.transaction!.id),
      });
      if (statusCode === 200) {
        if (selectedUserId) {
          setIsLoading(true);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
              selectedUserId,
              mode
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          const monthlyReport = await getMonthlyReport(selectedUserId, mode);
          setMonthlyReport(monthlyReport);
          setRejectedDialog({ isOpen: false, transaction: null });
          setIsLoading(false);
        }
      }
    }
  };
  const handleRependingConfirm = async () => {
    if (rependingDialog.transaction) {
      const client = new NeonClientApi();
      const statusCode = await client.updateStatusPending({
        userInfo: {
          accessToken:
              localStorage.getItem("income-expense-history-accessToken") || "",
        },
        id: Number(rependingDialog.transaction!.id),
      });
      if (statusCode === 200) {
        if (selectedUserId) {
          setIsLoading(true);
          const incomeExpenseHistory = await getIncomeExpenseHistory(
              selectedUserId,
              mode
          );
          setIncomeExpenseHistory(incomeExpenseHistory);
          const monthlyReport = await getMonthlyReport(selectedUserId, mode);
          setMonthlyReport(monthlyReport);
          setRependingDialog({ isOpen: false, transaction: null });
          setIsLoading(false);
        }
      }
    }
  };

  const [years, setYears] = useState<string[]>([]);
  const [currentYearTransactions, setCurrentYearTransactions] = useState<
    incomeExpenseHistory[]
  >([]);

  const [mount, setMount] = useState(0);
  useEffect(() => {
    if (incomeExpenseHistory) {
      setYears(
        Array.from(
          new Set(
            incomeExpenseHistory!.map((t) =>
              new Date(t.date).getFullYear().toString()
            )
          )
        ).sort((a, b) => parseInt(b) - parseInt(a))
      );
      const currentYear = incomeExpenseHistory!.filter(
        (t) => new Date(t.date).getFullYear().toString() === selectedYear
      );
      setCurrentYearTransactions(currentYear);

      if (
        (mount === 0 || currentYear.length === 0) &&
        incomeExpenseHistory.length > 0
      ) {
        setSelectedYear(
          new Date(incomeExpenseHistory[0].date).getFullYear().toString()
        );
      }
      setMount(() => {
        return mount + 1;
      });
      setTransactions(incomeExpenseHistory);
    }
  }, [selectedYear, monthlyReport, incomeExpenseHistory]);
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
                  <TableHead>
                    {mode === "borrowing"
                      ? isMobile
                        ? "借りた..."
                        : "借りたユーザー"
                      : isMobile
                      ? "貸した..."
                      : "貸したユーザー"}
                  </TableHead>
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
                        {format(new Date(transaction.date), "MM月dd日 (E)", {
                          locale: ja,
                        })}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.borrowed_user_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mode === "borrowing"
                              ? transaction.type === "0"
                                ? "default"
                                : "secondary"
                              : transaction.type === "0"
                              ? "default"
                              : "secondary"
                          }
                          className={
                          transaction.status === "done" ?
                            mode === "borrowing"
                              ? transaction.type === "0"
                                ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                                : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              : transaction.type === "0"
                              ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              :"bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
                          }>
                          { mode === "borrowing"
                            ? transaction.type === "0"
                              ? "返済"
                              : "借入"
                            : transaction.type === "0"
                            ? "返済"
                            : "貸付"}
                          {transaction.status === "done" ?"":Object.keys(statusLabels).includes(transaction.status || "") ?"("+statusLabels[transaction.status!]+")":""}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            mode === "borrowing"
                              ? transaction.type === "0"
                                ? "text-emerald-500"
                                : "text-red-500"
                              : transaction.type === "0"
                              ? "text-emerald-500"
                              : "text-red-500"
                          }>
                          ¥{transaction.price.toLocaleString()}
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
                            {transaction.created_by !== borrowedUserId  && transaction.status === "pending" ?
                                <DropdownMenuItem
                                    className="text-blue-500 focus:text-blue-500"
                                    onClick={() => handleApprovalClick(transaction)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  承諾
                                </DropdownMenuItem>:<></>}
                            {transaction.created_by !== borrowedUserId  && transaction.status === "pending" ?
                                <DropdownMenuItem
                                    className="text-white-500 focus:text-white-500"
                                    onClick={() => handleRejectedClick(transaction)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  却下
                                </DropdownMenuItem>:<></>}
                            {transaction.created_by === borrowedUserId  && transaction.status === "rejected" ?
                                <DropdownMenuItem
                                    className="text-white-500 focus:text-white-500"
                                    onClick={() => handleRependingClick(transaction)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  再申請
                                </DropdownMenuItem>:<></>}
                            {transaction.created_by === borrowedUserId ?
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteClick(transaction)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              削除
                            </DropdownMenuItem>:<></>}
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
      {approvalDialog.transaction && (
          <ApprovalTransactionDialog
              isOpen={approvalDialog.isOpen}
              onClose={() => setApprovalDialog({ isOpen: false, transaction: null })}
              onConfirm={handleApprovalConfirm}
              transaction={approvalDialog.transaction}
          />
      )}
      {rejectedDialog.transaction && (
          <RejectedTransactionDialog
              isOpen={rejectedDialog.isOpen}
              onClose={() => setRejectedDialog({ isOpen: false, transaction: null })}
              onConfirm={handleRejectedConfirm}
              transaction={rejectedDialog.transaction}
          />
      )}
      {rependingDialog.transaction && (
          <RependingTransactionDialog
              isOpen={rependingDialog.isOpen}
              onClose={() => setRependingDialog({ isOpen: false, transaction: null })}
              onConfirm={handleRependingConfirm}
              transaction={rependingDialog.transaction}
          />
      )}
    </motion.div>
  );
}
