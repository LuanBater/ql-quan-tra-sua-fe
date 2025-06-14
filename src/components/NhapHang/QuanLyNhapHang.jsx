import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import { taoPhieuNhap,getCTDDM, taoDonDatMua, getDanhSachDonDatMua, getDanhSachPhieuNhap, getDanhSachNhaCungCap, getDanhSachNguyenLieu, getDanhSachNguyenLieuDeXuat, getCTPN, xoaNhaCungCap, updateNhaCungCap, themNhaCungCap } from '../../API/QLNguyenLieu.js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import Header from '../HeaderPage/headerpage.jsx';
import { formatDate } from '../../API/QLSanPham.js';
import { useNavigate } from 'react-router-dom';
import MessageDialog from '../modal/MessageDialog.jsx';
import { Box, Card, CardContent, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const QuanLyNhapHang = ({ navItems }) => {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "QL") {
    navigate("/")
  }  const user = localStorage.getItem("username")
  const [activeCategory, setActiveCategory] = useState('don-dat-mua');
  const [donDatMuaList, setDonDatMuaList] = useState([]);
  const [phieuNhapList, setPhieuNhapList] = useState([]);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [nguyenLieuList, setNguyenLieuList] = useState([]);
  const [deXuatList, setDeXuatList] = useState([]);
  const [nguyenLieuOrder, setNguyenLieuOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openTaoPNDialog, setOpenTaoPNDialog] = useState(false);
  const [openCTPNDialog, setOpenCTPNDialog] = useState(false);
  const [selectedNCC, setSelectedNCC] = useState('');
  const [selectedNL, setSelectedNL] = useState('');
  const [selectedDonDatMua, setSelectedDonDatMua] = useState(null);
  const [selectedPhieuNhap, setSelectedPhieuNhap] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDetailsPN, setOrderDetailsPN] = useState(null);
  const [infoNCC, setinfoNCC] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [openNCC, setOpenNCC] = useState(false);
  const [openXoaNCC, setOpenXoaNCC] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageNote, setMessage] = useState("");
    const handleMessageClose = () => {
      setMessageOpen(false);
    };
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('don-dat-mua');
        break;
      case 2:
        setActiveCategory('phieu-nhap');
        break;
      case 3:
        setActiveCategory('nha-cung-cap');
        break;
      default:
        setActiveCategory('don-dat-mua');
    }
  };

  const fetchDonDatMuaList = async () => {
    try {
      const data = await getDanhSachDonDatMua();
      setDonDatMuaList(data);
    } catch (error) {
      console.error('Error fetching DonDatMua List:', error);
    }
  };

  const fetchNguyenLieuList = async () => {
    try {
        const data = await getDanhSachNguyenLieu();
        // Loại bỏ nguyên liệu có trangthai = 1
        const filteredData = data.filter((nguyenLieu) => nguyenLieu.trangthai !== 1);
        setNguyenLieuList(filteredData);
    } catch (error) {
        console.error('Error fetching NguyenLieu List:', error);
    }
};


  const fetchDeXuatList = async () => {
    try {
      const data = await getDanhSachNguyenLieuDeXuat();
      const filteredData = data.filter((nguyenLieu) => nguyenLieu.trangthai !== 1);
        setNguyenLieuList(filteredData);
      setDeXuatList(filteredData);
      initializeNguyenLieuOrder(filteredData);
    } catch (error) {
      console.error('Error fetching DeXuat List:', error);
    }
  };

  const fetchPhieuNhapList = async () => {
    try {
      const data = await getDanhSachPhieuNhap();
      setPhieuNhapList(data);
    } catch (error) {
      console.error('Error fetching PhieuNhap List:', error);
    }
  };

  const fetchNhaCungCapList = async () => {
    try {
      const data = await getDanhSachNhaCungCap();
      setNhaCungCapList(data);
    } catch (error) {
      console.error('Error fetching NhaCungCap List:', error);
    }
  };

  const initializeNguyenLieuOrder = (deXuatList) => {
    const initialOrder = deXuatList.map(nl => ({
      manl: nl.manl,
      tennl: nl.tennl,
      soluongton: nl.soluongton,
      donvi: nl.donvi,
      soluong: 1
    }));
    setNguyenLieuOrder(initialOrder);
  };

  useEffect(() => {
    fetchDonDatMuaList();
    fetchPhieuNhapList();
    fetchNhaCungCapList();
    fetchDeXuatList();
    fetchNguyenLieuList();
  }, []);

  const handleClickOpen = () => {
    setSelectedNCC(nhaCungCapList[0].mancc);
    setNguyenLieuOrder([]);
    initializeNguyenLieuOrder(deXuatList);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDetailsDialog(false);
    setOpenTaoPNDialog(false);
    setOpenCTPNDialog(false);
  };

  const handleSaveOrder = async () => {
    
    const order = {
      manv: user, // ID nhân viên quản lý, có thể thay đổi nếu cần
      mancc: selectedNCC,
      listNL: nguyenLieuOrder
    };
    const hasSoluongGreaterThanZero = order.listNL.some(nl => nl.soluong <= 0);

  if (hasSoluongGreaterThanZero) {
    alert("Tất cả nguyên liệu trong danh sách phải có số lượng lớn hơn 0.");
    return;
  }
    try {
      await taoDonDatMua(order);
      fetchDonDatMuaList();
      handleClose();
      setMessage("Tạo đơn đặt mua mới thành công!")
      setMessageOpen(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  const handleSaveIn = async () => {
    const updatedData = orderDetails.map(nl => ({
        ...nl,
        gianhap: parseInt(nl.gianhap) || 0 // Chuyển đổi giá nhập thành số, nếu không thể thì dùng giá trị mặc định 0
      }));
   
    const input = {
      madondat: selectedDonDatMua.madondat,
      manv: user, 
      listNL: updatedData
    };
    const hasSoluongGreaterThanZero = input.listNL.some(nl => nl.gianhap <= 0);

    if (hasSoluongGreaterThanZero) {
      alert("Tất cả nguyên liệu trong danh sách phải có giá nhập lớn hơn 0.");
      return;
    }
    try {
      await taoPhieuNhap(input);
      fetchDonDatMuaList();
      
      fetchPhieuNhapList();
      fetchDeXuatList();
      handleClose(); 
      setMessage("Tạo phiếu nhập thành công!")
      setMessageOpen(true);
    } catch (error) {
      console.error('Error creating phieunhap:', error);
    }
  };


  const handleAddNguyenLieu = () => {
    // Tìm nguyên liệu đã chọn từ danh sách nguyên liệu
    const nl = nguyenLieuList.find(nl => nl.manl === selectedNL);
    
    if (nl) {
        // Kiểm tra xem nguyên liệu đã chọn đã tồn tại trong danh sách đặt hàng chưa
        const isAlreadyInOrder = nguyenLieuOrder.some(orderItem => orderItem.manl === nl.manl);
        
        if (isAlreadyInOrder) {
            // Hiển thị thông báo nếu nguyên liệu đã tồn tại trong danh sách đặt hàng
            alert('Nguyên liệu đã tồn tại trong danh sách đặt hàng.');
        } else {
            // Nếu chưa tồn tại, thêm nguyên liệu vào danh sách đặt hàng
            setNguyenLieuOrder([...nguyenLieuOrder, { manl: nl.manl, tennl: nl.tennl,soluongton: nl.soluongton,donvi: nl.donvi, soluong: 1 }]);
        }

        // Reset nguyên liệu đã chọn
        setSelectedNL('');
    }
};


  const handleRemoveNguyenLieu = (manl) => {
    setNguyenLieuOrder(nguyenLieuOrder.filter(nl => nl.manl !== manl));
  };

  const handleQuantityChange = (manl, newQuantity) => {
    setNguyenLieuOrder(nguyenLieuOrder.map(nl => (nl.manl === manl ? { ...nl, soluong: newQuantity } : nl)));
  };
  const handlePriceChange = (manl, newPrice) => {
    setOrderDetails(orderDetails.map(nl => (nl.manl === manl ? { ...nl, gianhap: newPrice } : nl)));
  };
  const handleViewDetails = async (ddm) => {
    try {

        setSelectedDonDatMua(ddm);
      const data = await getCTDDM(ddm.madondat);
      const updatedData = data.map(nl => ({
        ...nl,
        gianhap: 0 // Giá nhập mặc định là chuỗi rỗng
      }));
      console.log(updatedData);
      setOrderDetails(updatedData);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  const handleTaoPN = async (ddm) => {
    try {
        setSelectedDonDatMua(ddm);
      const data = await getCTDDM(ddm.madondat);
      console.log(data);
      setOrderDetails(data);
      setOpenTaoPNDialog(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  const handleCTPN = async (pn) => {
    try {

        setSelectedPhieuNhap(pn);
      const data = await getCTPN(pn.mapn);
      console.log(data);
      setOrderDetailsPN(data);
      setOpenCTPNDialog(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleClickOpenNCC = () => {
    setinfoNCC({
       mancc: '',
       tenncc: '',
       diachi: '',
       sdt: '',
       email: ''
    });
    setIsUpdate(false);
    setOpenNCC(true);
};
const handleClickOpenUpdateNCC= (ncc) => {
  setinfoNCC(ncc);
    setIsUpdate(true);
    setOpenNCC(true);
};
const handleXoaNCCClick = (ncc) => {
  setinfoNCC(ncc);
    setOpenXoaNCC(true);
};
const handleXoaNCCClose = () => {
  setOpenXoaNCC(false);
};
const handleXoaNCCSubmit = async () => {
    try {
        await xoaNhaCungCap(infoNCC.mancc);
        await fetchNhaCungCapList();
        handleXoaNCCClose();
        alert("Xóa thành công")
    } catch (error) {
      alert("Xóa không thành công")
        console.error('Error Xoa BG:', error);
    }
};
const handleSaveNCCClick = async ()=>
{
    if (isUpdate)
    {
      const duplicateProducts1 = nhaCungCapList.filter(ncc => ncc.sdt === infoNCC.sdt && ncc.mancc !== infoNCC.mancc);
      if (duplicateProducts1.length > 0) {
        alert('Số điện thoại này đã có nhà cung cấp sử dụng!');
        return;
      }
      const duplicateProducts2 = nhaCungCapList.filter(ncc => ncc.email === infoNCC.emal && ncc.mancc !== infoNCC.mancc);
      if (duplicateProducts2.length > 0) {
        alert('Email đã có người đã có nhà cung cấp sử dụng!');
        return;
      }
        try {
            await updateNhaCungCap(infoNCC);
            await fetchNhaCungCapList();
            handleClickCloseNCC();
            setMessage("Cập nhật thông tin nhà cung cấp thành công!")
            setMessageOpen(true);
        } catch (error) {
            console.error('Error update BG:', error);
        }
    }
    else{
       const duplicateProducts = nhaCungCapList.filter(ncc => ncc.mancc === infoNCC.mancc);
        if (duplicateProducts.length > 0) {
          alert('Mã nhà cung cấp này đã tồn tại trong danh sách!');
          return;
        }
        const duplicateProducts1 = nhaCungCapList.filter(ncc => ncc.sdt === infoNCC.sdt );
        if (duplicateProducts1.length > 0) {
          alert('Số điện thoại này đã có nhà cung cấp sử dụng!');
          return;
        }
        const duplicateProducts2 = nhaCungCapList.filter(ncc => ncc.email === infoNCC.emal );
        if (duplicateProducts2.length > 0) {
          alert('Email đã có người đã có nhà cung cấp sử dụng!');
          return;
        }
        try {
            await themNhaCungCap(infoNCC);
            await fetchNhaCungCapList();
            handleClickCloseNCC();
            setMessage("Thêm nhà cung cấp mới thành công!")
            setMessageOpen(true);
        } catch (error) {
            console.error('Error add BG:', error);
        }
    }
}
const handleNCCChange = (e) => {
    const { name, value } = e.target;
    setinfoNCC({
        ...infoNCC,
        [name]: value
    });
};
const handleClickCloseNCC = async ()=>
    {
        setOpenNCC(false);
    }


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
            {activeCategory === 'don-dat-mua' && (
              
                <><span className="theloai-container">
                            <Button variant="outlined" onClick={handleClickOpen}>
                            Thêm mới
                          </Button>
                            <p className="title">Danh sách đơn đặt mua</p>
                          </span>
                          <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                  {donDatMuaList.map((ddm) => (
                    <Card
                      key={ddm.mapn}
                      sx={{
                        width: 280,
                        boxShadow: 3,
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                          ID Đơn đặt mua: {ddm.madondat}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Nhà cung cấp:</strong> {ddm.tenncc} (Mã: {ddm.mancc})
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Ngày đặt:</strong> {formatDate(ddm.ngaydat)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Nhân viên đặt:</strong> {ddm.tennv} (Mã: {ddm.manv})
                        </Typography>
                        <Box mt={2} textAlign="center">
                          {ddm.danhap === 1 ? (
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                            >
                              <CheckCircleIcon color="error" /> Đã nhập
                            </Typography>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleTaoPN(ddm)}
                              sx={{ marginRight: 1 }}
                            >
                              Tạo phiếu nhập
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleViewDetails(ddm)}
                          >
                            Xem chi tiết
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </div>


                <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Thêm mới đơn đặt mua</DialogTitle>
  <DialogContent>
    {/* Chọn nhà cung cấp */}
    <TextField
      select
      label="Nhà cung cấp"
      value={selectedNCC}
      onChange={(e) => setSelectedNCC(e.target.value)}
      fullWidth
      margin="normal"
      helperText="Vui lòng chọn nhà cung cấp để thêm nguyên liệu."
    >
      {nhaCungCapList.map((ncc) => (
        <MenuItem key={ncc.mancc} value={ncc.mancc}>
          {ncc.mancc} - {ncc.tenncc}
        </MenuItem>
      ))}
    </TextField>

    {/* Chọn nguyên liệu */}
    <TextField
      select
      label="Nguyên liệu"
      value={selectedNL}
      onChange={(e) => setSelectedNL(e.target.value)}
      fullWidth
      margin="normal"
      helperText="Chọn nguyên liệu từ danh sách để thêm vào đơn đặt mua."
    >
      {nguyenLieuList.map((nl) => (
        <MenuItem key={nl.manl} value={nl.manl}>
          {nl.tennl} - Tồn kho: {nl.soluongton} {nl.donvi}
        </MenuItem>
      ))}
    </TextField>

    {/* Nút thêm nguyên liệu */}
    <Button
      onClick={handleAddNguyenLieu}
      color="primary"
      variant="contained"
      style={{ marginTop: '10px', marginBottom: '20px', width: '100%' }}
    >
      Thêm nguyên liệu
    </Button>

    {/* Bảng danh sách nguyên liệu */}
    <p>
      <b>Bảng danh sách nguyên liệu</b>
    </p>
    {nguyenLieuOrder.length === 0 ? (
      <p style={{ fontStyle: 'italic', color: '#888' }}>Chưa có nguyên liệu nào được thêm.</p>
    ) : (
      <Table sx={{ border: '1px solid #ccc', marginTop: '10px' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell align="center">Mã NL</TableCell>
            <TableCell align="center">Tên NL</TableCell>
            <TableCell align="center">Tồn kho</TableCell>
            <TableCell align="center">Số lượng nhập</TableCell>
            <TableCell align="center">Đơn vị</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nguyenLieuOrder.map((nl) => (
            <TableRow key={nl.manl}>
              <TableCell align="center">{nl.manl}</TableCell>
              <TableCell align="center">{nl.tennl}</TableCell>
              
              <TableCell align="center">{nl.soluongton} {nl.donvi} </TableCell>
              <TableCell align="center">
                <TextField
                  type="number"
                  value={nl.soluong}
                  onChange={(e) => handleQuantityChange(nl.manl, e.target.value)}
                  inputProps={{ min: 1 }}
                  size="small"
                  sx={{ width: '10ch' }} // Độ rộng chỉ vừa đủ cho 3 chữ số
                />
              </TableCell>
              <TableCell align="center">{nl.donvi}</TableCell>
              <TableCell align="center">
                <Button
                  onClick={() => handleRemoveNguyenLieu(nl.manl)}
                  color="secondary"
                  variant="outlined"
                  size="small"
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </DialogContent>

  {/* Hành động */}
  <DialogActions>
    <Button onClick={handleClose} color="primary" variant="outlined">
      Hủy bỏ
    </Button>
    <Button onClick={handleSaveOrder} color="primary" variant="contained">
      Lưu
    </Button>
  </DialogActions>
</Dialog>

              </>
            )}
               {activeCategory === 'phieu-nhap' && (
              <>      <p className="title">Danh sách phiếu nhập</p>
               <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                {phieuNhapList.map((pn) => (
                  <Card
                    key={pn.mapn}
                    sx={{
                      width: 280,
                      boxShadow: 3,
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        ID Phiếu nhập: {pn.mapn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>ID Đơn đặt mua:</strong> {pn.madondat}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Nhà cung cấp:</strong> {pn.tenncc} (Mã: {pn.mancc})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Nhân viên nhập:</strong> {pn.tennv} (Mã: {pn.manv})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Ngày nhập:</strong> {formatDate(pn.ngaynhap)}
                      </Typography>
                      <Box mt={2} textAlign="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleCTPN(pn)}
                          sx={{ marginRight: 1 }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </>
            )}

            {activeCategory === 'nha-cung-cap' && (
              <>
              <span className="theloai-container">
              <Button variant="outlined" onClick={handleClickOpenNCC}>
                Thêm mới
              </Button>
                <p className="title">Danh sách nhà cung cấp</p>
                </span>
               
              <Dialog open={open} onClose={handleClose}></Dialog>
              <div className="product-list">
                {nhaCungCapList.map((ncc) => (
                  <div key={ncc.mancc} className="product-item">
                    <div className="product-info">
                      <h3>ID Nhà cung cấp: {ncc.mancc}</h3>
                      <p>Tên nhà cung cấp: {ncc.tenncc}</p>
                      <p>Số điện thoại: {ncc.sdt}</p>
                      <p>Email: {ncc.email}</p>
                      <p>Địa chỉ: {ncc.diachi}</p>
                      <div className="product-actions">
                      <Button variant="outlined"  onClick={() => handleClickOpenUpdateNCC(ncc)} >Sửa</Button>
                      <Button variant="outlined" onClick={() => handleXoaNCCClick(ncc)} >Xóa</Button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chi tiết đơn đặt mua */}
      <Dialog open={openDetailsDialog} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
    Chi tiết đơn đặt mua
  </DialogTitle>
  <DialogContent>
    {orderDetails && selectedDonDatMua ? (
      <>
        <Box mb={2}>
          <Typography variant="h6" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Thông tin đơn đặt mua
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>ID Đơn đặt mua:</strong> {selectedDonDatMua.madondat}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Nhà cung cấp:</strong> {selectedDonDatMua.tenncc} (Mã: {selectedDonDatMua.mancc})
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Ngày đặt:</strong> {formatDate(selectedDonDatMua.ngaydat)}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Nhân viên đặt:</strong> {selectedDonDatMua.tennv} (Mã: {selectedDonDatMua.manv})
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Danh sách nguyên liệu
          </Typography>
          <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Mã NL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Tên NL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((item) => (
                <TableRow key={item.manl}>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{item.manl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{item.tennl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>
                    {item.soluong} {item.donvi}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    ) : (
      <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
        Không có thông tin chi tiết để hiển thị.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="contained" color="primary" sx={{ margin: '0 auto' }}>
      Đóng
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={openTaoPNDialog} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
    Tạo Phiếu Nhập
  </DialogTitle>
  <DialogContent>
    {orderDetails ? (
      <>
        <Box mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Thông tin đơn đặt mua
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>ID Đơn đặt mua:</strong> {selectedDonDatMua.madondat}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Nhân viên nhập:</strong> {user}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Danh sách nguyên liệu
          </Typography>
          <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>
                  Mã NL
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>
                  Tên NL
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>
                  Số lượng
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>
                  Giá nhập
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((nl) => (
                <TableRow key={nl.manl}>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{nl.manl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{nl.tennl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>
                    {nl.soluong} - {nl.donvi}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>
                    <TextField
                      type="number"
                      value={nl.gianhap}
                      onChange={(e) => handlePriceChange(nl.manl, e.target.value)}
                      size="small"
                      sx={{ width: '15ch' }} // Độ rộng chỉ vừa đủ cho 3 chữ số
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    ) : (
      <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
        Không có thông tin chi tiết để hiển thị.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="outlined" color="secondary">
      Hủy bỏ
    </Button>
    <Button onClick={handleSaveIn} variant="contained" color="primary">
      Lưu
    </Button>
  </DialogActions>
</Dialog>

                <Dialog open={openCTPNDialog} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
    Chi Tiết Phiếu Nhập
  </DialogTitle>
  <DialogContent>
    {orderDetailsPN && selectedPhieuNhap ? (
      <>
        <Box mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Thông tin phiếu nhập
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>ID Phiếu nhập:</strong> {selectedPhieuNhap.mapn}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>ID Đơn đặt mua:</strong> {selectedPhieuNhap.madondat}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Nhà cung cấp:</strong> {selectedPhieuNhap.tenncc} (Mã: {selectedPhieuNhap.mancc})
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '4px' }}>
            <strong>Nhân viên nhập:</strong> {selectedPhieuNhap.tennv} (Mã: {selectedPhieuNhap.manv})
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Danh sách nguyên liệu
          </Typography>
          <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Mã NL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Tên NL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Số lượng</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ccc' }}>Giá nhập</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetailsPN.map((nl) => (
                <TableRow key={nl.manl}>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{nl.manl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>{nl.tennl}</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>
                    {nl.soluong} {nl.donvi}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #ccc' }}>
                    {nl.gianhap.toLocaleString('vi-VN')}đ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    ) : (
      <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
        Không có thông tin chi tiết để hiển thị.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="contained" color="primary" sx={{ margin: '0 auto' }}>
      Đóng
    </Button>
  </DialogActions>
</Dialog>
                <Dialog open={openNCC} onClose={handleClickCloseNCC}>
                <DialogTitle>{isUpdate ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}</DialogTitle>
                <DialogContent>
               
                <TextField
                    margin="dense"
                    id="mancc"
                    name="mancc"
                    label="Mã nhà cung cấp"
                    fullWidth
                    disabled={isUpdate}
                    value={infoNCC.mancc}
                    onChange={handleNCCChange}
                />
                <TextField
                    margin="dense"
                    id="tenncc"
                    name="tenncc"
                    label="Tên nhà cung cấp"
                    fullWidth
                    value={infoNCC.tenncc}
                    onChange={handleNCCChange}
                />
                 <TextField
                    margin="dense"
                    id="diachi"
                    name="diachi"
                    label="Địa chỉ"
                    fullWidth
                    value={infoNCC.diachi}
                    onChange={handleNCCChange}
                />
                 <TextField
                    margin="dense"
                    type='phone'
                    id="sdt"
                    name="sdt"
                    label="Số điện thoại"
                    fullWidth
                    value={infoNCC.sdt}
                    onChange={handleNCCChange}
                />
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    value={infoNCC.email}
                    onChange={handleNCCChange}
                />
                
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClickCloseNCC} color="secondary">
                Đóng
                </Button>
                <Button onClick={handleSaveNCCClick} color="primary">
                Lưu
                </Button>
                </DialogActions>
                </Dialog>
                <Dialog open={openXoaNCC} onClose={handleXoaNCCClose}>
                <DialogTitle>Xóa bảng giá</DialogTitle>
                <DialogContent>
                <p>Bạn có chắc chắn muốn xóa nhà cung cấp {infoNCC.mancc} - {infoNCC.tenncc} không?</p>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleXoaNCCClose} color="secondary">
                Hủy
                </Button>
                <Button onClick={handleXoaNCCSubmit} color="primary">
                Đồng ý
                </Button>
                </DialogActions>
                </Dialog>
                <MessageDialog
                            open={messageOpen}
                            onClose={handleMessageClose}
                            message = {messageNote}
                             />
       </div>
  );
};

export default QuanLyNhapHang;
