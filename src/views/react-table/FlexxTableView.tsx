'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'

// Style Imports
import IconButton from '@mui/material/IconButton'



//Icons Imports
import styles from '@core/styles/table.module.css'



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
    initialState: {
      pagination: {
        pageSize:5, /* сделать через переменную*/
      }
    },
    enableRowSelection: true, 
  onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
              .rows
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
      <div className='flex items-center justify-end p-4 gap-6 border-t'>
  {/* 1. Селект Rows per page */}
  <div className='flex items-center gap-2'>
    <Typography variant='body2'>Rows per page:</Typography>
    <Select
      size='small'
      value={table.getState().pagination.pageSize}
      onChange={e => {
        table.setPageSize(Number(e.target.value))
      }}
      variant='standard'
      sx={{ minWidth: 60 }}
    >
      {[5, 10, 20].map(pageSize => (
        <MenuItem key={pageSize} value={pageSize}>
          {pageSize}
        </MenuItem>
      ))}
    </Select>
  </div>

  {/* 2. Указатель диапазона (например, 1-5 of 15) */}
  <Typography variant='body2'>
    {`${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
    ${Math.min(
      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
      table.getFilteredRowModel().rows.length
    )} of ${table.getFilteredRowModel().rows.length}`}
  </Typography>

  {/* 3. Стрелки управления */}
  <div className='flex items-center'>
    <IconButton 
      size='small' 
      onClick={() => table.previousPage()} 
      disabled={!table.getCanPreviousPage()}
    >
      <i className='ri-arrow-left-s-line' />
    </IconButton>
    <IconButton 
      size='small' 
      onClick={() => table.nextPage()} 
      disabled={!table.getCanNextPage()}
    >
      <i className='ri-arrow-right-s-line' />
    </IconButton>
  </div>
</div>
    </Card>
  )
}

export default FlexxTableView
