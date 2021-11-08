import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const defaultFilter = (row) => row;
const columns = [
  { name: 'Rubric ID', props: { align: 'right' }, value: ({ rubricId }) => rubricId },
  { name: 'User ID', value: ({ userId }) => userId },
  {
    name: 'Confidence %',
    value: ({ confidence }) => confidence,
    reducer: (average, confidence) => (average !== undefined ? (average + confidence) / 2 : confidence),
  },
  { name: 'Date', value: ({ date }) => date.toString() },
];

export const Votes: React.FunctionComponent = ({ data, filter }) => {
  const tableData = data.filter(filter || defaultFilter);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        {/* Headings */}
        <TableHead>
          <TableRow>
            {columns.map(({ name, props }, index) => (
              <TableCell key={index} {...props}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Totals */}
        <TableHead>
          <TableRow>
            {columns.map(({ reducer, value, props }, index) => (
              <TableCell key={index} {...props}>
                {reducer ? tableData.reduce((total, row) => reducer(total, value(row)), undefined) : ''}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {columns.map(({ value, props }, index) => (
                <TableCell key={index} component='th' scope='row' {...props}>
                  {value(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
