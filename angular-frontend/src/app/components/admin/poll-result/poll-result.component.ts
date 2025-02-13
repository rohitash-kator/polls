import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartData, PollQuestionResult, PollResult } from '../../../data-types';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-poll-result',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.css'],
})
export class PollResultComponent {
  pollResult = signal<PollResult | undefined>(undefined);
  chartData: ChartData[] = [];
  pollId: string | null;
  submissions: number = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.pollId = this.activatedRoute.snapshot.paramMap.get('pollId');
    if (this.pollId) {
      this.apiService.getPollResult(this.pollId).subscribe({
        next: (response: any) => {
          

          const result = response?.result;

          if (result) {
            // Set the poll result in the component
            this.pollResult.set(result);
            this.submissions = result.totalSubmissions;
            // Process and display the result on a pie chart
            this.processResultToPieChart();

            // Display success notification
            this.notification.openSnackBar({
              message: 'Poll results fetched successfully.',
              type: 'success',
            });
          } else {
            // Handle case when there are no results returned
            this.notification.openSnackBar({
              message: 'No results available for this poll.',
              type: 'error',
            });
          }
        },
        error: (error) => {
          console.error('Error while fetching poll result: ', error);

          // Handle different types of errors
          if (error.status === 404) {
            // Poll not found or no results available
            this.notification.openSnackBar({
              message: 'Poll not found or no results available.',
              type: 'error',
            });
          } else if (error.status === 500) {
            // Server error
            this.notification.openSnackBar({
              message:
                'An error occurred while fetching poll results. Please try again later.',
              type: 'error',
            });
          } else {
            // Other unexpected errors
            this.notification.openSnackBar({
              message: 'An unexpected error occurred. Please try again.',
              type: 'error',
            });
          }
        },
      });
    }
  }

  processResultToPieChart(): void {
    this.pollResult()?.result.forEach((question: PollQuestionResult) => {
      const options: string[] = [];
      const labels: string[] = [];
      const submissions: number[] = [];

      question.options.forEach((option, index) => {
        options.push(option.option);
        labels.push(`Option ${index + 1}`);
        submissions.push(option.count);
      });

      const data: ChartData = {
        question: question.question,
        responses: question.totalSubmissions,
        options: options,
        chartOptions: {
          series: submissions,
          labels: labels,
          chart: {
            width: 400,
            type: 'pie',
          },
          responsive: [
            {
              breakpoint: 50,
              options: {
                chart: {
                  width: 30,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      };

      this.chartData.push(data);
    });

  }
}
