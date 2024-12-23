import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountService } from '../../services/create-account.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private createAccountService: CreateAccountService) {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], this.emailValidator.bind(this)],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')], this.mobileNumberValidator.bind(this)],
      residentialAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      aadharCard: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')], this.aadharCardValidator.bind(this)],
      accountType: ['', Validators.required],
      aadharPdf: [null, Validators.required],
      passportPhoto: [null, Validators.required]
    });
  }

  emailValidator(control: any) {
    return new Promise(resolve => {
      this.createAccountService.checkEmail(control.value).subscribe(
        (isTaken: boolean) => {
          resolve(isTaken ? { emailTaken: true } : null);
        },
        () => {
          resolve(null);
        }
      );
    });
  }

  mobileNumberValidator(control: any) {
    return new Promise(resolve => {
      this.createAccountService.checkMobileNumber(control.value).subscribe(
        (isTaken: boolean) => {
          resolve(isTaken ? { mobileNumberTaken: true } : null);
        },
        () => {
          resolve(null);
        }
      );
    });
  }

  aadharCardValidator(control: any) {
    return new Promise(resolve => {
      this.createAccountService.checkAadharCard(control.value).subscribe(
        (isTaken: boolean) => {
          resolve(isTaken ? { aadharCardTaken: true } : null);
        },
        () => {
          resolve(null);
        }
      );
    });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'aadharPdf') {
      this.createAccountForm.patchValue({ aadharPdf: file });
    } else if (fileType === 'passportPhoto') {
      this.createAccountForm.patchValue({ passportPhoto: file });
    }
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const formData = new FormData();
      formData.append('userProfile', JSON.stringify(this.createAccountForm.value));
      formData.append('accountType', this.createAccountForm.value.accountType);
      formData.append('aadharPdf', this.createAccountForm.value.aadharPdf);
      formData.append('passportPhoto', this.createAccountForm.value.passportPhoto);

      this.createAccountService.createAccountRequest(formData)
        .subscribe({
          next: response => {
            console.log('Account created successfully', response);
            this.successMessage = response;
            this.errorMessage = '';
          },
          error: error => {
            console.error('Error creating account', error);
            this.errorMessage = 'There was an error creating the account. Please try again.';
            this.successMessage = '';
          }
        });
    }
  }
}