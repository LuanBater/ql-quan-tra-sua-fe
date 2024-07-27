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

const QuanLyNhapHang = ({ navItems }) => {
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
  const [infoNCC, setinfoNCC] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [openNCC, setOpenNCC] = useState(false);
  const [openXoaNCC, setOpenXoaNCC] = useState(false);
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
      setNguyenLieuList(data);
    } catch (error) {
      console.error('Error fetching NguyenLieu List:', error);
    }
  };

  const fetchDeXuatList = async () => {
    try {
      const data = await getDanhSachNguyenLieuDeXuat();
      setDeXuatList(data);
      initializeNguyenLieuOrder(data);
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
      soluong: 20
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
      manv: 'QL01', // ID nhân viên quản lý, có thể thay đổi nếu cần
      mancc: selectedNCC,
      listNL: nguyenLieuOrder
    };
    try {
      await taoDonDatMua(order);
      handleClose();
      fetchDonDatMuaList();
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
      manv: 'QL01', 
      listNL: updatedData
    };
    try {
      await taoPhieuNhap(input);
      handleClose();
    
    } catch (error) {
      console.error('Error creating order:', error);
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
            setNguyenLieuOrder([...nguyenLieuOrder, { manl: nl.manl, tennl: nl.tennl, soluong: 20 }]);
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
      setOrderDetails(data);
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
        try {
            await updateNhaCungCap(infoNCC);
            await fetchNhaCungCapList();
            handleClickCloseNCC();
        } catch (error) {
            console.error('Error update BG:', error);
        }
    }
    else{
        try {
            await themNhaCungCap(infoNCC);
            await fetchNhaCungCapList();
            handleClickCloseNCC();
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
                <div className="product-list">
                  {donDatMuaList.map((ddm) => (
                    <div key={ddm.mapn} className="product-item">
                      <div className="product-info">
                        <h3>ID Đơn đặt mua: {ddm.madondat}</h3>
                        <p>Nhà cung cấp: {ddm.mancc} - {ddm.tenncc}</p>
                        <p>Ngày đặt: {formatDate(ddm.ngaydat)}</p>
                        <p>Nhân viên đặt: {ddm.manv} - {ddm.tennv}</p>
                        <div className="product-actions">
                          <Button variant="outlined" onClick={() => handleTaoPN(ddm)}>Tạo phiếu nhập</Button>
                          <Button variant="outlined" onClick={() => handleViewDetails(ddm)} >
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Thêm mới đơn đặt mua</DialogTitle>
                  <DialogContent>
                    <TextField
                      select
                      label="Nhà cung cấp"
                      value={selectedNCC}
                      onChange={(e) => setSelectedNCC(e.target.value)}
                      fullWidth
                      margin="normal"
                    >
                      {nhaCungCapList.map((ncc) => (
                        <MenuItem key={ncc.mancc} value={ncc.mancc}>
                          {ncc.mancc} - {ncc.tenncc}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Nguyên liệu"
                      value={selectedNL}
                      onChange={(e) => setSelectedNL(e.target.value)}
                      fullWidth
                      margin="normal"
                    >
                      {nguyenLieuList.map((nl) => (
                        <MenuItem key={nl.manl} value={nl.manl}>
                          {nl.tennl}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button onClick={handleAddNguyenLieu} color="primary">
                      Thêm nguyên liệu
                    </Button>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã NL</TableCell>
                          <TableCell>Tên NL</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {nguyenLieuOrder.map((nl) => (
                          <TableRow key={nl.manl}>
                            <TableCell>{nl.manl}</TableCell>
                            <TableCell>{nl.tennl}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={nl.soluong}
                                onChange={(e) => handleQuantityChange(nl.manl, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleRemoveNguyenLieu(nl.manl)} color="secondary">
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Hủy bỏ
                    </Button>
                    <Button onClick={handleSaveOrder} color="primary">
                      Lưu
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
            {activeCategory === 'phieu-nhap' && (
              <><span className="theloai-container">
              <p className="title">Danh sách phiếu nhập</p>
            </span>
              <div className="product-list">
                {phieuNhapList.map((pn) => (
                  

                  <div key={pn.mapn} className="product-item">
                    <div className="product-info">
                      <h3>ID Phiếu nhập: {pn.mapn}</h3>
                      <p>ID Đơn đặt mua: {pn.madondat}</p>
                      <p>Nhân viên nhập: {pn.manv} - {pn.tennv}</p>
                      <p>Ngày nhập: {formatDate(pn.ngaynhap)}</p>
                    </div>
                    <div className="product-actions">
                          <Button variant="outlined" onClick={() => handleCTPN(pn)} >
                            Xem chi tiết
                          </Button>
                        </div>
                  </div>
                
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
      <Dialog open={openDetailsDialog} onClose={handleClose}>
        <DialogTitle>Chi tiết đơn đặt mua</DialogTitle>
        <DialogContent>
          {orderDetails && selectedDonDatMua && (
            <>
              <h3>ID Đơn đặt mua: {selectedDonDatMua.madondat}</h3>
              <p>Nhà cung cấp: {selectedDonDatMua.mancc}-{selectedDonDatMua.tenncc}</p>
              <p>Ngày đặt: {formatDate(selectedDonDatMua.ngaydat)}</p>
              <p>Nhân viên đặt: {selectedDonDatMua.manv}-{selectedDonDatMua.tennv}</p>
              <div>
              <b>Danh sách nguyên liệu</b>
              <Table>
                
                <TableHead>
                  <TableRow>
                    <TableCell>Mã NL</TableCell>
                    <TableCell>Tên NL</TableCell>
                    <TableCell>Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.map((item) => (
                    <TableRow key={item.manl}>
                      <TableCell>{item.manl}</TableCell>
                      <TableCell>{item.tennl}</TableCell>
                      <TableCell>{item.soluong}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTaoPNDialog} onClose={handleClose}>
                  <DialogTitle>Tạo Phiếu Nhập</DialogTitle>
                  <DialogContent>
                 {orderDetails && (
                    <>
                    <h3>ID Đơn đặt mua: {selectedDonDatMua.madondat}</h3>
                  <p>Nhân viên nhập: QL01-Nguyen Luan</p>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã NL</TableCell>
                          <TableCell>Tên NL</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Giá nhập</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDetails.map((nl) => (
                          <TableRow key={nl.manl}>
                            <TableCell>{nl.manl}</TableCell>
                            <TableCell>{nl.tennl}</TableCell>
                            <TableCell>{nl.soluong}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={nl.gianhap.toLocaleString('vi-VN')}
                                onChange={(e) => handlePriceChange(nl.manl, e.target.value)}
                              />
                            </TableCell>
                           
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Hủy bỏ
                    </Button>
                    <Button onClick={handleSaveIn} color="primary">
                      Lưu
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={openCTPNDialog} onClose={handleClose}>
                  <DialogTitle>Chi Tiết Phiếu Nhập</DialogTitle>
                  <DialogContent>
                 {orderDetails&& selectedPhieuNhap  && (
                    <>
                    <h3>ID Phiếu nhập {selectedPhieuNhap.mapn}</h3>
                    <p>ID đơn đặt mua: {selectedPhieuNhap.madondat}</p>
                  <p>Nhân viên nhập: {selectedPhieuNhap.manv}-{selectedPhieuNhap.tennv}</p>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã NL</TableCell>
                          <TableCell>Tên NL</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Giá nhập</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDetails.map((nl) => (
                          <TableRow key={nl.manl}>
                            <TableCell>{nl.manl}</TableCell>
                            <TableCell>{nl.tennl}</TableCell>
                            <TableCell>{nl.soluong}</TableCell>
                            <TableCell>{nl.gianhap.toLocaleString('vi-VN')}đ</TableCell>
                           
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Đóng
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
       </div>
  );
};

export default QuanLyNhapHang;
