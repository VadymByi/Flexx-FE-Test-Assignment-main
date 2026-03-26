'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Style Imports
import IconButton from '@mui/material/IconButton'

import styles from '@core/styles/table.module.css'

//Icons Imports


// Type Imports
import type { FlexxTableType } from '@/types/pages/flexxTableType'

//Service Imports
import { flexService } from '@/services/flexxService';

const { fetchTableData, fetchTopCardsData } = flexService;

// Column Definitions
const columnHelper = createColumnHelper<FlexxTableType>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()}/>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()} disabled={!row.getCanSelect()}
      indeterminate={row.getIsSomeSelected()} onChange={row.getToggleSelectedHandler()}/>
    )
  }),
  columnHelper.accessor('transaction_id', {
    cell: info => info.getValue(),
    header: 'Transaction'
  }),
  columnHelper.accessor('policy_holder', {
    cell: info => info.getValue(),
    header: 'Policyholder'
  }),
  columnHelper.accessor('amount', {
    cell: info => info.getValue(),
    header: 'Amount'
  }),
  columnHelper.accessor('method', {
    cell: info => info.getValue(),
    header: 'Method'
  }),
  columnHelper.accessor('status', {
    cell: info => info.getValue(),
    header: 'Status'
  }),  
  columnHelper.display({
    id: 'tasks',
    header: 'Tasks',
    cell: ({ row }) => (
      <div>
        <strong>Upcoming:</strong> {row.original.upcoming_task}<br />
        <strong>Overdue:</strong> {row.original.overdue_task}
      </div>

    )
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: () => (
      <div>
        <IconButton size="small" onClick={() => console.log('View')}>
          <i className="ri-eye-line" /> 
        </IconButton>
        <IconButton size="small" onClick={() => console.log('Edit')}>
          <i className="ri-edit-box-line" />
        </IconButton>
      </div>
    )
  })
]

const FlexxTableView = () => {
  // States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<FlexxTableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});


  // Hooks


  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true, 
  onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  // Effects

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchTableData();

        setData(result);
      } catch (error) {
console.error('Data was not loaded: ', error)
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);


  return (
    <Card>
      <CardHeader title='Flexx Table' />
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default FlexxTableView
