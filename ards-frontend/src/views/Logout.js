/* eslint-disable import/no-anonymous-default-export */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useApi from '../Services/api'

export default () => {
  const api = useApi()
  const navigate = useNavigate()

  useEffect(() => {
    const doLogout = async () => {
      await api.logout()
      navigate('/login')
    }
    doLogout()
  }, [api, navigate])

  return null
}
