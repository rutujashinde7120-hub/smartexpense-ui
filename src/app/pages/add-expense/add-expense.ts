import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-add-expense',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense implements OnInit {
  title: string = '';
  amount: number = 0;
  category: string = '';
  description: string = '';
  date: string = '';
  errorMessage: string = '';
  isEditMode: boolean = false;
  expenseId: number = 0;
  isLoadingAI: boolean = false;
  aiSuggestion: string = '';

  categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

  constructor(private expenseService: ExpenseService, private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { expense: any };
    if (state && state.expense) {
      this.isEditMode = true;
      this.expenseId = state.expense.id;
      this.title = state.expense.title;
      this.amount = state.expense.amount;
      this.category = state.expense.category;
      this.description = state.expense.description;
      this.date = state.expense.date;
    }
  }

  async suggestCategory(): Promise<void> {
    if (!this.title || this.title.trim().length < 3) return;

    this.isLoadingAI = true;
    this.aiSuggestion = '';

    try {
      const response = await fetch('/api/ai/suggest-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: this.title })
      });

      const data = await response.json();
      const suggested = data.category.trim();

      if (this.categories.includes(suggested)) {
        this.category = suggested;
        this.aiSuggestion = `AI suggested: ${suggested}`;
      } else {
        this.category = 'Other';
        this.aiSuggestion = `AI suggested: Other`;
      }
    } catch (error) {
      console.error('AI error:', error);
      this.aiSuggestion = 'AI suggestion failed';
    } finally {
      this.isLoadingAI = false;
    }
  }

  onSubmit(): void {
    const expense = {
      title: this.title,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: this.date
    };

    if (this.isEditMode) {
      this.expenseService.updateExpense(this.expenseId, expense).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to update expense. Please try again!';
        }
      });
    } else {
      this.expenseService.addExpense(expense).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to add expense. Please try again!';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  
}