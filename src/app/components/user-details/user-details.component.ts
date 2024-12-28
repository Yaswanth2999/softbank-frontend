import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsDTO, NEFTTransactionDTO, UPITransactionDTO, TransactionSummaryDTO } from '../../models/userdetails';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
 
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit,OnDestroy {
  userDetails: UserDetailsDTO = {
    username: '',
    accountNo: '',
    upiId: '',
    balance: 0
  };

  isModalVisible = false;
  modalMessage = '';
  paymentSuccessMessage = '';
  transactions: TransactionSummaryDTO[] = [];
  dateRange = { startDate: '', endDate: '' };
  selectedSection: string = 'home';
  transactionSuccessMessage: string = '';
  transaction: Partial<NEFTTransactionDTO & UPITransactionDTO> = {
    fromAccount: '',
    toAccount: '',
    fromUpiId: '',
    toUpiId: '',
    amount: 0,
    transactionType: '',
    remarks: '',
    transactionDate: '',
    fromAccountBalanceAfterTransaction: 0,
    toAccountBalanceAfterTransaction: 0,
    transactionPassword: '',
  };
  timer: string | undefined;
  timeout: any;
  showTransactions = false;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  fetchUserDetails(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const username = localStorage.getItem('username'); // Retrieve stored username
      if (username) {
        this.dashboardService.getUserDetails(username).subscribe(
          userDetails => {
            this.userDetails = userDetails;
            this.transaction.fromAccount = userDetails.accountNo;
            this.transaction.fromUpiId = userDetails.upiId;
          },
          error => {
            console.error('Error fetching user details:', error);
          }
        );
      }
    }
  }

  fetchTransactionHistory(): void {
    if (this.dateRange.startDate && this.dateRange.endDate) {
      const formattedStartDate = new Date(this.dateRange.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(this.dateRange.endDate).toISOString().split('T')[0];
  
      this.dashboardService.getTransactionHistoryCustom(this.userDetails.accountNo, this.userDetails.upiId, formattedStartDate, formattedEndDate).subscribe(
        transactions => {
          this.transactions = transactions.map(transaction => {
            let balanceAfterTransaction;
            let amount = transaction.amount;
            let debitCredit = '';
  
            if (transaction.transactionType === 'UPI') {
              if (transaction.fromUpiId === this.userDetails.upiId) {
                balanceAfterTransaction = transaction.fromAccountBalanceAfterTransaction;
                amount = -amount; // Debit
                debitCredit = 'Debit';
              } else if (transaction.toUpiId === this.userDetails.upiId) {
                balanceAfterTransaction = transaction.toAccountBalanceAfterTransaction;
                amount = +amount; // Credit
                debitCredit = 'Credit';
              }
            } else {
              if (transaction.fromAccount === this.userDetails.accountNo) {
                balanceAfterTransaction = transaction.fromAccountBalanceAfterTransaction;
                amount = -amount; // Debit
                debitCredit = 'Debit';
              } else if (transaction.toAccount === this.userDetails.accountNo) {
                balanceAfterTransaction = transaction.toAccountBalanceAfterTransaction;
                amount = +amount; // Credit
                debitCredit = 'Credit';
              }
            }
  
            return {
              ...transaction,
              displayFrom: transaction.transactionType === 'UPI' ? transaction.fromUpiId : transaction.fromAccount,
              displayTo: transaction.transactionType === 'UPI' ? transaction.toUpiId : transaction.toAccount,
              balanceAfterTransaction,
              amount,
              debitCredit
            };
          });
          this.showTransactions = true; // Show the table and button
        },
        error => {
          console.error('Error fetching transaction history:', error);
        }
      );
    }
  }

  sendNeft(): void {
    const neftTransaction: NEFTTransactionDTO = {
      fromAccount: this.transaction.fromAccount!,
      toAccount: this.transaction.toAccount!,
      amount: this.transaction.amount!,
      transactionType: 'NEFT',
      remarks: this.transaction.remarks!,
      transactionDate: '',
      fromAccountBalanceAfterTransaction: 0,
      toAccountBalanceAfterTransaction: 0,
      transactionPassword: this.transaction.transactionPassword!
    };
  
    this.dashboardService.performNeftTransaction(neftTransaction).subscribe(
      response => {
        console.log(response);
        this.transactionSuccessMessage = response;
        this.showPaymentSuccessModal(response);
        this.fetchUserDetails(); // Reload current balance
      },
      error => {
        console.error('Error performing NEFT transaction:', error);
        this.transactionSuccessMessage = 'NEFT Transaction failed';
      }
    );
  }

  sendUpi(): void {
    const upiTransaction: UPITransactionDTO = {
      fromUpiId: this.transaction.fromUpiId!,
      toUpiId: this.transaction.toUpiId!,
      amount: this.transaction.amount!,
      transactionType: 'UPI',
      remarks: this.transaction.remarks!,
      transactionDate: '',
      fromAccountBalanceAfterTransaction: 0,
      toAccountBalanceAfterTransaction: 0,
      transactionPassword: this.transaction.transactionPassword!
    };
  
    this.dashboardService.performUpiTransaction(upiTransaction).subscribe(
      response => {
        console.log(response);
        this.transactionSuccessMessage = response;
        this.showPaymentSuccessModal(response);
        this.fetchUserDetails(); // Reload current balance
      },
      error => {
        console.error('Error performing UPI transaction:', error);
        this.transactionSuccessMessage = 'UPI Transaction failed';
      }
    );
  }

  showSection(section: string): void {
    this.selectedSection = section;
  }

  logout(): void {
    this.modalMessage = 'You have logged out successfully.';
    this.showModal();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  startTimer(): void {
    let timeLeft = 5 * 60; // 5 minutes in seconds
    this.updateTimer(timeLeft);

    this.timeout = setInterval(() => {
      timeLeft--;
      this.updateTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(this.timeout);
        this.modalMessage = 'Time Out! You have been logged out.';
        this.showModal();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    }, 1000);
  }

  updateTimer(timeLeft: number): void {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    this.timer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  showModal(): void {
    this.isModalVisible = true;
    setTimeout(() => {
      this.isModalVisible = false;
    }, 2000);
  }

  showPaymentSuccessModal(message: string): void {
    this.paymentSuccessMessage = message;
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  clearForm(): void {
    this.transaction = {
      fromAccount: this.userDetails.accountNo,
      toAccount: '',
      fromUpiId: this.userDetails.upiId,
      toUpiId: '',
      amount: 0,
      transactionType: '',
      remarks: '',
      transactionDate: '',
      fromAccountBalanceAfterTransaction: 0,
      toAccountBalanceAfterTransaction: 0,
      transactionPassword: '',
    };
  }

  printPDF(): void {
    const data = document.getElementById('transactionTable');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('TransactionHistory.pdf');
      }).catch(error => {
        console.error('Error generating PDF:', error);
      });
    } else {
      console.error('Element with ID "transactionTable" not found.');
    }
  }
}