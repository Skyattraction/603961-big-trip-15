import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {generateDuration} from './route-point.js';
import {getWeightForNull} from './common.js';

const reducer = (previousValue, currentValue) => previousValue + currentValue;

const sortVal = (pointA, pointB) => {
  const weight = getWeightForNull(pointA, pointB);

  if (weight !== null) {
    return weight;
  }

  return pointB - pointA;
};

const generateEventTypesList = (points) => {
  const types = [];
  points.forEach((point) => {
    types.push(point.type);
  });
  const resultedTypes = [... new Set(types)];
  return resultedTypes;
};

const generateEventTypesListCaps = (points) => {
  const types = [];
  generateEventTypesList(points).forEach((item) => {
    const itemCaps = item.toUpperCase();
    types.push(itemCaps);
  });
  return types;
};

const generateMoneyValuesForType = (points) => {
  const accumulatedPrices = [];
  generateEventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    const basePrices = pointsWithType.map((point) => point.basePrice);
    const accumulatedPrice = basePrices.reduce(reducer, 0);

    accumulatedPrices.push(accumulatedPrice);
  });

  accumulatedPrices.sort(sortVal);

  return accumulatedPrices;
};

const generateQuantityForType = (points) => {
  const typeQuantities = [];
  generateEventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    typeQuantities.push(pointsWithType.length);
  });

  typeQuantities.sort(sortVal);

  return typeQuantities;
};

const generateDurationForType = (points) => {
  const durations = [];
  generateEventTypesList(points).forEach((item) => {
    const pointsWithType = points.filter((point) => point.type === item);
    let durationForType = 0;
    pointsWithType.forEach((subitem) => {
      const pointDuration = dayjs(subitem.dateTo).diff(dayjs(subitem.dateFrom));
      if (pointDuration > 0) {
        durationForType += pointDuration;
      }
    });
    durations.push(durationForType);
  });

  durations.sort(sortVal);

  return durations;
};

const renderMoneyChart = (moneyCtx, points) => new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: generateEventTypesListCaps(points),
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
    labels: generateEventTypesListCaps(points),
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
    labels: generateEventTypesListCaps(points),
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

export {generateEventTypesList, renderMoneyChart, renderTypeChart, renderTimeChart};
