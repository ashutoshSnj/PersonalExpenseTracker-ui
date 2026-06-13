import { Component } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../service/user/expense.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { ExpenseRequest } from '../../model/user/expense-request';
import { ExpenseResponce } from '../../model/user/expense-responce';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoryServiceService } from '../../service/admin/category-service.service';
import { CategoryResponse } from '../../model/admin/category-response';
import { ExportService } from '../../service/export/export.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule,SelectModule,CardModule,CommonModule,TableModule,ButtonModule,InputTextModule,DropdownModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  constructor(
    private expenseService: ExpenseService,private messageService:MessageService, private confirmationService: ConfirmationService,private categoryService:CategoryServiceService
    , private exportService:ExportService  ) {}
  category:CategoryResponse[]=[];
  expenses: ExpenseResponce[] = [];
  isEditMode = false;
  selectedId: number = 0;

 expenseForm: FormGroup = new FormGroup({
  categoryName: new FormControl(null, Validators.required),
  amount: new FormControl(null, [
    Validators.required,
    Validators.min(1)
  ]),
  description: new FormControl(''),
  date: new FormControl('')

 })

 
 
 ngOnInit() {
  const today=new Date().toISOString().split('T')[0];
  this.expenseForm.patchValue({
    date:today
  })
  this.expenseService.getAll().subscribe({
    
    next: (data: ExpenseResponce[]) => {
      this.expenses = data;
    },
   
  });
 this.categoryService.getAllCategories().subscribe((res)=>{
     this.category=res;
 })

}

 onSubmit() {

  if (this.expenseForm.invalid) {
    this.expenseForm.markAllAsTouched();
    return;
  }

  const data: ExpenseRequest = this.expenseForm.value;

  this.expenseService.create(data).subscribe({

    next: (res) => {
 this.expenses.unshift(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Expense added successfully'
      });
       
       this.expenseForm.reset({
    date: new Date().toISOString().split('T')[0]
  });
    },

    error: (err) => {

      console.error(err);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add expense'
      });
    }

  });

}


onEdit(exp: ExpenseResponce) {
  this.isEditMode = true;
  this.selectedId = exp.id;
  this.expenseForm.patchValue({
    categoryName: exp.categoryName,
    amount: exp.amount,
    description: exp.description,
    date: exp.date
  });

 
}

   updateExpense() {

  if (this.expenseForm.invalid) {
    this.expenseForm.markAllAsTouched();
    return;
  }
  const data: ExpenseRequest = this.expenseForm.value;

  this.expenseService.update(this.selectedId, data).subscribe({

    next: (res) => {
      const index = this.expenses.findIndex(e => e.id === this.selectedId);
      if (index !== -1) {
        this.expenses[index] = res;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Expense updated successfully'
      });

    
      this.isEditMode = false;
      this.selectedId = 0;
      this.expenseForm.reset({
  date: new Date().toISOString().split('T')[0]
});
    },

    error: (err) => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update expense'
        
      });
    }

  });

}


confirmDelete(id: number) {

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this expense?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.deleteExpense(id);
    }
  });

}


deleteExpense(id: number) {

  this.expenseService.delete(id).subscribe({

    next: () => {

      this.expenses = this.expenses.filter(e => e.id !== id);

      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Expense deleted successfully'
      });

    },

    error: (err) => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete expense'
      });
    }

  });

}
    exportExpenses(){
      this.exportService.exportToCSV(this.expenses,'expenses');
    }
}
