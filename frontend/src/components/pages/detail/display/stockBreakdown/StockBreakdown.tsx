import * as React from "react";
import { Expense, Report } from "../../../../../types/report/report";
import { report } from "process";

import "./StockBreakdown.css";
import { useCurrency } from "../../../../../hooks/useCurrency/useCurrency";
import { ExtendedDate } from "../../../../../types/date/extendedDate";

interface IStockBreakdownProps {
  reports: Record<string, Report>;
}

export default function StockBreakdown(
  props: IStockBreakdownProps
): JSX.Element {
  const { properties, format } = useCurrency();

  const reports = props.reports;

  let stockExpenses: Expense[] = [];
  const totals: Record<string, number> = {};
  let sum = 0;

  Object.values(reports).forEach((report: Report) => {
    report.expenses.forEach((expense: Expense) => {
      if (expense.category === "stock") {
        stockExpenses.push(expense);
        if (totals[expense.subCategory || ""] === undefined) {
          totals[expense.subCategory || ""] = 0;
        }
        totals[expense.subCategory || ""] += expense.amount;
        sum += expense.amount;
      }
    });
  });

  const downloadCSV = () => {
    // Create a CSV file and download it
    const csvContent = stockExpenses
      .map((expense: Expense) => {
        const date = new ExtendedDate(expense.reportDate).toSimpleString();
        return `${date},${expense.subCategory},${expense.amount}`;
      })
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_breakdown.csv";
    a.click();
  };

  stockExpenses = stockExpenses.sort((a: Expense, b: Expense) => {
    if ((a.subCategory || "") < (b.subCategory || "")) return -1;
    if ((a.subCategory || "") > (b.subCategory || "")) return 1;
    if (a.reportDate < b.reportDate) return -1;
    return -1;
  });

  const sortedTotals: { category: string; amount: number }[] = Object.entries(
    totals
  )
    .map(([key, value]) => ({ category: key, amount: value }))
    .sort((a, b) => {
      return a.category < b.category ? -1 : 1;
    });

  return (
    <div className="stock-breakdown-wrapper">
      <h2>Stock Breakdown</h2>
      <table className="browse-summary-table">
        {sortedTotals.map((total) => (
          <tbody>
            <tr className="stock-breakdown-totals">
              <td>{total.category}</td>
              <td className="right-align">
                {properties.symbol}
                {format(total.amount)}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <table className="browse-summary-table">
        {stockExpenses.map((stockExpense: Expense) => (
          <tbody>
            <tr className="stock-breakdown-all">
              <td>{stockExpense.subCategory}</td>
              <td>
                {new ExtendedDate(stockExpense.reportDate).toSimpleString()}
              </td>
              <td className="right-align">
                {properties.symbol}
                {format(stockExpense.amount)}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <div className="full-width right-align">
        Total: {properties.symbol}
        {format(sum)}
      </div>
      <div className="full-width right-align">
        <button type="button" className="standard-button" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
    </div>
  );
}
