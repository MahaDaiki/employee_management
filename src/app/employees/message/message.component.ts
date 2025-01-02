import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: false,

  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input()message:string | null = null;
  @Input() messageType: 'success' | 'error' = 'error';

  get messageTypeClass(): string {
    return this.messageType === 'success' ? 'success-message' : 'error-message';
  }
}
