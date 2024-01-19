import * as React from 'react';
import './DetailBarChart.css';
import DetailBarChartControls from './controls/DetailBarChartControls';
import { Report } from '../../../../../types/report/report';

interface IDetailBarChartProps {
  reports: Record<string, Report>
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function DetailBarChart(props: IDetailBarChartProps): JSX.Element {
  return (
    <div className='detail-bar-chart-wrapper'>
      <DetailBarChartControls />
      <div className='detail-chart-wrapper'>
        detail bar chart not yet implemented
      {/* <Bar datasetIdKey="id" data={chartData} options={{ maintainAspectRatio: false }} /> */}
      </div>
    </div>
  );
}