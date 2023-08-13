import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private router: Router) {}
  isNavbarCollapsed: boolean = false;

  goToDetails(fromCurr: string, toCurr: string) {
    this.router.navigate(['/details'], {
      queryParams: {
        fromCurr,
        toCurr,
      },
    });
  }
}
