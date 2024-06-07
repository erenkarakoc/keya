import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserBadgeCell} from './UserBadgeCell'
import { UserActionsCell } from "./UserActionsCell"
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../../_core/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Kullanıcı' className='min-w-125px' />,
    id: 'firstName',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Ünvan' className='min-w-125px' />,
    accessor: 'role',
    Cell: ({...props}) => <UserBadgeCell text={props.data[props.row.index].role} type="role" />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Ofis' className='min-w-125px' />,
    accessor: 'officeId',
    Cell: ({...props}) => <UserBadgeCell text={props.data[props.row.index].officeId} type="officeId" />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
