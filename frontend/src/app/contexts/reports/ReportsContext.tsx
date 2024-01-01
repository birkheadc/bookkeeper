import { Report } from "../../../types/report/report";
import * as React from 'react';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import api from "../../../api";


type Props = {
  children: React.ReactNode
}

type ReportsState = {
  reports: Report[],
  addReport: (report: Report) => void,
  addReports: (reports: Report[]) => void
}

export const ReportsContext = React.createContext<ReportsState>({ reports: [], addReport: () => {}, addReports: () => {} });
export const ReportsProvider = ({ children }: Props) => {
  const [ reports, setReports ] = React.useState<Report[]>([]);

  const { useLoading } = React.useContext(LoadingSpinnerContext);

  React.useEffect(() => {
    (async function fetchReportsOnMount() {
      useLoading(async () => {
        const reports = await api.reports.getRangeReports(new Date(), new Date());
        reports.body ? setReports(reports.body) : console.log('wat');
      });
    })();
  }, []);

  const addReport = (report: Report) => {

  }

  const addReports = (reports: Report[]) => {

  }

  return (
    <ReportsContext.Provider value={{ reports, addReport, addReports }} >
      { children }
    </ReportsContext.Provider>
  );
}