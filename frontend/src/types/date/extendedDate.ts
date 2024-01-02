import { BrowseViewMode } from "../browse/browseViewMode";

export class ExtendedDate extends Date {
  toSimpleString(): string {
    return this.toISOString().substring(0, 10);
  }

  addBrowseViewMode(viewMode: BrowseViewMode, n: number) {
    switch (viewMode) {
      case BrowseViewMode.DAY:
        this.setDate(this.getDate() + n);
        break;
      case BrowseViewMode.WEEK:
        this.setDate(this.getDate() + (n * 7));
        break;
      case BrowseViewMode.MONTH:
        this.setMonth(this.getMonth() + n);
        break;
    }
  }

  getWeekOf(): ExtendedDate[] {
    const day = this.getDay();
    const sunday = new ExtendedDate(this);
    sunday.setDate(this.getDate() - day);

    const week: ExtendedDate[] = [];
    week.push(sunday);
    for (let i = 1; i < 7; i++) {
      const day = new ExtendedDate(sunday);
      day.setDate(day.getDate() + i);
      week.push(day);
    }
    
    return week;
  }

  getMonthOf(): ExtendedDate[] {
    const date = this.getDate();
    const first = new ExtendedDate(this);
    first.setDate(this.getDate() - (date - 1));

    const month: ExtendedDate[] = [];
    let day = first;
    while (day.getMonth() === this.getMonth()) {
      month.push(new ExtendedDate(day));
      day.setDate(day.getDate() + 1);
    }

    return month;
  }
}