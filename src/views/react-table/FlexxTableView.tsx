'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState
} from '@tanstack/react-table'

// Custom Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import styles from '@core/styles/table.module.css'

// Type Imports
import type { FlexxTableType } from '@/types/pages/flexxTableType'
import type { CardStatsHorizontalProps } from '@/types/pages/widgetTypes'

// Service Imports
import { flexService } from '@/services/flexxService'

const { fetchTableData, fetchTopCardsData } = flexService

// Column Definitions
const columnHelper = createColumnHelper<FlexxTableType>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
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
    cell: info => `$${info.getValue().toLocaleString()}`,
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
      <div className='flex flex-col'>
        <Typography variant='caption'>
          <strong>Upcoming:</strong> {row.original.upcoming_task}
        </Typography>
        <Typography variant='caption' color='error'>
          <strong>Overdue:</strong> {row.original.overdue_task}
        </Typography>
      </div>
    )
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: () => (
      <div className='flex items-center'>
        <IconButton size='small' onClick={() => console.log('View')}>
          <i className='ri-eye-line' />
        </IconButton>
        <IconButton size='small' onClick={() => console.log('Edit')}>
          <i className='ri-edit-box-line' />
        </IconButton>
      </div>
    )
  })
]

const FlexxTableView = () => {
  // States
  const [data, setData] = useState<FlexxTableType[]>([])
  const [loading, setLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState({})
  const [statsData, setStatsData] = useState<CardStatsHorizontalProps[]>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    },

    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  // Effects
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true)
        const [tableResult, statsResult] = await Promise.all([fetchTableData(), fetchTopCardsData()])

        setData(tableResult)
        setStatsData(statsResult)
      } catch (error) {
        console.error('Data was not loaded: ', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  return (
    <Grid container spacing={6}>
      {/* Cards with sceleton */}
      {loading
        ? Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={`stats-skeleton-${index}`}>
              <Card>
                <CardContent>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-2 w-full'>
                      <Skeleton variant='text' width='40%' height={20} />
                      <Skeleton variant='text' width='60%' height={32} />
                    </div>
                    <Skeleton variant='rounded' width={44} height={44} />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        : statsData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                      <Typography variant='body2'>{item.title}</Typography>
                      <Typography variant='h4'>${item.stats}</Typography>
                    </div>
                    <CustomAvatar color={item.color} skin='light' variant='rounded' size={44}>
                      <i className={item.icon} />
                    </CustomAvatar>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}

      {/* Table with sceleton*/}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Flexx Table' />
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          userSelect: 'none'
                        }}
                        className={header.column.getCanSort() ? 'hover:text-primary transition-colors' : ''}
                      >
                        <div className='flex items-center gap-1.5'>
                          <Typography
                            variant='subtitle2'
                            className='font-bold uppercase tracking-wider text-[0.8rem]'
                            color={header.column.getIsSorted() ? 'textPrimary' : 'textSecondary'}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </Typography>

                          {header.column.getIsSorted() && (
                            <i
                              className={
                                header.column.getIsSorted() === 'asc'
                                  ? 'ri-arrow-up-line text-primary'
                                  : 'ri-arrow-down-line text-primary'
                              }
                              style={{ fontSize: '1rem' }}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading
                  ? Array.from(new Array(table.getState().pagination.pageSize)).map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        {columns.map((_, colIndex) => (
                          <td key={`skeleton-cell-${colIndex}`}>
                            {colIndex === 0 ? (
                              <Skeleton variant='rectangular' width={20} height={20} sx={{ borderRadius: '4px' }} />
                            ) : (
                              <Skeleton variant='text' sx={{ fontSize: '1rem' }} width='80%' />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  : table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-end p-4 gap-6 border-t'>
            <div className='flex items-center gap-2'>
              <Typography variant='body2'>Rows per page:</Typography>
              <Select
                size='small'
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
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

            <Typography variant='body2'>
              {loading
                ? 'Loading...'
                : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )} of ${table.getFilteredRowModel().rows.length}`}
            </Typography>

            <div className='flex items-center'>
              <IconButton
                size='small'
                onClick={() => table.previousPage()}
                disabled={loading || !table.getCanPreviousPage()}
              >
                <i className='ri-arrow-left-s-line' />
              </IconButton>
              <IconButton size='small' onClick={() => table.nextPage()} disabled={loading || !table.getCanNextPage()}>
                <i className='ri-arrow-right-s-line' />
              </IconButton>
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FlexxTableView
