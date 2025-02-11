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

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5000/api';
  private readonly tokenKey = 'authToken';
  private readonly token: string | null = localStorage.getItem(this.tokenKey);

  private readonly currentUserSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {
    this.token = this.getToken();

    if (this.token) {
      this.fetchCurrentUserDetails().subscribe({
        next: (user) => {
          console.log('Current User from API Service: ', user);
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          console.error(error);
          this.logout();
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
    console.log('Setting token...');
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  private fetchCurrentUserDetails(): Observable<any> {
    console.log('Fetching user...');
    return this.httpClient
      .get(`${this.apiUrl}/users/currentUser`, {
        headers: this.setHttpHeader(),
      })
      .pipe(catchError(this.errorHandler));
  }

  login(loginCredentials: LoginCredentials): Observable<any> {
    console.log('Login From API Service: ', loginCredentials);

    return this.httpClient
      .post(`${this.apiUrl}/auth/login`, loginCredentials)
      .pipe(
        switchMap((response: any) => {
          console.log('Login API Response: ', response);
          const token = response?.token;

          console.log('Token: ', token);
          this.setToken(token);

          return this.fetchCurrentUserDetails().pipe(
            switchMap((userDetails) => {
              this.currentUserSubject.next(userDetails);
              return [userDetails];
            })
          );
        }),
        catchError(this.errorHandler)
      );
  }

  signup(userDetails: SignupCredentials): Observable<any> {
    console.log('Sign Up From API Service', userDetails);

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
      catchError(this.errorHandler)
    );
  }

  logout(): Observable<any> {
    this.currentUserSubject.next(null);
    return this.httpClient
      .post(`${this.apiUrl}/auth/logout`, {}, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          // Remove the token after the logout request is successful
          this.removeToken();
          return of(response); // Return the response as an observable
        }),
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: any): Observable<never> {
    console.log('Error in API: ', error);
    throw error;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  createPoll(createdPoll: CreatePoll): Observable<any> {
    console.log('Created poll From API Service', createdPoll);

    return this.httpClient
      .post(`${this.apiUrl}/polls`, createdPoll, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Created Poll Response: ', response);

          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  getAllPolls(): Observable<any> {
    console.log('Getting All Polls');
    return this.httpClient
      .get(`${this.apiUrl}/polls`, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Response: ', response);

          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  closePoll(pollId: string): Observable<any> {
    console.log('Closing a Poll');
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
          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  getPollResult(pollId: string): Observable<any> {
    console.log('Getting Poll result');
    return this.httpClient
      .get(`${this.apiUrl}/polls/${pollId}/result`, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Result: ', response);
          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  getActivePolls(): Observable<any> {
    console.log('Getting All Polls');
    return this.httpClient
      .get(`${this.apiUrl}/polls/active`, { headers: this.setHttpHeader() })
      .pipe(
        switchMap((response: any) => {
          console.log('Fetched Poll Response: ', response);

          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  getPollById(pollId: string): Observable<any> {
    console.log('Getting poll by Poll ID');

    return this.httpClient
      .get(`${this.apiUrl}/polls/${pollId}`, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Poll fetched successfully: ', response);
          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }

  submitPoll(pollId: string, pollSubmission: PollAnswers): Observable<any> {
    console.log(pollId, pollSubmission);
    return this.httpClient
      .post(`${this.apiUrl}/polls/${pollId}/submit`, pollSubmission, {
        headers: this.setHttpHeader(),
      })
      .pipe(
        switchMap((response: any) => {
          console.log('Poll Submitted Successfully. Response: ', response);
          return of(response);
        }),
        catchError(this.errorHandler)
      );
  }
}
