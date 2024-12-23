import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-auth.component.html',
  styleUrl: './customer-auth.component.css'
})
export class CustomerAuthComponent {
  view: 'login' | 'register' | 'forgot-username' | 'reset-password' = 'login';
  isModalVisible = false;
  modalMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotUsernameForm: FormGroup;
  resetPasswordForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      accountNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      authPin: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      loginPassword: ['', [Validators.required, Validators.minLength(6)]],
      transactionPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.forgotUsernameForm = this.fb.group({
      authPin: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });

    this.resetPasswordForm = this.fb.group({
      authPin: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setView(view: 'login' | 'register' | 'forgot-username' | 'reset-password') {
    this.view = view;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: string) => {
          this.showModal(response);
          localStorage.setItem('username', this.loginForm.value.username); // Store username
          this.router.navigate(['/details']);
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response: string) => {
          this.showModal(response);
          this.setView('login');
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  onForgotUsername() {
    if (this.forgotUsernameForm.valid) {
      this.authService.forgotUsername(this.forgotUsernameForm.value).subscribe(
        (response: string) => {
          this.showModal(response);
          this.setView('login');
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetLoginPassword(this.resetPasswordForm.value).subscribe(
        (response: string) => {
          this.showModal(response);
          this.setView('login');
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status && error.statusText) {
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    this.showModal(errorMessage);
  }

  showModal(message: string) {
    this.modalMessage = message;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}