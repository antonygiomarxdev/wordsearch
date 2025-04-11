import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">
        Selecciona un tema
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          *ngFor="let topic of safeTopics(); let i = index"
          class="px-4 py-2 rounded-lg font-semibold shadow-md border bg-white text-gray-800 hover:bg-blue-100"
          (click)="onTopicSelect(topic)"
        >
          {{ topic }}
        </button>
      </div>
    </div>
  `,
})
export class TopicSelectorComponent {
  topics = input<string[]>([]);
  safeTopics = computed(() => this.topics() || []);

  topicSelect = output<string>();

  onTopicSelect(topic: string): void {
    this.topicSelect.emit(topic);
  }
}
