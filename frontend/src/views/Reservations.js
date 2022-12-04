/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import useApi from '../Services/api'
import { cilPenAlt, cilPlus, cilTrash } from '@coreui/icons'

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalId, setModalId] = useState('')
  const [modalUnitList, setModalUnitList] = useState([])
  const [modalAreaList, setModalAreaList] = useState([])
  const [modalUnitId, setModalUnitId] = useState(0)
  const [modalAreaId, setModalAreaId] = useState(0)
  const [modalDateField, setModalDateField] = useState('')

  const handelCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (index) => {
    setModalId(index.id)
    setModalUnitId(index.id_unit)
    setModalAreaId(index.id_area)
    setModalDateField(index.reservation_date)
    setShowModal(true)
  }

  const handleNewButton = () => {
    setModalId('')
    setModalUnitId('')
    setModalAreaId('')
    setModalDateField('')
    setShowModal(true)
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeReservations(index.id)
      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handelSaveModal = async () => {
    if (true) {
      setModalLoading(true)
      let result
      let data = {}
      if (!modalId) {
        result = await api.addReservations(data)
      } else {
        result = await api.updateReservations(modalId, data)
      }
      setModalLoading(false)
      if (result.error === '') {
        setShowModal(false)
        getList()
      } else {
        alert(result.error)
      }
    } else {
      alert('Preencha os campos!')
    }
  }

  const columns = [
    {
      name: 'Unidade',
      selector: (row) => row.name_unit,
      sortable: true,
      compact: true,
    },
    {
      name: 'Id Unidade',
      selector: (row) => row.id_unit,
      omit: true,
    },
    {
      name: 'Área',
      selector: (row) => row.name_area,
      sortable: true,
      compact: true,
    },
    {
      name: 'Id Area',
      selector: (row) => row.id_area,
      omit: true,
    },
    {
      name: 'Data da reserva',
      selector: (row) => row.reservation_date,
      sortable: true,
      compact: true,
    },
    {
      cell: (row) => (
        // eslint-disable-next-line react/jsx-no-undef
        <CRow className="justify-content-around w-100">
          <CCol className="text-center">
            <CButton
              color="info"
              className="text-white"
              onClick={() => handleEditButton(row)}
              disabled={modalUnitList.length === 0 || modalAreaList.length === 0}
            >
              <CIcon icon={cilPenAlt} /> Editar
            </CButton>
          </CCol>
          <CCol className="text-center">
            <CButton color="danger" className="text-white" onClick={() => handleRemoveButton(row)}>
              <CIcon icon={cilTrash} /> Excluir
            </CButton>
          </CCol>
        </CRow>
      ),
      selector: (row) => row.action,
      name: 'Ação',
      center: true,
    },
  ]

  useEffect(() => {
    getList()
    getUnitList()
    getAreas()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getReservations()
    console.log(result)
    if (result.error === '') {
      setList(result.list)
      setLoading(false)
    } else {
      alert(result.error)
    }
  }

  const getUnitList = async () => {
    const result = await api.getUnits()
    if (result.error === '') {
      setModalUnitList(result.list)
    }
  }

  const getAreas = async () => {
    const result = await api.getAreas()
    if (result.error === '') {
      setModalAreaList(result.list)
    }
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Reservas</h2>
          <CCard>
            <CCardHeader>
              <CButton
                color="primary"
                className="btn-add-api"
                onClick={handleNewButton}
                disabled={modalUnitList.length === 0 || modalAreaList.length === 0}
              >
                <CIcon icon={cilPlus} />
                Nova Reserva
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable columns={columns} data={list} progressPending={loading} pagination />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handelCloseModal}>
        <CModalHeader closeButton>{!modalId ? 'Nova' : 'Editar'} Reserva</CModalHeader>
        <CModalBody>
          <CFormInput type="hidden" id="modal-id" value={modalId} />
          <CForm>
            <CFormSelect
              id="modal-unidade"
              aria-label="Default select example"
              label="Unidade"
              custom
              onChange={(e) => setModalUnitId(e.target.value)}
            >
              <option>Unidade</option>
              {modalUnitList.map((item, index) => (
                <option key={index} value={item.id} selected={item.id === modalUnitId}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
            <br></br>
            <CFormSelect
              id="modal-area"
              aria-label="Default select example"
              label="Area"
              custom
              onChange={(e) => setModalAreaId(e.target.value)}
            >
              <option>Área</option>
              {modalAreaList.map((item, index) => (
                <option key={index} value={item.id} selected={item.id === modalAreaId}>
                  {item.title}
                </option>
              ))}
            </CFormSelect>
            <br></br>
            <CFormInput
              type="text"
              id="modal-date"
              label="Data da reserva"
              value={modalDateField}
              onChange={(e) => setModalDateField(e.target.value)}
              disabled={modalLoading}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="text-white"
            onClick={handelSaveModal}
            disabled={modalLoading}
          >
            {modalLoading ? 'Carregando...' : 'Salvar'}
          </CButton>
          <CButton
            color="danger"
            className="text-white"
            onClick={handelCloseModal}
            disabled={modalLoading}
          >
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
