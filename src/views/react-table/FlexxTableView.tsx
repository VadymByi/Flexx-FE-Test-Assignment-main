'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { Card, Checkbox, Typography, Select, Skeleton, MenuItem, Grid, CardContent, IconButton } from '@mui/material'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type RowSelectionState
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

const columnHelper = createColumnHelper<FlexxTableType>()

const columns = [
  columnHelper.display({
    id: 'select',
    enableSorting: false,
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
        onChange={row.getToggleSelectedHandler()}
      />
    )
  }),
  columnHelper.accessor('transaction_id', { header: 'Transaction' }),
  columnHelper.accessor('policy_holder', { header: 'Policyholder' }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: info => `$${Number(info.getValue() ?? 0).toLocaleString()}`
  }),
  columnHelper.accessor('method', { header: 'Method' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.display({
    id: 'tasks',
    header: 'Tasks',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        <Typography variant='body2' color='text.primary'>
          <span className='font-medium'>Upcoming:</span> {row.original.upcoming_task}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          <span className='font-medium'>Overdue:</span> {row.original.overdue_task}
        </Typography>
      </div>
    )
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    enableSorting: false,
    cell: () => (
      <div className='flex items-center gap-1'>
        <IconButton size='small'>
          <i className='ri-eye-line' />
        </IconButton>
        <IconButton size='small'>
          <i className='ri-edit-box-line' />
        </IconButton>
      </div>
    )
  })
]

const FlexxTableView = () => {
  const [data, setData] = useState<FlexxTableType[]>([])
  const [loading, setLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [statsData, setStatsData] = useState<CardStatsHorizontalProps[]>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row, index) => `${row.transaction_id}-${index}`,
    state: { rowSelection, sorting },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: { fuzzy: () => false },
    initialState: { pagination: { pageSize: 5 } }
  })

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true)
        const [tableResult, statsResult] = await Promise.all([fetchTableData(), fetchTopCardsData()])

        setData(tableResult)
        setStatsData(statsResult)
      } catch (error) {
        console.error('Data error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  return (
    <Grid container spacing={6}>
      {/* Cards Section */}
      {loading
        ? Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant='rectangular' height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))
        : statsData.map(item => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent className='flex justify-between items-center'>
                  <div className='flex flex-col' style={{ minHeight: '64px', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ maxWidth: 100, lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant='h4' sx={{ mt: 'auto' }}>
                      ${item.stats}
                    </Typography>
                  </div>
                  <CustomAvatar color={item.color} skin='light' variant='rounded' size={44}>
                    <i className={item.icon} />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>
          ))}

      {/* Table Section */}
      <Grid item xs={12}>
        <Card>
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(header => (
                      <th
                        key={header.id}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={header.column.getCanSort() ? styles.sortableHeader : ''}
                      >
                        <div className={styles.headerContent}>
                          <Typography variant='subtitle2' className='font-bold uppercase tracking-wider text-[0.8rem]'>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Typography>
                          {header.column.getIsSorted() && (
                            <i
                              className={
                                header.column.getIsSorted() === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                              }
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
                  ? Array.from(new Array(5)).map((_, i) => (
                      <tr key={i}>
                        {columns.map((_, ci) => (
                          <td key={ci}>
                            <Skeleton variant='text' width={ci === 0 ? 24 : '80%'} />
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
                disableUnderline
                SelectDisplayProps={{ style: { paddingRight: '32px', minWidth: '25px', fontSize: '0.875rem' } }}
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
                : `${
                    table.getPaginationRowModel().rows.length > 0
                      ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
                      : 0
                  }-${
                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                    table.getPaginationRowModel().rows.length
                  } of ${table.getPrePaginationRowModel().rows.length}`}{' '}
            </Typography>

            <div className='flex items-center'>
              <IconButton size='small' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <i className='ri-arrow-left-s-line' />
              </IconButton>
              <IconButton size='small' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
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
