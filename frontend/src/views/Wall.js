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
  CFormTextarea,
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
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalBodyField, setModalBodyField] = useState('')
  const [modalId, setModalId] = useState('')

  const handelCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (index) => {
    setModalId(index.id)
    setModalTitleField(index.title)
    setModalBodyField(index.body)
    setShowModal(true)
  }

  const handleNewButton = () => {
    setModalId()
    setModalTitleField()
    setModalBodyField()
    setShowModal(true)
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeWall(index.id)
      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handelSaveModal = async () => {
    if (modalTitleField && modalBodyField) {
      setModalLoading(true)
      let result
      let data = {
        title: modalTitleField,
        body: modalBodyField,
      }
      if (!modalId) {
        result = await api.addWall(data)
      } else {
        result = await api.updateWall(modalId, data)
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
      name: 'Título',
      selector: (row) => row.title,
    },
    {
      name: 'Data de Criação',
      selector: (row) => row.datecreated,
    },
    {
      cell: (row) => (
        // eslint-disable-next-line react/jsx-no-undef
        <CRow className="justify-content-around w-100">
          <CCol className="text-center">
            <CButton color="info" className="text-white" onClick={() => handleEditButton(row)}>
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
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getWall()
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
          <h2>Mural de avisos</h2>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="btn-add-api" onClick={handleNewButton}>
                <CIcon icon={cilPlus} />
                Novo Aviso
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable columns={columns} data={list} progressPending={loading} pagination />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handelCloseModal}>
        <CModalHeader closeButton>{!modalId ? 'Novo' : 'Editar'} Aviso</CModalHeader>
        <CModalBody>
          <CFormInput type="hidden" id="modal-id" value={modalId} />
          <CForm>
            <CFormInput
              type="text"
              id="modal-title"
              placeholder="Digite um título"
              label="Título do Aviso"
              value={modalTitleField}
              onChange={(e) => setModalTitleField(e.target.value)}
              disabled={modalLoading}
            />
            <br></br>
            <CFormTextarea
              id="modal-body"
              placeholder="Digite o conteúdo do aviso"
              label="Conteúdo do Aviso"
              value={modalBodyField}
              rows="5"
              onChange={(e) => setModalBodyField(e.target.value)}
              disabled={modalLoading}
            ></CFormTextarea>
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
