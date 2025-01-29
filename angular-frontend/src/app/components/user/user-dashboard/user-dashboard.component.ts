import { Component, OnInit } from '@angular/core';
import { type Poll } from '../../../data-types';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  polls: Poll[] = [];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.polls = [
      {
        _id: '6799d5064c63bf5ea190f3c2',
        title: 'Lifestyle Preferences',
        totalSubmissions: 0,
        questions: [
          {
            _id: '6799d5064c63bf5ea190f3c3',
            question: 'How often do you exercise?',
            isRequired: true,
            options: [
              {
                _id: '6799d5064c63bf5ea190f3c4',
                option: 'Every day',
                createdAt: '2025-01-29T07:13:10.831Z',
                updatedAt: '2025-01-29T07:13:10.831Z',
                __v: 0,
              },
              {
                _id: '6799d5064c63bf5ea190f3c7',
                option: 'A few times a week',
                createdAt: '2025-01-29T07:13:10.924Z',
                updatedAt: '2025-01-29T07:13:10.924Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3ca',
                option: 'Once a week',
                createdAt: '2025-01-29T07:13:11.010Z',
                updatedAt: '2025-01-29T07:13:11.010Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3cd',
                option: 'Rarely',
                createdAt: '2025-01-29T07:13:11.101Z',
                updatedAt: '2025-01-29T07:13:11.101Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3d0',
                option: 'Never',
                createdAt: '2025-01-29T07:13:11.187Z',
                updatedAt: '2025-01-29T07:13:11.187Z',
                __v: 0,
              },
            ],
            createdAt: '2025-01-29T07:13:11.274Z',
            updatedAt: '2025-01-29T07:13:11.274Z',
            __v: 0,
          },
          {
            _id: '6799d5074c63bf5ea190f3d5',
            question: 'What is your favorite type of cuisine?',
            isRequired: true,
            options: [
              {
                _id: '6799d5074c63bf5ea190f3d6',
                option: 'Italian',
                createdAt: '2025-01-29T07:13:11.369Z',
                updatedAt: '2025-01-29T07:13:11.369Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3d9',
                option: 'Chinese',
                createdAt: '2025-01-29T07:13:11.456Z',
                updatedAt: '2025-01-29T07:13:11.456Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3dc',
                option: 'Mexican',
                createdAt: '2025-01-29T07:13:11.564Z',
                updatedAt: '2025-01-29T07:13:11.564Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3df',
                option: 'Indian',
                createdAt: '2025-01-29T07:13:11.650Z',
                updatedAt: '2025-01-29T07:13:11.650Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3e2',
                option: 'American',
                createdAt: '2025-01-29T07:13:11.735Z',
                updatedAt: '2025-01-29T07:13:11.735Z',
                __v: 0,
              },
              {
                _id: '6799d5074c63bf5ea190f3e5',
                option: 'Mediterranean',
                createdAt: '2025-01-29T07:13:11.822Z',
                updatedAt: '2025-01-29T07:13:11.822Z',
                __v: 0,
              },
            ],
            createdAt: '2025-01-29T07:13:11.921Z',
            updatedAt: '2025-01-29T07:13:11.921Z',
            __v: 0,
          },
          {
            _id: '6799d5084c63bf5ea190f3ea',
            question: 'Which season do you enjoy the most?',
            isRequired: true,
            options: [
              {
                _id: '6799d5084c63bf5ea190f3eb',
                option: 'Spring',
                createdAt: '2025-01-29T07:13:12.008Z',
                updatedAt: '2025-01-29T07:13:12.008Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f3ee',
                option: 'Summer',
                createdAt: '2025-01-29T07:13:12.097Z',
                updatedAt: '2025-01-29T07:13:12.097Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f3f1',
                option: 'Fall',
                createdAt: '2025-01-29T07:13:12.177Z',
                updatedAt: '2025-01-29T07:13:12.177Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f3f4',
                option: 'Winter',
                createdAt: '2025-01-29T07:13:12.263Z',
                updatedAt: '2025-01-29T07:13:12.263Z',
                __v: 0,
              },
            ],
            createdAt: '2025-01-29T07:13:12.344Z',
            updatedAt: '2025-01-29T07:13:12.344Z',
            __v: 0,
          },
          {
            _id: '6799d5084c63bf5ea190f3f9',
            question: 'How do you prefer to spend your weekends?',
            isRequired: true,
            options: [
              {
                _id: '6799d5084c63bf5ea190f3fa',
                option: 'Relaxing at home',
                createdAt: '2025-01-29T07:13:12.420Z',
                updatedAt: '2025-01-29T07:13:12.420Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f3fd',
                option: 'Going out with friends',
                createdAt: '2025-01-29T07:13:12.514Z',
                updatedAt: '2025-01-29T07:13:12.514Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f400',
                option: 'Outdoor activities',
                createdAt: '2025-01-29T07:13:12.602Z',
                updatedAt: '2025-01-29T07:13:12.602Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f403',
                option: 'Working on personal projects',
                createdAt: '2025-01-29T07:13:12.678Z',
                updatedAt: '2025-01-29T07:13:12.678Z',
                __v: 0,
              },
              {
                _id: '6799d5084c63bf5ea190f406',
                option: 'Traveling',
                createdAt: '2025-01-29T07:13:12.759Z',
                updatedAt: '2025-01-29T07:13:12.759Z',
                __v: 0,
              },
            ],
            createdAt: '2025-01-29T07:13:12.844Z',
            updatedAt: '2025-01-29T07:13:12.844Z',
            __v: 0,
          },
          {
            _id: '6799d5084c63bf5ea190f40b',
            question:
              'Which of the following best describes your sleep habits?',
            isRequired: false,
            options: [
              {
                _id: '6799d5084c63bf5ea190f40c',
                option: 'I sleep 8 or more hours every night',
                createdAt: '2025-01-29T07:13:12.923Z',
                updatedAt: '2025-01-29T07:13:12.923Z',
                __v: 0,
              },
              {
                _id: '6799d5094c63bf5ea190f40f',
                option: 'I sleep 6-7 hours a night',
                createdAt: '2025-01-29T07:13:13.001Z',
                updatedAt: '2025-01-29T07:13:13.001Z',
                __v: 0,
              },
              {
                _id: '6799d5094c63bf5ea190f412',
                option: 'I sleep 4-5 hours a night',
                createdAt: '2025-01-29T07:13:13.089Z',
                updatedAt: '2025-01-29T07:13:13.089Z',
                __v: 0,
              },
              {
                _id: '6799d5094c63bf5ea190f415',
                option: 'I rarely get enough sleep',
                createdAt: '2025-01-29T07:13:13.172Z',
                updatedAt: '2025-01-29T07:13:13.172Z',
                __v: 0,
              },
            ],
            createdAt: '2025-01-29T07:13:13.268Z',
            updatedAt: '2025-01-29T07:13:13.268Z',
            __v: 0,
          },
        ],
        isActive: true,
        expiresAt: '2025-02-13T18:30:00.000Z',
        createdBy: {
          _id: '6799d4b54c63bf5ea190f3bc',
          firstName: 'Rohitash',
          lastName: 'Kator',
        },
        createdAt: '2025-01-29T07:13:13.345Z',
        updatedAt: '2025-01-29T07:13:13.345Z',
        __v: 0,
      },
    ];
  }

  onViewPoll(pollId: string): void {
    this.router.navigate(['/poll/', pollId]);
  }
}
