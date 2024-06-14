import React, { useMemo, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import 'tailwindcss/tailwind.css';

const initialData = {
    bytes: [
        { label: "Prisma Access to GCP CDEN", value: 70, color: '#1f77b4' },
        { label: "Prisma Access to Internet", value: 30, color: '#ff7f0e' },
    ],
    sessions: [
        { label: "Prisma Access to GCP CDEN", value: 50, color: '#2ca02c' },
        { label: "Prisma Access to Internet", value: 50, color: '#d62728' },
    ],
};

const calculatePercentage = (value, totalValue) => ((value / totalValue) * 100).toFixed(2);

export const calloutLabelFormatter = ({ datum }, totalValue, dataKey) => 
    `${datum.label} (${calculatePercentage(datum.value, totalValue)}%) ${datum.value} ${dataKey === 'bytes' ? 'GB' : 'Sessions'}`;

const TrafficDistributionPieChart = () => {
    const [dataKey, setDataKey] = useState('bytes');
    const [data, setData] = useState(initialData[dataKey]);
    const [colors, setColors] = useState(initialData[dataKey].map(item => item.color));

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4caf50',
            },
            error: {
                main: '#f44336',
            },
        },
    });

    const handleDataKeyChange = (event, newDataKey) => {
        if (newDataKey !== null) {
            setDataKey(newDataKey);
            setData(initialData[newDataKey]);
            setColors(initialData[newDataKey].map(item => item.color));
        }
    };

    const totalValue = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

    const options = {
        autoSize: true,
        background: {
            fill: '#1E1E1E',
        },
        data,

        series: [
            {
                type: "pie",
                angleKey: "value",
                radiusKey: 5,
                legendItemKey: "label",
                calloutLabelKey: "label",
                calloutLabel: {
                    enabled: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                    formatter: (params) => calloutLabelFormatter(params, totalValue, dataKey),
                    color: 'white',
                },
                calloutLine: {
                    length: 50,
                    strokeWidth: 2,
                    colors: data.map(d => d.color),
                    lineDash: [5, 5]
                },
                fills: colors,
                strokes: colors.map(() => '#FFFFFF'),
            },
        ],

        legend: {
            position: 'bottom',
            marker: {
                fill: params => colors[params.index],
            },
            item: {
                label: {
                    color: '#FFFFFF',
                },
            },
        },

    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ padding: '20px', backgroundColor: '#1E1E1E', borderRadius: '8px', width: '50vw' }}>
                <div style={{ marginBottom: '10px' }}>
                    <h2 style={{ color: 'white', margin: 0 }}>Egress Traffic Distribution</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'white', marginRight: '10px' }}>View Distribution by:</span>
                        <ToggleButtonGroup
                            value={dataKey}
                            exclusive
                            onChange={handleDataKeyChange}
                            aria-label="data key"
                            color="primary"
                            style={{
                                backgroundColor: '#2E2E2E',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <ToggleButton
                                value="bytes"
                                aria-label="bytes"
                                style={{
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 0,
                                    backgroundColor: dataKey === 'bytes' ? '#4caf50' : '#2E2E2E',
                                }}
                            >
                                Bytes
                            </ToggleButton>
                            <ToggleButton
                                value="sessions"
                                aria-label="sessions"
                                style={{
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 0,
                                    backgroundColor: dataKey === 'sessions' ? '#4caf50' : '#2E2E2E',
                                }}
                            >
                                Session Count
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div style={{ height: '500px' }}>
                    <AgChartsReact options={options} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default TrafficDistributionPieChart;
