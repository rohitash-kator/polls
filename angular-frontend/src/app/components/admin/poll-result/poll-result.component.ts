import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartData, PollQuestionResult, PollResult } from '../../../data-types';

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
    private readonly apiService: ApiService
  ) {
    this.pollId = this.activatedRoute.snapshot.paramMap.get('pollId');
    if (this.pollId) {
      this.apiService.getPollResult(this.pollId).subscribe({
        next: (response: any) => {
          console.log(
            'Poll Result Fetched Successfully. Response: ',
            response?.result
          );

          const result = response?.result;
          this.pollResult.set(response.result);
          this.submissions = result.totalSubmissions;
          this.processResultToPieChart();
        },
        error: (error) => {
          console.error('Error while fetching poll result: ', error);
        },
      });
    }
  }

  processResultToPieChart(): void {
    console.log('From ProcessResultToPieChart', this.pollResult());
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

    console.log('this.chartData', this.chartData);
  }
}
