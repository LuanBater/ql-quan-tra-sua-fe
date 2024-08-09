import React, { useState, useEffect } from 'react';
import Header from '../HeaderPage/headerpage';
import { menuItemsKH, menuItemsNV, menuItemsQL } from '../HeaderPage/Menu';
import bannerhome1 from '../../resource/image/banner-home-.jpg';
import bannerhome2 from '../../resource/image/banner-home-2.jpg';
import bannerhome3 from '../../resource/image/banner 3.jpg';
import "../../resource/css/content.css"; 

function HomePage() {
  const maquyen = localStorage.getItem("maquyen");
  const [menuItems, setMenuItem] = useState([]);

  useEffect(() => {
    if (maquyen === null) {
      setMenuItem(menuItemsKH);
    } else if (maquyen === 'KH') {
      setMenuItem(menuItemsKH);
    } else if (maquyen === 'QL') {
      setMenuItem(menuItemsQL);
    } else {
      setMenuItem(menuItemsNV);
    }
  }, [maquyen]);

  return (
    <div>
      <Header menuItems={menuItems} />
      <div className="banner-container">
        <img src={bannerhome1} alt="banner" className="banner-img" />
      </div>
      <div className="banner-container">
        <img src={bannerhome2} alt="banner" className="banner-img" />
      </div>
      <div className="banner-container">
        <img src={bannerhome3} alt="banner" className="banner-img" />
      </div>
    </div>
  );
}

export default HomePage;
