import { Component, Input } from '@angular/core';
import { HistoryItem } from '../../../shared/components/sidebar-management/sidebar-management.component';
export interface ConversationMessage {
  text: string;
  isUser: boolean;
  timestamp: string;
}
@Component({
  selector: 'app-conversation-history',
  standalone: false,
  templateUrl: './conversation-history.component.html',
  styleUrl: './conversation-history.component.scss'
})
export class ConversationHistoryComponent {
 @Input() conversationData!: HistoryItem;
}
