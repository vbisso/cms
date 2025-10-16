import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInputRef!: ElementRef;
  @ViewChild('msgText') msgTextInputRef!: ElementRef;

  currentSender: string = 'Valeria';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subjectValue = this.subjectInputRef.nativeElement.value;
    const msgTextValue = this.msgTextInputRef.nativeElement.value;

    const newMessage = new Message(
      '1',
      subjectValue,
      msgTextValue,
      this.currentSender
    );

    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
