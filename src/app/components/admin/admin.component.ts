import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AccountRequestDTO } from '../../models/userdetails';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  loginForm: FormGroup;
  accountRequests: AccountRequestDTO[] = [];
  loginFailed: boolean = false;
  loginSuccess: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.adminService.login(username, password).subscribe(
        response => {
          this.loginSuccess = true;
          this.loginFailed = false;
          this.message = response;
          this.router.navigate(['/admin-dashboard'], { state: { username, password } });
        },
        error => {
          this.loginFailed = true;
          this.loginSuccess = false;
          this.message = 'Login failed. Please check your credentials.';
        }
      );
    }
  }
}