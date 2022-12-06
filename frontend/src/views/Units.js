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
  CFormLabel,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import useApi from '../Services/api'
import { cilPenAlt, cilPlus, cilTrash } from '@coreui/icons'
let timer

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalNameField, setModalNameField] = useState('')
  const [modalOwnerSearchField, setModalOwnerSearchField] = useState('')
  const [modalOwnerSearchList, setModalOwnerSearchList] = useState([])
  const [modalOwnerField, setModalOwnerField] = useState(null)
  const [modalId, setModalId] = useState('')

  const handelCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (index) => {
    console.log(index.name)
    setModalId(index.id)
    setModalNameField(index.name)
    setModalOwnerSearchList([])
    setModalOwnerSearchField('')
    if (index.name_owner) {
      setModalOwnerField({
        name: index.name_owner,
        id: index.id,
      })
    } else {
      setModalOwnerField(null)
    }
    setShowModal(true)
  }

  const handleNewButton = () => {
    setModalId()
    setModalNameField('')
    setModalOwnerField(null)
    setModalOwnerSearchList([])
    setModalOwnerSearchField('')
    setShowModal(true)
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeUnit(index.id)
      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handelSaveModal = async () => {
    if (modalNameField) {
      setModalLoading(true)
      let result
      let data = {
        name: modalNameField,
        id_owner: modalOwnerField.id,
      }
      if (!modalId) {
        result = await api.addUnits(data)
      } else {
        result = await api.updateUnits(modalId, data)
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
      selector: (row) => row.name,
    },
    {
      name: 'Proprietário',
      selector: (row) => row.name_owner,
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

  useEffect(() => {
    if (modalOwnerSearchField !== '') {
      clearTimeout(timer)
      timer = setTimeout(searchUser, 1500)
    }
  }, [modalOwnerSearchField])

  const searchUser = async () => {
    if (modalOwnerSearchField !== '') {
      const result = await api.searchUser(modalOwnerSearchField)
      if (result.error === '') {
        setModalOwnerSearchList(result.list)
      } else {
        alert(result.error)
      }
    }
  }

  const selectModalOwnerField = (id) => {
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line
    let item = modalOwnerSearchList.find(modalOwnerSearchList => modalOwnerSearchList.id == id)
    setModalOwnerField(item)
    setModalOwnerSearchList([])
    setModalOwnerSearchField('')
  }

  const getList = async () => {
    setLoading(true)
    const result = await api.getUnits()
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
          <h2>Unidades</h2>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="btn-add-api" onClick={handleNewButton}>
                <CIcon icon={cilPlus} />
                Nova Unidade
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable columns={columns} data={list} progressPending={loading} pagination />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handelCloseModal}>
        <CModalHeader closeButton>{!modalId ? 'Novo' : 'Editar'} Unidade</CModalHeader>
        <CModalBody>
          <CFormInput type="hidden" id="modal-id" value={modalId} />
          <CForm>
            <CFormInput
              type="text"
              id="modal-name"
              placeholder="digite o nome da unidade"
              label="Nome da unidade"
              value={modalNameField}
              onChange={(e) => setModalNameField(e.target.value)}
            />
            <br></br>
            <CFormLabel htmlFor="modal-owner">Proprietário (nome, cpf ou e-mail)</CFormLabel>
            {modalOwnerField === null && (
              <>
                <CFormInput
                  type="text"
                  id="modal-owner"
                  value={modalOwnerSearchField}
                  onChange={(e) => setModalOwnerSearchField(e.target.value)}
                />
                <br></br>
                {modalOwnerSearchList.length > 0 && (
                  <CFormSelect htmlSize={5} onChange={(e) => selectModalOwnerField(e.target.value)}>
                    {modalOwnerSearchList.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                )}
              </>
            )}
            {modalOwnerField !== null && (
              <CRow>
                <CCol>
                  <CButton size="sm" color="danger" onClick={() => setModalOwnerField(null)}>
                    X
                  </CButton>
                  {modalOwnerField.name}
                </CCol>
              </CRow>
            )}
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
