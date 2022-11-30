import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <p>2022 ArdSytem</p>
      </div>
      <div className="ms-auto">
        <span className="me-1">Desenvolvido por</span>
        <a
          href="https://www.linkedin.com/in/marco-antonio-rodrigues-da-silva-b7577b176/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Marco Silva
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
