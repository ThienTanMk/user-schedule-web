import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AiResponse } from '../models/ai-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/ai-agent';
  constructor(private http: HttpClient, private zone: NgZone) {}

  getServerSentEvent(keycloakId: string): Observable<string> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(
        `${this.apiUrl}/sse/connect/${keycloakId}`
      );

      // Lắng nghe sự kiện tên "ai-message"
      eventSource.addEventListener('ai-message', (event: MessageEvent) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      });

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.error('SSE error:', error);
          eventSource.close();
          observer.error(error);
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }
  askChatbot(message: string, keycloakId: string): void {
    this.http
      .post(
        `${this.apiUrl}/conversation/ask?keycloakId=${keycloakId}`,
        { aiMessage: message },
        { responseType: 'text' }
      )
      .subscribe();
  }
  getHistory(keycloakId: string): Observable<ApiResponse<AiResponse[]>> {
    return this.http.get<ApiResponse<AiResponse[]>>(
      `${this.apiUrl}/conversation/history?keycloakId=${keycloakId}`
    );
  }
  clearHistory(keycloakId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/conversation/${keycloakId}`
    );
  }
}
