import { ExtendedDate } from "../date/extendedDate";
import { BrowseViewMode } from "./browseViewMode";
import {OmitProperties} from 'ts-essentials';

export class BrowseOptions {
  date: ExtendedDate;
  viewMode: BrowseViewMode;
  
  constructor() {
    this.date = new ExtendedDate();
    this.viewMode = BrowseViewMode.DAY;
  }

  static fromSearchParamsOrDefault(searchParams: URLSearchParams, def: OmitProperties<BrowseOptions, Function>): { browseOptions: BrowseOptions, newSearchParams: URLSearchParams } {    
    const browseOptions = new BrowseOptions();
    const newSearchParams = new URLSearchParams();

    const date = ExtendedDate.fromStringOrDefault(searchParams.get('date'), def.date)
    browseOptions.date = date;
    newSearchParams.set('date', date.toSimpleString());
    
    const viewMode = <BrowseViewMode> (searchParams.get('mode') ?? def.viewMode);
    browseOptions.viewMode = Object.values(BrowseViewMode).includes(viewMode) ? viewMode : def.viewMode;
    newSearchParams.set('mode', browseOptions.viewMode);

    return { browseOptions, newSearchParams };
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