import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import useApi from '../Services/api'

const DefaultLayout = () => {
  const api = useApi()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      if (api.getToken()) {
        const result = await api.validateToken()
        if (result.error === '') {
          setLoading(false)
        } else {
          // alert(result.error)
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }
    checkLogin()
  }, [api, navigate])

  return (
    <div>
      {!loading && (
        <>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light dash-main">
            <AppHeader />
            <div className="body flex-grow-1 px-3">
              <AppContent />
            </div>
            {/* <AppFooter /> */}
          </div>
        </>
      )}
    </div>
  )
}

export default DefaultLayout
