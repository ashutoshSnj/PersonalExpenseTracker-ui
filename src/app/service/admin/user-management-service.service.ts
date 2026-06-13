import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../../model/admin/user-dto';
import { UpdateUserRequest } from '../../model/admin/update-user-request';

@Injectable({
  providedIn: 'root'
})
export class UserManagementServiceService {

  private readonly baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseUrl);
  }


  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
  }

 
  updateUser(id: number, request: UpdateUserRequest): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/${id}`, request);
  }

  
  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text'
    });
}
getAllRoles(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/roles`);
}
}
