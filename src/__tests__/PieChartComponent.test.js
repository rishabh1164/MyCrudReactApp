import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import PieChartComponent from "../PieChartComponent";
import { AgChartsReact } from 'ag-charts-react';

const mockStore = configureStore([]);


jest.mock('ag-charts-react', () => ({
    AgChartsReact: jest.fn(() => null),
}));

describe('PieChartComponent', () => {
    let store;

    beforeEach(() => {
        AgChartsReact.mockClear();
        store = mockStore({
            reducer: {
                list: [
                    { id: 1, title: 'Learn React', completed: true },
                    { id: 2, title: 'Learn Deep Source', completed: false },
                    { id: 3, title: 'Complete test cases for palo alto', completed: false },
                ]
            }
        });
    });

    test('render PieChartComponent correctly', async () => {

        render(
            <Provider store={store}>
                <PieChartComponent />
            </Provider>
        );
        expect(AgChartsReact).toHaveBeenCalled();
    });

    test('should pass the correct option to AgChartsReact', () => {
        render(
            <Provider store={store}>
                <PieChartComponent />
            </Provider>
        );


        const expctedOptions = {
            data: [{ asset: "Stocks", amount: 60000, yield: 3, },
            { asset: "Bonds", amount: 40000, yield: 4, },
            { asset: "Cash", amount: 7000, yield: 0.75, },
            { asset: "Real Estate", amount: 5000, yield: 4, },
            { asset: "Commodities", amount: 3000, yield: 5, },],
            title: {
                text: "Portfolio Composition",
            },
            subtitle: {
                text: "Showing Annual Yield",
            },
            series: [
                {
                    type: "pie",
                    angleKey: "amount",
                    radiusKey: "yield",
                    legendItemKey: "asset",
                    calloutLabelKey: 'asset',
                    calloutLabel: {
                        enabled: true,
                    },
                    sectorLabelKey: 'amount',
                    sectorLabel: {
                        enabled: true,
                        fontWeight: 'bold'
                    },
                    tooltip: {
                        renderer: expect.any(Function),
                    },
                },
            ],
            legend: {
                item: {
                    onClick: expect.any(Function),
                }
            }
        };

        expect(AgChartsReact).toHaveBeenCalledWith(
            expect.objectContaining({ options: expctedOptions }),
            {} // passed empty object to tell react that no additional objects have been passed
        );
    });

    test('should toggle visibility of data on legend item click', () => {

        render(<Provider store={store}>
            <PieChartComponent />
        </Provider>)

        const legendClickHandler = AgChartsReact.mock.calls[0][0].options.legend.item.onClick;
        const event = { itemId: 'Stocks' };

        const initialData = [
            { asset: 'Stocks', amount: 60000, yield: 3 },
            { asset: 'Bonds', amount: 40000, yield: 4 },
            { asset: 'Cash', amount: 7000, yield: 0.75 },
            { asset: 'Real Estate', amount: 5000, yield: 4 },
            { asset: 'Commodities', amount: 3000, yield: 5 },
        ];

        legendClickHandler(event);

        const updatedData = [
            { asset: 'Stocks', amount: 60000, yield: 3, visible: false },
            { asset: 'Bonds', amount: 40000, yield: 4 },
            { asset: 'Cash', amount: 7000, yield: 0.75 },
            { asset: 'Real Estate', amount: 5000, yield: 4 },
            { asset: 'Commodities', amount: 3000, yield: 5 },
        ];
        expect(updatedData.find(d => d.asset === 'Stocks').visible).toBe(false);
    });

});
