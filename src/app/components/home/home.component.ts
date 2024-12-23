import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink,CreateAccountComponent,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
