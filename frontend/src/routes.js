import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const Logout = React.lazy(() => import('./views/Logout'))
const Wall = React.lazy(() => import('./views/Wall'))
const Documents = React.lazy(() => import('./views/Documents'))
const Reservations = React.lazy(() => import('./views/Reservations'))
const Users = React.lazy(() => import('./views/Users'))
const Warnings = React.lazy(() => import('./views/Warnings'))
const AreasComuns = React.lazy(() => import('./views/AreasComuns'))
const Units = React.lazy(() => import('./views/Units'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logout', name: 'Logout', element: Logout },
  { path: '/avisos', name: 'Avisos', element: Wall },
  { path: '/documentos', name: 'Documentos', element: Documents },
  { path: '/reservas', name: 'Reservas', element: Reservations },
  { path: '/ocorrencias', name: 'Ocorrências', element: Warnings },
  { path: '/usuarios', name: 'Usuários', element: Users },
  { path: '/areas-comuns', name: 'AreasComuns', element: AreasComuns },
  { path: '/unidades', name: 'Unidades', element: Units },
]

export default routes
