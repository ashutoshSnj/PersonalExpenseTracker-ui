import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, FormGroup, FormControl } from '@angular/forms';


import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [  CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule, ToastModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
   registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[ Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/)])
  });

  constructor(private authService:AuthService,private messageService: MessageService,private router:Router){}
  
  onSubmit(){
    if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const request = this.registerForm.value;

  this.authService.register(request).subscribe({
     next: (res) => {

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
      detail: `Hi ${request.username}, your account has been successfully created.`
      });
      this.registerForm.reset();
      this.router.navigate(['/login']);
    },
    error: (err) => {

  const errorMessage = err?.error?.message || 'Registration failed';

  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: errorMessage
  }); 
}
  }) }

  goToLogin() {
  this.router.navigate(['/login']);
}
}

