import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,ButtonModule,
    AvatarModule,
    RippleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}
isUser(): boolean {
  const roles = JSON.parse(
    localStorage.getItem('expense_tracker_roles') || '[]'
  );
  return roles.includes('ROLE_USER');
}

isAdmin(): boolean {
  const roles = JSON.parse(
    localStorage.getItem('expense_tracker_roles') || '[]'
  );
  return roles.includes('ROLE_ADMIN');
}
  logout() {
  localStorage.removeItem('expense_tracker_token');
  localStorage.removeItem('expense_tracker_user');
  localStorage.removeItem('expense_tracker_roles');
  this.router.navigate(['/']);
}

confirmLogout(){

}

}
