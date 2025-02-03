'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const transactions = [
  {
    id: 1,
    date: new Date(2024, 2, 15),
    description: '給与',
    amount: 320000,
    type: 'income',
  },
  {
    id: 2,
    date: new Date(2024, 2, 15),
    description: '家賃',
    amount: 85000,
    type: 'expense',
  },
  {
    id: 3,
    date: new Date(2024, 2, 14),
    description: '食費',
    amount: 12000,
    type: 'expense',
  },
  {
    id: 4,
    date: new Date(2024, 2, 13),
    description: '副業収入',
    amount: 50000,
    type: 'income',
  },
  {
    id: 5,
    date: new Date(2024, 2, 13),
    description: '光熱費',
    amount: 15000,
    type: 'expense',
  },
  {
    id: 6,
    date: new Date(2023, 11, 25),
    description: 'ボーナス',
    amount: 500000,
    type: 'income',
  },
  {
    id: 7,
    date: new Date(2023, 11, 20),
    description: '年末調整',
    amount: 80000,
    type: 'income',
  },
];

type YearlyTransactions = {
  [key: string]: typeof transactions;
};

function AddTransactionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          取引を追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規取引の追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">日付</Label>
            <Input type="date" id="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">種類</Label>
            <Select>
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
            <Input id="description" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">金額</Label>
            <Input type="number" id="amount" />
          </div>
          <Button className="w-full">追加</Button>
        </div>
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
  transaction: (typeof transactions)[0];
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>取引を削除</AlertDialogTitle>
          <AlertDialogDescription>
            以下の取引を削除してもよろしいですか？
            <br />
            {format(transaction.date, 'yyyy年MM月dd日', { locale: ja })}の
            {transaction.description}（¥{transaction.amount.toLocaleString()}）
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TransactionHistory() {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [transactionList, setTransactionList] = useState(transactions);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    transaction: (typeof transactions)[0] | null;
  }>({
    isOpen: false,
    transaction: null,
  });

  const yearlyTransactions = transactionList.reduce<YearlyTransactions>(
    (acc, transaction) => {
      const year = transaction.date.getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(transaction);
      return acc;
    },
    {}
  );

  const years = Object.keys(yearlyTransactions).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );
  const currentYearTransactions = yearlyTransactions[selectedYear] || [];

  const handleDeleteClick = (transaction: (typeof transactions)[0]) => {
    setDeleteDialog({
      isOpen: true,
      transaction,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.transaction) {
      setTransactionList((prev) =>
        prev.filter((t) => t.id !== deleteDialog.transaction!.id)
      );
      setDeleteDialog({ isOpen: false, transaction: null });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
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
              <AddTransactionDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
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
              {currentYearTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(transaction.date, 'MM月dd日 (E)', { locale: ja })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === 'income' ? 'default' : 'secondary'
                      }
                      className={
                        transaction.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      }
                    >
                      {transaction.type === 'income' ? '収入' : '支出'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-emerald-500'
                          : 'text-red-500'
                      }
                    >
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
                          onClick={() => handleDeleteClick(transaction)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
