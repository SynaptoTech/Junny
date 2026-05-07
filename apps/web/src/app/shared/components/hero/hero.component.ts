import { Component, signal } from '@angular/core';
import { BRAND } from '../../../core/constants/brand.constants';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  readonly brand = BRAND;
  readonly previewBody = signal(`{
  "status": "ok",
  "service": "junny",
  "version": "0.1.0"
}`);
}
