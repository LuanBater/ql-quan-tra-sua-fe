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
import { getDonHangDaDat, getDonHangHoanThanh, getHoaDon ,duyetDonHang,hoanThanhDonHang,xemHoaDon} from '../../API/QLMuaHang.js';
import { formatDate } from '../../API/QLSanPham.js';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
const QuanLyDonHang = ({navItems}) => {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "NV") {
    navigate("/")
  }
  const dialogStyles = {
    width: '600px',
    maxWidth: '600px',  // Đảm bảo không vượt quá 500px
};
  const user = localStorage.getItem("username")
  const [activeCategory, setActiveCategory] = useState('don-hang-da-hoan-thanh');
  const [hoanThanhList, setHoanThanhList] = useState([]);
  const [hoaDonList, setHoaDonList] = useState([]);
  const [hoaDon, setHoaDon] = useState();
  const [openHoaDon, setOpenHoaDon] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('don-hang-da-hoan-thanh');
        fetchHoanThanhList();
        break;
      case 2:
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
  useEffect(() => {
    fetchHoanThanhList();
  }, []);
  const fetchHoanThanhList = async () => {
    try {
      const data = await getDonHangHoanThanh();
      setHoanThanhList(data);
    } catch (error) {
      console.error('Error fetching HoanThanh List:', error);
    }
  };



  const handleCTHoaDon = async (madonhang) => {
    try {

      const data = await xemHoaDon(madonhang);
      setHoaDon(data);
      setOpenHoaDon(true);
    } catch (error) {
      console.error('Error fetching hoadon:', error);
    }
  };
  const handleClose = ()=> {
    setOpenHoaDon(false);
  }
  const handlePrint = async () => {
    const printWindow = window.open('', '', 'height=600,width=600');
    
    printWindow.document.write('<html><head><title>In hóa đơn</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { text-align: center; font-family: Arial, sans-serif; }');
    printWindow.document.write('table { width: 550px; margin: 0 auto; border-collapse: collapse; }');
    printWindow.document.write('th, td { padding: 8px; border: 1px solid #ddd; }');
    printWindow.document.write('th { background-color: #f4f4f4; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Hóa đơn mua hàng</h1>');
    printWindow.document.write("<h2>Cửa hàng trà sữa Luân's Milktea</h2>");
    printWindow.document.write(`<p><strong>Mã hóa đơn:</strong> ${hoaDon.mahoadon}</p>`);
    printWindow.document.write(`<p><strong>Mã đơn hàng:</strong> ${hoaDon.madonhang}</p>`);
    printWindow.document.write(`<p><strong>Ngày xuất:</strong> ${formatDate(hoaDon.ngayxuat)}</p>`);
    printWindow.document.write(`<p><strong>Khách Hàng:</strong> ${hoaDon.tenkh}</p>`);
    printWindow.document.write(`<p><strong>Nhân viên bán:</strong> ${hoaDon.manv} - ${hoaDon.tennv}</p>`);
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr><th>Sản phẩm</th><th>SL</th><th>Giá</th><th>Topping</th></tr></thead>');
    printWindow.document.write('<tbody>');
    
    hoaDon.ctdh.forEach(item => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${item.tensp} - ${item.masize}</td>`);
      printWindow.document.write(`<td>${item.soluong}</td>`);
      printWindow.document.write(`<td>${item.gia.toLocaleString('vi-VN')}đ</td>`);
      printWindow.document.write(`<td>${item.listCT_Topping.length > 0 
          ? item.listCT_Topping.map(topping => `${topping.tensp} - ${topping.soluong} - ${topping.gia.toLocaleString('vi-VN')}đ`).join('<br />') 
          : 'Không có topping'}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');
    printWindow.document.write(`<p><strong>Tổng giá:</strong> ${hoaDon.tonggia.toLocaleString('vi-VN')}đ</p>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Gắn sự kiện đóng sau khi in hoặc hủy in
    printWindow.onafterprint = () => {
        printWindow.close(); // Đóng cửa sổ in
    };
    
    printWindow.focus();
    printWindow.print(); // Bắt đầu in
    
    setOpenHoaDon(false); // Đóng dialog gốc
};
const [paymentFilter, setPaymentFilter] = useState('Tất cả'); // State để lọc loại thanh toán
const handlePaymentFilterChange = (event) => {
  setPaymentFilter(event.target.value);
};

const filteredHoanThanhList = hoanThanhList.filter((order) => {
  const matchesPayment = paymentFilter === 'Tất cả' || 
                         (paymentFilter === 'Chuyển khoản' && order.thanhtoan === 2) ||
                         (paymentFilter === 'Tiền mặt' && order.thanhtoan === 1);

  const matchesDate = !dateFilter || order.ngaytao === dateFilter;

  return matchesPayment && matchesDate;
});

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
                      {activeCategory === 'don-hang-da-hoan-thanh' && (
                      <div className="order-list">
                        {hoanThanhList.length === 0 ? (
                          <p variant="h6" align="center" style={{ padding: '20px' }}>
                            Chưa có đơn hàng đã hoàn thành
                          </p>
                        ) : (
                          <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <span>Hình thức thanh toán:</span>
                      {/* ComboBox lọc loại thanh toán */}
                      <select
                        value={paymentFilter}
                        onChange={handlePaymentFilterChange}
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Chuyển khoản">Chuyển khoản</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                      </select>

                      {/* Input lọc theo ngày tạo */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Ngày:</span>
                        <input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                      </div>
                    </div>

                            <Table sx={{ border: '1px solid #ccc' }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell colSpan={8}>
                                    <h2 style={{ textAlign: 'center' }}>Danh sách đơn hàng hoàn thành</h2>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                      Tổng doanh thu:
                    </TableCell>

                          <TableCell colSpan={2} style={{textAlign: 'left ', fontWeight: 'bold', fontSize: '18px' }}>
                            {filteredHoanThanhList.reduce((total, order) => {
                              const orderTotal = order.ctdh.reduce((orderSum, item) => {
                                const totalToppingPrice = item.listCT_Topping.reduce(
                                  (toppingSum, topping) => toppingSum + topping.gia ,
                                  0
                                );
                                return orderSum + (item.gia + totalToppingPrice) * item.soluong;
                              }, 0);
                              return total + orderTotal;
                            }, 0).toLocaleString('vi-VN')}
                            đ
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Mã đơn hàng</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Ngày tạo</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Nhân viên duyệt</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Khách hàng</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thanh toán</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Chi tiết đơn hàng</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thành tiền</TableCell>
                          <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredHoanThanhList.map((order) => (
                          <TableRow key={order.madonhang}>
                            <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.madonhang}</TableCell>
                            <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{formatDate(order.ngaytao)}</TableCell>
                            <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.manv} - {order.tennv}</TableCell>
                            <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>{order.tenkh}</TableCell>
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
                            {order.ctdh.reduce((total, item) => {
                              const toppingPrice = item.listCT_Topping.reduce(
                                (sum, topping) => sum + topping.gia ,
                                0
                              );
                              return total + (item.gia + toppingPrice) * item.soluong;
                            }, 0).toLocaleString('vi-VN')}đ
                          </TableCell>

                            <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                              <Button variant="contained" color="primary" onClick={() => handleCTHoaDon(order.madonhang)}>
                                Xuất Hóa Đơn
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
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
                      <TableCell colSpan={8} ><h2 style={{ textAlign: 'center' }}>Danh sách hóa đơn</h2></TableCell>
                    </TableRow>
                  <TableRow>
                  <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}}>Mã hóa đơn</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}}>Mã đơn hàng</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Ngày xuất</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}}>MST</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' ,width:'150px'}}>Nhân viên duyệt</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' ,width:'150px' }}>Khách hàng</TableCell>
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
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoadon.tenkh} </TableCell>
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
      <Dialog open={openHoaDon} onClose={handleClose} PaperProps={{ style: dialogStyles }}>
        {hoaDon 
        &&  (<>
        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
        <DialogContent>
        <b><h2>Cửa hàng trà sữa Luân's Milktea</h2></b>
        <p><strong>Mã hóa đơn:</strong> {hoaDon.mahoadon}</p>
        <p><strong>Mã đơn hàng:</strong> {hoaDon.madonhang}</p>
        <p><strong>Ngày xuất:</strong> {formatDate(hoaDon.ngayxuat)}</p>
        <p><strong>Khách Hàng:</strong> {hoaDon.tenkh} </p>
        <p><strong>Nhân viên bánt:</strong> {hoaDon.manv}- {hoaDon.tennv} </p>
          <Table sx={{ border: '1px solid #ccc'}}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ccc', width: "100px"}}>Sản phẩm</TableCell>
                <TableCell sx={{ border: '1px solid #ccc', width: "20px"}}>SL</TableCell>
                <TableCell sx={{ border: '1px solid #ccc', width: "50px" }}>Giá</TableCell>
                <TableCell sx={{ border: '1px solid #ccc'} }>Topping</TableCell>
                <TableCell sx={{ border: '1px solid #ccc'} }>Thành giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {hoaDon.ctdh.map((item) => {
              const thanhGia = item.gia + item.listCT_Topping.reduce((acc, topping) => acc + topping.gia, 0);
              return (
                <TableRow key={item.idctdh}>
                  <TableCell  sx={{ border: '1px solid #ccc'} }>{item.tensp} - {item.masize}</TableCell>
                  <TableCell  sx={{ border: '1px solid #ccc'} }>{item.soluong}</TableCell>
                  <TableCell  sx={{ border: '1px solid #ccc'} }>{item.gia.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell  sx={{ border: '1px solid #ccc'} }>
                    {item.listCT_Topping.length > 0
                      ? item.listCT_Topping.map((topping) => (
                          <div key={topping.idctdh}>
                            {topping.tensp} - {topping.soluong} - {topping.gia.toLocaleString('vi-VN')}đ
                          </div>
                        ))
                      : 'Không có topping'}
                  </TableCell>
                  <TableCell>{thanhGia.toLocaleString('vi-VN')}đ</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
            <TableCell colSpan={4} align="right"><strong>TỔNG GIÁ:</strong></TableCell>
            <TableCell>
              <strong>{hoaDon.tonggia.toLocaleString('vi-VN')}đ</strong>
            </TableCell>
          </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button onClick={handlePrint}>In</Button>
        </DialogActions>
        </>)}
        
      </Dialog>
    </div>
  );
};

export default QuanLyDonHang;
