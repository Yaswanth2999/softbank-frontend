import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserDetailsDTO, TransactionSummaryDTO, NEFTTransactionDTO, UPITransactionDTO } from '../models/userdetails';
 
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 
  private userApiUrl = 'http://localhost:8088/dashboard';
 
  private transactionApiUrl = 'http://localhost:8087'; // Different microservice URL
 
  constructor(private http: HttpClient) {}
 
  getUserDetails(username: string): Observable<UserDetailsDTO> {
    return this.http.get<UserDetailsDTO>(`${this.userApiUrl}/user-details?username=${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }
 
  getTransactionHistoryCustom(accountNo: string, upiId: string, startDate: string, endDate: string): Observable<TransactionSummaryDTO[]> {
    return this.http.get<TransactionSummaryDTO[]>(`${this.userApiUrl}/transaction-history/custom?accountNo=${accountNo}&upiId=${upiId}&startDate=${startDate}&endDate=${endDate}`);
  }
 
  performNeftTransaction(transaction: NEFTTransactionDTO): Observable<string> {
    return this.http.post<string>(`${this.transactionApiUrl}/transactions/neft`, transaction, { responseType: 'text' as 'json' });
  }
 
  performUpiTransaction(transaction: UPITransactionDTO): Observable<string> {
    return this.http.post<string>(`${this.transactionApiUrl}/transactions/upi`, transaction, { responseType: 'text' as 'json' });
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}