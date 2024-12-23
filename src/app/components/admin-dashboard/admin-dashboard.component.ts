import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountRequestDTO } from '../../models/userdetails';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  accountRequests: AccountRequestDTO[] = [];
  message: string = '';
  accountNo: string = '';
  amount: number = 0;
  username: string = 'admin';
  password: string = 'admin';
  pdfUrl: SafeResourceUrl | null = null;
  pdfBlobUrl: string | null = null;
  pdfVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { username: string; password: string };
    if (state) {
      this.username = state.username;
      this.password = state.password;
    }
  }

  ngOnInit(): void {
    this.fetchAccountRequests();
  }

  fetchAccountRequests() {
    this.adminService.getPendingAccountRequests(this.username, this.password).subscribe(
      response => {
        this.accountRequests = response;
        console.log(this.accountRequests);
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
      }
    );
  }

  approveAccount(accountNo: string) {
    this.adminService.approveAccount(accountNo, this.username, this.password).subscribe(
      response => {
        this.message = 'Accepted';
        this.snackBar.open('Account approved successfully', 'Close', { duration: 3000 });
        this.updateAccountStatus(accountNo, 'Accepted');
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
        this.snackBar.open('Account approval failed', 'Close', { duration: 3000 });
      }
    );
  }

  rejectAccount(accountNo: string) {
    this.adminService.rejectAccount(accountNo, this.username, this.password).subscribe(
      response => {
        this.message = 'Rejected';
        this.snackBar.open('Account rejected successfully', 'Close', { duration: 3000 });
        this.updateAccountStatus(accountNo, 'Rejected');
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
        this.snackBar.open('Account rejection failed', 'Close', { duration: 3000 });
      }
    );
  }

  depositMoney(accountNo: string, amount: number) {
    this.adminService.depositMoney(accountNo, amount, this.username, this.password).subscribe(
      response => {
        this.message = response;
        this.snackBar.open('Deposit successful', 'Close', { duration: 3000 });
      },
      error => {
        console.error(error);
        this.snackBar.open('Deposit failed', 'Close', { duration: 3000 });
      }
    );
  }

  withdrawMoney(accountNo: string, amount: number) {
    this.adminService.withdrawMoney(accountNo, amount, this.username, this.password).subscribe(
      response => {
        this.message = response;
        this.snackBar.open('Withdrawal successful', 'Close', { duration: 3000 });
      },
      error => {
        console.error(error);
        this.snackBar.open('Withdrawal failed', 'Close', { duration: 3000 });
      }
    );
  }

  private updateAccountStatus(accountNo: string, status: string) {
    const account = this.accountRequests.find(req => req.accountNo === accountNo);
    if (account) {
      account.status = status;
    }
  }

  isPdfField(fieldName: unknown): boolean {
    const pdfFields = ['aadharPdf', 'passportPhoto'];
    return typeof fieldName === 'string' && pdfFields.includes(fieldName);
  }

  showPdf(fieldName: unknown) {
    if (typeof fieldName === 'string') {
      const accountRequest = this.accountRequests.find(req => req[fieldName as keyof AccountRequestDTO]);
      if (accountRequest) {
        const base64 = accountRequest[fieldName as keyof AccountRequestDTO] as string;
        console.log('Base64 string:', base64);
        if (this.isValidBase64(base64)) {
          const blobUrl = this.convertBase64ToBlobUrl(base64);
          console.log('Blob URL:', blobUrl);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.pdfBlobUrl = blobUrl;
          this.pdfVisible = true;
        } else {
          console.error('Invalid base64 string for field:', fieldName);
        }
      }
    }
  }

  hidePdf() {
    this.pdfVisible = false;
  }

  private convertBase64ToBlobUrl(base64: string): string {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error converting base64 to Blob URL:', error, 'Base64:', base64);
      return '';
    }
  }

  private isValidBase64(base64: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Regex.test(base64);
  }

  getPdfUrl(base64: string): string {
    const blobUrl = this.convertBase64ToBlobUrl(base64);
    return this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl) as string;
  }

  getImageUrl(base64: string): string {
    return `data:image/jpeg;base64,${base64}`;
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}