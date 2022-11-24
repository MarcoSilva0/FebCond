import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const Logout = React.lazy(() => import('./views/Logout'))
const Wall = React.lazy(() => import('./views/Wall'))
const Documents = React.lazy(() => import('./views/Documents'))
const Reservations = React.lazy(() => import('./views/Reservations'))
const Users = React.lazy(() => import('./views/Users'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logout', name: 'Logout', element: Logout },
  { path: '/avisos', name: 'Avisos', element: Wall },
  { path: '/documentos', name: 'Documentos', element: Documents },
  { path: '/reservas', name: 'Reservas', element: Reservations },
  { path: '/usuarios', name: 'Usuários', element: Users },
]

export default routes
