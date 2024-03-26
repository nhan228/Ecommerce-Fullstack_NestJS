import { Store } from '@/store'
import { useSelector } from 'react-redux'

import './log.scss'

export default function Log() {
  const logStore = useSelector((store: Store) => store.logStore)
  return (
    <div className='log_table_body'>
      <h2 className='page_title'>Log all</h2>

      {/* LOGS TABLE */}
      <div className='logs'>
        <table>
          {/* header */}
          <thead>
            <tr>
              <th>#</th>
              <th>Member</th>
              <th>Note</th>
              <th>Time</th>
              <th>Tools</th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {
              logStore.data?.slice().reverse().map(log => (
                <tr key={Date.now() * Math.random()}>
                  <td>{log.id}</td>
                  <td style={{color: 'var(--danger)', fontWeight:'600'}}>{log.member.firstName + ' ' + log.member.lastName}</td>
                  <td>{log.note}</td>
                  <td>{`${(new Date(+log.createTime)).getDate()}/${(new Date(+log.createTime)).getMonth() + 1}/${(new Date(+log.createTime)).getFullYear()}
                <>${(new Date(+log.createTime)).getHours()}h
                :${(new Date(+log.createTime)).getMinutes()}'
                -${(new Date(+log.createTime)).getSeconds()}s
                `}</td>
                  <td>
                    <button className='btn-hide'>Hide</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
