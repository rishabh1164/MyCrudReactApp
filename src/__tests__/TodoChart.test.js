import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TodoChart from '../TodoChart';
import Highcharts from 'highcharts';

const mockStore = configureStore([]);
describe('TodoChart Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      todos: {
        list: [
          { id: 1, title: 'Learn React', completed: true },
          { id: 2, title: 'Learn Deep source', completed: false },
          { id: 3, title: 'Learn HighCharts', completed: true },
        ],
      },
    });
  });

  test('renders TodoChart component', async () => {
    render(
      <Provider store={store}>
        <TodoChart />
      </Provider>
    );
    // await waitFor(() =>  console.log('Highcharts 1 -> ', Highcharts.charts));
    expect(screen.getByText('Todo Progress Over Time')).toBeInTheDocument();
  });

  test('initial state of yAxisType is linear', async () => {
    render(
      <Provider store={store}>
        <TodoChart />
      </Provider>
    );
    // console.log('HighCharts.charts=>', Highcharts.charts);
    // await waitFor(() =>  console.log('Highcharts 2 -> ', Highcharts.charts));

    const chart = Highcharts.charts[1].userOptions;
    expect(chart.yAxis[0].type).toBe('linear');
  });

  test('correct rendering of completed and pending todos', async () => {
    render(
      <Provider store={store}>
        <TodoChart />
      </Provider>
    );

    const completedSeries = Highcharts.charts[2].series.find(
      series => series.name === 'Completed Todos'
    );
    const pendingSeries = Highcharts.charts[2].series.find(
      series => series.name === 'Pending Todos'
    );

    expect(completedSeries.data.length).toBe(5);
    expect(pendingSeries.data.length).toBe(5);

    expect(completedSeries.data[0].y).toBe(1);
    expect(pendingSeries.data[0].y).toBe(2);
  });

    test('yAxis type toggles correctly', () => {
      render(
        <Provider store={store}>
          <TodoChart />
        </Provider>
      );

      const button = screen.getByText('Toggle Y-Axis Type');
      fireEvent.click(button);
      // console.log(Highcharts.charts[3].userOptions.yAxis[0].type);
      let chartOptions = Highcharts.charts[3].userOptions;
      expect(chartOptions.yAxis[0].type).toBe('logarithmic');

      fireEvent.click(button);
      chartOptions = Highcharts.charts[3].userOptions;
      expect(chartOptions.yAxis[0].type).toBe('datetime');

      fireEvent.click(button);
      chartOptions = Highcharts.charts[3].userOptions;
      expect(chartOptions.yAxis[0].type).toBe('linear');
    });

    test('Highcharts options are configured correctly', () => {
      render(
        <Provider store={store}>
          <TodoChart />
        </Provider>
      );

      const chartOptions = Highcharts.charts[4].userOptions;
      expect(chartOptions.chart.type).toBe('line');
      expect(chartOptions.title.text).toBe('Todo Progress Over Time');
      expect(chartOptions.xAxis[0].type).toBe('datetime');
      expect(chartOptions.yAxis[0].title.text).toBe('Number of Todos');
    });
});
