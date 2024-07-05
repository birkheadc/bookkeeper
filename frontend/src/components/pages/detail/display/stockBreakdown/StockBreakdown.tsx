import * as React from "react";
import { Expense, Report } from "../../../../../types/report/report";
import { report } from "process";

import "./StockBreakdown.css";
import { useCurrency } from "../../../../../hooks/useCurrency/useCurrency";

interface IStockBreakdownProps {
  reports: Record<string, Report>;
}

export default function StockBreakdown(
  props: IStockBreakdownProps
): JSX.Element {
  const { properties, format } = useCurrency();

  const reports = props.reports;

  const stockExpenses: Expense[] = [];
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
              <td className="right-align">
                {properties.symbol}
                {format(value)}
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
              <td>{stockExpense.reportDate.toLocaleDateString()}</td>
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
    </div>
  );
}
