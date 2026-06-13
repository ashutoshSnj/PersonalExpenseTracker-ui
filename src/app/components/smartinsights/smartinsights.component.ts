import { Component } from '@angular/core';
import { AnalyticsService } from '../../service/analytics/analytics.service';
import { SuggestionDto } from '../../model/analytics/suggestion-dto';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-smartinsights',
  standalone: true,
  imports: [CommonModule,CardModule],
  templateUrl: './smartinsights.component.html',
  styleUrl: './smartinsights.component.css'
})
export class SmartinsightsComponent {
  suggestions: SuggestionDto[] = [];

  isAdmin: boolean = false;
  isUser: boolean = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(){
    this.checkRole();

    if(this.isUser){
      this.loadUserSuggestions();
    }

    if(this.isAdmin){
      this.loadAdminSuggestions();
    }
  }

  checkRole(){
    const storedRoles = localStorage.getItem('expense_tracker_roles');

    if(storedRoles){

      const roles: string[] = JSON.parse(storedRoles);

      if(roles.includes('ROLE_ADMIN')){
        this.isAdmin = true;
      }
      else {
        this.isUser = true;
      }
    }
  }

  loadUserSuggestions(){
    this.analyticsService.getSuggestions()
      .subscribe((res:SuggestionDto[])=> {
        debugger

        this.suggestions = res;
      });
  }

  loadAdminSuggestions(){
    this.analyticsService.getSystemSuggestions()
      .subscribe((res:SuggestionDto[]) => {
        this.suggestions = res;
      });
  }


}
