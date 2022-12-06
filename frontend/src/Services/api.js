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
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

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

    //Ocorrências
    getWarnings: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/warnings', {}, token)
      return json
    },
    updateWarning: async () => {
      let token = localStorage.getItem('token')
      let json = await request('post', '/warnings', {}, token)
      return json
    },

    //Usuários
    getUsers: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/users', {}, token)
      return json
    },
    addUsers: async (data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('cpf', data.cpf)
      formData.append('permission', data.permission)
      formData.append('password', data.password)
      formData.append('password_confirm', data.password_confirm)
      if (data.photo) {
        formData.append('photo', data.photo)
      }
      let req = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    updateUser: async (id, data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('cpf', data.cpf)
      formData.append('permission', data.permission)
      formData.append('password', data.password)
      formData.append('password_confirm', data.password_confirm)
      if (data.photo) {
        formData.append('photo', data.photo)
      }
      let req = await fetch(`${baseUrl}/user/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    deleteUser: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/user/${id}`, {}, token)
      return json
    },

    //Áreas
    getAreas: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/areas', {}, token)
      return json
    },
    deleteArea: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/area/${id}`, {}, token)
      return json
    },
    addArea: async (data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      for (let i in data) {
        formData.append(i, data[i])
      }
      let req = await fetch(`${baseUrl}/areas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    updateArea: async (id, data) => {
      let token = localStorage.getItem('token')
      let formData = new FormData()
      for (let i in data) {
        formData.append(i, data[i])
      }
      let req = await fetch(`${baseUrl}/area/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      let json = await req.json()
      return json
    },
    updateAreaAllowed: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('put', `/area/${id}/allowed`, {}, token)
      return json
    },

    //Unidades
    getUnits: async () => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/units', {}, token)
      return json
    },
    searchUser: async (query) => {
      let token = localStorage.getItem('token')
      let json = await request('get', '/users/search', { q: query }, token)
      return json
    },
    addUnits: async (data) => {
      let token = localStorage.getItem('token')
      let json = await request('post', '/units', data, token)
      return json
    },
    updateUnits: async (id, data) => {
      let token = localStorage.getItem('token')
      let json = await request('put', `/unit/${id}`, data, token)
      return json
    },
    removeUnit: async (id) => {
      let token = localStorage.getItem('token')
      let json = await request('delete', `/unit/${id}`, {}, token)
      return json
    },
  }
}
