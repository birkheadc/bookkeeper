import * as React from "react";
import "./DetailDisplay.css";
import { useSearchParams } from "react-router-dom";
import { Report } from "../../../../types/report/report";
import { ReportsContext } from "../../../../app/contexts/reports/ReportsContext";
import { ExtendedDate } from "../../../../types/date/extendedDate";
import { Result } from "../../../../types/result/result";
import ResultDisplay from "../../../resultDisplay/ResultDisplay";
import DetailLineChart from "./detailLineChart/DetailLineChart";
import { SessionContext } from "../../../../app/contexts/session/SessionContext";
import { SessionStatus } from "../../../../types/session/session";
import DetailBarChart from "./detailBarChart/DetailBarChart";
import DetailSummary from "./detailSummary/DetailSummary";
import { ReportsSummary } from "../../../../types/report/reportsSummary";
import StockBreakdown from "./stockBreakdown/StockBreakdown";

interface IDetailDisplayProps {}

/**
 *
 * @returns {JSX.Element | null}
 */
export default function DetailDisplay(
  props: IDetailDisplayProps
): JSX.Element | null {
  const [searchParams] = useSearchParams();

  const [reports, setReports] = React.useState<
    Record<string, Report> | undefined
  >();
  const { getReports } = React.useContext(ReportsContext);

  const summary = ReportsSummary.fromRecord(reports);

  React.useEffect(() => {
    (async function fetchReportsBasedOnSearchParams() {
      const startDate = ExtendedDate.fromStringOrNull(
        searchParams.get("startDate")
      );
      const endDate = ExtendedDate.fromStringOrNull(
        searchParams.get("endDate")
      );

      const dates = ExtendedDate.getRange(startDate, endDate);

      if (dates == null || dates.length < 1) return;
      const result = await getReports(dates);
      if (!result.wasSuccess || result.body == null) {
        setReports({});
      }
      setReports(result.body);
    })();
  }, [searchParams]);

  return (
    <div className="detail-display-wrapper">
      {reports && <DetailSummary summary={summary} />}
      {reports && <DetailLineChart reports={reports} />}
      {reports && <DetailBarChart summary={summary} />}
      {reports && <StockBreakdown reports={reports} />}
    </div>
  );
}
