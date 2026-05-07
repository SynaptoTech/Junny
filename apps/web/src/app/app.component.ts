import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly name = signal('junny');
  readonly slogan = signal('Open Integration Studio');
  readonly description = signal(
    'Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.',
  );
  readonly year = signal(new Date().getFullYear());
  readonly previewBody = signal(`{
  "status": "ok",
  "service": "junny",
  "version": "0.1.0"
}`);
}
