import { Component } from '@angular/core';
import { BRAND } from '../../core/constants/brand.constants';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly brand = BRAND;
}
