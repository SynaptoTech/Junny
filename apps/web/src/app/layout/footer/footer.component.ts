import { Component, signal } from '@angular/core';
import { BRAND } from '../../core/constants/brand.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly brand = BRAND;
  readonly year = signal(new Date().getFullYear());
}
