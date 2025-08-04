import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChatbotService } from '../../../core/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent implements OnInit {
  isTyping = false;
  messages: Array<{ text: string; isUser: boolean }> = [];
  currentMessage: string = '';
  constructor(
    private authService: AuthService,
    private chatbotService: ChatbotService
  ) {}
  ngOnInit(): void {
    if (this.authService.getCurrentUser()?.keycloakId) {
      this.chatbotService
        .getServerSentEvent(this.authService.getCurrentUser()?.keycloakId || '')
        .subscribe((data) => {
          console.log(data);
          this.messages.push({
            text: data,
            isUser: false,
          });
          this.isTyping = false;
        });
    }
    this.chatbotService
      .getHistory(this.authService.getCurrentUser()?.keycloakId || '')
      .subscribe((data) => {
        console.log(data);
        this.messages = data.data.map((item) => ({
          text: item.message,
          isUser: item.role === 'USER',
        }));
      });
  }
  sendMessage() {
    this.isTyping = true;
    if (this.currentMessage.trim()) {
      this.chatbotService.askChatbot(
        this.currentMessage,
        this.authService.getCurrentUser()?.keycloakId || ''
      );
      this.messages.push({
        text: this.currentMessage,
        isUser: true,
      });
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
    this.chatbotService
      .clearHistory(this.authService.getCurrentUser()?.keycloakId || '')
      .subscribe((data) => {
        this.messages = [];
      });
  }
}
