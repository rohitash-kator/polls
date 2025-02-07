import { CommonModule } from '@angular/common';
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

  constructor(private readonly formBuilder: FormBuilder) {
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

  onSubmitCreateForm(): void {
    console.log(this.pollForm.value);
    if (this.pollForm.valid) {
      console.log('Poll created: ', this.pollForm.value);
    }
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    console.log(questionIndex, optionIndex);
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;
    options.removeAt(optionIndex);
  }
}
