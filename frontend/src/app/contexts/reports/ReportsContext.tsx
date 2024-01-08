import { Report, ReportDictionary } from "../../../types/report/report";
import * as React from 'react';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import { Result } from "../../../types/result/result";
import { SessionContext } from "../session/SessionContext";
import { ExtendedDate } from "../../../types/date/extendedDate";
import { SessionStatus } from "../../../types/session/session";
import api from "../../../api";
import { SettingsContext } from "../settings/SettingsContext";


type Props = {
  children: React.ReactNode
}

type Data = {
  getReport: (date: ExtendedDate) => Promise<Result<Report>>,
  getReports: (dates: ExtendedDate[]) => Promise<Result<ReportDictionary>>
  addReport: (report: Report) => Promise<Result>,
  addReports: (reports: Report[]) => Promise<Result>,
  uploadCsv: (file: any) => Promise<Result>
}

const DEFAULT_DATA: Data = {
  getReport: function (date: ExtendedDate): Promise<Result<Report>> {
    throw new Error("Function not implemented.");
  },
  getReports: function (dates: ExtendedDate[]): Promise<Result<ReportDictionary>> {
    throw new Error("Function not implemented.");
  },
  addReport: function (report: Report): Promise<Result> {
    throw new Error("Function not implemented.");
  },
  addReports: function (reports: Report[]): Promise<Result> {
    throw new Error("Function not implemented.");
  },
  uploadCsv: function (file: any): Promise<Result<any>> {
    throw new Error("Function not implemented.");
  }
}

export const ReportsContext = React.createContext<Data>(DEFAULT_DATA);
export const ReportsProvider = ({ children }: Props) => {

  const [ reports, setReports ] = React.useState<ReportDictionary>({});
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const { session } = React.useContext(SessionContext);

  const _api = session.status === SessionStatus.LOCAL ? api.local : api;

  React.useEffect(function clearCacheOnChangeInSession() {
    setReports({});
  }, [ session ]);

  const getReport = async (date: ExtendedDate): Promise<Result<Report>> => {
    const key = date.toSimpleString();
    if (reports.hasOwnProperty(key)) {
      return Result.Succeed().WithBody(reports[key]);
    }
    return await useLoading(async () => {
      const result = await _api.reports.getRangeReports( session.token, [ date ]);
      if (result.wasSuccess && result.body != null) {
        const report = result.body[0];
        setReports(r => {
          const newReports = {...r};
          newReports[report.date.toSimpleString()] = report;
          return newReports;
        });
        return Result.Succeed().WithBody(report);
      }
      return result.OfType();
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
      const result = await _api.reports.getRangeReports(session.token, datesToFetch);
      if (result.wasSuccess && result.body != null) {
        result.body.forEach(report => {
          _reports[report.date.toSimpleString()] = report;
        });
  
        setReports(r => ({...r, ..._reports}));
        return Result.Succeed().WithBody(_reports);
      }
      return result.OfType();
    })
  }

  const addReport = async (report: Report): Promise<Result> => {
    return await useLoading(async () => {
      const result = await _api.reports.postReport(session.token, report);
      if (result.wasSuccess) {
        const dict = Report.toDictionary([report]);
        setReports(r => ({ ...r, ...dict }));
      }
      return result;
    });
  }

  const addReports = async (reports: Report[]):Promise<Result> => {
    return Result.Fail().WithMessage('not yet implemented.');
  }

  const uploadCsv = async (file: File | undefined): Promise<Result> => {
    if (file == null) return Result.Fail().WithMessage('no file found');
    return await useLoading(async () => {
      const result = await _api.reports.postCsv(session.token, file);
      if (result.wasSuccess && result.body) {
        setReports(Report.toDictionary(result.body));
      }
      return result;
    });
  }

  return (
    <ReportsContext.Provider value={{ getReport, getReports, addReport, addReports, uploadCsv }} >
      { children }
    </ReportsContext.Provider>
  );
}