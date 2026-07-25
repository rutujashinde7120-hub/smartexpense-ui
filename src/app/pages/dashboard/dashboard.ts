import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpenseService } from '../../services/expense';
import { AuthService } from '../../services/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
     MatProgressSpinnerModule

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  allExpenses: any[] = [];
  monthlyExpenses: any[] = [];
  filteredExpenses: any[] = [];
  totalAmount: number = 0;
  monthlyTotal: number = 0;
  monthlyBudget: number = 0;
  budgetInput: number = 0;
  budgetSet: boolean = false;
  selectedCategory: string = 'All';
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  userName: string = '';

  // AI Advice Variables
  aiAdvice: string = '';
  isLoadingAdvice: boolean = false;
  showAdvice: boolean = false;

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  years = [2024, 2025, 2026, 2027];

  categories = [
    'All',
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Other'
  ];

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getUser();
    this.userName = user.name;

    this.loadBudget();
    this.loadAllExpenses();
    this.loadMonthlyExpenses();
  }

  loadBudget(): void {
    const key = `budget_${this.selectedMonth}_${this.selectedYear}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      this.monthlyBudget = Number(saved);
      this.budgetInput = this.monthlyBudget;
      this.budgetSet = true;
    } else {
      this.monthlyBudget = 0;
      this.budgetInput = 0;
      this.budgetSet = false;
    }
  }

  loadAllExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data: any) => {
        this.allExpenses = data;
        this.totalAmount = data.reduce(
          (sum: number, e: any) => sum + e.amount,
          0
        );
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading expenses', err);
      }
    });
  }

  loadMonthlyExpenses(): void {
    this.expenseService
      .getMonthlyExpenses(this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (data: any) => {
          this.monthlyExpenses = data;
          this.monthlyTotal = data.reduce(
            (sum: number, e: any) => sum + e.amount,
            0
          );
          this.applyFilter();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error loading monthly expenses', err);
        }
      });
  }

  onMonthYearChange(): void {
    this.selectedCategory = 'All';
    this.loadBudget();
    this.loadMonthlyExpenses();
  }

  applyFilter(): void {
    if (this.selectedCategory === 'All') {
      this.filteredExpenses = this.monthlyExpenses;
    } else {
      this.filteredExpenses = this.monthlyExpenses.filter(
        e => e.category === this.selectedCategory
      );
    }
  }

  onCategoryChange(): void {
    this.applyFilter();
  }

  setBudget(): void {
    this.monthlyBudget = this.budgetInput;
    this.budgetSet = true;

    const key = `budget_${this.selectedMonth}_${this.selectedYear}`;
    localStorage.setItem(key, String(this.monthlyBudget));
  }

  getBudgetPercentage(): number {
    if (this.monthlyBudget === 0) return 0;

    return Math.min(
      Math.round((this.monthlyTotal / this.monthlyBudget) * 100),
      100
    );
  }

  getBudgetStatus(): string {
    const percentage = this.getBudgetPercentage();

    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';

    return 'safe';
  }

  getRemainingBudget(): number {
    return Math.max(this.monthlyBudget - this.monthlyTotal, 0);
  }

  getMonthName(): string {
    return (
      this.months.find(m => m.value === this.selectedMonth)?.name || ''
    );
  }

  getAIAdvice(): void {
    this.isLoadingAdvice = true;
    this.showAdvice = false;
    this.aiAdvice = '';

    setTimeout(() => {
      this.aiAdvice = this.generateSmartAdvice();
      this.showAdvice = true;
      this.isLoadingAdvice = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  generateSmartAdvice(): string {
    const advice: string[] = [];
    const monthName = this.getMonthName();

    // Check if no expenses
    if (this.monthlyExpenses.length === 0) {
      return `📊 No expenses found for ${monthName} ${this.selectedYear}. Start adding expenses to get personalized advice!`;
    }

    // Budget check
    if (this.budgetSet) {
      const percentage = this.getBudgetPercentage();
      if (percentage >= 100) {
        advice.push(`❌ You have exceeded your budget for ${monthName}! You spent ₹${this.monthlyTotal} against a budget of ₹${this.monthlyBudget}. Try to cut down expenses next month.`);
      } else if (percentage >= 80) {
        advice.push(`⚠️ You have used ${percentage}% of your ${monthName} budget! Only ₹${this.getRemainingBudget()} remaining. Be careful with spending!`);
      } else {
        advice.push(`✅ Great job! You have used only ${percentage}% of your ${monthName} budget. You have ₹${this.getRemainingBudget()} remaining.`);
      }
    } else {
      advice.push(`💡 Tip: Set a monthly budget to better track your spending for ${monthName}!`);
    }

    // Category analysis
    const categoryTotals: { [key: string]: number } = {};
    this.monthlyExpenses.forEach((e: any) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    // Find highest spending category
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topPercentage = Math.round((topCategory[1] / this.monthlyTotal) * 100);
      advice.push(`🏆 Your highest spending category is ${topCategory[0]} at ₹${topCategory[1]} (${topPercentage}% of total spending).`);

      // Category specific tips
      if (topCategory[0] === 'Food' && topPercentage > 40) {
        advice.push(`🍔 Food expenses are high! Consider meal prepping at home to save money on food costs.`);
      } else if (topCategory[0] === 'Travel' && topPercentage > 30) {
        advice.push(`🚗 Travel expenses are significant! Consider using public transport or carpooling to reduce costs.`);
      } else if (topCategory[0] === 'Shopping' && topPercentage > 30) {
        advice.push(`🛍️ Shopping expenses are high! Try to distinguish between needs and wants before purchasing.`);
      } else if (topCategory[0] === 'Entertainment' && topPercentage > 20) {
        advice.push(`🎬 Entertainment spending is notable! Check if you are using all your subscriptions and cancel unused ones.`);
      } else if (topCategory[0] === 'Bills' && topPercentage > 30) {
        advice.push(`💡 Bills are taking a big chunk! Look for ways to reduce electricity and internet costs.`);
      }
    }

    // Total expenses summary
    advice.push(`📈 Total spending summary for ${monthName}: ₹${this.monthlyTotal} across ${this.monthlyExpenses.length} transactions.`);

    // Savings tip
    if (this.monthlyTotal > 5000) {
      advice.push(`💰 Saving tip: Try the 50-30-20 rule — 50% on needs, 30% on wants, and 20% on savings!`);
    } else {
      advice.push(`👏 You are managing your expenses well! Keep tracking to maintain good financial habits.`);
    }

    return advice.join('\n\n');
  }
  closeAdvice(): void {
    this.showAdvice = false;
  }

  goToAddExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  goToChart(): void {
    this.router.navigate(['/chart']);
  }

  editExpense(expense: any): void {
    this.router.navigate(['/add-expense'], {
      state: { expense: expense }
    });
  }

  deleteExpense(id: number): void {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.loadAllExpenses();
        this.loadMonthlyExpenses();
      },
      error: (err: any) => {
        console.error('Error deleting expense', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}