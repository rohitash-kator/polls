import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApiService } from '../../../services/api.service';
import { CreatePoll } from '../../../data-types';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-create-poll-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatSlideToggleModule,
  ],
  templateUrl: './create-poll-form.component.html',
  styleUrl: './create-poll-form.component.css',
})
export class CreatePollFormComponent {
  pollForm: FormGroup = new FormGroup({});

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.initiatePoll();
  }

  get questions(): FormArray {
    return this.pollForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number): FormArray {
    const question = this.questions.at(questionIndex);
    return question.get('options') as FormArray;
  }

  initiatePoll(): void {
    this.pollForm = this.formBuilder.group({
      title: ['', Validators.required],
      expiresAt: ['', Validators.required],
      questions: this.formBuilder.array([this.createQuestion()]),
    });
  }

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      question: ['', Validators.required],
      isRequired: [false],
      options: this.formBuilder.array([
        this.createOption(),
        this.createOption(),
      ]) as FormArray,
    });
  }

  createOption(): FormGroup {
    return this.formBuilder.group({
      option: ['', Validators.required],
    });
  }

  onAddQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  addOption(questionIndex: number): void {
    const question = this.questions.at(questionIndex);
    const option = question.get('options') as FormArray;
    option.push(this.createOption());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;
    options.removeAt(optionIndex);
  }

  onSubmitCreateForm(): void {
    if (!this.pollForm.valid) {
      this.notification.openSnackBar({
        message: 'Please fill out all required fields.',
        type: 'error',
      });
      return;
    }

    const { title, expiresAt, questions } = this.pollForm.value;
    const expiresAtDate = new Date(expiresAt);
    const currentDate = new Date();

    if (expiresAtDate < currentDate) {
      this.notification.openSnackBar({
        message: 'Please provide the expiry date in the future.',
        type: 'error',
      });
      return;
    }

    const formattedExpiryDate = this.formatDate(expiresAtDate);

    const createdPoll: CreatePoll = {
      title,
      expiresAt: formattedExpiryDate,
      questions: this.formatQuestions(questions),
    };

    this.apiService.createPoll(createdPoll).subscribe({
      next: (response: any) => {
        this.router.navigate(['/']);
        this.notification.openSnackBar({
          message: 'Poll Created Successfully',
          type: 'success',
        });
      },
      error: (error) => {
        console.error('From Poll Create Form Component: ', error);

        // Handle backend errors
        if (
          error.status === 400 &&
          error.error.message === 'Validation Error' &&
          error.error.errors
        ) {
          // If error contains validation errors, show the error array messages
          const validationMessages = error.error.errors
            .map((err: any) => err.msg)
            .join(', ');

          this.notification.openSnackBar({
            message: `Validation Error: ${validationMessages}`,
            type: 'error',
          });
        } else if (error.status === 403) {
          // Handle unauthorized error
          this.notification.openSnackBar({
            message: 'You are not allowed to create a poll.',
            type: 'error',
          });
        } else {
          // Handle generic errors
          this.notification.openSnackBar({
            message: 'An error occurred. Please try again later.',
            type: 'error',
          });
        }
      },
    });
  }

  private formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MM-dd-yyyy')!;
  }

  private formatQuestions(questions: any[]): any[] {
    return questions.map((question) => ({
      question: question.question,
      isRequired: question.isRequired,
      options: question.options.map((option: any) => option.option),
    }));
  }
}
