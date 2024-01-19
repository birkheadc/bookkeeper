import * as React from 'react';
import './DetailLineChart.css'
import { Report } from '../../../../../types/report/report';
import DetailLineChartControls from './controls/DetailLineChartControls';
import { BrowseViewMode } from '../../../../../types/browse/browseViewMode';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface IDetailLineChartProps {
  reports: Record<string, Report>
}

/**
*
* @returns {JSX.Element | null}
*/
export default function DetailLineChart(props: IDetailLineChartProps): JSX.Element {

  const reports: Report[] = Object.values(props.reports);

  const [ mode, setMode ] = React.useState<BrowseViewMode>(BrowseViewMode.DAY);

  const [chartData, setChartData] = React.useState<{
    labels: string[],
    datasets: {
      id: string,
      data: number[],
      borderColor: string,
      tension: number,
      pointStyle: any,
      pointHitRadius?: number | undefined
    }[]
  }>({
    labels: [],
    datasets: [{
      id: 'gross',
      data: [],
      borderColor: 'rgba(50, 50, 200, 0.8)',
      tension: 0.3,
      pointStyle: false,
      pointHitRadius: undefined
    }, {
      id: 'net',
      data: [],
      borderColor: 'rgba(0, 0, 0, 0.8)',
      tension: 0.3,
      pointStyle: false,
      pointHitRadius: undefined
    }]
  });

  // Initialize chart-js
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(PointElement);
  Chart.register(LineElement);

  React.useEffect(() => {
    // The code ahead is a nightmare, turn back now if you value your life.
    function generateChartData() {

      let labels: string[] = [];
      let grossData = [];
      let netData = [];
  
      if (mode === 'month') {
        let currentMonth = new Date(reports[0].id).toLocaleString('default', { month: 'long' });
        let currentGross = 0;
        let currentExpense = 0;

        for (let i = 0; i < reports.length; i++) {
          const report = reports[i];
          const reportMonth = new Date(report.id).toLocaleString('default', { month: 'long' });
          if (reportMonth !== currentMonth || i === reports.length - 1) {
            labels.push(currentMonth + " '" + new Date(report.id).getFullYear().toString().slice(2));
            currentMonth = reportMonth;
            grossData.push(currentGross);
            netData.push(currentGross - currentExpense);
            currentGross = 0;
            currentExpense = 0;
          }
          for (let j = 0; j < report.earnings.length; j++) {
            currentGross += report.earnings[j].amount;
          }
          for (let j = 0; j < report.expenses.length; j++) {
            currentExpense += report.expenses[j].amount;
          }
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              id: 'gross',
              data: grossData,
              borderColor: 'rgba(50, 50, 200, 0.8)',
              tension: 0.3,
              pointStyle: false
            },
            {
              id: 'net',
              data: netData,
              borderColor: 'rgba(0, 0, 0, 0.8)',
              tension: 0.3,
              pointStyle: false
            }
          ]
        });
        return;
      }


      const span = (mode === 'week' ? 7 : 1);

      let currentGross = 0;
      let currentExpense = 0;

      for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        for (let j = 0; j < report.earnings.length; j++) {
          currentGross += report.earnings[j].amount;
        }
        for (let j = 0; j < report.expenses.length; j++) {
          currentExpense += report.expenses[j].amount;
        }
        if ((i+1) % span === 0) {
          labels.push((mode === 'week' ? '~' : '') + report.id.toSimpleString());
          grossData.push(currentGross);
          netData.push(currentGross - currentExpense);
          currentGross = 0;
          currentExpense = 0;
        }
      }
  
      setChartData({
        labels: labels,
        datasets: [
          {
            id: 'gross',
            data: grossData,
            borderColor: 'rgba(50, 50, 200, 0.8)',
            tension: 0.3,
            pointStyle: false,
            pointHitRadius: 1000
          },
          {
            id: 'net',
            data: netData,
            borderColor: 'rgba(0, 0, 0, 0.8)',
            tension: 0.3,
            pointStyle: false
          }
        ]
      });
    }
    generateChartData();
  }, [mode]);

  return (
    <div className='detail-line-chart-wrapper'>
      <DetailLineChartControls mode={mode} changeMode={setMode} />
      <div className='detail-chart-wrapper'>
        <Line datasetIdKey="id" data={chartData} options={{ maintainAspectRatio: true }} />
      </div>
    </div>
  );
}