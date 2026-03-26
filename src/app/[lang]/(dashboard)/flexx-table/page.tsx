// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component imports
import BasicDataTables from '@views/react-table/BasicDataTables'
import EditableDataTables from '@views/react-table/EditableDataTables'
import ColumnVisibility from '@views/react-table/ColumnVisibility'
import RowSelection from '@views/react-table/RowSelection'
import FlexxTableView from '@views/react-table/FlexxTableView'

const Tables = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>React Table</Typography>
      </Grid>

      <Grid item xs={12}>
        <FlexxTableView />
      </Grid>
    </Grid>
  )
}

export default Tables
