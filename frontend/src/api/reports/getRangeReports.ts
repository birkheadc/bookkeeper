import { Report } from "../../types/report/report";
import { Result } from "../../types/result/result";

export default async function getRangeReports(startDate: Date, endDate: Date): Promise<Result<Report[]>> {

  const DUMMY_REPORTS: Report[] = [
    {
      date: startDate,
      earnings: [
  
      ],
      expenses: [
  
      ]
    }
  ];

  return Result.Succeed().WithBody(DUMMY_REPORTS);
}