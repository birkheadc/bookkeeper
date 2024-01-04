import { ExtendedDate } from "../date/extendedDate";
import { BrowseViewMode } from "./browseViewMode"

export class BrowseOptions {
  date: ExtendedDate;
  viewMode: BrowseViewMode;
  
  constructor() {
    this.date = new ExtendedDate();
    this.viewMode = BrowseViewMode.DAY;
  }

  static fromSearchParams(searchParams: URLSearchParams): BrowseOptions | undefined {
    const options = new BrowseOptions();

    const dateString = searchParams.get('date');
    const viewModeString = searchParams.get('mode');
    
    if (!dateString || !viewModeString) {
      return undefined;
    }

    options.viewMode = <BrowseViewMode> viewModeString;
    options.date = new ExtendedDate(dateString);
    return options;
  }

  getDates(): ExtendedDate[] {
    switch (this.viewMode) {
      case BrowseViewMode.DAY:
        return [ this.date ];
      case BrowseViewMode.WEEK:
        return this.date.getWeekOf();
      case BrowseViewMode.MONTH:
        return this.date.getMonthOf();
    }
  }
}