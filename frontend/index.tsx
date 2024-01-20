import * as React from 'react';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';

import './src/styles/reset.css';
import './src/styles/vars.css';
import './src/styles/global.css';
import './src/styles/forms.css';

import App from './src/app/App';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

Modal.setAppElement('#react-root');
Modal.defaultStyles.content = {};
Modal.defaultStyles.overlay = {
  ...Modal.defaultStyles.overlay,
  // position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  inset: 0,
  zIndex: 5
};

// Initialize chart-js
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

const container = document.getElementById('react-root');

if (container != null) {
  const root = createRoot(container);
  root.render(<App />);
}