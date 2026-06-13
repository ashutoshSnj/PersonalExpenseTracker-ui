import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../model/auth/register-request.model';
import { RegisterResponse } from '../../model/auth/register-response.model';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../model/auth/login-request';
import { LoginResponce } from '../../model/auth/login-responce';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}/register`,
      data
    );
  }
    login(request: LoginRequest): Observable<LoginResponce> {
    return this.http.post<LoginResponce>(
      `${this.baseUrl}/login`,
      request
    );
}
}
