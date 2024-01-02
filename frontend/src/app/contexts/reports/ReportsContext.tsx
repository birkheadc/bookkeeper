import { Report, ReportDictionary } from "../../../types/report/report";
import * as React from 'react';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import api from "../../../api";
import { Result } from "../../../types/result/result";
import { report } from "process";


type Props = {
  children: React.ReactNode
}

type Data = {
  getReport: (date: Date) => Promise<Result<Report>>,
  getReports: (dates: Date[]) => Promise<Result<ReportDictionary>>
  addReport: (report: Report) => void,
  addReports: (reports: Report[]) => void
}

const DEFAULT_DATA: Data = {
  getReport: function (date: Date): Promise<Result<Report>> {
    throw new Error("Function not implemented.");
  },
  getReports: function (dates: Date[]): Promise<Result<ReportDictionary>> {
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

  const [ reports, setReports ] = React.useState<{[key: string]: Report}>({});
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const getReport = async (date: Date): Promise<Result<Report>> => {
    return await useLoading(async () => {
      const key = date.toString();
      if (reports.hasOwnProperty(key)) {
        return Result.Succeed().WithBody(reports[key]);
      }
      
      const result = await api.reports.getRangeReports([ date ]);
      if (!result.wasSuccess || result.body == null) {
        return Result.Fail().WithMessage('Failed to retrieve report.');
      }
      const report = result.body[0];

      setReports(r => ({ ...r, key: report }));
      return Result.Succeed().WithBody(report);
    });
  }

  const getReports = async (dates: Date[]): Promise<Result<ReportDictionary>> => {
    return await useLoading(async () => {
      const _reports: { [key: string]: Report } = {};
      const datesToFetch: Date[] = [];

      dates.forEach(date => {
        const key = date.toString();
        if (reports.hasOwnProperty(key)) {
          _reports[key] = (reports[key]);
        } else {
          datesToFetch.push(date);
        }
      });

      const result = await api.reports.getRangeReports(datesToFetch);
      if (!result.wasSuccess || result.body == null) {
        return Result.Fail().WithMessage('Failed to retrieve reports.');
      }

      result.body.forEach(report => {
        _reports[report.date.toString()] = report;
      });

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