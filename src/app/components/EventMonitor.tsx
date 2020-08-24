import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

export default function EventMonitor(): JSX.Element {
  const rows = [
    { id: 1, channel: 1, event_type: 'Control Change', input_port: 'mpk49', data1: 1, data2: 127 },
    { id: 2, channel: 1, event_type: 'Program Change', input_port: 'dmc8', data1: 1, data2: 127 },
    { id: 3, channel: 1, event_type: 'Note On', input_port: 'mpk49', data1: 1, data2: 127 },
  ];
  return (
    <TableContainer>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Channel</TableCell>
            <TableCell>Event Type</TableCell>
            <TableCell>Input Port</TableCell>
            <TableCell>Data1</TableCell>
            <TableCell>Data2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.channel}</TableCell>
              <TableCell>{row.event_type}</TableCell>
              <TableCell>{row.input_port}</TableCell>
              <TableCell>{row.data1}</TableCell>
              <TableCell>{row.data2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
