import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import "../../resource/css/header.css";
import banner1 from '../../resource/image/banner-tra-sua-1.jpg';
import banner2 from '../../resource/image/banner-tra-sua-3.jpg';
import banner3 from '../../resource/image/banner-tra-sua-2.jpg';
import logo from '../../resource/image/logo-tra-sua-1.jpg';

function HeaderPage({menuItems}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, // 5000 milliseconds = 5 seconds
        appendDots: (dots) => (
            <div style={{ bottom: '20px' }}>
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
          ),
      };

    const images = [
        { id: 1, url: banner1 },
        { id: 2, url: banner2 },
        { id: 3, url: banner3 },
    ];
      
    return (
        <div className="header-page-container">
            <div className="header-page-top">
                <div className="header-page-left">
                    <div className="logo" onClick={() => window.location.href = '/'}>
                        <img src={logo} alt="Logo" className="logo-img"/>
                    </div>
                </div>
                <div className="header-page-center">
                    <div className="banner">
                        <Slider {...settings}>
                            {images.map((image) => (
                                <div key={image.id}>
                                    <img src={image.url} alt={`Slide ${image.id}`} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="header-page-right">
                    <div className="user-info">
                        <button onClick={() => window.location.href = '/login'}>Đăng nhập</button>
                        <div className="user-details">
                            {/* Thông tin user sẽ hiển thị ở đây nếu đã đăng nhập */}
                        </div>
                    </div>
                </div>
            </div>
            <nav className="nav-bar">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a href={item.link}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default HeaderPage;
