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
    if (toCurr === 'USD') {
      this.router.navigate(['/details/eur-usd'], {
        queryParams: {
          fromCurr,
          toCurr,
        },
      });
    } else {
      this.router.navigate(['/details/eur-gbp'], {
        queryParams: {
          fromCurr,
          toCurr,
        },
      });
    }
  }
}
