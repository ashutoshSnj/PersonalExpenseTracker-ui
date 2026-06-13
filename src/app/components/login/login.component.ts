import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../model/auth/login-request';
import { ToastModule } from 'primeng/toast';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, FloatLabelModule,CardModule, InputTextModule,
  PasswordModule,
  ButtonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
        
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router:Router
  ) {}

 
onSubmit() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const request: LoginRequest =this.loginForm.value as LoginRequest;

  this.authService.login(request).subscribe({
    next: (res) => {
      debugger
     

  localStorage.setItem('expense_tracker_token', res.token);

   localStorage.setItem(
    'expense_tracker_roles',
    JSON.stringify(res.roles)
  );

 
  const user = {
    id: res.id,
    username: res.username
  };


  localStorage.setItem(
    'expense_tracker_user',
    JSON.stringify(user)
  );
    

if (res.roles.includes('ROLE_ADMIN')) {
    this.router.navigate(['/admin/dashboard']);
  } else {
    this.router.navigate(['/dashboard']);
  }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Hi ${request.username}, Login successful.`
      });
    }
  });
}
}
