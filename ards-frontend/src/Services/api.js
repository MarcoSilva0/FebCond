/* eslint-disable import/no-anonymous-default-export */
const baseUrl = 'http://localhost:8000/api'

const request = async (method, endpoint, params, token = null) => {
  method = method.toLowerCase()
  let fullUrl = `${baseUrl}${endpoint}`
  let body = null

  // eslint-disable-next-line default-case
  switch (method) {
    case 'get':
      let queryString = new URLSearchParams(params).toString()
      fullUrl += `?${queryString}`
      break
    case 'post':
    case 'put':
    case 'delete':
      body = JSON.stringify(params)
      break
  }
  let headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  let req = await fetch(fullUrl, { method, headers, body })
  let json = await req.json()
  return json
}
export default () => {
  return {
    //Autorização
    getToken: () => {
      return localStorage.getItem('token')
    },
    validateToken: async () => {
      let token = localStorage.getItem('token')
      let json = await request('post', '/auth/validate', {}, token)
      return json
    },
    login: async (email, password) => {
      let json = await request('post', '/auth/login', { email, password })
      return json
    },
    logout: async () => {
      let token = localStorage.getItem('token')
      let json = await request('post', '/auth/logout', {}, token)
      localStorage.removeItem('token')
      return json
    },

    //Avisos
    getWall: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/walls', {}, token)
      return json
    },
    updateWall: async (id, data) => {
      let token = localStorage.getItem('token')
      let json = await request('put', `/wall/${id}`, data, token)
      return json
    },
    addWall: async (data) => {
      let token = localStorage.getItem('token')
      let json = await request('post', `/walls/`, data, token)
      return json
    },
    removeWall: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/wall/${id}`, {}, token)
      return json
    },

    //Documentos
    getDocuments: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/docs', {}, token)
      return json
    },
    addDocuments: async (data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      formData.append('title', data.title)
      if (data.file) {
        formData.append('file', data.file)
      }
      let req = await fetch(`${baseUrl}/docs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    updateDocuments: async (id, data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      formData.append('title', data.title)
      if (data.file) {
        formData.append('file', data.file)
      }
      let req = await fetch(`${baseUrl}/doc/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    removeDocuments: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/doc/${id}`, {}, token)
      return json
    },

    //Reservas
    getReservations: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/allreservations', {}, token)
      return json
    },
    updateReservations: async (id, data) => {
      let token = localStorage.getItem('token')
      let json = await request('put', `/wall/${id}`, data, token)
      return json
    },
    addReservations: async (data) => {
      let token = localStorage.getItem('token')
      let json = await request('post', `/walls/`, data, token)
      return json
    },
    removeReservations: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/wall/${id}`, {}, token)
      return json
    },
  }
}
