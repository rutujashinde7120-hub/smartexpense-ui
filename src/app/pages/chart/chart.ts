import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense';
import { AuthService } from '../../services/auth';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Chart2 implements OnInit {
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  userName: string = '';
  totalAmount: number = 0;
  pieChart: any;
  barChart: any;
  expenses: any[] = [];
  insights: string = '';
  showInsights: boolean = false;
  isLoadingInsights: boolean = false;

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

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getUser();
    this.userName = user.name;
    this.loadChartData();
  }

  loadChartData(): void {
    this.expenseService.getMonthlyExpenses(this.selectedMonth, this.selectedYear).subscribe({
      next: (data: any) => {
        this.expenses = data;
        this.totalAmount = data.reduce((sum: number, e: any) => sum + e.amount, 0);
        this.showInsights = false;
        this.insights = '';
        setTimeout(() => {
          this.buildPieChart(data);
          this.buildBarChart(data);
        }, 100);
      },
      error: (err: any) => {
        console.error('Error loading chart data', err);
      }
    });
  }

  buildPieChart(data: any[]): void {
    const categoryMap: { [key: string]: number } = {};
    data.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    if (this.pieChart) this.pieChart.destroy();

    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (canvas) {
      this.pieChart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors.slice(0, labels.length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: `Spending by Category — ${this.getMonthName()} ${this.selectedYear}`
            }
          }
        }
      });
    }
  }

  buildBarChart(data: any[]): void {
    const categoryMap: { [key: string]: number } = {};
    data.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);

    if (this.barChart) this.barChart.destroy();

    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (canvas) {
      this.barChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount (₹)',
            data: values,
            backgroundColor: '#36A2EB'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Monthly Spending — ${this.getMonthName()} ${this.selectedYear}`
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  generateInsights(): void {
    this.isLoadingInsights = true;
    this.showInsights = false;
    this.insights = '';

    try {
      const result = this.buildInsights();
      this.insights = result;
      this.showInsights = true;
      this.isLoadingInsights = false;
    } catch (error) {
      console.error('Insights error:', error);
      this.insights = 'Error generating insights. Please try again!';
      this.showInsights = true;
      this.isLoadingInsights = false;
    }
  }

  buildInsights(): string {
    const monthName = this.getMonthName();
    const insights: string[] = [];

    if (this.expenses.length === 0) {
      return `📊 No expenses found for ${monthName} ${this.selectedYear}. Add some expenses to see insights!`;
    }

    // Category breakdown
    const categoryMap: { [key: string]: number } = {};
    this.expenses.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const sortedCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1]);

    insights.push(`📊 Spending Insights for ${monthName} ${this.selectedYear}`);
    insights.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    insights.push(`💰 Total Spent: ₹${this.totalAmount}`);
    insights.push(`📝 Total Transactions: ${this.expenses.length}`);
    insights.push(`📌 Average per transaction: ₹${Math.round(this.totalAmount / this.expenses.length)}`);
    insights.push(``);
    insights.push(`📈 Category Breakdown:`);

    sortedCategories.forEach(([category, amount]) => {
      const percentage = Math.round((amount / this.totalAmount) * 100);
      const bar = '█'.repeat(Math.floor(percentage / 5));
      insights.push(`${category}: ₹${amount} (${percentage}%) ${bar}`);
    });

    insights.push(``);
    insights.push(`🏆 Top Spending Category: ${sortedCategories[0][0]} (₹${sortedCategories[0][1]})`);

    if (sortedCategories.length > 1) {
      insights.push(`🥈 Second Highest: ${sortedCategories[1][0]} (₹${sortedCategories[1][1]})`);
    }

    // Find most expensive single expense
    const maxExpense = this.expenses.reduce((max: any, e: any) =>
      e.amount > max.amount ? e : max, this.expenses[0]);
    insights.push(``);
    insights.push(`💸 Most Expensive: ${maxExpense.title} — ₹${maxExpense.amount}`);

    // Spending pattern
    insights.push(``);
    insights.push(`💡 Insights:`);

    const foodPercentage = categoryMap['Food']
      ? Math.round((categoryMap['Food'] / this.totalAmount) * 100) : 0;
    const travelPercentage = categoryMap['Travel']
      ? Math.round((categoryMap['Travel'] / this.totalAmount) * 100) : 0;
    const entertainmentPercentage = categoryMap['Entertainment']
      ? Math.round((categoryMap['Entertainment'] / this.totalAmount) * 100) : 0;
    const shoppingPercentage = categoryMap['Shopping']
      ? Math.round((categoryMap['Shopping'] / this.totalAmount) * 100) : 0;

    if (foodPercentage > 40) {
      insights.push(`🍔 Food spending is ${foodPercentage}% of total — consider cooking at home more often!`);
    }
    if (travelPercentage > 30) {
      insights.push(`🚗 Travel is ${travelPercentage}% of total — try public transport to save money!`);
    }
    if (entertainmentPercentage > 20) {
      insights.push(`🎬 Entertainment is ${entertainmentPercentage}% of total — review your subscriptions!`);
    }
    if (shoppingPercentage > 30) {
      insights.push(`🛍️ Shopping is ${shoppingPercentage}% of total — make a list before shopping!`);
    }
    if (foodPercentage <= 40 && travelPercentage <= 30 &&
        entertainmentPercentage <= 20 && shoppingPercentage <= 30) {
      insights.push(`✅ Your spending distribution looks balanced! Keep it up!`);
    }

    insights.push(``);
    insights.push(`💰 Money Saving Tip: Save at least 20% of your monthly income for future goals!`);

    return insights.join('\n');
  }

  onMonthYearChange(): void {
    this.loadChartData();
  }

  getMonthName(): string {
    return this.months.find(m => m.value === this.selectedMonth)?.name || '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}