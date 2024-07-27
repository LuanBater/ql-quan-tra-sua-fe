import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer, Typography, Paper } from '@mui/material';
import Header from '../HeaderPage/headerpage.jsx';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import { 
//   getHoaDonTrongNgay, 
//   getHoaDonTrongThang, 
//   getNhapTrongThang, 
//   getTongHopThuChiThang, 
getDanhSachCPPS, 
  themCPPS,
  xoaCPPS, 
  updateCPPS ,formatDate,getHoaDonNgay,getHoaDonThang,getPhieuNhapThang
} from '../../API/QLThongKe.js';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const QuanLyThongKe = ({ navItems }) => {
  const [activeCategory, setActiveCategory] = useState('hoa-don-trong-ngay');
  const [thongKeList, setThongKeList] = useState([]);
  const [CPPSList, setCPPSList] = useState([]);
  const [hoaDonNgayList, setHoaDonNgayList] = useState([]);
  const [hoaDonThangList, setHoaDonThangList] = useState([]);
  const [phieuNhapThangList, setPhieuNhapThangList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [temp1, setTemp1] = useState('');
  const [temp2, setTemp2] = useState('');
  const [openDELDialog, setOpenDELDialog] = useState(false);
  const [selectCPPS, setSelectCPPS] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setSelectedDate(today);
  }, []);
  const handleCategorySelect = async (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('hoa-don-trong-ngay');
        await fetchHoaDonTrongNgay(selectedDate);
        break;
      case 2:
        setActiveCategory('hoa-don-trong-thang');
        setSelectedMonth('');
        setSelectedYear('');
        await fetchHoaDonTrongThang(selectedMonth,selectedYear);
        break;
      case 3:
        setActiveCategory('nhap-trong-thang');
        setSelectedMonth('');
        setSelectedYear('');
        await fetchNhapTrongThang(selectedMonth,selectedYear);
        break;
      case 4:
        setActiveCategory('thu-chi-thang');
        // await fetchTongHopThuChiThang();
        break;
      case 5:
        setActiveCategory('chi-phi-phat-sinh');
        await fetchChiPhiPhatSinh();
        break;
      default:
        setActiveCategory('chi-phi-phat-sinh');
        await fetchChiPhiPhatSinh();
    }
  };

    const fetchHoaDonTrongNgay = async (selectedDate) => {
        try {
        const data = await getHoaDonNgay(selectedDate);
        setHoaDonNgayList(data);
        } catch (error) {
        console.error('Error fetching Hoa Don Trong Ngay:', error);
        }
    };

    const fetchHoaDonTrongThang = async (selectedMonth,selectedYear) => {
        console.log()
        try {
        const data = await getHoaDonThang(selectedMonth,selectedYear);
        setTemp1(selectedMonth); setTemp2(selectedYear);
        setHoaDonThangList(data);
        } catch (error) {
        console.error('Error fetching Hoa Don Trong Thang:', error);
        }
    };

    const fetchNhapTrongThang = async (selectedMonth,selectedYear) => {
        try {
        const data = await getPhieuNhapThang(selectedMonth,selectedYear);
        setPhieuNhapThangList(data);
        } catch (error) {
        console.error('Error fetching Nhap Trong Thang:', error);
        }
    };

//   const fetchTongHopThuChiThang = async () => {
//     try {
//       const data = await getTongHopThuChiThang();
//       setThongKeList(data);
//     } catch (error) {
//       console.error('Error fetching Tong Hop Thu Chi Thang:', error);
//     }
//   };

  const fetchChiPhiPhatSinh = async () => {
    try {
      const data = await getDanhSachCPPS();
      setCPPSList(data);
    } catch (error) {
      console.error('Error fetching Chi Phi Phat Sinh:', error);
    }
  };

  const handleOpenDialog = () => {
    setSelectCPPS({
        macpps: '', 
        chiphi: '', 
        ngay: '', 
        mota: '', 
        manv: 'QL01', 
        tennv: ''
    });
    setIsUpdate(false);
    setOpenDialog(true);
  };
  
  const handleOpenDialogEdit = (item) => {
    setSelectCPPS(item);
    setIsUpdate(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (isUpdate) {
      try {
        await updateCPPS(selectCPPS);
        setOpenDialog(false);
        fetchChiPhiPhatSinh();
      } catch (error) {
        console.error('Error updating Chi Phi Phat Sinh:', error);
      }
    } else {
      try {
        await themCPPS(selectCPPS);
        setOpenDialog(false);
        fetchChiPhiPhatSinh();
      } catch (error) {
        console.error('Error adding Chi Phi Phat Sinh:', error);
      }
    }
  };

  const handleOpenDelete = (item) => {
    setSelectCPPS(item);
    setOpenDELDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDELDialog(false);
  };

  const handleDelete = async (macpps) => {
    try {
      await xoaCPPS(macpps);
      fetchChiPhiPhatSinh();
      setOpenDELDialog(false);
    } catch (error) {
      console.error('Error deleting Chi Phi Phat Sinh:', error);
    }
  };
  const handleCPPSChange = (e) => {
    const { name, value } = e.target;
    setSelectCPPS({
        ...selectCPPS,
        [name]: value
    });
  };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearch = () => {
    const today = new Date(); // Ngày hiện tại
    const selected = new Date(selectedDate); // Ngày được chọn
  
    // So sánh ngày được chọn với ngày hiện tại
    if (selected > today) {
      alert('Ngày chọn đang ở tương lai');
    } else {
      fetchHoaDonTrongNgay(selectedDate);
    }
  };
  
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSearchThang = () => {
    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng chọn tháng và năm');
      return;
    }
    fetchHoaDonTrongThang(selectedMonth, selectedYear);
  };
  const handleSearchNhap = () => {
    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng chọn tháng và năm');
      return;
    }
    fetchNhapTrongThang(selectedMonth, selectedYear);
  };
  return (
    <div>
      <Header menuItems={menuItemsQL} />
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
            {activeCategory === 'hoa-don-trong-ngay' && (
              <div className="order-list">
                   <div style={{ marginBottom: '16px' }}>
                  <TextField
                    id="date"
                    label="Chọn ngày"
                    type="date"
                    value={selectedDate}
                   
                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                 <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '10px',marginTop:'10px' }}
                    onClick={handleSearch}
                    >
                    Tìm kiếm
                    </Button>
                </div>
                {hoaDonNgayList.length === 0 ? (
                  <Typography variant="h6" align="center" style={{ padding: '20px' }}>
                    Không có hóa đơn trong ngày
                  </Typography>
                ) : (
                    <TableContainer component={Paper}>
                    <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                        Thống kê hóa đơn trong ngày
                    </Typography>
                    <Table sx={{ border: '1px solid #ccc' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Mã hóa đơn</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Mã đơn hàng</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Ngày xuất</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>MST</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Tổng giá</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hoaDonNgayList.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.mahoadon}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.madonhang}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(item.ngayxuat)}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.mst}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.tonggia.toLocaleString('vi-VN') }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
              </div>
            )}
             {activeCategory === 'hoa-don-trong-thang' && (
              <div className="order-list">
                <div style={{ marginBottom: '16px' }}>
                  <TextField
                    id="month"
                    label="Chọn tháng"
                    type="number"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: 12 },
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <TextField
                    id="year"
                    label="Chọn năm"
                    type="number"
                    value={selectedYear}
                    onChange={handleYearChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchThang}
                  >
                    Tìm kiếm
                  </Button>
                </div>
                {hoaDonThangList.length === 0 ? (
                  <Typography variant="h6" align="center" style={{ padding: '20px' }}>
                    Không có hóa đơn trong tháng {temp1}/{temp2}
                  </Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                      Thống kê hóa đơn trong tháng {temp1}/{temp2}
                    </Typography>
                    <Table sx={{ border: '1px solid #ccc' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Tổng số hóa đơn</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Ngày xuất</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Tổng tiền </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hoaDonThangList.map((row) => (
                          <TableRow key={row.soluong}>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.soluong}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.ngay}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.tong.toLocaleString('vi-VN')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            )}
              {activeCategory === 'nhap-trong-thang' && (
              <div className="order-list">
                <div style={{ marginBottom: '16px' }}>
                  <TextField
                    id="month"
                    label="Chọn tháng"
                    type="number"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: 12 },
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <TextField
                    id="year"
                    label="Chọn năm"
                    type="number"
                    value={selectedYear}
                    onChange={handleYearChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchNhap}
                  >
                    Tìm kiếm
                  </Button>
                </div>
                {phieuNhapThangList.length === 0 ? (
                  <Typography variant="h6" align="center" style={{ padding: '20px' }}>
                    Không có hóa đơn trong tháng {temp1}/{temp2}
                  </Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                      Thống kê hóa đơn trong tháng {temp1}/{temp2}
                    </Typography>
                    <Table sx={{ border: '1px solid #ccc' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Tổng số phiếu nhập</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Ngày ngày nhập</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>Tổng tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hoaDonThangList.map((row) => (
                          <TableRow key={row.soluong}>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.soluong}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.ngay}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.tong.toLocaleString('vi-VN')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            )}
            {activeCategory === 'thu-chi-thang' && (
              <div className="order-list">
                {/* <h2>Thống kê tổng hợp thu chi tháng</h2>
                <TongHopThuChiThangTable data={thongKeList} /> */}
              </div>
            )}
            {activeCategory === 'chi-phi-phat-sinh' && (
                <>
                <Button variant="outlined" onClick={handleOpenDialog}>
                  Thêm mới
                </Button> 
              <div className="order-list">
              {CPPSList.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Chưa có hóa đơn
                  </p>
                ) : (
                    <TableContainer component={Paper}>
                    <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                        Danh Sách Chi Phí Phát Sinh
                    </Typography>
                    <Table sx={{ border: '1px solid #ccc' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Mã Chi Phí</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Chi Phí</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Mô Tả</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', width: '140px' }}>Thao Tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {CPPSList.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.macpps}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.chiphi}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(item.ngay)}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>{item.mota}</TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc' }}>
                                        <Button onClick={() => handleOpenDialogEdit(item)}>Sửa</Button>
                                        <Button onClick={() => handleOpenDelete(item)}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                )} 
              </div>
              </>
            )}
            
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isUpdate ? 'Sửa Chi Phí Phát Sinh' : 'Thêm Chi Phí Phát Sinh'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="macpps"
            name="macpps"
            label="Mã Chi Phí"
            fullWidth
            value={selectCPPS.macpps}
            onChange={handleCPPSChange}
            disabled={isUpdate} // Disable if editing
          />
          <TextField
            margin="dense"
            id="chiphi"
            name="chiphi"
            type='number'
            label="Chi Phí"
            fullWidth
            value={selectCPPS.chiphi}
            onChange={handleCPPSChange}
          />
          <TextField
            margin="dense"
            id="ngay"
            name="ngay"
            label="Ngày"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectCPPS.ngay}
            onChange={handleCPPSChange}
          />
          <TextField
            margin="dense"
            id="mota"
            name="mota"
            label="Mô Tả"
            fullWidth
            value={selectCPPS.mota}
            onChange={handleCPPSChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDELDialog} onClose={handleCloseDelete}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa chi phí phát sinh có mã {selectCPPS.macpps} không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button onClick={() => handleDelete(selectCPPS.macpps)}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// const HoaDonTrongNgayTable = ({ data }) => (
//   <Table sx={{ border: '1px solid #ccc' }}>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Mã Hóa Đơn</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Khách Hàng</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Tổng Tiền</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {data.map((item, index) => (
//         <TableRow key={index}>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.maHD}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.khachHang}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.ngay}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.tongTien}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// const HoaDonTrongThangTable = ({ data }) => (
//   <Table sx={{ border: '1px solid #ccc' }}>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Mã Hóa Đơn</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Khách Hàng</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Tổng Tiền</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {data.map((item, index) => (
//         <TableRow key={index}>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.maHD}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.khachHang}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.ngay}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.tongTien}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// const NhapTrongThangTable = ({ data }) => (
//   <Table sx={{ border: '1px solid #ccc' }}>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Mã Nhập</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Nhà Cung Cấp</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Tổng Nhập</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {data.map((item, index) => (
//         <TableRow key={index}>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.maNhap}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.nhaCungCap}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.ngay}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.tongNhap}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// const TongHopThuChiThangTable = ({ data }) => (
//   <Table sx={{ border: '1px solid #ccc' }}>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Doanh Thu</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Chi Phí</TableCell>
//         <TableCell sx={{ border: '1px solid #ccc' }}>Lợi Nhuận</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {data.map((item, index) => (
//         <TableRow key={index}>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.ngay}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.doanhThu}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.chiPhi}</TableCell>
//           <TableCell sx={{ border: '1px solid #ccc' }}>{item.loiNhuan}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// const ChiPhiPhatSinhTable = ({ data, onEdit, onDelete }) => (
  
// );

export default QuanLyThongKe;
