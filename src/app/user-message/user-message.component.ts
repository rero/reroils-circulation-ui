import { Component, Input } from '@angular/core';

@Component({
  selector: 'reroils-circulation-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent {
  @Input() message: string;

}
