import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {generateDuration} from './route-point.js';

const reducer = (previousValue, currentValue) => previousValue + currentValue;

const eventTypesList = (points) => {
  const list = [];
  points.forEach((point) => {
    list.push(point.type);
  });
  const resultedList = [... new Set(list)];
  return resultedList;
};

const eventTypesListCaps = (points) => {
  const list = [];
  eventTypesList(points).forEach((item) => {
    const itemCaps = item.toUpperCase();
    list.push(itemCaps);
  });
  return list;
};

const generateMoneyValuesForType = (points) => {
  const list = [];
  eventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    const prices = pointsWithType.map((point) => point.basePrice);
    const accumulatedPrice = prices.reduce(reducer, 0);

    list.push(accumulatedPrice);
  });
  return list;
};

const generateQuantityForType = (points) => {
  const list = [];
  eventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    list.push(pointsWithType.length);
  });
  return list;
};

const generateDurationForType = (points) => {
  const list = [];
  eventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    let durationForType = 0;
    pointsWithType.forEach((subitem) => {
      const pointDuration = dayjs(subitem.dateTo).diff(dayjs(subitem.dateFrom));
      if (pointDuration > 0) {
        durationForType += pointDuration;
      }
    });
    list.push(durationForType);
  });
  return list;
};

const renderMoneyChart = (moneyCtx, points) => new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: eventTypesListCaps(points),
    datasets: [{
      data: generateMoneyValuesForType(points),
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `€ ${val}`,
      },
    },
    title: {
      display: true,
      text: 'MONEY',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const renderTypeChart = (typeCtx, points) => new Chart(typeCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: eventTypesListCaps(points),
    datasets: [{
      data: generateQuantityForType(points),
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `${val}x`,
      },
    },
    title: {
      display: true,
      text: 'TYPE',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const renderTimeChart = (timeCtx, points) => new Chart(timeCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: eventTypesListCaps(points),
    datasets: [{
      data: generateDurationForType(points),
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => generateDuration(0, val),
      },
    },
    title: {
      display: true,
      text: 'TIME',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

export {eventTypesList, renderMoneyChart, renderTypeChart, renderTimeChart};
