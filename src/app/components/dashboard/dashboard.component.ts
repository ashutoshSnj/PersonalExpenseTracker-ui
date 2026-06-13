import { Component} from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { AnalyticsService } from '../../service/analytics/analytics.service';
import { SummaryAnalytics } from '../../model/analytics/summary-analytics';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { CategoryAnalytics } from '../../model/analytics/category-analytics';

import { ChartModule } from 'primeng/chart';
import { AdminSummaryAnalytics } from '../../model/analytics/admin-summary-analytics';
import { SmartinsightsComponent } from '../smartinsights/smartinsights.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,CommonModule,ChartModule,SmartinsightsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
roles:string[]=[];

isAdmin: boolean=false;
isUser:boolean =false;

summary:SummaryAnalytics={
  totalExpense:0,
  balance:0,totalIncome:0,transactionCount:0
};

categoryData:CategoryAnalytics []=[];

pieData: any;
pieOptions: any;

lineData: any;
lineOptions: any;
monthOrder = [
 'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];

barData: any;
barOptions: any;

dailyLineData: any;
dailyLineOptions: any;

constructor(private analyticsService:AnalyticsService){}

ngOnInit(){
   this.checkRole();
  this.setPieOptions();
  this.setLineOptions();
  this.getDailyAnalytics()
   if(this.isAdmin){
    this.loadAdminDashboard();
  }
  else{
    this.getSummary();
    this.getCategoryAnalytics();
    this.getMonthlyAnalytics();
  }

 
}

checkRole(){
   const storedRoles=localStorage.getItem('expense_tracker_roles');
  if(storedRoles){
    const roles:string[]=JSON.parse(storedRoles);
    if(roles.includes('ROLE_ADMIN')){
      this.isAdmin=true;
    }
    else{
      this.isUser=true;
    }
}
}

getSummary(){
 this.analyticsService.getSummary().subscribe({
  next:(res)=>{
    this.summary=res;
  }
});

}

  getCategoryAnalytics(){

  this.analyticsService.getCategoryAnalytics()
  .subscribe(res => {

    const labels = res.map(x => x.categoryName);
    const values = res.map(x => x.totalAmount);

 
    this.pieData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#ff6b6b',
            '#ff9f43',
            '#feca57',
            '#1dd1a1',
            '#54a0ff',
            '#5f27cd'
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 20
        }
      ]
    };

    const colors = values.map(v => {
      if (v >= 5000) return '#ff4d4f';   
      if (v >= 2000) return '#ffa940';   
      return '#52c41a';                  
    });

    
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Expense Amount',
          data: values,
          backgroundColor: colors,
          borderRadius: 6
        }
      ]
    };

    this.barOptions = {
      indexAxis: 'y',   
      plugins: {
        legend: {
   
          display:false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Category'
          }
        }
      }
    };

  });

}

getMonthlyAnalytics(){

  this.analyticsService.getMonthlyAnalytics()
  .subscribe(res => {

    const months = this.monthOrder;

    const incomeValues = months.map(m => res.income[m] ?? 0);
    const expenseValues = months.map(m => res.expense[m] ?? 0);

    this.lineData = {

      labels: months,

      datasets: [

{
  label:'Income',
  data: incomeValues,
  borderColor:'#00C896',
  backgroundColor:'rgba(0,200,150,0.15)',
  fill:true,
  borderWidth:3
},

{
  label:'Expense',
  data: expenseValues,
  borderColor:'#FF5A6E',
  backgroundColor:'rgba(255,90,110,0.15)',
  fill:true,
  borderWidth:3
}

      ]

    };

  });

}
 

setPieOptions(){
  this.pieOptions = {
    plugins:{
      legend:{
        position:'bottom',
        labels:{
          padding:20,
          boxWidth:15
        }
      }
    }
  };
}
/*setLineOptions(){
  this.lineOptions = {
    maintainAspectRatio:false,
    plugins:{
      legend:{
        position:'bottom'
      }
    }
  };
}*/
setLineOptions(){

  this.lineOptions = {

    maintainAspectRatio:false,

    plugins:{

      legend:{
        display:false
      },

      tooltip:{
        enabled:true,
        backgroundColor:'#111827',
        titleColor:'#ffffff',
        bodyColor:'#ffffff',
        padding:12,
        cornerRadius:8,
        callbacks:{
          label:(context:any)=>{
            let label = context.dataset.label || '';
            if(label){
              label += ': ';
            }
            label += '₹' + context.parsed.y;
            return label;
          }
        }
      }

    },

    elements:{
      line:{
        tension:0.45
      },
      point:{
        radius:4,
        hoverRadius:7
      }
    },

    scales:{
      x:{
        grid:{
          display:false
        }
      },
      y:{
        beginAtZero:true,
        grid:{
          color:'rgba(0,0,0,0.05)'
        }
      }
    }

  };

}
currentStartDate: Date = new Date();
daysToShow = 7;
getDailyAnalytics(){

  this.analyticsService.getDailyAnalytics()
  .subscribe(res => {

    const incomeMap = res.income || {};
    const expenseMap = res.expense || {};

    const start = new Date(this.currentStartDate);

    const labels: string[] = [];
    const incomeValues: number[] = [];
    const expenseValues: number[] = [];

    for(let i = 6; i >= 0; i--){

      const d = new Date(start);
      d.setDate(start.getDate() - i);

      const key = d.toISOString().split('T')[0];

      const label = d.getDate() + ' ' + d.toLocaleString('default',{month:'short'});

      labels.push(label);

      incomeValues.push(incomeMap[key] ?? 0);
      expenseValues.push(expenseMap[key] ?? 0);
    }

    this.dailyLineData = {
      labels: labels,
      datasets: [
        {
          label:'Income',
          data: incomeValues,
          borderColor:'#00C896',
          backgroundColor:'rgba(0,200,150,0.15)',
          fill:true,
          tension:0.45,
          borderWidth:3
        },
        {
          label:'Expense',
          data: expenseValues,
          borderColor:'#FF5A6E',
          backgroundColor:'rgba(255,90,110,0.15)',
          fill:true,
          tension:0.45,
          borderWidth:3
        }
      ]
    };

  });
}
showMonthly: boolean = false;

toggleMonthlyView(){

  this.showMonthly = !this.showMonthly;

  if(this.showMonthly){
    this.getMonthlyAnalytics();
  }else{
    this.getDailyAnalytics();
  }

}



previous7Days(){
  this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
  this.getDailyAnalytics();
}
next7Days(){
  this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
  this.getDailyAnalytics();
}
exportDashboardReport(){

let csvContent = "";

csvContent += "===== SUMMARY =====\n";
csvContent += "Total Income," + this.summary.totalIncome + "\n";
csvContent += "Total Expense," + this.summary.totalExpense + "\n";
csvContent += "Balance," + this.summary.balance + "\n";
csvContent += "Transactions," + this.summary.transactionCount + "\n\n";


csvContent += "===== DAILY ANALYTICS =====\n";
csvContent += "Date,Income,Expense\n";

if(this.dailyLineData){

this.dailyLineData.labels.forEach((label:any,index:number)=>{

const income = this.dailyLineData.datasets[0].data[index];
const expense = this.dailyLineData.datasets[1].data[index];

csvContent += `${label},${income},${expense}\n`;

});

}

csvContent += "\n";


csvContent += "===== CATEGORY ANALYTICS =====\n";
csvContent += "Category,Amount\n";

if(this.pieData){

this.pieData.labels.forEach((label:any,index:number)=>{

const value = this.pieData.datasets[0].data[index];

csvContent += `${label},${value}\n`;

});

}

csvContent += "\n";


csvContent += "===== MONTHLY ANALYTICS =====\n";
csvContent += "Month,Income,Expense\n";

if(this.lineData){

this.lineData.labels.forEach((month:any,index:number)=>{

const income = this.lineData.datasets[0].data[index];
const expense = this.lineData.datasets[1].data[index];

csvContent += `${month},${income},${expense}\n`;

});

}


const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

const link = document.createElement("a");

const url = URL.createObjectURL(blob);

link.setAttribute("href", url);

link.setAttribute("download", "dashboard_report.csv");

link.style.visibility = "hidden";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

}

adminSummary: AdminSummaryAnalytics = {
  totalUsers: 0,
  totalCategories: 0,
  totalIncome: 0,
  totalExpense: 0,
  totalTransactions: 0
};

adminPieData: any;
adminBarData: any;
adminLineData: any;



loadAdminDashboard(){
  this.getAdminSummary();
  this.getAdminCategoryAnalytics();
  this.getAdminMonthlyAnalytics();
}



getAdminSummary(){

  this.analyticsService.getAdminSummary()
  .subscribe((res: AdminSummaryAnalytics) => {

    this.adminSummary = res;

  });

}

getAdminCategoryAnalytics(){

  this.analyticsService.getAdminCategoryAnalytics()
  .subscribe(res => {

    const labels = res.map(x => x.categoryName);
    const values = res.map(x => x.totalAmount);

  this.adminPieData = {
  labels: labels,
  datasets: [{
    data: values,
    backgroundColor: [
      '#ff6b6b',
      '#ff9f43',
      '#feca57',
      '#1dd1a1',
      '#54a0ff',
      '#5f27cd'
    ],
    borderWidth:3,
    borderColor:'#ffffff',
    hoverOffset:20
  }]
};

    const colors = values.map(v => {
  if (v >= 5000) return '#ff4d4f';
  if (v >= 2000) return '#ffa940';
  return '#52c41a';
});

this.adminBarData = {
  labels: labels,
  datasets:[{
    label:'Expense Amount',
    data: values,
    backgroundColor: colors,
    borderRadius:6
  }]
};
this.barOptions = {
  indexAxis: 'y',
  plugins:{
    legend:{
      display:false
    }
  },
  scales:{
    x:{
      beginAtZero:true
    }
  }
};

  });

}
getAdminMonthlyAnalytics(){

  this.analyticsService.getAdminMonthlyAnalytics()
  .subscribe(res => {

    const months = this.monthOrder;

    const incomeValues = months.map(m => res.income[m] ?? 0);
    const expenseValues = months.map(m => res.expense[m] ?? 0);

    this.adminLineData = {

      labels: months,

      datasets: [

{
  label:'Income',
  data: incomeValues,
  borderColor:'#00C896',
  backgroundColor:'rgba(0,200,150,0.15)',
  fill:true,
  borderWidth:3
},

{
  label:'Expense',
  data: expenseValues,
  borderColor:'#FF5A6E',
  backgroundColor:'rgba(255,90,110,0.15)',
  fill:true,
  borderWidth:3
}

      ]

    };

  });

}


}






