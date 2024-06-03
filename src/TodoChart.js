import React, { useCallback, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

const TodoChart = () => {
  const todos = useSelector(state => state.todos.list);
  const [yAxisType, setYAxisType] = useState('linear');
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  // console.log('yAxisType: ',yAxisType);
  const dates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
  const completedData = dates.map((date, index) => ({
    x: Date.parse(date),
    y: completedTodos.length > index ? completedTodos[index].id : 0,
  }));
  const pendingData = dates.map((date, index) => ({
    x: Date.parse(date),
    y: pendingTodos.length > index ? pendingTodos[index].id : 0,
  }));

  const options = useMemo(() => ({
    chart: {
      type: 'line',
    },
    title: {
      text: 'Todo Progress Over Time',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
      },
    },
    yAxis: {
      type: yAxisType,
      title: {
        text: 'Number of Todos',
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    plotOptions: {
      series: {
        events: {
          legendItemClick: function () {
            const visibility = this.visible ? 'visible' : 'hidden';
            this.chart.series.forEach(series => {
              if (series !== this) {
                series.setVisible(false, false);
              }
            });
            this.setVisible(true, true);
            return false;
          }
        }
      }
    },
    series: [
      {
        name: 'Completed Todos',
        data: completedData,
      },
      {
        name: 'Pending Todos',
        data: pendingData,
      },
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
        },
      }],
    },
  }), [completedData, pendingData]);

  const handleYAxisChange = useCallback(() => {
  setYAxisType(prevType => {
    if (prevType === 'linear') return 'logarithmic';
    if (prevType === 'logarithmic') return 'datetime';
    return 'linear';
  })
  }, []);
  console.log('charts->',Highcharts.charts);
  console.log('charts->',Highcharts.charts);

  return (
    <div>
      <button onClick={handleYAxisChange}>Toggle Y-Axis Type</button>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ 'data-testid': 'highcharts-container'}}
      />
    </div>
  );
};

export default TodoChart;
