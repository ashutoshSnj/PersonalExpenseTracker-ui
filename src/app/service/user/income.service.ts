import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IncomeResponse } from '../../model/user/income-response';
import { Observable } from 'rxjs';
import { IncomeRequest } from '../../model/user/income-request';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  
  private baseUrl = 'http://localhost:8081/api/incomes';

  constructor(private http: HttpClient) {}

 
  getAll(): Observable<IncomeResponse[]> {
    return this.http.get<IncomeResponse[]>(this.baseUrl);
  }


  getById(id: number): Observable<IncomeResponse> {
    return this.http.get<IncomeResponse>(`${this.baseUrl}/${id}`);
  }


  create(data: IncomeRequest): Observable<IncomeResponse> {
    return this.http.post<IncomeResponse>(this.baseUrl, data);
  }


  update(id: number, data: IncomeRequest): Observable<IncomeResponse> {
    return this.http.put<IncomeResponse>(`${this.baseUrl}/${id}`, data);
  }


  delete(id: number): Observable<string> {
  return this.http.delete(`${this.baseUrl}/${id}`, {
    responseType: 'text'
  });
}
}
