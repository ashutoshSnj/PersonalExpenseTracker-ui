import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseResponce } from '../../model/user/expense-responce';
import { ExpenseRequest } from '../../model/user/expense-request';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
 private baseUrl = 'http://localhost:8081/api/expenses';

  constructor(private http: HttpClient) {}

  
  getAll(): Observable<ExpenseResponce[]> {
    debugger
    return this.http.get<ExpenseResponce[]>(this.baseUrl);
  }

  
  create(expense: ExpenseRequest): Observable<ExpenseResponce> {
    return this.http.post<ExpenseResponce>(this.baseUrl, expense);
  }

  
  update(id: number, expense: ExpenseRequest): Observable<ExpenseResponce> {
    return this.http.put<ExpenseResponce>(`${this.baseUrl}/${id}`, expense);
  }

 
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
