import { Component } from '@angular/core';
import { Poll, PollAnswer, PollAnswers } from '../../data-types';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { NotificationsComponent } from '../shared/notifications/notifications.component';

@Component({
  selector: 'app-poll-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './poll-form.component.html',
  styleUrl: './poll-form.component.css',
})
export class PollFormComponent {
  poll: Poll | null = null;
  pollId: string | null;

  submittedAnswers: PollAnswer[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.pollId = this.activatedRoute.snapshot.paramMap.get('pollId');

    if (this.pollId) {
      this.apiService.getPollById(this.pollId).subscribe({
        next: (response: any) => {
          // If the response contains the poll data, set it to the component state
          if (response?.poll) {
            this.poll = response.poll;

            // Display success notification
            this.notification.openSnackBar({
              message: 'Poll fetched successfully.',
              type: 'success',
            });
          } else {
            // If no poll is found in the response
            this.notification.openSnackBar({
              message: 'Poll data not found.',
              type: 'error',
            });
          }
        },
        error: (error) => {
          console.error(
            'Error occurred while fetching the poll. Error: ',
            error
          );

          // Handle different types of errors
          if (error.status === 404) {
            // Poll not found
            this.notification.openSnackBar({
              message: 'Poll not found.',
              type: 'error',
            });
          } else if (error.status === 500) {
            // Server error
            this.notification.openSnackBar({
              message:
                'An error occurred while fetching the poll. Please try again later.',
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

  getRequiredQuestionIds(): string[] {
    return (
      this.poll?.questions
        ?.filter((question) => question.isRequired)
        .map((question) => question._id) ?? []
    );
  }

  isRequiredQuestionSkipped(
    requiredQuestionIds: string[],
    answeredQuestionIds: string[]
  ): boolean {
    // Iterate through each required question ID
    for (const requiredId of requiredQuestionIds) {
      // Check if the required question ID is NOT present in the answeredQuestionIds
      if (!answeredQuestionIds.includes(requiredId)) {
        return true; // If any required question is skipped, return true
      }
    }

    // If all required questions are answered, return false (no question skipped)
    return false;
  }

  onSubmitPoll(): void {
    if (this.pollId) {
      const requiredQuestionIds = this.getRequiredQuestionIds();
      const answeredQuestionIds = this.submittedAnswers.map(
        (ans) => ans.questionId
      );

      // Check if any required questions were skipped
      const isSkipped = this.isRequiredQuestionSkipped(
        requiredQuestionIds,
        answeredQuestionIds
      );

      if (isSkipped) {
        console.error('Answer all the required Questions.');
        this.notification.openSnackBar({
          message: 'You must answer all the required questions.',
          type: 'error',
        });
        return;
      }

      const pollAnswers: PollAnswers = { answers: this.submittedAnswers };

      // Make the API call to submit the poll answers
      this.apiService.submitPoll(this.pollId, pollAnswers).subscribe({
        next: (response: any) => {
          // Navigate to the user page after successful submission
          this.router.navigate(['/user']);

          // Show a success notification
          this.notification.openSnackBar({
            message: 'Your answers saved successfully!',
            type: 'success',
          });
        },
        error: (error) => {
          console.error('Error submitting answers.', error);

          // Handle validation errors from the backend (e.g., error.errors)
          if (
            error.status === 400 &&
            error.error.message === 'Validation Error' &&
            error.error.errors
          ) {
            // Loop through the errors array and display each validation error
            const validationMessages = error.error.errors
              .map((err: any) => err.msg)
              .join(', ');

            this.notification.openSnackBar({
              message: `Validation Error: ${validationMessages}`,
              type: 'error',
            });
          } else if (error.status === 404) {
            this.notification.openSnackBar({
              message: 'Poll not found.',
              type: 'error',
            });
          } else if (error.status === 400) {
            if (error.error.message === 'Poll is closed') {
              this.notification.openSnackBar({
                message: 'Poll is closed.',
                type: 'error',
              });
            } else if (error.error.message === 'Poll is already expired') {
              this.notification.openSnackBar({
                message: 'Poll is expired.',
                type: 'error',
              });
            } else if (
              error.error.message ===
              'You must submit all the mandatory questions of the poll'
            ) {
              this.notification.openSnackBar({
                message: 'You must submit all the mandatory questions.',
                type: 'error',
              });
            } else {
              this.notification.openSnackBar({
                message: 'Error submitting poll. Please try again.',
                type: 'error',
              });
            }
          } else {
            this.notification.openSnackBar({
              message: 'An unexpected error occurred. Please try again.',
              type: 'error',
            });
          }
        },
      });
    }
  }

  onOptionChange(questionId: string, optionId: string): void {
    const existingResponseIndex = this.submittedAnswers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingResponseIndex > -1) {
      this.submittedAnswers[existingResponseIndex].optionId = optionId;
    } else {
      this.submittedAnswers.push({ questionId, optionId });
    }
  }
}
