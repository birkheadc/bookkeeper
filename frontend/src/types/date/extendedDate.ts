import { OmitProperties } from "ts-essentials";
import { BrowseViewMode } from "../browse/browseViewMode";

export class ExtendedDate extends Date {

  copy(): ExtendedDate {
    return ExtendedDate.fromDto(this.toDto());
  }

  toSimpleString(): string {
    return this.toISOString().substring(0, 10);
  }

  toDto(): ExtendedDateDto {
    const yearString = this.getFullYear().toString();
    const monthString = (this.getMonth() + 1).toString().padStart(2, '0');
    const dayString = this.getDate().toString().padStart(2, '0');

    const s = yearString.concat(monthString).concat(dayString);
    return s;
  }

  static fromDto(dto: ExtendedDateDto): ExtendedDate {
    const yearString = dto.substring(0, 4);
    const monthString = dto.substring(4, 6);
    const dayString = dto.substring(6);

    const date = new ExtendedDate();
    date.setFullYear(parseInt(yearString));
    date.setMonth(parseInt(monthString) - 1);
    date.setDate(parseInt(dayString));

    return date;
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

  isValid(): boolean {
    return !isNaN(this.getDate());
  }

  static fromStringOrNull(s: string | null | undefined): ExtendedDate | null {
    if (s == null) return null;
    const date = new ExtendedDate(s);
    if (date.isValid()) return date;
    return null;
  }

  static fromStringOrDefault(s: string | null | undefined, def: ExtendedDate): ExtendedDate {
    if (s == null) return def;
    const date = new ExtendedDate(s);
    if (date.isValid()) return date;
    return def;
  }

  static fromSearchParamsOrToday(searchParams: URLSearchParams): { date: ExtendedDate, newSearchParams: URLSearchParams } {
    const date = ExtendedDate.fromStringOrDefault(searchParams.get('date'), new ExtendedDate());
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('date', date.toSimpleString());
    return { date, newSearchParams };
  }

  static getRange(from: ExtendedDate | null, to: ExtendedDate | null): ExtendedDate[] | null {
    if (from == null || to == null || from.valueOf() > to.valueOf()) return null;
    const dates: ExtendedDate[] = [];
    let day = from.copy();
    while (day.isBeforeOrEquals(to)) {
      dates.push(day.copy());
      day.setDate(day.getDate() + 1);
    }
    return dates;
  }

  isBeforeOrEquals(date: ExtendedDate): boolean {
    if (this.getFullYear() < date.getFullYear()) return true;
    if (this.getFullYear() > date.getFullYear()) return false;

    if (this.getMonth() < date.getMonth()) return true;
    if (this.getMonth() > date.getMonth()) return false;

    if (this.getDate() <= date.getDate()) return true;
    return false;
  }
}

export type ExtendedDateDto = string;