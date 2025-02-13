// API Service

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';
import {
  CreatePoll,
  LoginCredentials,
  PollAnswers,
  SignupCredentials,
} from '../data-types';
import { NotificationsComponent } from '../components/shared/notifications/notifications.component';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5000/api';
  private readonly tokenKey = 'authToken';
  private readonly token: string | null = localStorage.getItem(this.tokenKey);
  private readonly currentUserSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  private readonly isLoggedINSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isUserLoggedIn());
  private readonly isLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false); // Default to false

  currentUser: Observable<any> = this.currentUserSubject.asObservable();
  isLoggedIn: Observable<boolean> = this.isLoggedINSubject.asObservable();
  isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly notification: NotificationsComponent
  ) {
    this.token = this.getToken();

    if (this.token) {
      this.fetchCurrentUserDetails().subscribe({
        next: (user) => {
          console.log('Current User from API Service: ', user);
          this.currentUserSubject.next(user);
          this.notification.openSnackBar({
            message: 'Current user details fetched successfully.',
            type: 'success',
          });
        },
        error: (error) => {
          console.error('Check for malformed JWT error');
          if (
            error.error.error === 'jwt malformed' ||
            error.error.error === 'jwt expired'
          ) {
            this.notification.openSnackBar({
              message: 'Session expired. Please log in again.',
              type: 'error',
            });
            this.removeToken();
            this.router.navigate(['/login']);
          } else {
            this.notification.openSnackBar({
              message:
                'An error occurred while fetching user details. Please try again.',
              type: 'error',
            });
          }
        },
      });
    }
  }

  private setHttpHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedINSubject.next(true);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedINSubject.next(false);
    this.router.navigate(['/login']);
  }

  private fetchCurrentUserDetails(): Observable<any> {
    console.log('Fetching user...');
    const headers = this.setHttpHeader();
    return this.httpClient
      .get(`${this.apiUrl}/users/currentUser`, { headers })
      .pipe(catchError(this.errorHandler));
  }

  login(loginCredentials: LoginCredentials): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .post(`${this.apiUrl}/auth/login`, loginCredentials)
      .pipe(
        switchMap((response: any) => {
          console.log('Login API Response: ', response);
          const token = response?.token;
          this.setToken(token);
          return this.fetchCurrentUserDetails().pipe(
            switchMap((response: any) => {
              this.currentUserSubject.next(response);
              return [response];
            })
          );
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  signup(userDetails: SignupCredentials): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient.post(`${this.apiUrl}/auth/signup`, userDetails).pipe(
      switchMap((response: any) => {
        const token = response?.token;
        this.setToken(token);
        return this.fetchCurrentUserDetails().pipe(
          switchMap((userDetails) => {
            this.currentUserSubject.next(userDetails);
            return [userDetails];
          })
        );
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false); // End loading on error
        return this.errorHandler(error);
      })
    );
  }

  logout(): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    this.currentUserSubject.next(null);
    return this.httpClient
      .post(`${this.apiUrl}/auth/logout`, {}, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          this.removeToken();
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  private errorHandler(error: any): Observable<never> {
    console.log('Error in API: ', error);
    this.isLoadingSubject.next(false); // End loading in case of error
    throw error;
  }

  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  createPoll(createdPoll: CreatePoll): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .post(`${this.apiUrl}/polls`, createdPoll, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Created Poll Response: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  getAllPolls(): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .get(`${this.apiUrl}/polls`, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Response: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  closePoll(pollId: string): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .post(
        `${this.apiUrl}/polls/${pollId}/close`,
        {},
        {
          headers: this.setHttpHeader(),
        }
      )
      .pipe(
        switchMap((response: any) => {
          console.log('Close Poll Response: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  getPollResult(pollId: string): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .get(`${this.apiUrl}/polls/${pollId}/result`, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Result: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  getActivePolls(): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .get(`${this.apiUrl}/polls/active`, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Response: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  getPollById(pollId: string): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .get(`${this.apiUrl}/polls/${pollId}`, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Poll fetched successfully: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }

  submitPoll(pollId: string, pollSubmission: PollAnswers): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this.httpClient
      .post(`${this.apiUrl}/polls/${pollId}/submit`, pollSubmission, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Poll Submitted Successfully. Response: ', response);
          this.isLoadingSubject.next(false); // End loading
          return of(response);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false); // End loading on error
          return this.errorHandler(error);
        })
      );
  }
}
