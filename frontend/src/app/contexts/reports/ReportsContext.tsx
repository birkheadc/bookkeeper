import { Report, ReportDictionary } from "../../../types/report/report";
import * as React from 'react';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import api from "../../../api";
import { Result } from "../../../types/result/result";
import { SessionContext } from "../session/SessionContext";
import { ExtendedDate } from "../../../types/date/extendedDate";


type Props = {
  children: React.ReactNode
}

type Data = {
  getReport: (date: ExtendedDate) => Promise<Result<Report>>,
  getReports: (dates: ExtendedDate[]) => Promise<Result<ReportDictionary>>
  addReport: (report: Report) => void,
  addReports: (reports: Report[]) => void
}

const DEFAULT_DATA: Data = {
  getReport: function (date: ExtendedDate): Promise<Result<Report>> {
    throw new Error("Function not implemented.");
  },
  getReports: function (dates: ExtendedDate[]): Promise<Result<ReportDictionary>> {
    throw new Error("Function not implemented.");
  },
  addReport: function (report: Report): void {
    throw new Error("Function not implemented.");
  },
  addReports: function (reports: Report[]): void {
    throw new Error("Function not implemented.");
  }
}

export const ReportsContext = React.createContext<Data>(DEFAULT_DATA);
export const ReportsProvider = ({ children }: Props) => {

  const [ reports, setReports ] = React.useState<ReportDictionary>({});
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const { session } = React.useContext(SessionContext);

  const getReport = async (date: ExtendedDate): Promise<Result<Report>> => {
    const key = date.toString();
      if (reports.hasOwnProperty(key)) {
        return Result.Succeed().WithBody(reports[key]);
      }
    return await useLoading(async () => {      
      const result = await api.reports.getRangeReports( session.token, [ date ]);
      if (!result.wasSuccess || result.body == null) {
        return Result.Fail().WithErrors(result.errors).WithMessage('Failed to retrieve report.');
      }
      const report = result.body[0];

      setReports(r => ({ ...r, key: report }));
      return Result.Succeed().WithBody(report);
    });
  }

  const getReports = async (dates: ExtendedDate[]): Promise<Result<ReportDictionary>> => {
    const _reports: { [key: string]: Report } = {};
    const datesToFetch: ExtendedDate[] = [];
    
    dates.forEach(date => {
      const key = date.toSimpleString();
      if (reports.hasOwnProperty(key)) {
        _reports[key] = (reports[key]);
      } else {
        datesToFetch.push(date);
      }
    });
    if (datesToFetch.length < 1) {
      return Result.Succeed().WithBody(_reports);
    }
    return await useLoading(async () => {  
      const result = await api.reports.getRangeReports(session.token, datesToFetch);
      if (!result.wasSuccess || result.body == null) {
        return Result.Fail().WithErrors(result.errors).WithMessage('Failed to retrieve reports.');
      }

      result.body.forEach(report => {
        _reports[report.date.toSimpleString()] = report;
      });

      setReports(r => ({...r, ..._reports}));
      return Result.Succeed().WithBody(_reports);
    })
  }

  const addReport = (report: Report) => {

  }

  const addReports = (reports: Report[]) => {

  }

  return (
    <ReportsContext.Provider value={{ getReport, getReports, addReport, addReports }} >
      { children }
    </ReportsContext.Provider>
  );
}