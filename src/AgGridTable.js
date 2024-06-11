import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PieChartComponent from './PieChartComponent';

const rowData = [
  {
    site_name: "ABCD-TEST",
    site_status: "up",
    site_type: "SDWAN",
    site_location: "UK",
    site_bgp_status: "down",
    tunnel_up_count: "2",
    tunnel_total_count: "6",
    tunnel_status: "up"
  },
];

const columnDefs = [
  { headerName: 'Site Name', field: 'site_name', sortable: true, filter: true },
  { headerName: 'Site Status', field: 'site_status', sortable: true, filter: true },
  { headerName: 'Site Type', field: 'site_type', sortable: true, filter: true },
  { headerName: 'Site Location', field: 'site_location', sortable: true, filter: true },
  { headerName: 'BGP Status', field: 'site_bgp_status', sortable: true, filter: true },
  {
    headerName: 'Pie Chart',
    field: 'pie_chart',
    cellRenderer: PieChartComponent
  }
];

const AgGridTable = () => {
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AgGridTable;
