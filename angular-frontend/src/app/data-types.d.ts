import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

interface Base {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: 0;
}

export interface Poll extends Base {
  title: string;
  totalSubmissions: number;
  questions: Question[];
  isActive: boolean;
  expiresAt: string;
  createdBy: User;
}

export interface Question extends Base {
  question: string;
  isRequired: boolean;
  options: Option[];
}

export interface Option extends Base {
  option: string;
}

export interface User extends Base {
  firstName: string;
  lastName: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreatePoll {
  title: string;
  expiresAt: string;
  questions: CreatePollQuestion[];
}

export interface CreatePollQuestion {
  question: string;
  isRequired: boolean;
  options: string[];
}

export interface ChartData {
  question: string;
  options: string[];
  responses: number;
  chartOptions: ChartOptions;
}

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
}

export interface PollResult {
  pollId: string; // Unique identifier for the poll result
  title: string;
  totalSubmissions: number;
  result: PollQuestionResult[];
}

export interface PollQuestionResult {
  question: string;
  options: PollOptionResult[];
  totalSubmissions: number;
}

export interface PollOptionResult {
  option: string;
  count: number;
}

export interface PollAnswer {
  questionId: string;
  optionId: string;
}

export interface PollAnswers {
  answers: PollAnswer[];
}

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
