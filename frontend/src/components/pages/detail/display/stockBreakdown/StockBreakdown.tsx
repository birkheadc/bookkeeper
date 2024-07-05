import * as React from "react";
import { Expense, Report } from "../../../../../types/report/report";
import { report } from "process";

import "./StockBreakdown.css";

interface IStockBreakdownProps {
  reports: Record<string, Report>;
}

export default function StockBreakdown(
  props: IStockBreakdownProps
): JSX.Element {
  const reports = props.reports;

  const stockExpenses: Expense[] = [];
  const totals: Record<string, number> = {};

  Object.values(reports).forEach((report: Report) => {
    report.expenses.forEach((expense: Expense) => {
      if (expense.category === "stock") {
        stockExpenses.push(expense);
        if (totals[expense.subCategory || ""] === undefined) {
          totals[expense.subCategory || ""] = 0;
        }
        totals[expense.subCategory || ""] += expense.amount;
      }
    });
  });

  stockExpenses.sort((a: Expense, b: Expense) => {
    if ((a.subCategory || "") > (b.subCategory || "")) return 1;
    if ((a.subCategory || "") < (b.subCategory || "")) return 1;
    if (a.reportDate < b.reportDate) return -1;
    return -1;
  });

  return (
    <div className="stock-breakdown-wrapper">
      <h2>Stock Breakdown</h2>
      <table className="browse-summary-table">
        {Object.entries(totals).map(([key, value]) => (
          <tbody>
            <tr className="stock-breakdown-totals">
              <td>{key}</td>
              <td className="right-align">{value}</td>
            </tr>
          </tbody>
        ))}
      </table>
      <table className="browse-summary-table">
        {stockExpenses.map((stockExpense: Expense) => (
          <tbody>
            <tr className="stock-breakdown-all">
              <td>{stockExpense.subCategory}</td>
              <td>{stockExpense.reportDate.toLocaleDateString()}</td>
              <td className="right-align">{stockExpense.amount}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
