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
  CFormSwitch,
  CFormLabel,
  CFormCheck,
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
  const [modalAllowedField, setModalAllowedField] = useState(1)
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalCoverField, setModalCoverField] = useState('')
  const [modalDaysField, setModalDaysField] = useState([])
  const [modalStartTimeField, setModalStartTimeField] = useState('')
  const [modalEndTimeField, setModalEndTimeField] = useState('')

  const handelCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (index) => {
    setModalId(index.id)
    setModalAllowedField(index.allowed)
    setModalTitleField(index.title)
    setModalCoverField('')
    setModalDaysField(index.days.split(','))
    setModalStartTimeField(index.start_time)
    setModalEndTimeField(index.end_time)
    setShowModal(true)
  }

  const handleNewButton = () => {
    setModalId()
    setModalAllowedField(1)
    setModalTitleField('')
    setModalCoverField('')
    setModalDaysField([])
    setModalStartTimeField('')
    setModalEndTimeField('')
    setShowModal(true)
  }

  const handleRemoveButton = async (index) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.deleteArea(index.id)
      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handelSaveModal = async () => {
    if (modalTitleField && modalStartTimeField && modalEndTimeField) {
      setModalLoading(true)
      let result
      let data = {
        allowed: modalAllowedField,
        title: modalTitleField,
        days: modalDaysField.join(','),
        start_time: modalStartTimeField,
        end_time: modalEndTimeField,
      }

      if (modalCoverField) {
        data.cover = modalCoverField
      }

      if (!modalId) {
        result = await api.addArea(data)
      } else {
        result = await api.updateArea(modalId, data)
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

  const handleSwitchClick = async (item) => {
    setLoading(true)
    const result = await api.updateAreaAllowed(item.id)
    setLoading(false)
    if (result.error === '') {
      getList()
    } else {
      alert(result.error)
    }
  }

  const handleModalSwitchClick = () => {
    setModalAllowedField(1 - modalAllowedField)
  }

  const toggleModalDays = (item, event) => {
    let dias = [...modalDaysField]

    if (event.target.checked === false) {
      dias = dias.filter((dia) => dia !== item)
    } else {
      dias.push(item)
    }

    setModalDaysField(dias)
  }

  const columns = [
    {
      cell: (row) => (
        <CFormSwitch
          color="success"
          checked={row.allowed}
          onChange={() => handleSwitchClick(row)}
        />
      ),
      name: 'Ativo',
      selector: (row) => row.allowed,
    },
    {
      cell: (row) => (
        <td>
          <img
            src={row.cover}
            width={100}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/Image_not_available.png'
            }}
            alt={'Capa da ' + row.title}
          />
        </td>
      ),
      name: 'Capa',
      selector: (row) => row.cover,
    },
    {
      name: 'Título',
      selector: (row) => row.title,
    },
    {
      format: (row) => {
        let diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
        let dias = row.days.split(',')
        let dayString = []
        for (let i in dias) {
          if (dias[i] && diasSemana[dias[i]]) {
            dayString.push(diasSemana[dias[i]])
          }
        }
        return <td>{dayString.join(', ')}</td>
      },
      name: 'Dias Funcionamento',
      selector: (row) => row.days,
      wrap: true,
    },
    {
      name: 'Abertura',
      selector: (row) => row.start_time,
      compact: true,
    },
    {
      name: 'Encerramentos',
      selector: (row) => row.end_time,
      compact: true,
    },
    {
      cell: (row) => (
        // eslint-disable-next-line react/jsx-no-undef
        <CRow className="justify-content-around w-100">
          <CCol className="text-center">
            <CButton color="info" className="text-white" onClick={() => handleEditButton(row)}>
              <CIcon icon={cilPenAlt} />
            </CButton>
          </CCol>
          <CCol className="text-center">
            <CButton color="danger" className="text-white" onClick={() => handleRemoveButton(row)}>
              <CIcon icon={cilTrash} />
            </CButton>
          </CCol>
        </CRow>
      ),
      selector: (row) => row.action,
      name: 'Ação',
      center: true,
      compact: true,
      minWidth: '140px',
    },
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getAreas()
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
          <h2>Áreas Comuns</h2>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="btn-add-api" onClick={handleNewButton}>
                <CIcon icon={cilPlus} />
                Nova Área Comum
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={columns}
                striped={true}
                data={list}
                progressPending={loading}
                pagination
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handelCloseModal}>
        <CModalHeader closeButton>{!modalId ? 'Nova' : 'Editar'} Área Comum</CModalHeader>
        <CModalBody>
          <CFormInput type="hidden" id="modal-id" value={modalId} />
          <CForm>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-allowed">Ativo</CFormLabel>
                <CFormSwitch
                  color="success"
                  checked={modalAllowedField}
                  onChange={handleModalSwitchClick}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-title">Título</CFormLabel>
                <CFormInput
                  type="text"
                  id="modal-title"
                  name="name"
                  value={modalTitleField}
                  onChange={(e) => setModalTitleField(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-cover">Capa</CFormLabel>
                <CFormInput
                  type="file"
                  id="modal-cover"
                  name="cover"
                  placeholder="Selecione uma imagem"
                  onChange={(e) => setModalCoverField(e.target.files[0])}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-dias">Dias de funcionamento</CFormLabel>
                <div>
                  <div>
                    <CFormCheck
                      id="modal-days-0"
                      name="modal-days"
                      value={0}
                      label="Segunda-feira"
                      checked={modalDaysField.includes('0')}
                      onChange={(e) => toggleModalDays('0', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-1"
                      name="modal-days"
                      value={1}
                      label="Terça-feira"
                      checked={modalDaysField.includes('1')}
                      onChange={(e) => toggleModalDays('1', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-2"
                      name="modal-days"
                      value={2}
                      label="Quarta-feira"
                      checked={modalDaysField.includes('2')}
                      onChange={(e) => toggleModalDays('2', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-3"
                      name="modal-days"
                      value={3}
                      label="Quinta-feira"
                      checked={modalDaysField.includes('3')}
                      onChange={(e) => toggleModalDays('3', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-4"
                      name="modal-days"
                      value={4}
                      label="Sexta-feira"
                      checked={modalDaysField.includes('4')}
                      onChange={(e) => toggleModalDays('4', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-5"
                      name="modal-days"
                      value={5}
                      label="Sábado"
                      checked={modalDaysField.includes('5')}
                      onChange={(e) => toggleModalDays('5', e)}
                    />
                  </div>
                  <div>
                    <CFormCheck
                      id="modal-days-6"
                      name="modal-days"
                      value={6}
                      label="Domingo"
                      checked={modalDaysField.includes('6')}
                      onChange={(e) => toggleModalDays('6', e)}
                    />
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-incio">Horário de ínicio</CFormLabel>
                <CFormInput
                  type="time"
                  id="modal-inicio"
                  name="start_time"
                  value={modalStartTimeField}
                  onChange={(e) => setModalStartTimeField(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="modal-fim">Horário de Fim</CFormLabel>
                <CFormInput
                  type="time"
                  id="modal-fim"
                  name="end_time"
                  value={modalEndTimeField}
                  onChange={(e) => setModalEndTimeField(e.target.value)}
                />
              </CCol>
            </CRow>
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
