import { ExtendedDate } from "../date/extendedDate";

export class Breakdown {
  byDay: Record<number, {
    sum: number,
    dates: string[],
    average: number
  }>;
  byDate: Record<number, {
    sum: number,
    dates: string[],
    average: number
  }>;
  byMonth: Record<number, {
    sum: number,
    dates: string[],
    average: number
  }>;

  constructor() {
    this.byDay = {};
    this.byDate = {};
    this.byMonth = {};
  }

  addTransaction(transaction: { reportDate: ExtendedDate, amount: number }) {
    const day = transaction.reportDate.getDay();
    const date = transaction.reportDate.getDate();
    const month = transaction.reportDate.getMonth();
    
    const amount = transaction.amount;

    const dateString = transaction.reportDate.toDto();

    if (!this.byDay.hasOwnProperty(day)) {
      this.byDay[day] = { sum: 0, dates: [], average: 0 }
    }
    if (!this.byDate.hasOwnProperty(date)) {
      this.byDate[date] = { sum: 0, dates: [], average: 0 }
    }
    if (!this.byMonth.hasOwnProperty(month)) {
      this.byMonth[month] = { sum: 0, dates: [], average: 0 }
    }

    this.byDay[day].sum += amount;
    if (!this.byDay[day].dates.includes(dateString)) {
      this.byDay[day].dates.push(dateString);
    }
    this.byDay[day].average = this.byDay[day].sum / this.byDay[day].dates.length;

    this.byDate[date].sum += amount;
    if (!this.byDate[date].dates.includes(dateString)) {
      this.byDate[date].dates.push(dateString);
    }
    this.byDate[date].average = this.byDate[date].sum / this.byDate[date].dates.length;

    this.byMonth[month].sum += amount;
    if (!this.byMonth[month].dates.includes(dateString)) {
      this.byMonth[month].dates.push(dateString);
    }
    this.byMonth[month].average = this.byMonth[month].sum / this.byMonth[month].dates.length;
  }
}