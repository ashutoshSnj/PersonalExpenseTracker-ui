import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncomeService } from '../../service/user/income.service';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IncomeRequest } from '../../model/user/income-request';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast, ToastModule } from "primeng/toast";
import { ExportService } from '../../service/export/export.service';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule, CardModule, CommonModule, TableModule, ButtonModule, InputTextModule, DropdownModule, ToastModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {

  incomes: any[] = [];
  isEditMode = false;
  selectedId = 0;

  totalIncome = 0;
  monthlyIncome = 0;
  incomeSources = 0;


  constructor(private incomeService :IncomeService,  private messageService: MessageService,private exportService: ExportService,
  private confirmationService: ConfirmationService){}
  incomeForm = new FormGroup({
    source: new FormControl('', Validators.required),
    amount: new FormControl(0, [
      Validators.required,
      Validators.min(1)
    ]),
    date: new FormControl('')
  });


  ngOnInit() {
    this.loadIncomes();
 const todayDate = new Date().toISOString().split('T')[0];

  this.incomeForm.patchValue({
    date: todayDate
  });
}

  loadIncomes() {
    this.incomeService.getAll().subscribe(data => {
      this.incomes = data;
      this.calculateSummary();
    });
  }

  calculateSummary() {
    this.totalIncome = this.incomes
      .reduce((sum, inc) => sum + inc.amount, 0);

    const currentMonth = new Date().getMonth();

    this.monthlyIncome = this.incomes
      .filter(inc => new Date(inc.date).getMonth() === currentMonth)
      .reduce((sum, inc) => sum + inc.amount, 0);

    this.incomeSources =
      new Set(this.incomes.map(i => i.source)).size;
  }

createIncome() {

  if (this.incomeForm.invalid) {
    this.incomeForm.markAllAsTouched();
    return;
  }

  const data = this.incomeForm.value as IncomeRequest;

  this.incomeService.create(data).subscribe({

    next: (res) => {
      this.incomes.unshift(res);
    
      this.calculateSummary();
       this.incomeForm.reset({
    date: new Date().toISOString().split('T')[0]
  });

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Income added successfully'
      });
    },

    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add income'
      });
    }

  });
}

onEdit(income: any) {

  this.isEditMode = true;
  this.selectedId = income.id;

  this.incomeForm.patchValue({
    source: income.source,
    amount: income.amount,
    date: income.date
  });

}
updateIncome() {

  if (this.incomeForm.invalid) {
    this.incomeForm.markAllAsTouched();
    return;
  }

  const data = this.incomeForm.value as IncomeRequest;

  this.incomeService.update(this.selectedId, data).subscribe({

    next: (res) => {

      const index = this.incomes.findIndex(i => i.id === this.selectedId);

      if (index !== -1) {
        this.incomes[index] = res;
      }

      this.isEditMode = false;
      this.selectedId = 0;
       this.incomeForm.reset({
    date: new Date().toISOString().split('T')[0]
  });
      this.calculateSummary();

      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Income updated successfully'
      });
    },

    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update income'
      });
    }

  });
}

confirmDelete(id: number) {

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this income?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptButtonStyleClass: 'p-button-danger',

    accept: () => {
      this.deleteIncome(id);
    }
  });

}

deleteIncome(id: number) {

  this.incomeService.delete(id).subscribe({

    next: () => {

      this.incomes = this.incomes.filter(i => i.id !== id);
      this.calculateSummary();

      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Income deleted successfully'
      });
    },

    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete income'
      });
    }

  });

}

getTotalIncomeClass() {
  if (this.totalIncome === 0) return 'danger-card';
  if (this.totalIncome < 10000) return 'warning-card';
  return 'success-card';
}

getMonthlyIncomeClass() {
  if (this.monthlyIncome === 0) return 'danger-card';
  if (this.monthlyIncome < 5000) return 'warning-card';
  return 'primary-card';
}

getSourcesClass() {
  if (this.incomeSources <= 1) return 'danger-card';
  if (this.incomeSources <= 3) return 'warning-card';
  return 'info-card';
}
  exportIncomes(){
  this.exportService.exportToCSV(this.incomes,'incomes');
}
}
