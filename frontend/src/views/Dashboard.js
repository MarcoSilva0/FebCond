/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import { CCol, CRow, CWidgetStatsF, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilBell, cilCalendar } from '@coreui/icons'
import useApi from '../Services/api'

const Dashboard = () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [listUsers, setListUsers] = useState([])
  const [listWall, setListWall] = useState([])
  const [listReservations, setListReservations] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const resultUsers = await api.getUsers()
    const resultWall = await api.getWall()
    const resultReservations = await api.getReservations()

    if (resultUsers.error === '') {
      setListUsers(resultUsers.list)
    }
    if (resultWall.error === '') {
      setListWall(resultWall.list)
    }
    if (resultReservations.error === '') {
      setListReservations(resultReservations.list)
    }

    setLoading(false)
  }

  return (
    <>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Usuários do sistema"
            value={loading ? <CSpinner /> : listUsers.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilBell} height={24} />}
            title="Avisos"
            value={loading ? <CSpinner /> : listWall.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilCalendar} height={24} />}
            title="Reservas"
            value={loading ? <CSpinner /> : listReservations.length}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
