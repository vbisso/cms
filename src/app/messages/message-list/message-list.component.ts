import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'SOS', 'Please answer my emails.', 'Valeria'),
    new Message('2', 'Sky', 'Why has the sky changed color?', 'Sushi'),
    new Message(
      '3',
      'Assignment',
      "Why havent I finished my assignment? I don't have time.",
      'Leo'
    ),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
