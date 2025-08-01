import { Component } from '@angular/core';

@Component({
  selector: 'app-mail',
  standalone: false,
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss'
})
export class MailComponent {
messages: Array<{ text: string, isUser: boolean }> = [];
  currentMessage: string = '';
  showInitialGuide: boolean = true;

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.messages.push({
        text: this.currentMessage,
        isUser: true
      });

      if (this.showInitialGuide) {
        this.showInitialGuide = false;
      }
      setTimeout(() => {
        this.messages.push({
          text: 'Câu trả lời từ AI',
          isUser: false
        });
      }, 1000);

      this.currentMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
