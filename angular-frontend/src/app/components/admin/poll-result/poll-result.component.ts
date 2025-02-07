import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  NgApexchartsModule,
} from 'ng-apexcharts';

interface ChartData {
  question: string;
  options: string[];
  responses: number;
  chartOptions: ChartOptions;
}

interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
}

interface PollResult {
  pollId: string; // Unique identifier for the poll result
  title: string;
  totalSubmissions: number;
  result: PollQuestionResult[];
}

interface PollQuestionResult {
  question: string;
  options: PollOptionResult[];
  totalSubmissions: number;
}

interface PollOptionResult {
  option: string;
  count: number;
}

const POLL_RESULT: PollResult = {
  pollId: '6799d5064c63bf5ea190f3c2',
  title: 'Lifestyle Preferences',
  totalSubmissions: 50,
  result: [
    {
      question: 'How often do you exercise?',
      options: [
        { option: 'Every day', count: 10 },
        { option: 'A few times a week', count: 15 },
        { option: 'Once a week', count: 8 },
        { option: 'Rarely', count: 12 },
        { option: 'Never', count: 5 },
      ],
      totalSubmissions: 50,
    },
    {
      question: 'What is your favorite type of cuisine?',
      options: [
        { option: 'Italian', count: 8 },
        { option: 'Chinese', count: 12 },
        { option: 'Mexican', count: 10 },
        { option: 'Indian', count: 5 },
        { option: 'American', count: 8 },
        { option: 'Mediterranean', count: 7 },
      ],
      totalSubmissions: 50,
    },
    {
      question: 'Which season do you enjoy the most?',
      options: [
        { option: 'Spring', count: 10 },
        { option: 'Summer', count: 20 },
        { option: 'Fall', count: 12 },
        { option: 'Winter', count: 8 },
      ],
      totalSubmissions: 50,
    },
    {
      question: 'How do you prefer to spend your weekends?',
      options: [
        { option: 'Relaxing at home', count: 12 },
        { option: 'Going out with friends', count: 10 },
        { option: 'Outdoor activities', count: 8 },
        { option: 'Working on personal projects', count: 10 },
        { option: 'Traveling', count: 10 },
      ],
      totalSubmissions: 50,
    },
    {
      question: 'Which of the following best describes your sleep habits?',
      options: [
        { option: 'I sleep 8 or more hours every night', count: 15 },
        { option: 'I sleep 6-7 hours a night', count: 20 },
        { option: 'I sleep 4-5 hours a night', count: 10 },
        { option: 'I rarely get enough sleep', count: 5 },
      ],
      totalSubmissions: 50,
    },
  ],
};

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
export class PollResultComponent implements OnInit {
  pollResult = signal<PollResult | undefined>(undefined);
  chartData: ChartData[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pollResult.set(POLL_RESULT);
    this.processResultToPieChart();
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
