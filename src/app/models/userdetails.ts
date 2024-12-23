export interface UserDetailsDTO {
  username: string;
  accountNo: string;
  upiId: string;
  balance: number;
}

export interface TransactionSummaryDTO {
  id: number;
  fromAccount: string;
  toAccount: string;
  fromUpiId: string;
  toUpiId: string;
  displayFrom:string;
  displayTo:string;
  amount: number;
  transactionType: string;
  remarks: string;
  transactionDate: string;
  balanceAfterTransaction: number;
}

export interface NEFTTransactionDTO {
  fromAccount: string;
  toAccount: string;
  amount: number;
  transactionType: string;
  remarks: string;
  transactionDate: string;
  fromAccountBalanceAfterTransaction: number;
  toAccountBalanceAfterTransaction: number;
  transactionPassword: string;
}

export interface UPITransactionDTO {
  fromUpiId: string;
  toUpiId: string;
  amount: number;
  transactionType: string;
  remarks: string;
  transactionDate: string;
  fromAccountBalanceAfterTransaction: number;
  toAccountBalanceAfterTransaction: number;
  transactionPassword: string;
}

export interface AccountRequestDTO {
  id: number;
  accountNo: string;
  accountType: string;
  status: string;
  createdAt: string; // Using string to represent LocalDateTime
  approvedAt: string; // Using string to represent LocalDateTime
  aadharPdf: string; // Using Uint8Array to represent byte[]
  passportPhoto: string; // Using Uint8Array to represent byte[]
}