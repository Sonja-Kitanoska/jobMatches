import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const JobsChart = ({ chartData }: any) => {
  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Weeks since Job posting',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
  };

  return <Line options={options} data={chartData} />;
};