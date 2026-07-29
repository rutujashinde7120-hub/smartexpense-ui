import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private baseUrl = 'https://YOUR-RENDER-URL.onrender.com/api/expenses';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post(this.baseUrl, expense, { headers: this.getHeaders() });
  }

  getExpenses(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  getMonthlyExpenses(month: number, year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/monthly?month=${month}&year=${year}`, {
      headers: this.getHeaders()
    });
  }

  updateExpense(id: number, expense: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, expense, { headers: this.getHeaders() });
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  getBudgetAdvice(data: any): Observable<any> {
    return this.http.post('/api/ai/budget-advice', data, {
      headers: this.getHeaders()
    });
  }
}