import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SummaryAnalytics } from '../../model/analytics/summary-analytics';
import { Observable } from 'rxjs';
import { CategoryAnalytics } from '../../model/analytics/category-analytics';
import { MonthlyAnalytics } from '../../model/analytics/monthly-analytics';
import { AdminSummaryAnalytics } from '../../model/analytics/admin-summary-analytics';
import { SuggestionDto } from '../../model/analytics/suggestion-dto';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

   private baseUrl = 'http://localhost:8081/api/analytics';
  

  constructor(private http: HttpClient) {}

  getSummary(): Observable<SummaryAnalytics> {
    return this.http.get<SummaryAnalytics>(`${this.baseUrl}/summary`);
  }

  getCategoryAnalytics(): Observable<CategoryAnalytics[]> {
  return this.http.get<CategoryAnalytics[]>(
    `${this.baseUrl}/category`
  );
}

getMonthlyAnalytics(): Observable<MonthlyAnalytics> {

  return this.http.get<MonthlyAnalytics>(
    `${this.baseUrl}/monthly`
  );

}
getSuggestions(){
  return this.http.get<SuggestionDto[]>(
    this.baseUrl + '/suggestions'
  );
}
getDailyAnalytics(){
  return this.http.get<any>(`${this.baseUrl}/daily`);
}

  getAdminSummary(): Observable<AdminSummaryAnalytics> {
    return this.http.get<AdminSummaryAnalytics>(
      `${this.baseUrl}/admin-summary`
    );
  }


  getAdminCategoryAnalytics(): Observable<CategoryAnalytics[]> {
    return this.http.get<CategoryAnalytics[]>(
      `${this.baseUrl}/admin-category`
    );
  }


  getAdminMonthlyAnalytics(): Observable<MonthlyAnalytics> {
    return this.http.get<MonthlyAnalytics>(
      `${this.baseUrl}/admin-monthly`
    );
  }
 getSystemSuggestions(){
  return this.http.get<SuggestionDto[]>(
    this.baseUrl + '/system-suggestions'
  );
}

}
