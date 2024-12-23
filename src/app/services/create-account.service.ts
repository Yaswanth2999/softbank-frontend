import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  private baseUrl = 'http://localhost:8086/registration';

  constructor(private http: HttpClient) {}

  createAccountRequest(formData: FormData): Observable<string> {
    return this.http.post(`${this.baseUrl}/create-account`, formData, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-email`, { params: { email } })
      .pipe(
        catchError(this.handleError)
      );
  }

  checkMobileNumber(mobileNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-mobile-number`, { params: { mobileNumber } })
      .pipe(
        catchError(this.handleError)
      );
  }

  checkAadharCard(aadharCard: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-aadhar-card`, { params: { aadharCard } })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}