import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Header from '../HeaderPage/headerpage.jsx';
import { menuItemsNV } from '../HeaderPage/Menu.js';
import { getDonHangDaDat, getDonHangHoanThanh, getHoaDon ,duyetDonHang,hoanThanhDonHang} from '../../API/QLMuaHang.js';
import { formatDate } from '../../API/QLSanPham.js';

const QuanLyDonHang = ({navItems}) => {
  const [activeCategory, setActiveCategory] = useState('don-hang-cho-duyet');
  const [choDuyetList, setChoDuyetList] = useState([]);
  const [hoanThanhList, setHoanThanhList] = useState([]);
  const [hoaDonList, setHoaDonList] = useState([]);

  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('don-hang-cho-duyet');
        fetchChoDuyetList();
        break;
      case 2:
        setActiveCategory('don-hang-da-hoan-thanh');
        fetchHoanThanhList();
        break;
      case 3:
        setActiveCategory('hoa-don');
        fetchHoaDonList();
        break;
      default:
        setActiveCategory('don-hang-cho-duyet');
    }
  };

  const fetchHoaDonList = async () => {
    try {
      const data = await getHoaDon();
      setHoaDonList(data);
    } catch (error) {
      console.error('Error fetching ChoDuyet List:', error);
    }
  };
  const fetchChoDuyetList = async () => {
    try {
      const data = await getDonHangDaDat();
      setChoDuyetList(data);
    } catch (error) {
      console.error('Error fetching ChoDuyet List:', error);
    }
  };

  const fetchHoanThanhList = async () => {
    try {
      const data = await getDonHangHoanThanh();
      setHoanThanhList(data);
    } catch (error) {
      console.error('Error fetching HoanThanh List:', error);
    }
  };


const handleDuyetClick = async(madonhang) =>{
    try {
        await duyetDonHang("NV01",madonhang);
        fetchChoDuyetList();
      } catch (error) {
        console.error('Error duyệt đơn:', error);
      }

}
const handleHoanThanhClick = async(order) =>{
    try {
        const input = {
            madonhang: order.madonhang,
            list_sanpham: order.ctdh
        }
        await hoanThanhDonHang(input);
        fetchChoDuyetList();
      } catch (error) {
        console.error('Error duyệt đơn:', error);
      }

}

  useEffect(() => {
    fetchChoDuyetList();
  }, []);

  return (
    <div>
      <Header menuItems={menuItemsNV} />
      <div className="contents-container">
        <div className="contents-left">
          <nav className="vertical-nav">
            <ul>
            {navItems.map((item, index) => (
                <li key={index}>
                  <a href="#" onClick={() => handleCategorySelect(item.id)}>{item.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="contents-right">
          <div className="functional-content">
            {activeCategory === 'don-hang-cho-duyet' && (
              <div className="order-list">
                {choDuyetList.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Không còn đơn hàng chờ duyệt
                  </p>
                ) : (
                    <Table sx={{ border: '1px solid #ccc' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Mã đơn hàng</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Ngày tạo</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Thông tin khách hàng</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Thanh toán</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Chi tiết đơn hàng</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {choDuyetList.map((order) => (
                                <TableRow key={order.madonhang}>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{order.madonhang}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{order.ngaytao}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>
                                        <div>Khách đặt: {order.makh}-{order.tenkh}</div>
                                        <div>Địa chỉ: {order.diachi}</div>
                                        <div>SĐT: {order.sdt}</div>
                                    </TableCell >

                                    <TableCell sx={{ border: '1px solid #ccc' }}>{order.thanhtoan === 1 ? 'Tiền mặt' : 'Chuyển khoản'}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>
                                        {order.ctdh.map((item) => (
                                            <div key={item.idctdh}>
                                                <div>
                                                    <strong>Sản phẩm:</strong> {item.tensp} - {item.masize}
                                                </div>
                                                <div>
                                                    <strong>Số lượng:</strong> {item.soluong}
                                                </div>
                                                <div>
                                                    <strong>Giá:</strong> {item.gia.toLocaleString('vi-VN')}đ
                                                </div>
                                                <div>
                                                    <strong>Topping:</strong>
                                                    {item.listCT_Topping.length > 0 ? (
                                                        item.listCT_Topping.map((topping) => (
                                                            <div key={topping.idctdh}>
                                                                {topping.tensp} - {topping.soluong} - {topping.gia.toLocaleString('vi-VN')}đ
                                                            </div>
                                                        ))
                                                    ) : (
                                                        'Không có topping'
                                                    )}
                                                </div>
                                                <hr />
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {order.trangthai === 0 ? (
                                        <Button variant="contained" color="primary" onClick={() => handleDuyetClick(order.madonhang)}>
                                        Duyệt đơn
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="secondary" onClick={() => handleHoanThanhClick(order)}>
                                        Hoàn thành
                                        </Button>
                                    )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
              </div>
            )}
            {activeCategory === 'don-hang-da-hoan-thanh' && (
              <div className="order-list">
                {hoanThanhList.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Chưa có đơn hàng đã hoàn thành
                  </p>
                ) : (
                  <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Mã đơn hàng</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Ngày tạo</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Nhân viên duyệt</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thông tin khách hàng</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thanh toán</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Chi tiết đơn hàng</TableCell>
                        <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hoanThanhList.map((order) => (
                        <TableRow key={order.madonhang}>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.madonhang}</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.ngaytao}</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.manv} - {order.tennv}</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                            <div>Khách đặt: {order.makh} - {order.tenkh}</div>
                            <div>Địa chỉ: {order.diachi}</div>
                            <div>SĐT: {order.sdt}</div>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                            {order.thanhtoan === 1 ? 'Tiền mặt' : 'Chuyển khoản'}
                          </TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                            {order.ctdh.map((item) => (
                              <div key={item.idctdh}>
                                <div>
                                  <strong>Sản phẩm:</strong> {item.tensp} - {item.masize}
                                </div>
                                <div>
                                  <strong>Số lượng:</strong> {item.soluong}
                                </div>
                                <div>
                                  <strong>Giá:</strong> {item.gia.toLocaleString('vi-VN')}đ
                                </div>
                                <div>
                                  <strong>Topping:</strong>
                                  {item.listCT_Topping.length > 0 ? (
                                    item.listCT_Topping.map((topping) => (
                                      <div key={topping.idctsp}>
                                        {topping.tensp} - {topping.soluong} - {topping.gia.toLocaleString('vi-VN')}đ
                                      </div>
                                    ))
                                  ) : (
                                    'Không có topping'
                                  )}
                                </div>
                                <hr />
                              </div>
                            ))}
                          </TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                            <Button variant="contained" color="primary">
                              Xuất Hóa Đơn
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
            {activeCategory === 'hoa-don' && (
              <div className="order-list">
                {hoaDonList.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Chưa có hóa đơn
                  </p>
                ) : (
                  <Table sx={{ border: '1px solid #ccc' }}>
                  <TableHead>
                  <TableRow>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Số hóa đơn</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Mã đơn hàng</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Ngày xuất</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>MST</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Nhân viên duyệt</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Khách hàng</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Chi tiết đơn hàng</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Tổng giá</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                          {hoaDonList.map((hoadon) => (
                              <TableRow key={hoadon.mahoadon}>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.mahoadon}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.madonhang}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(hoadon.ngayxuat)}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.mst}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.manv} - {hoadon.tennv}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.makh}-{hoadon.tenkh} </TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>
                                      {hoadon.ctdh.map((item) => (
                                          <div key={item.idctdh}>
                                              <div>
                                                  <strong>Sản phẩm:</strong> {item.tensp} - {item.masize}
                                              </div>
                                              <div>
                                                  <strong>Số lượng:</strong> {item.soluong}
                                              </div>
                                              <div>
                                                  <strong>Giá:</strong> {item.gia.toLocaleString('vi-VN')}đ
                                              </div>
                                              <div>
                                                  <strong>Topping:</strong>
                                                  {item.listCT_Topping.length > 0 ? (
                                                      item.listCT_Topping.map((topping) => (
                                                          <div key={topping.idctsp}>
                                                              {topping.tensp} - {topping.soluong} - {topping.gia.toLocaleString('vi-VN')}đ
                                                          </div>
                                                      ))
                                                  ) : (
                                                      'Không có topping'
                                                  )}
                                              </div>
                                              <hr />
                                          </div>
                                      ))}
                                  </TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.tonggia.toLocaleString('vi-VN')}đ</TableCell>
                              </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuanLyDonHang;
