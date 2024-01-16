import { ReportDto } from "./report.dto";

export type PutTransactionsRequestDto = Omit<ReportDto, 'id'>