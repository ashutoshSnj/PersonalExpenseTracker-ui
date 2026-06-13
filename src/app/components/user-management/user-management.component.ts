import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { UserDto } from '../../model/admin/user-dto';
import { UpdateUserRequest } from '../../model/admin/update-user-request';
import { UserManagementServiceService } from '../../service/admin/user-management-service.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportService } from '../../service/export/export.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    CardModule,MultiSelectModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  constructor(
    private userService: UserManagementServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exportService: ExportService
  ) {}
 
  users: UserDto[] = [];
  selectedUser!: UserDto;

  viewDialog = false;
  isEditMode = false;
  selectedId: number = 0;
  userForm: FormGroup = new FormGroup({
    id: new FormControl(null,  [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    roles: new FormControl(null, Validators.required)
  });

  roleOptions :any[]=[];

  searchId: string = '';

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data.sort((a,b)=>a.id-b.id),
    });
  }


  viewUser(user: UserDto) {
    this.selectedUser = user;
    this.viewDialog = true;
  }

  searchUser() {

    if (!this.searchId) return;

    const id = Number(this.searchId);
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.selectedUser = data;
        this.viewDialog = true;   
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Not Found',
          detail: 'User not found'
        });
      }
    });
  }

 
  loadUserIntoForm(data: UserDto) {
    this.selectedId = data.id;
    this.isEditMode = true;

    this.userForm.patchValue({
      id: data.id,
      email: data.email,
      roles: data.roles[0],
    });
     this.userForm.get('id')?.disable();
  }

  
  onEdit(user: UserDto) {
    this.loadUserIntoForm(user);
  }

  loadUserForEdit() {

    const id = this.userForm.value.id;

    if (!id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Enter User ID'
      });
      return;
    }

    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.loadUserIntoForm(data);
      },
    });
  }

  updateUser() {

    if (this.userForm.invalid) return;

    const data: UpdateUserRequest = {
      email: this.userForm.value.email,
      roles: [this.userForm.value.roles]
    };

    this.userService.updateUser(this.selectedId, data).subscribe({
      next: (res) => {

        const index = this.users.findIndex(u => u.id === this.selectedId);
        if (index !== -1) {
          this.users[index] = res;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'User updated successfully'
        });

        this.userForm.reset();
        this.userForm.get('id')?.enable();
        this.isEditMode = false;
        this.selectedId = 0;
      },
    });
  }

  confirmDelete(id: number) {

    this.confirmationService.confirm({
      message: 'Deleting this user will permanently remove all associated expenses and incomes. This action cannot be undone. Do you want to continue?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteUser(id)
    });

  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted successfully'
        });

      }
    });

  }

  loadRoles() {
  this.userService.getAllRoles().subscribe({
    next: (roles: string[]) => {
      this.roleOptions = roles.map(role => ({
        label: role,
        value: role
      }));
    }
  });
}

exportUsers(){

  const exportData = this.users.map(user => ({
    ID: user.id,
    Username: user.username,
    Email: user.email,
    Roles: user.roles.join(', ')
  }));

  this.exportService.exportToCSV(exportData,'users');
}
}