/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CFormSwitch, CButton, CCol, CRow } from '@coreui/react'
import DataTable from 'react-data-table-component'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import useApi from '../Services/api'

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [photoList, setPhotoList] = useState([])
  const [photListIndex, setPhotoListIndex] = useState(0)

  const columns = [
    {
      cell: (row) => (
        <CFormSwitch
          color="success"
          checked={row.status === 'RESOLVED'}
          onChange={(e) => handleSwitchClick(e, row)}
        />
      ),
      name: 'Resolvido',
      selector: (row) => row.status,
      sortable: true,
      compact: true,
    },
    {
      name: 'Unidade',
      selector: (row) => row.name_unit,
      compact: true,
    },
    {
      name: 'Titulo',
      selector: (row) => row.title,
      compact: true,
    },
    {
      cell: (row) => (
        <td>
          {row.photos.length > 0 && (
            <CButton color="success" onClick={() => showLightBox()}>
              {row.photos.length} foto{row.photos.length !== 1 ? 's' : ''}
            </CButton>
          )}
        </td>
      ),
      name: 'Fotos',
      compact: true,
    },
    {
      name: 'Data',
      selector: (row) => row.datecreated,
      format: (row) => row.datecreated_formatted,
      sortable: true,
      compact: true,
    },
  ]

  const handleSwitchClick = () => {}
  const showLightBox = (photos) => {
    setPhotoListIndex(0)
    setPhotoList(photos)
  }

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getWarnings()
    if (result.error === '') {
      setList(result.list)
      setLoading(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Ocorrências</h2>
          <CCard>
            <CCardBody>
              <DataTable columns={columns} data={list} progressPending={loading} pagination />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {photoList.length > 0 && (
        <Lightbox
          mainSrc={photoList[photListIndex]}
          nextSrc={photoList[photListIndex + 1]}
          prevSrc={photoList[photListIndex - 1]}
          onCloseRequest={() => setPhotoList([])}
          onMovePrevRequest={() => {
            if (photoList[photListIndex - 1] !== undefined) {
              setPhotoListIndex(photoList[photListIndex - 1])
            }
          }}
          onMoveNextRequest={() => {
            if (photoList[photListIndex + 1] !== undefined) {
              setPhotoListIndex(photoList[photListIndex + 1])
            }
          }}
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
