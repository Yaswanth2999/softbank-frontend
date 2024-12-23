import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8084/auth'; // Update with your backend URL
 
  constructor(private http: HttpClient) {}
 
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data, { responseType: 'text' });
  }
 
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
  }
 
  forgotUsername(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-username`, data, { responseType: 'text' });
  }
 
  resetLoginPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-login-password`, data, { responseType: 'text' });
  }
 
 
}

