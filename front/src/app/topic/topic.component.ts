import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Topic } from './topic.model';
import { TopicService } from './topic.service';

@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TopicComponent implements OnInit {
    private readonly topicService = inject(TopicService);
    private readonly destroyRef = inject(DestroyRef);

    readonly topics = signal<Topic[]>([]);
    readonly loading = signal(true);
    readonly errorMessage = signal('');

    ngOnInit(): void {
        this.topicService.getTopics()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: topics => {
                    this.topics.set(topics);
                    this.loading.set(false);
                },
                error: () => {
                    this.errorMessage.set('Les thèmes sont temporairement indisponibles.');
                    this.loading.set(false);
                }
            });
    }

    subscribe(topic: Topic): void {
        this.topicService.subscribe(topic.id).subscribe({
            next: () => this.topics.update(topics => topics.map(item => item.id === topic.id ? { ...item, subscribed: true } : item)),
            error: event => this.errorMessage.set(event.error?.message ?? "L'abonnement a échoué.")
        });
    }
}
