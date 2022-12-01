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
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import useApi from '../Services/api'
import { cilCloudDownload, cilPenAlt, cilPlus, cilTrash } from '@coreui/icons'
import { cpfMask } from './functions/maskCpf'

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalNameField, setModalNameField] = useState('')
  const [modalEmailField, setModalEmailField] = useState('')
  const [modalCpfField, setModalCpfField] = useState('')
  const [modalFileField, setModalFileField] = useState('')
  const [modalId, setModalId] = useState('')

  const handelCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (index) => {
    setModalId(index.id)
    setModalNameField(index.name)
    setModalEmailField(index.email)
    setModalCpfField(index.cpf)
    setModalFileField(index.file)
    setShowModal(true)
  }

  const handleNewButton = () => {
    setModalId()
    setModalNameField()
    setModalEmailField()
    setModalCpfField()
    setShowModal(true)
  }

  const handleDownloadButton = (index) => {
    window.open(index.fileurl)
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeDocuments(index.id)
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
        name: modalNameField(),
        email: modalEmailField(),
        cpf: modalCpfField(),
      }
      if (!modalId) {
        if (modalFileField) {
          data.file = modalFileField
          result = await api.addDocuments(data)
        } else {
          alert('Selecione o arquivo!')
          setModalLoading(false)
          return
        }
      } else {
        if (modalFileField) {
          data.file = modalFileField
        }
        result = await api.updateDocuments(modalId, data)
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

  const handlechangeCpf = (e) => {
    setModalCpfField(cpfMask(e.target.value))
  }

  const columns = [
    {
      name: 'Nome',
      selector: (row) => row.name,
    },
    {
      name: 'E-mail',
      selector: (row) => row.email,
    },
    {
      name: 'CPF',
      selector: (row) => row.cpf,
    },
    {
      name: 'Permissão',
      selector: (row) => row.permission,
      compact: true,
    },
    {
      cell: (row) => (
        // eslint-disable-next-line react/jsx-no-undef
        <CRow className="justify-content-around w-100">
          <CCol className="text-center px-1">
            <CButton
              color="success"
              className="text-white"
              onClick={() => handleDownloadButton(row)}
            >
              <CIcon icon={cilCloudDownload} />
              Foto
            </CButton>
          </CCol>
          <CCol className="text-center px-1">
            <CButton color="info" className="text-white" onClick={() => handleEditButton(row)}>
              <CIcon icon={cilPenAlt} /> Editar
            </CButton>
          </CCol>
          <CCol className="text-center px-1">
            <CButton color="danger" className="text-white" onClick={() => handleRemoveButton(row)}>
              <CIcon icon={cilTrash} /> Excluir
            </CButton>
          </CCol>
        </CRow>
      ),
      selector: (row) => row.action,
      name: 'Ação',
      center: true,
      minWidth: '400px',
    },
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getUsers()
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
          <h2>Usuários</h2>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="btn-add-api" onClick={handleNewButton}>
                <CIcon icon={cilPlus} />
                Novo Usuário
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable columns={columns} data={list} progressPending={loading} pagination />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handelCloseModal}>
        <CModalHeader closeButton>{!modalId ? 'Novo' : 'Editar'} Usuário</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput type="hidden" id="modal-id" value={modalId} />
            <CFormInput
              type="text"
              id="modal-name"
              placeholder="Nome do usuário"
              label="Nome"
              value={modalNameField}
              onChange={(e) => setModalNameField(e.target.value)}
              disabled={modalLoading}
            />
            <br></br>
            <CFormInput
              type="email"
              id="modal-email"
              placeholder="Nome do usuário"
              label="Nome"
              value={modalEmailField}
              onChange={(e) => setModalEmailField(e.target.value)}
              disabled={modalLoading}
            />
            <br></br>
            <CFormInput
              type="text"
              id="modal-title"
              placeholder="Digite o CPF"
              label="CPF:"
              value={modalCpfField}
              onChange={handlechangeCpf}
              disabled={modalLoading}
            />
            <br></br>
            <CFormInput
              type="file"
              id="modal-file"
              label="Foto do usuário"
              placeholder="Escolha um arquivo"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => setModalFileField(e.target.files[0])}
              name="photo"
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
