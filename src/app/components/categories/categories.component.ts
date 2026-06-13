import { Component } from '@angular/core';
import { CategoryRequest } from '../../model/admin/category-request';
import { CategoryResponse } from '../../model/admin/category-response';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryServiceService } from '../../service/admin/category-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  constructor(
    private categoryService: CategoryServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  categories: CategoryResponse[] = [];
  isEditMode = false;
  selectedId: number = 0;

  
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.pattern(/^[A-Za-z]+$/)])
  });


  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  
  onSubmit() {

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const data: CategoryRequest = this.categoryForm.value;

    this.categoryService.createCategory(data).subscribe({

      next: (res) => {
        this.categories.unshift(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category added successfully'
        });

        this.categoryForm.reset();
      },

      error: (err) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add category'
        });
      }

    });
  }

  onEdit(cat: CategoryResponse) {
    this.isEditMode = true;
    this.selectedId = cat.id;

    this.categoryForm.patchValue({
      name: cat.name
    });
  }


  updateCategory() {

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const data: CategoryRequest = this.categoryForm.value;

    this.categoryService.updateCategory(this.selectedId, data).subscribe({

      next: (res) => {

        const index = this.categories.findIndex(c => c.id === this.selectedId);
        if (index !== -1) {
          this.categories[index] = res;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Category updated successfully'
        });

        this.categoryForm.reset();
        this.isEditMode = false;
        this.selectedId = 0;
      },

      error: (err) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update category'
        });
      }

    });
  }

  confirmDelete(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category? All related expenses will also be permanently deleted.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteCategory(id);
      }
    });

  }

  deleteCategory(id: number) {

    this.categoryService.deleteCategory(id).subscribe({

      next: () => {

        this.categories = this.categories.filter(c => c.id !== id);

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Category deleted successfully'
        });

      },

      error: (err) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete category'
        });
      }

    });
  }
}
