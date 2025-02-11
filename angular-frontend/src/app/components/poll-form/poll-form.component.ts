import { Component } from '@angular/core';
import { Poll, PollAnswer, PollAnswers } from '../../data-types';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';

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
    private readonly apiService: ApiService
  ) {
    this.pollId = this.activatedRoute.snapshot.paramMap.get('pollId');

    if (this.pollId) {
      this.apiService.getPollById(this.pollId).subscribe({
        next: (response: any) => {
          console.log('Poll fetched successfully. Poll: ', response);
          this.poll = response?.poll;
        },
        error: (error) => {
          console.error(
            'Error Occurred while fetching the Poll. Error: ',
            error
          );
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
    console.log('Submitted Poll: ', this.submittedAnswers);
    if (this.pollId) {
      const requiredQuestionIds = this.getRequiredQuestionIds();
      const answeredQuestionIds = this.submittedAnswers.map(
        (ans) => ans.questionId
      );

      const isSkipped = this.isRequiredQuestionSkipped(
        requiredQuestionIds,
        answeredQuestionIds
      );

      if (isSkipped) {
        console.error('Answer all the required Questions.');
        return;
      }
      const pollAnswers: PollAnswers = { answers: this.submittedAnswers };
      this.apiService.submitPoll(this.pollId, pollAnswers).subscribe({
        next: (response: any) => {
          console.log('Answers submitted successfully!', response);
          this.router.navigate(['/user']);
        },
        error: (error) => {
          console.log('Error submitting answers.', error);
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
