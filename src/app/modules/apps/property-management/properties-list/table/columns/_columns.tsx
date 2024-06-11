import {Column} from 'react-table'
import {PropertyInfoCell} from './PropertyInfoCell'
import {PropertyBadgeCell} from './PropertyBadgeCell'
import {PropertyActionsCell} from "./PropertyActionsCell"
import {PropertySelectionCell} from './PropertySelectionCell'
import {PropertyCustomHeader} from './PropertyCustomHeader'
import {PropertySelectionHeader} from './PropertySelectionHeader'

import {Property} from '../../../_core/_models'

const propertiesColumns: ReadonlyArray<Column<Property>> = [
  {
    Header: (props) => <PropertySelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <PropertySelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='İlan' className='min-w-125px' />,
    id: 'title',
    Cell: ({...props}) => <PropertyInfoCell property={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='Ofis Id' className='min-w-125px' />,
    accessor: 'Ofis',
    Cell: ({...props}) => <PropertyBadgeCell text={props.data[props.row.index].officeId} />,
  },
  {
    Header: (props) => (
      <PropertyCustomHeader tableProps={props} title='' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <PropertyActionsCell id={props.data[props.row.index].id} />,
  },
]

export {propertiesColumns}
