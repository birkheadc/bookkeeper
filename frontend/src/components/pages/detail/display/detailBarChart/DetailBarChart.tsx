import * as React from 'react';
import './DetailBarChart.css';
import DetailBarChartControls from './controls/DetailBarChartControls';
import { Report } from '../../../../../types/report/report';
import { BreakdownMode } from '../../../../../types/detail/breakdownMode';
import { Bar } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { ReportsSummary } from '../../../../../types/report/reportsSummary';

interface IDetailBarChartProps {
  summary: ReportsSummary
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function DetailBarChart(props: IDetailBarChartProps): JSX.Element {

  const [ mode, setMode ] = React.useState<BreakdownMode>(BreakdownMode.DAY_OF_WEEK);

  const [ chartData, setChartData ] = React.useState<ChartData<'bar'>>({
    labels: [],
    datasets: [{
      data: [],
      borderColor: 'rgba(50, 50, 200, 0.8)',
      pointStyle: false
    }]
  })

  React.useEffect(() => {
    function generateChartData() {
      let labels = [];
      let amountData = [];

      if (mode === BreakdownMode.DAY_OF_WEEK) {
        for (let i = 0; i < 7; i++) {
          const breakdown = props.summary.breakdown.byDay[i];
          labels.push(DAYS_OF_WEEK[i]);
          amountData.push(breakdown?.average ?? 0);
        }
      } else if (mode === BreakdownMode.DAY_OF_MONTH) {
        for (let i = 1; i < 32; i++) {
          const breakdown = props.summary.breakdown.byDate[i];
          labels.push(i);
          amountData.push(breakdown?.average ?? 0);
        }
      } else {
        for (let i = 0; i < 12; i++) {
          const breakdown = props.summary.breakdown.byMonth[i];
          const month = new Date();
          month.setMonth(i);
          labels.push(month.toLocaleString('en-us', { month: 'long' }));
          amountData.push(breakdown?.average ?? 0);
        }
      }
      setChartData({
        labels: labels,
        datasets: [{
          data: amountData,
          backgroundColor: 'rgba(50, 50, 200, 0.8)',
          pointStyle: false
        }]
      });
    }
    generateChartData();
  }, [mode])
  
  return (
    <div className='detail-bar-chart-wrapper'>
      <h2>sales trends</h2>
      <DetailBarChartControls mode={mode} changeMode={setMode} />
      <div className='detail-chart-wrapper'>
      <Bar datasetIdKey="id" data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];