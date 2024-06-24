import {Column} from 'react-table'

import {PropertyCustomHeader} from './PropertyCustomHeader'
import {PropertySelectionHeader} from './PropertySelectionHeader'

import {PropertyInfoCell} from './PropertyInfoCell'
import {PropertyUsersCell} from './PropertyUsersCell'
import {PropertyActionsCell} from "./PropertyActionsCell"
import {PropertySelectionCell} from './PropertySelectionCell'
import { PropertyBadgeCell } from './PropertyBadgeCell'
import { PropertyActiveCell } from './PropertyActiveCell'
import { PropertyPermitUntilCell } from './PropertyPermitUntilCell'

import {Property} from '../../../_core/_models'


const propertiesColumns: ReadonlyArray<Column<Property>> = [
  {
    Header: (props) => <PropertySelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <PropertySelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='İlan Başlığı' className='min-w-125px' />,
    id: 'title',
    Cell: ({...props}) => <PropertyInfoCell property={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='Danışman' className='min-w-125px' />,
    id: "userIds",
    Cell: ({...props}) => <PropertyUsersCell userIds={props.data[props.row.index].userIds} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='Fiyat' className='min-w-125px' />,
    id: "price",
    Cell: ({...props}) => <PropertyBadgeCell text={props.data[props.row.index].propertyDetails.price} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='Yayında' className='min-w-125px' />,
    id: "active",
    Cell: ({...props}) => <PropertyActiveCell isActive={props.data[props.row.index].saleDetails?.active} />,
  },
  {
    Header: (props) => <PropertyCustomHeader tableProps={props} title='Yetki Bitiş Tarihi' className='min-w-125px' />,
    id: "permitUntilDate",
    Cell: ({...props}) => <PropertyPermitUntilCell date={props.data[props.row.index].ownerDetails?.permitUntilDate} />,
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
