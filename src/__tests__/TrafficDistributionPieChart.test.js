import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrafficDistributionPieChart, { calloutLabelFormatter } from '../TrafficDistributionPieChart';
import { AgChartsReact } from 'ag-charts-react';

jest.mock('ag-charts-react', () => ({
    AgChartsReact: jest.fn(() => null),
}));

describe('TrafficDistributionPieChart', () => {
    beforeEach(() => {
        AgChartsReact.mockClear();
    });

    test('renders correctly with initial state', () => {
        render(<TrafficDistributionPieChart />);
        expect(screen.getByText('Egress Traffic Distribution')).toBeInTheDocument();
        expect(screen.getByLabelText('bytes')).toBeInTheDocument();
        expect(screen.getByLabelText('sessions')).toBeInTheDocument();
    });

    test('toggles between bytes and sessions', () => {
        render(<TrafficDistributionPieChart />);

        const bytesButton = screen.getByLabelText('bytes');
        const sessionsButton = screen.getByLabelText('sessions');

        expect(bytesButton).toHaveStyle('background-color: #4caf50');
        expect(sessionsButton).toHaveStyle('background-color: #2E2E2E');

        fireEvent.click(sessionsButton);

        expect(bytesButton).toHaveStyle('background-color: #2E2E2E');
        expect(sessionsButton).toHaveStyle('background-color: #4caf50');
    });

    test('callout label formatting', () => {
        const dataKeyBytes = 'bytes';
        const dataKeySessions = 'sessions';
        const totalValueBytes = 100;
        const totalValueSessions = 100;

        const labelBytes = calloutLabelFormatter({ datum: { label: "Prisma Access to GCP CDEN", value: 70 } }, totalValueBytes, dataKeyBytes);
        const labelSessions = calloutLabelFormatter({ datum: { label: "Prisma Access to GCP CDEN", value: 50 } }, totalValueSessions, dataKeySessions);

        expect(labelBytes).toBe("Prisma Access to GCP CDEN (70.00%) 70 GB");
        expect(labelSessions).toBe("Prisma Access to GCP CDEN (50.00%) 50 Sessions");
    });

    test('chart options configuration', () => {
        render(<TrafficDistributionPieChart />);

        const options = AgChartsReact.mock.calls[0][0].options;

        expect(options.background.fill).toBe('#1E1E1E');
        expect(options.legend.position).toBe('bottom');
        expect(options.series[0].fills).toEqual(['#1f77b4', '#ff7f0e']);
        expect(options.series[0].calloutLine.colors).toEqual(['#1f77b4', '#ff7f0e']);
    });
});
