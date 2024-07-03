import {Column} from 'react-table'
import {OfficeInfoCell} from './OfficeInfoCell'
import {OfficeBadgeCell} from './OfficeBadgeCell'
import {OfficeActionsCell} from "./OfficeActionsCell"
import {OfficeSelectionCell} from './OfficeSelectionCell'
import {OfficeCustomHeader} from './OfficeCustomHeader'
import {OfficeSelectionHeader} from './OfficeSelectionHeader'
import {OfficeUsersCell} from './OfficeUsersCell'

import {Office} from '../../../_core/_models'

const officesColumns: ReadonlyArray<Column<Office>> = [
  {
    Header: (props) => <OfficeSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <OfficeSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <OfficeCustomHeader tableProps={props} title='Ofis' className='min-w-125px' />,
    id: 'name',
    Cell: ({...props}) => <OfficeInfoCell office={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <OfficeCustomHeader tableProps={props} title='Şehir' className='min-w-125px' />,
    accessor: 'address',
    Cell: ({...props}) => <OfficeBadgeCell stateId={props.data[props.row.index].address.state ?? "2217"} />,
  },
  {
    Header: (props) => <OfficeCustomHeader tableProps={props} title='Broker' className='min-w-125px' />,
    id: 'owners',
    Cell: ({...props}) => <OfficeUsersCell userIds={props.data[props.row.index].owners} />,
  },
  {
    Header: (props) => (
      <OfficeCustomHeader tableProps={props} title='' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <OfficeActionsCell id={props.data[props.row.index].id} />,
  },
]

export {officesColumns}
