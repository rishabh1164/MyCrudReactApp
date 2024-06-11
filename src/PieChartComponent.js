import React, { useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';

const PieChartComponent = () => {
    const initialData = [
        { asset: "Stocks", amount: 60000, yield: 3, },
        { asset: "Bonds", amount: 40000, yield: 4, },
        { asset: "Cash", amount: 7000, yield: 0.75, },
        { asset: "Real Estate", amount: 5000, yield: 4, },
        { asset: "Commodities", amount: 3000, yield: 5, },
    ];

    const [data, setData] = useState(initialData);
    const options = {
        data,
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
                    renderer: (params) => {
                        return {
                            content: `${params.datum.asset}: ${params.datum.amount} (Yield: ${params.datum.yield}%)`
                        };
                    }
                },
            },
        ],
        legend: {
            item: {
                onClick: (event) => {
                    //Here itemId corresponds to the field specified by 'legendItemKey' .
                    const itemName = event.itemId;
                    setData(data.map(d => d.asset === itemName ? { ...d, visible: !d.visible } : d));
                }
            }
        }
    };

    return (
        <div style={{ height: '100vh' }}>
            <AgChartsReact options={options} />
        </div>
    );
};

export default PieChartComponent;
