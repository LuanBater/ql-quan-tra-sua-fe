import React from 'react'
import Header from '../HeaderPage/headerpage'
import { menuItemsQL ,menuItemsKH} from '../HeaderPage/Menu'
function HomePage() {
  return (
    <body>
    <div className='fullScreen'>
        <Header menuItems = {menuItemsKH}></Header>
      <p>ĐÂY LÀ HOME PAGE</p>
    </div>
    </body>
  )
}

export default HomePage
