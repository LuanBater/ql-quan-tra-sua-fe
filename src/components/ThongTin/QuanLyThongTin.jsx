import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import moment from 'moment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import img1 from '../../resource/image/default-nhanvien.png';
import on from '../../resource/image/on-button.png';
import off from '../../resource/image/off-button.png';
import pen from '../../resource/image/pen.png';
import Table from '@mui/material/Table';
import change from '../../resource/image/change.png';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Header from '../HeaderPage/headerpage.jsx';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import { getDanhSachNhanVien, getDanhSachKhachHang,formatDate,fetchImage,themNhanVien,updateNhanVien,changeQuyen,changeNghiLam, updateKhachHang} from '../../API/QLThongTin.js'; // Update import paths
import { useNavigate } from 'react-router-dom';


const QuanLyThongTin = ({navItems}) => {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "QL") {
    navigate("/")
  }
  const [activeCategory, setActiveCategory] = useState('danh-sach-nhan-vien');
  const [danhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [danhSachKhachHang, setDanhSachKhachHang] = useState([]);
  const [listImg, setListImg] = useState([]);
  const [open, setOpen] = useState(false);
  const [openUpdateKH, setOpenUpdateKH] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [SelectNhanVien,setSelectNhanVien] =  useState({});
  const [SelectKhachHang,setSelectedKhachHang] =  useState({});
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('danh-sach-nhan-vien');
        fetchDanhSachNhanVien();
        break;
      case 2:
        setActiveCategory('danh-sach-khach-hang');
        fetchDanhSachKhachHang();
        break;
      default:
        setActiveCategory('danh-sach-nhan-vien');
    }
  };
  useEffect(() => {
    const fetchAndSetImages = async () => {
        const images = await Promise.all(danhSachNhanVien.map(async (nv) => {
            try {
                const image = await fetchImage(nv.hinhanh);
                return { IDNV: nv.manv, image };
            } catch (error) {
                console.error('Error fetching IDNV image:', error);
                return { IDNV: nv.mnv, image: null };
            }
        }));
        setListImg(images);
    };
  
fetchAndSetImages();
}, [danhSachNhanVien]);
  const fetchDanhSachNhanVien = async () => {
    try {
      const data = await getDanhSachNhanVien(); // Replace with your actual API call
      setDanhSachNhanVien(data);
    } catch (error) {
      console.error('Error fetching DanhSachNhanVien List:', error);
    }
  };

  const fetchDanhSachKhachHang = async () => {
    try {
      const data = await getDanhSachKhachHang(); // Replace with your actual API call
      setDanhSachKhachHang(data);
    } catch (error) {
      console.error('Error fetching DanhSachKhachHang List:', error);
    }
  };

  useEffect(() => {
      fetchDanhSachNhanVien();
    }, []);
    const handleClickOpen = () => {
    setSelectNhanVien({
        manv: '',
        tennv: '',
        phai: 0,
        ngaysinh: '',
        diachi:'',
        sdt: '',
        hinhanh: '',
        email: '',
        nghilam: 0,
        maquyen: 'NV'
    });
    setIsUpdate(false);
    setSelectedFile(null);
    setOpen(true);
  };
  const handleClickOpenEditKH = (khachHang) => {
    setSelectedKhachHang(khachHang)
    setOpenUpdateKH(true);
  }
  const handleClickOpenEdit = async (nhanvien) => {
    setIsUpdate(true);
    setSelectNhanVien(nhanvien);
    if (String(nhanvien.hinhanh)) {
      try {
          // Lấy URL hình ảnh từ API
          const imageUrl = await fetchImage(String(nhanvien.hinhanh));

          // Tạo đối tượng File từ URL
          fetch(imageUrl)
              .then(response => response.blob())
              .then(blob => {
                  const file = new File([blob], 'image.jpg', { type: blob.type });
                  setSelectedFile(file);
              })
              .catch(error => {
                  console.error('Error creating file from image URL:', error);
                  setSelectedFile(null); // Sử dụng URL tĩnh cho ảnh mặc định
              });
      } catch (error) {
          console.error('Error fetching image:', error);
          setSelectedFile(null); // Sử dụng URL tĩnh cho ảnh mặc định
      }
  } else {
      setSelectedFile(null); // Sử dụng URL tĩnh cho ảnh mặc định
  }
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setOpenUpdateKH(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
    }
};
const getImageUrl = (file) => {
  if (file) {
      return URL.createObjectURL(file);
  }
  return img1; // Sử dụng ảnh mặc định nếu không có file
};
  const handleSelectNhanVienChange = (e) => {
    const { name, value } = e.target;
    setSelectNhanVien({
        ...SelectNhanVien,
        [name]: value
    });
  };
  const handleSelectKhachHangChange = (e) => {
    const { name, value } = e.target;
    setSelectedKhachHang({
        ...SelectKhachHang,
        [name]: value
    });
  };
  const handleSaveClick = async() => 
  {
    if (selectedFile === null) {
      const response = await fetch(img1);
      const blob = await response.blob();
      const defaultFile = new File([blob], 'default-nhanvien.png', { type: blob.type });
      setSelectedFile(defaultFile);
  }
  if(SelectNhanVien.manv.trim() === '' || SelectNhanVien.tennv === '' || SelectNhanVien.ngaysinh === '' || SelectNhanVien.sdt === ''|| SelectNhanVien.email === ''){
      alert("Không bỏ trống các ô thông tin!");
      return;
  }
 
  if (!isUpdate) {
    const duplicateProducts = danhSachNhanVien.filter(nv => nv.manv === SelectNhanVien.manv);
    if (duplicateProducts.length > 0) {
      alert('Mã nhân viên đã tồn tại trong danh sách!');
      return;
    }
  }
  const duplicateProducts1 = danhSachNhanVien.filter(nv => nv.sdt === SelectNhanVien.sdt && nv.manv !== SelectNhanVien.manv);
  if (duplicateProducts1.length > 0) {
    alert('Số điện thoại này đã có nhân viên sử dụng!');
    return;
  }
  const duplicateProducts2 = danhSachNhanVien.filter(nv => nv.email === SelectNhanVien.emal && nv.manv !== SelectNhanVien.manv);
  if (duplicateProducts2.length > 0) {
    alert('Email đã có người đã có nhân viên sử dụng!');
    return;
  }

  if (isUpdate)
  {
    try {
      await updateNhanVien(SelectNhanVien,selectedFile);
      fetchDanhSachNhanVien();
      SelectNhanVien.manv = '';
      handleClose();
  } catch (error) {
      console.error('Error adding nhanvien:', error);
  }
  }
  else{
    try {
      await themNhanVien(SelectNhanVien,selectedFile);
      fetchDanhSachNhanVien();
      SelectNhanVien.manv = '';
      handleClose();
  } catch (error) {
      console.error('Error adding nhanvien:', error);
  }
  }
  };
    const handleChangeQuyenOpen = (nhanvien) =>
    {
      
        setSelectNhanVien(nhanvien);
        setOpenChange (true);

    }
    const handleChangeNghiLamClose = () => {
      setOpenChange (false);
  };

  const handleChangeQuyen = async ()=>{
    await changeQuyen(SelectNhanVien.manv,SelectNhanVien.maquyen);
    fetchDanhSachNhanVien();
    handleChangeNghiLamClose(false);
  }

  const handleChangeNghiLam = async(manv) =>{
    try {
      await changeNghiLam(manv);
      fetchDanhSachNhanVien();
  } catch (error) {
      console.error('Error adding nhanvien:', error);
  }
  }

  const handlUpdateKHClick = async() => 
    
    {
      console.log(SelectKhachHang);
    if(SelectKhachHang.tenkh === '' || SelectKhachHang.diachi === '' || SelectKhachHang.sdt === ''|| SelectKhachHang.email === ''){
        alert("Không bỏ trống các ô thông tin!");
        return;
    }
   
    const duplicateProducts1 = danhSachKhachHang.filter(kh => kh.sdt === SelectKhachHang.sdt && kh.makh !== SelectKhachHang.makh);
    if (duplicateProducts1.length > 0) {
      alert('Số điện thoại này đã có khách hàng sử dụng!');
      return;
    }
    const duplicateProducts2 = danhSachKhachHang.filter(kh => kh.email === SelectKhachHang.emal && kh.makh !== SelectKhachHang.makh);
    if (duplicateProducts2.length > 0) {
      alert('Email đã có người đã có khách hàng sử dụng!');
      return;
    }
  

      try {
        await updateKhachHang(SelectKhachHang);
        fetchDanhSachKhachHang()
        handleClose();
    } catch (error) {
        console.error('Error adding nhanvien:', error);
    }
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
            {activeCategory === 'danh-sach-nhan-vien' && (
              <><span className="theloai-container">
                <Button variant="outlined" onClick={handleClickOpen}>
                Thêm mới
              </Button>
                 <p className="title">Danh sách nhân viên</p>
                  </span>

              <Dialog open={open} onClose={handleClose}></Dialog>
              <div className="order-list">
                {danhSachNhanVien.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Chưa có danh sách nhân viên
                  </p>
                ) : (
                    <Table sx={{ border: '1px solid #ccc' }}>
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Hình ảnh</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Nhân viên</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Quyền</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Phái</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Ngày sinh</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Địa chỉ</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Email</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>SĐT</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Nghỉ việc</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Sửa</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {danhSachNhanVien.map((nhanVien) => (
                        <TableRow key={nhanVien.manv}>
                            <TableCell sx={{ border: '1px solid #ddd' , width: '100px'}}>
                            {nhanVien.hinhanh ? (
                                <img 
                                src={listImg.find(img => img.IDNV === nhanVien.manv)?.image || img1} 
                                alt={`Ảnh nhân viên`} 
                                style={{ width: '100px', height: '100px'}} 
                                />
                            ) : (
                                <img 
                                src={img1} 
                                alt={`Ảnh nhân viên`} 
                                style={{ width: '100px', height: '100px' }} 
                                />
                            )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' }}>{nhanVien.manv} - {nhanVien.tennv}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', width: '100px'  }}>
                              {nhanVien.maquyen === 'NV' ? 'Nhân viên' : 'Quản lý'}
                              <a href="#" style={{ marginLeft: '8px'} } onClick={() => handleChangeQuyenOpen(nhanVien)}>
                                  <img src={change} alt={"quyền"} style={{ width: '20px', height: '20px' }} />
                              </a>
                               </TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', width: '30px' }}>{nhanVien.phai === 1 ? 'Nữ' : 'Nam'}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' , width: '80px' }}>{formatDate(nhanVien.ngaysinh)}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' }}>{nhanVien.diachi}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' }}>{nhanVien.email}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' }}>{nhanVien.sdt}</TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', width: '50px' }}>
                            {nhanVien.nghilam === 0 ? (
                               <a href='#' onClick={() => handleChangeNghiLam(nhanVien.manv)}> <img 
                                src={off} // Thay thế bằng đường dẫn đến hình ảnh "toggle-off"
                                alt="Còn làm"
                                style={{ width: '50px', height: '50px' }}
                                />
                                </a>
                            ) : (
                                <a href='#' onClick={() => handleChangeNghiLam(nhanVien.manv)}><img 
                                src={on} // Thay thế bằng đường dẫn đến hình ảnh "toggle-on"
                                alt="Đã nghỉ"
                                style={{ width: '50px', height: '50px' }}
                                />
                                </a>
                            )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #ddd' , width: '50px'}}> 
                                <a href='#' onClick={() => handleClickOpenEdit(nhanVien)}><img 
                                src={pen} // Thay thế bằng đường dẫn đến hình ảnh "toggle-on"
                                alt="sửa"
                                style={{ width: '40px', height: '40px' }}
                                /> 
                                </a>
                                </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                )}
              </div>
              </>
            )}
            {activeCategory === 'danh-sach-khach-hang' && (
              <><span className="theloai-container">
              <p className="title">Danh sách khách hàng</p>
            </span>
              <div className="order-list">
                {danhSachKhachHang.length === 0 ? (
                  <p variant="h6" align="center" style={{ padding: '20px' }}>
                    Chưa có danh sách khách hàng
                  </p>
                ) : (
                    <Table sx={{ border: '1px solid #ccc' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Mã khách hàng</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Tên khách hàng</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Địa chỉ</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>SĐT</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Email</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>Sửa</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSachKhachHang.map((khachHang) => (
                        <TableRow key={khachHang.makh}>
                          <TableCell sx={{ border: '1px solid #ddd' }}>{khachHang.makh}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd' }}>{khachHang.tenkh}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd' }}>{khachHang.diachi}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd' }}>{khachHang.sdt}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd' }}>{khachHang.email}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd' , width: '50px'}}> 
                                <a href='#' onClick={() => handleClickOpenEditKH(khachHang)}><img 
                                src={pen} // Thay thế bằng đường dẫn đến hình ảnh "toggle-on"
                                alt="sửa"
                                style={{ width: '40px', height: '40px' }}
                                /> 
                                </a>
                                </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              </>
            )}
          </div>
        </div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{!isUpdate ? 'Thêm nhân viên mới' : 'Cập nhật thôn tin nhân viên'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="manv"
                    name="manv"
                    label="Mã nhân viên"
                    fullWidth
                    value={SelectNhanVien.manv}
                    onChange={handleSelectNhanVienChange}
                    disabled={isUpdate}
                />
                <TextField
                    margin="dense"
                    id="tennv"
                    name="tennv"
                    label="Họ và tên"
                    fullWidth
                    value={SelectNhanVien.tennv}
                    onChange={handleSelectNhanVienChange}
                />
               {!isUpdate === '' && (<FormControl fullWidth margin="dense">
                    <InputLabel id="role-label">Quyền</InputLabel>
                    <Select
                        labelId="role-label"
                        
                        id="maquyen"
                        name="maquyen"
                        value={SelectNhanVien.maquyen}
                        onChange={handleSelectNhanVienChange}
                    >
                        <MenuItem value="NV">Nhân viên</MenuItem>
                        <MenuItem value="QL">Quản lý</MenuItem>
                    </Select>
                </FormControl>
                )}
                <FormControl fullWidth margin="dense">
                    <InputLabel id="gender-label">Phái</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="phai"
                        name="phai"
                        value={SelectNhanVien.phai}
                        onChange={handleSelectNhanVienChange}
                    >
                        <MenuItem value="0">Nam</MenuItem>
                        <MenuItem value="1">Nữ</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    id="ngaysinh"
                    name="ngaysinh"
                    label="Ngày sinh"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={SelectNhanVien.ngaysinh}
                    onChange={handleSelectNhanVienChange}
                />
                     <TextField
                    margin="dense"
                    id="diachi"
                    name="diachi"
                    label="Địa chỉ"
                    fullWidth
                    value={SelectNhanVien.diachi}
                    onChange={handleSelectNhanVienChange}
                />
                <TextField
                    margin="dense"
                    id="sdt"
                    name="sdt"
                    label="Số điện thoại"
                    fullWidth
                    value={SelectNhanVien.sdt}
                    onChange={handleSelectNhanVienChange}
                />
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    value={SelectNhanVien.email}
                    onChange={handleSelectNhanVienChange}
                />
                <input
                    id="fileInputAdd"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <Button variant="outlined" onClick={() => document.getElementById('fileInputAdd').click()}>
                    Chọn ảnh
                </Button>
                <img src={getImageUrl(selectedFile)} alt="Selected" style={{ marginTop: '10px', maxHeight: '300px', maxWidth: '100%' }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Đóng
                </Button>
                <Button onClick={handleSaveClick} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openChange} onClose={handleChangeNghiLamClose}>
            <DialogTitle>Thay đổi quyền</DialogTitle>
             <DialogContent>
             <FormControl fullWidth margin="dense">
                    <InputLabel id="role-label">Quyền</InputLabel>
                    <Select
                        labelId="role-label"
                        
                        id="maquyen"
                        name="maquyen"
                        value={SelectNhanVien.maquyen}
                        onChange={handleSelectNhanVienChange}
                    >
                        <MenuItem value="NV">Nhân viên</MenuItem>
                        <MenuItem value="QL">Quản lý</MenuItem>
                    </Select>
                </FormControl>
                </DialogContent>
                     <DialogActions>
                    <Button onClick={handleChangeNghiLamClose} color="secondary">
                       Hủy
                  </Button>
                 <Button onClick={handleChangeQuyen} color="primary">
                Đồng ý
               </Button>
            </DialogActions>
         </Dialog>
         <Dialog open={openUpdateKH} onClose={handleClose}>
            <DialogTitle>Cập nhật thông tin khách hàng</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="makh"
                    name="makh"
                    label="Mã khách hàng"
                    fullWidth
                    value={SelectKhachHang.makh}
                    onChange={handleSelectKhachHangChange}
                    disabled
                />
                <TextField
                    margin="dense"
                    id="tenkh"
                    name="tenkh"
                    label="Họ và tên"
                    fullWidth
                    value={SelectKhachHang.tenkh}
                    onChange={handleSelectKhachHangChange}
                />
                <TextField
                    margin="dense"
                    id="diachi"
                    name="diachi"
                    label="Địa chỉ"
                    fullWidth
                    value={SelectKhachHang.diachi}
                    onChange={handleSelectKhachHangChange}
                />
                <TextField
                    margin="dense"
                    id="sdt"
                    name="sdt"
                    label="Số điện thoại"
                    fullWidth
                    value={SelectKhachHang.sdt}
                    onChange={handleSelectKhachHangChange}
                />
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    value={SelectKhachHang.email}
                    onChange={handleSelectKhachHangChange}
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Đóng
                </Button>
                <Button onClick={handlUpdateKHClick} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default QuanLyThongTin;
