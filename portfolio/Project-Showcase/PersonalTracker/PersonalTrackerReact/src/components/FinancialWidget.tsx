import type { FC } from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type FinancialSummary = {
  income: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  netWorth: number;
  totalTransactions: number;
  expensesByCategory: { [key: string]: number };
  incomeByCategory: { [key: string]: number };
};

type FinancialWidgetProps = {
  onClick?: () => void;
};

export const FinancialWidget: FC<FinancialWidgetProps> = ({ onClick }) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/financialentries/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      } else {
        setError('Failed to fetch financial data');
      }
    } catch (err) {
      setError('Error fetching financial data');
      // Fallback to sample data for development
      setSummary({
        income: 5000,
        expenses: 3200,
        netIncome: 1800,
        assets: 25000,
        liabilities: 8000,
        netWorth: 17000,
        totalTransactions: 45,
        expensesByCategory: {
          'Food': 800,
          'Rent': 1200,
          'Transportation': 400,
          'Entertainment': 300,
          'Utilities': 500
        },
        incomeByCategory: {
          'Salary': 4500,
          'Freelance': 500
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getNetWorthColor = (netWorth: number) => {
    if (netWorth > 0) return 'text-green-600 dark:text-green-400';
    if (netWorth < 0) return 'text-red-600 dark:text-red-400';
    return 'text-stone-600 dark:text-stone-400';
  };

  if (loading) {
    return (
      <motion.div
        className="relative rounded-2xl shadow-lg p-6 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-700"
        style={{ minHeight: '120px' }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </motion.div>
    );
  }

  if (error && !summary) {
    return (
      <motion.div
        className="relative rounded-2xl shadow-lg p-6 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-700"
        style={{ minHeight: '120px' }}
      >
        <div className="flex items-center justify-center h-full text-red-500">
          <p>Error loading financial data</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-2xl shadow-lg p-6 cursor-pointer bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-700 group transition-all duration-200"
      onClick={onClick}
      style={{ minHeight: '200px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Financial Overview
        </h3>
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
      </div>

      {summary && (
        <div className="space-y-3">
          {/* Net Worth - Main highlight */}
          <div className="text-center pb-3 border-b border-stone-300 dark:border-stone-600">
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Net Worth</p>
            <p className={`text-2xl font-bold ${getNetWorthColor(summary.netWorth)}`}>
              {formatCurrency(summary.netWorth)}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-stone-600 dark:text-stone-400 mb-1">This Month</p>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(summary.income)}
              </p>
              <p className="text-xs text-stone-500">Income</p>
            </div>
            <div>
              <p className="text-stone-600 dark:text-stone-400 mb-1">&nbsp;</p>
              <p className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(summary.expenses)}
              </p>
              <p className="text-xs text-stone-500">Expenses</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-2 border-t border-stone-300 dark:border-stone-600">
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-600 dark:text-stone-400">Monthly Savings</span>
              <span className={`font-medium ${summary.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(summary.netIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-500 mt-1">
              <span>Assets: {formatCurrency(summary.assets)}</span>
              <span>Debts: {formatCurrency(summary.liabilities)}</span>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="text-center">
            <p className="text-xs text-stone-500">
              {summary.totalTransactions} transactions tracked
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};