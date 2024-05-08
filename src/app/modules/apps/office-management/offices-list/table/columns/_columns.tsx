import {Column} from 'react-table'
import {OfficeInfoCell} from './OfficeInfoCell'
import { OfficeBadgeCell } from './OfficeBadgeCell'
import { OfficeActionsCell } from './OfficeActionsCell'
import {OfficeSelectionCell} from './OfficeSelectionCell'
import { OfficeCustomHeader } from './OfficeCustomHeader'
import {OfficeSelectionHeader} from './OfficeSelectionHeader'
import {User} from '../../core/_models'

const officesColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <OfficeSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <OfficeSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <OfficeCustomHeader tableProps={props} title='Kullanıcı' className='min-w-125px' />,
    id: 'first_name',
    Cell: ({...props}) => <OfficeInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <OfficeCustomHeader tableProps={props} title='Ünvan' className='min-w-125px' />,
    accessor: 'role',
    Cell: ({...props}) => <OfficeBadgeCell text={props.data[props.row.index].role} />,
  },
  {
    Header: (props) => (
      <OfficeCustomHeader tableProps={props} title='Son Giriş' className='min-w-125px' />
    ),
    id: 'lastLoginAt',
    Cell: ({...props}) => <OfficeBadgeCell text={props.data[props.row.index].lastLoginAt} />,
  },
  {
    Header: (props) => (
      <OfficeCustomHeader tableProps={props} title='Kayıt Tarihi' className='min-w-125px' />
    ),
    accessor: 'createdAt',
    Cell: ({...props}) => <OfficeBadgeCell text={`test${props.data[props.row.index].createdAt}`} />,
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
