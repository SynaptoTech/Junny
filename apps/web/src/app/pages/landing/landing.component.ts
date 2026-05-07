import { Component } from '@angular/core';
import { PROTOCOL_ITEMS } from '../../core/constants/protocols.data';
import { FooterComponent } from '../../layout/footer/footer.component';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { ProtocolCardComponent } from '../../shared/components/protocol-card/protocol-card.component';
import { SectionComponent } from '../../shared/components/section/section.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    SectionComponent,
    ProtocolCardComponent,
    FooterComponent,
  ],
  templateUrl: './landing.component.html',
})
export class LandingPageComponent {
  readonly protocols = PROTOCOL_ITEMS;
}
