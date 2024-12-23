import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRequestDTO } from '../models/userdetails';

 
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8085/admin';
 
  constructor(private http: HttpClient) {}
 
  login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `username=${username}&password=${password}`;
    return this.http.post<string>(`${this.baseUrl}/login`, body, { headers, responseType: 'text' as 'json' });
  }
 
  getPendingAccountRequests(username: string, password: string): Observable<AccountRequestDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const params = `username=${username}&password=${password}`;
    return this.http.get<AccountRequestDTO[]>(`${this.baseUrl}/account-requests?${params}`);
  }
 
  approveAccount(accountNo: string, username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const params = `username=${username}&password=${password}`;
    return this.http.put<string>(`${this.baseUrl}/account-requests/approve/${accountNo}?${params}`, null, { headers, responseType: 'text' as 'json' });
  }
 
  rejectAccount(accountNo: string, username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const params = `username=${username}&password=${password}`;
    return this.http.put<string>(`${this.baseUrl}/account-requests/reject/${accountNo}?${params}`, null, { headers, responseType: 'text' as 'json' });
  }
 
  lockAccount(accountNo: string, username: string, password: string): Observable<string> { // Add this method
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const params = `username=${username}&password=${password}`;
    return this.http.put<string>(`${this.baseUrl}/account-requests/lock/${accountNo}?${params}`, null, { headers, responseType: 'text' as 'json' });
  }
 
  depositMoney(accountNo: string, amount: number, username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `accountNo=${accountNo}&amount=${amount}&username=${username}&password=${password}`;
    return this.http.post<string>(`${this.baseUrl}/accounts/deposit`, body, { headers, responseType: 'text' as 'json' });
  }
 
  withdrawMoney(accountNo: string, amount: number, username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `accountNo=${accountNo}&amount=${amount}&username=${username}&password=${password}`;
    return this.http.post<string>(`${this.baseUrl}/accounts/withdraw`, body, { headers, responseType: 'text' as 'json' });
  }
}