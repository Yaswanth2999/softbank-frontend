
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountService } from '../../services/create-account.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-account',
  standalone: true,
  imports:[CommonModule,FormsModule,RouterLink],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  userProfile: any = {};
  accountType: string = '';
  aadharPdf: File | null = null;
  passportPhoto: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private createAccountService: CreateAccountService) {}

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'aadharPdf') {
      this.aadharPdf = file;
    } else if (fileType === 'passportPhoto') {
      this.passportPhoto = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('userProfile', JSON.stringify(this.userProfile));
    formData.append('accountType', this.accountType);
    if (this.aadharPdf) {
      formData.append('aadharPdf', this.aadharPdf);
    }
    if (this.passportPhoto) {
      formData.append('passportPhoto', this.passportPhoto);
    }

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
