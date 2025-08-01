import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent {
  isTyping = false;
  messages: Array<{ text: string; isUser: boolean }> = [];
  currentMessage: string = '';
  sendMessage() {
    this.isTyping = true;
    if (this.currentMessage.trim()) {
      this.messages.push({
        text: this.currentMessage,
        isUser: true,
      });

      setTimeout(() => {
        this.isTyping = false;
        this.messages.push({
          text: 'Câu trả lời từ AI',
          isUser: false,
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
  clearChat() {
    this.messages = [];
  }
}
