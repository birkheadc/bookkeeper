import { Earning, Expense, Report } from "../../../types/report/report";
import * as React from 'react';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import { Result } from "../../../types/result/result";
import { SessionContext } from "../session/SessionContext";
import { ExtendedDate } from "../../../types/date/extendedDate";
import { useApi } from "../../../hooks/useApi/useApi";
import { SettingsContext } from "../settings/SettingsContext";


type Props = {
  children: React.ReactNode
}

type Data = {
  getReport: (date: ExtendedDate) => Promise<Result<Report>>,
  getReports: (dates: ExtendedDate[]) => Promise<Result<Record<string, Report>>>
  addReport: (report: Report) => Promise<Result>,
  addReports: (reports: Report[]) => Promise<Result>,
  uploadCsv: (file: any) => Promise<Result>,
  addTransactions: (transactions: { earnings: Earning[], expenses: Expense[] }) => Promise<Result>
}

const DEFAULT_DATA: Data = {
  getReport: function (date: ExtendedDate): Promise<Result<Report>> {
    throw new Error("Function not implemented.");
  },
  getReports: function (dates: ExtendedDate[]): Promise<Result<Record<string, Report>>> {
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
  },  
  addTransactions: function (transactions: { earnings: Earning[]; expenses: Expense[]; }): Promise<Result<any>> {
    throw new Error("Function not implemented.");
  }
}

export const ReportsContext = React.createContext<Data>(DEFAULT_DATA);
export const ReportsProvider = ({ children }: Props) => {

  const [ reports, setReports ] = React.useState<Record<string, Report>>({});
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const { session } = React.useContext(SessionContext);
  const { refreshSettings } = React.useContext(SettingsContext);

  const { api } = useApi();

  React.useEffect(function clearCacheOnChangeInSession() {
    setReports({});
  }, [ session ]);

  const getReport = async (date: ExtendedDate): Promise<Result<Report>> => {
    const key = date.toDto();
    if (reports.hasOwnProperty(key)) {
      return Result.Succeed().WithBody(reports[key]);
    }
    return await useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.reports.getReportsByDates( session.token, [ date ]);
      if (result.wasSuccess && result.body != null) {
        const report = result.body[0];
        setReports(r => {
          const newReports = {...r};
          newReports[key] = report;
          return newReports;
        });
        return Result.Succeed().WithBody(report);
      }
      return result.OfType();
    });
  }

  const getReports = async (dates: ExtendedDate[]): Promise<Result<Record<string, Report>>> => {
    const _reports: Record<string, Report> = {};
    const datesToFetch: ExtendedDate[] = [];
    
    dates.forEach(date => {
      const key = date.toDto();
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
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.reports.getReportsByDates(session.token, datesToFetch);
      if (result.wasSuccess && result.body != null) {
        result.body.forEach(report => {
          _reports[report.id.toDto()] = report;
        });
        setReports(r => ({ ...r, ..._reports }));
        return Result.Succeed().WithBody(_reports);
      }
      return result.OfType();
    })
  }

  const addReport = async (report: Report): Promise<Result> => {
    return await useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.reports.postReport(session.token, report);
      if (result.wasSuccess) {
        const record = Report.toRecord([report]);
        setReports(r => ({ ...r, ...record }));
      }
      await refreshSettings();
      return result;
    });
  }

  const addReports = async (reports: Report[]):Promise<Result> => {
    return Result.Fail().WithMessage('not yet implemented.');
  }

  const uploadCsv = async (file: File | undefined): Promise<Result> => {
    if (file == null) return Result.Fail().WithMessage('no file found');
    return await useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.reports.postCsv(session.token, file);
      if (result.wasSuccess) {
        setReports({});
        await refreshSettings();
      }
      return result;
    });
  }

  const addTransactions = async (transactions: { earnings: Earning[], expenses: Expense[] }): Promise<Result> => {
    return await useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.reports.postBatchTransactions(session.token, transactions);
      if (result.wasSuccess) {
        addTransactionsToCache(transactions);
        await refreshSettings();
      }
      return result;
    })
  }

  function addTransactionsToCache(transactions: { earnings: Earning[], expenses: Expense[] }) {
    const newReports = { ...reports };
    transactions.earnings.forEach(earning => {
      const key = earning.reportDate.toDto();
      if (!newReports.hasOwnProperty(key)) {
        const report = new Report();
        report.id = earning.reportDate;
        newReports[key] = report;
      }
      newReports[key].earnings.push(earning);
    });
    transactions.expenses.forEach(expense => {
      const key = expense.reportDate.toDto();
      if (!newReports.hasOwnProperty(key)) {
        const report = new Report();
        report.id = expense.reportDate;
        newReports[key] = report;
      }
      newReports[key].expenses.push(expense);
    });
    setReports(newReports);
  }
  
  return (
    <ReportsContext.Provider value={{ getReport, getReports, addReport, addReports, uploadCsv, addTransactions }} >
      { children }
    </ReportsContext.Provider>
  );
}