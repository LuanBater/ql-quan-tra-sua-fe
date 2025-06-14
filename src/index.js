import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import QuanLySanPham from './components/Sanpham/QuanLySanPham';
import QuanLyNguyenLieu from './components/NguyenLieu/QuanLyNguyenLieu';
import QuanLyNhapHang from './components/NhapHang/QuanLyNhapHang';
import HomePage from './components/Home/HomePage';
import {QLSPItems,QLNLItems,QLNHItems,QLMHItems,QLDHItems,QLTTItems ,QLTKItems} from './components/HeaderPage/Menu'
import QuanLyBanHang from './components/QuanLyBanHang/QuanLyBanHang';
import QuanLyDonHang from './components/QuanLyBanHang/QuanLyDonHang';
import QuanLyThongTin from './components/ThongTin/QuanLyThongTin';
import QuanLyThongKe from './components/ThongKe/QuanLyThongKe';
import Login from './components/Login/Login.jsx'
export default function QLTS() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
        <Route index element={<HomePage />} />
        {/* Quản lý  */}
          <Route path="san-pham" element={<QuanLySanPham navItems = {QLSPItems} />} /> 
          <Route path="nguyen-lieu" element={<QuanLyNguyenLieu navItems = {QLNLItems} />} />
          <Route path="nhap-hang" element={<QuanLyNhapHang navItems={QLNHItems} />} />
          <Route path="thong-tin" element={<QuanLyThongTin navItems = {QLTTItems} />} /> 
          <Route path="thong-ke" element={<QuanLyThongKe navItems = {QLTKItems} />} /> 
            {/* Nhân viên  */}

          <Route path="don-hang" element={<QuanLyDonHang navItems={QLDHItems} />} />
          <Route path="mua-hang" element={<QuanLyBanHang navItems={QLMHItems} />} />
          {/* Khách Hàng  */}
          {/* <Route path="mua-hang" element={<QuanLyBanHang navItems={QLMHItems} />} /> */}
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<QLTS />);
