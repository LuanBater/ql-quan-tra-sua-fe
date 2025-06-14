import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import { getDanhSachNguyenLieu, themNguyenLieu, xoaNguyenLieu, updateNguyenLieu,fetchImage,
    getDanhSachNguyenLieuPhatSinh,themNguyenLieuPhatSinh,updateNguyenLieuPhatSinh,xoaNguyenLieuPhatSinh,formatDate,
    getCTNhapNL,getDanhSachNguyenLieuHienCo,getSanPhamKhaDung,getNguyenLieuSuDungTrongNgay,changeTrangThai
 } from '../../API/QLNguyenLieu.js';
import img1 from '../../resource/image/default.png';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FormHelperText, Grid, Paper } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import Header from '../HeaderPage/headerpage.jsx';
import { useNavigate } from 'react-router-dom';
import MessageDialog from '../modal/MessageDialog.jsx';
import on from '../../resource/image/on-button.png';
import off from '../../resource/image/off-button.png';
function QuanLyNguyenLieu({ navItems }) {
   
    const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "QL") {
    navigate("/")
  }
    const user = localStorage.getItem("username")
    const [activeCategory, setActiveCategory] = useState('nguyen-lieu');
    const [nguyenLieuList, setNguyenLieuList] = useState([]);
    const [openChiTietNhap, setOpenChiTietNhap] = React.useState(false);
    const [chiTietNhap, setChiTietNhap] = React.useState([]);
    const [nguyenLieuHienCoList, setNguyenLieuHienCo] = React.useState([]);
    const [SanPhamKhaDungList, setSanPhamKhaDung] = React.useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openNLPS, setOpenNLPS] = useState(false);
    const [openXoaNLPS, setOpenXoaNLPS] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [NLImages, setNLImages] = useState([]); 
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [data, setData] = useState([]);
    const [newNguyenLieu, setNewNguyenLieu] = useState({
        manl: '',
        tennl: '',
        soluongton: 0,
        hinhanh: '',
        toithieu: '',
        donvi: '',
        trangthai: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedNguyenLieu, setSelectedNguyenLieu] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State để xác định chế độ
    const [NLPSList, setNLPSList] = useState([]);
    const [NLPSSelected, setNLPSSelected] = useState({});
    const [messageNote, setMessage] = useState("");
    const [openAvailableDialog, setOpenAvailableDialog] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu giá trị tìm kiếm

    // Hàm lọc danh sách nguyên liệu theo tên
    const filteredNguyenLieuList = nguyenLieuList.filter(nguyenLieu =>
        nguyenLieu.tennl.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc theo tên nguyên liệu
    );
const handleChangeStatus = async(manl) =>{
    try {
      await changeTrangThai(manl);
      setMessage ("Thay đổi trạng thái kinh doanh của nguyên liệu thành công!")
      setMessageOpen(true)
      fetchNguyenLieu(); 
  } catch (error) {
      console.error('Error adding nhanvien:', error);
  }
  }
  const handleMessageClose = () => {
    setMessageOpen(false);
  };
    const handleClickOpenAvailableProducts = () => 
        {
            fetchSanPhamKhaDung();
            fetchNguyenLieuHienCo();
            setOpenAvailableDialog(true);
        }
    const handleCloseAvailableProducts = () => setOpenAvailableDialog(false);

    const fetchNguyenLieu = async () => {
        try {
            const data = await getDanhSachNguyenLieu();
            setNguyenLieuList(data);
        } catch (error) {
            console.error('Error fetching NguyenLieu:', error);
        }
    };
    const fetchNguyenLieuHienCo = async () => {
        try {
            const data = await getDanhSachNguyenLieuHienCo();
            setNguyenLieuHienCo(data);
        } catch (error) {
            console.error('Error fetching NguyenLieu Hien Co:', error);
        }
    };
    const fetchSanPhamKhaDung = async () => {
        try {
            const data = await getSanPhamKhaDung();
            setSanPhamKhaDung(data);
        } catch (error) {
            console.error('Error fetching San Pham Kha Dung:', error);
        }
    };
    const fetchChiTietNhap = async (manl) => {
        try {
            const data = await getCTNhapNL(manl);
            setChiTietNhap(data);
        } catch (error) {
            console.error('Error fetching chi tiết nhập NguyenLieu:', error);
        }
    };
    const fetchNLPS = async () => {
        try {
            const data = await getDanhSachNguyenLieuPhatSinh();
            setNLPSList(data);
        } catch (error) {
            console.error('Error fetching NguyenLieuPS:', error);
        }
    };
    useEffect(() => {
        fetchNguyenLieu();
        fetchNLPS();
    }, []);
    const handleCategorySelect = (categoryId) => {
        switch (categoryId) {
            case 1:
                setActiveCategory('nguyen-lieu');
                break;
            case 2:
                setActiveCategory('phat-sinh');
                break;
            case 3:
                setActiveCategory('nguyen-lieu-trong-ngay');
                break;
            default:
                setActiveCategory('nguyen-lieu');
        }
    };
    

    const handleClickOpenAdd = () => {
        setNewNguyenLieu({
            manl: '',
            tennl: '',
            soluongton: '',
            hinhanh: '',
            toithieu: '',
            donvi: '',
        });
        setSelectedFile(null);
        setIsEditing(false); // Thiết lập chế độ thêm mới
        setOpenAdd(true);
    };

    useEffect(() => {
        const fetchAndSetImages = async () => {
            const images = await Promise.all(nguyenLieuList.map(async (nl) => {
                try {
                    const image = await fetchImage(nl.hinhanh);
                    return { NguyenLieuID: nl.manl, image };
                } catch (error) {
                    console.error('Error fetching NguyenLieuID image:', error);
                    return { NguyenLieuID: nl.manl, image: null };
                }
            }));
            setNLImages(images);
        };
      
    fetchAndSetImages();
    }, [nguyenLieuList]);

    const handleClickOpenEdit = async (nguyenLieu) => {
        setNewNguyenLieu(nguyenLieu);
    
        if (String(nguyenLieu.hinhanh)) {
            try {
                // Lấy URL hình ảnh từ API
                const imageUrl = await fetchImage(String(nguyenLieu.hinhanh));
    
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
    
        setIsEditing(true); // Thiết lập chế độ chỉnh sửa
        setOpenEdit(true);
    };
    

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleConfirmDeleteClose = () => {
        setOpenConfirmDelete(false);
    };

    const handleNewNguyenLieuChange = (e) => {
        const { name, value } = e.target;
        setNewNguyenLieu({
            ...newNguyenLieu,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSaveAdd = async () => {
        if (selectedFile === null) {
            const response = await fetch(img1);
            const blob = await response.blob();
            const defaultFile = new File([blob], 'default.png', { type: blob.type });
            setSelectedFile(defaultFile);
        }
        if(newNguyenLieu.manl.trim() === '' || newNguyenLieu.tennl.trim() === ''){
            alert("Không bỏ trống các ô thông tin!");
            return;
        }
       
        const duplicateProducts = nguyenLieuList.filter(nl => nl.manl === newNguyenLieu.manl);
    if (duplicateProducts.length > 0) {
        alert('Mã nguyên liệu đã tồn tại trong danh sách!');
        return;
    }
        try {
            await themNguyenLieu(newNguyenLieu,selectedFile);
            fetchNguyenLieu();
            handleCloseAdd();
            setMessage("Thêm nguyên liệu mới thành công!")
            setMessageOpen(true);
        } catch (error) {
            console.error('Error adding NguyenLieu:', error);
        }
    };
    

    const handleSaveEdit = async () => {
        try {
            await updateNguyenLieu(newNguyenLieu,selectedFile);
            await fetchNguyenLieu();
            handleCloseEdit();
            setMessage("Cập nhật nguyên liệu thành công!")
            setMessageOpen(true);
        } catch (error) {
            console.error('Error update NguyenLieu:', error);
        }
    };

    const handleDelete = async () => {
        if (selectedNguyenLieu) {
            try {
                await xoaNguyenLieu(selectedNguyenLieu.manl);
                await fetchNguyenLieu();
                handleConfirmDeleteClose();
                setMessage("Xóa nguyên liệu thành công!")
                setMessageOpen(true);
            } catch (error) {
                setMessage("Nguyên liệu này đã sử dụng không thể xóa!")
                setMessageOpen(true);
                console.error('Error update NguyenLieu:', error);
            }
        }
    };

    const handleOpenConfirmDelete = (nguyenLieu) => {
        setSelectedNguyenLieu(nguyenLieu);
        setOpenConfirmDelete(true);
    };

    const getImageUrl = (file) => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return img1; // Sử dụng ảnh mặc định nếu không có file
    };
    const handleClickOpenNLPS = () => {
        setNLPSSelected({
            manv: user,
            tennv:'',
            manl: '',
            tennl: '',
            ngay: '',
            soluongton: '',
            mota: '',
        });
        setIsUpdate(false);
        setOpenNLPS(true);
    };
    const handleClickOpenUpdateNLPS = (nlps) => {
        setNLPSSelected(nlps);
        setIsUpdate(true);
        setOpenNLPS(true);
    };
    const handleXoaNLPSClick = (nlps) => {
        setNLPSSelected(nlps);
        setOpenXoaNLPS(true);
    };
    const handleXoaNLPSClose = () => {
        setOpenXoaNLPS(false);
    };
    const handleXoaNLPSSubmit = async (nlps) => {
        try {
            await xoaNguyenLieuPhatSinh(NLPSSelected);
            await fetchNLPS();
            handleXoaNLPSClose();
            setMessage("Xóa nguyên liệu phát sinh thành công!")
            setMessageOpen(true);
        } catch (error) {
            setMessage("Lỗi xóa nguyên liệu phát sinh chưa thành công!")
            setMessageOpen(true);
            console.error('Error update NguyenLieu:', error);
        }
    };
    const handleSaveNLPSClick = async ()=>
    {
        if (isUpdate)
        {
            try {
                await updateNguyenLieuPhatSinh(NLPSSelected);
                await fetchNLPS();
                handleClickCloseNLPS();
                setMessage("Cập nhật nguyên liệu phát sinh thành công!")
                setMessageOpen(true);
            } catch (error) {
                console.error('Error update NguyenLieuPS:', error);
            }
        }
        else{
            if (NLPSSelected.soluong < 0) {
            alert('Số lượng phải lớn hơn 0!');
            return;
            }
            try {
                await themNguyenLieuPhatSinh(NLPSSelected);
                await fetchNLPS();
                handleClickCloseNLPS();
                
                setMessage("Thêm nguyên liệu phát sinh thành công!")
                setMessageOpen(true);
            } catch (error) {
                console.error('Error add NguyenLieuPS:', error);
            }
        }
    }
    const handleNLPSChange = (e) => {
        const { name, value } = e.target;
        setNLPSSelected({
            ...NLPSSelected,
            [name]: value
        });
    };
    const handleClickCloseNLPS = async ()=>
        {
            setOpenNLPS(false);
        }

        const handleOpenChiTietNhap = (nguyenLieu) => {
            setSelectedNguyenLieu(nguyenLieu);
            fetchChiTietNhap(nguyenLieu.manl);
            setOpenChiTietNhap(true);
        };
        
        const handleCloseChiTietNhap = () => {
            setChiTietNhap([]);
            setOpenChiTietNhap(false);
        };
        const handleFetchData = async () => {
            if (!selectedDate) {
                alert("Vui lòng chọn ngày!");
                return;
            }
            try {
                const response = await getNguyenLieuSuDungTrongNgay(selectedDate);
                setData(response);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
                alert("Không thể lấy dữ liệu. Vui lòng thử lại sau.");
            }
        };
        const ChiTietNhapDialog = () => (
            <Dialog open={openChiTietNhap} onClose={handleCloseChiTietNhap} maxWidth="md" fullWidth
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Màu nền đen với độ mờ 30% 
                },
            }}
          >
                <DialogTitle>Chi tiết nhập nguyên liệu: {selectedNguyenLieu?.manl} - {selectedNguyenLieu?.tennl}</DialogTitle>
                <DialogContent>
                    {chiTietNhap.length === 0 ? (
                        <p>Chưa có thông tin chi tiết nhập.</p>
                    ) : (
                     
                        <Table>
                            <TableHead>
                                <TableRow>
                              
                                    <TableCell  align="center"  sx={{ fontWeight: 'bold' }}>Ngày nhập</TableCell>
                                    <TableCell align="right"  sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell  align="right"  sx={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                                    <TableCell   align="right" sx={{ fontWeight: 'bold' }}>Tồn kho trước</TableCell>
                                    <TableCell  align="right"  sx={{ fontWeight: 'bold' }}>Tồn kho sau</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chiTietNhap.map((row) => (
                                    <TableRow key={row.maphieunhap}>
                         
                                        <TableCell  align="center" >{formatDate(row.ngaynhap)}</TableCell>
                                        <TableCell  align="right" >{row.soluong} {row.donvi}</TableCell>
                                        <TableCell  align="right" >{row.gianhap.toLocaleString()}đ</TableCell>
                                        <TableCell  align="right" >{row.tonkhotruoc} {row.donvi}</TableCell>
                                        <TableCell  align="right" >{row.tonkhosau} {row.donvi}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChiTietNhap} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        );
        const SanPhamKhaDung = () => {
            return (
                <Dialog open={openAvailableDialog} onClose={handleCloseAvailableProducts} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>
                        Thống kê khả dụng
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={4} justifyContent="space-between">
                            {/* Bảng nguyên liệu */}
                            <Grid item xs={5}>
                                <Paper elevation={3} sx={{ padding: 2 }}>
                                    <h3 style={{ textAlign: "center", margin: 0, fontWeight: "bold" }}>Nguyên liệu hiện có</h3>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Nguyên liệu</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }} align='right'>Số lượng</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {nguyenLieuHienCoList.map((row, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{row.manl} - {row.tennl}</TableCell>
                                                    <TableCell align='right'>{row.soluongton} {row.donvi}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
        
                            {/* Bảng sản phẩm khả dụng */}
                            <Grid item xs={5}>
                                <Paper elevation={3} sx={{ padding: 2 }}>
                                    <h3 style={{ textAlign: "center", margin: 0, fontWeight: "bold" }}>Sản phẩm khả dụng</h3>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Sản phẩm</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }} align='center'>Size</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }} align='right'>Số lượng khả dụng</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {SanPhamKhaDungList.map((row, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{row.tensp}</TableCell>
                                                    <TableCell align='center'>{row.masize}</TableCell>
                                                    <TableCell align='right'>{row.soluongkhadung}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAvailableProducts} variant="contained" color="primary" sx={{ margin: '0 auto', display: 'block' }}>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            );
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
                        {activeCategory === 'nguyen-lieu' && (
                            <>
                            <div className="search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="button-container" style={{ display: 'flex' }}>
                                <Button variant="outlined" onClick={handleClickOpenAdd} style={{ marginRight: '10px' }}>
                                    Thêm mới
                                </Button>
                                <Button variant="outlined" onClick={handleClickOpenAvailableProducts}>
                                    Thống kê khả dụng
                                </Button>
                            </div>
                            <label htmlFor="search" style={{ marginLeft: '10px' }}>Tìm kiếm:</label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
                                placeholder="Tìm kiếm theo tên nguyên liệu"
                                className="search-input" // Thêm class để chỉnh sửa ô tìm kiếm
                                style={{ flex: 1, marginRight: '10px' }} // Làm cho ô tìm kiếm chiếm không gian còn lại
                            />
                           
                            <p className="title">Danh sách nguyên liệu</p>
                        </div>
                        
                        {openAvailableDialog && <SanPhamKhaDung />}
                        
                       
                        
                                
                                <Dialog open={openAdd} onClose={handleCloseAdd}>
                                    <DialogTitle>Thêm nguyên liệu mới</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            margin="dense"
                                            id="manl"
                                            name="manl"
                                            label="Mã nguyên liệu"
                                            fullWidth
                                            value={newNguyenLieu.manl}
                                            onChange={handleNewNguyenLieuChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="tennl"
                                            name="tennl"
                                            label="Tên nguyên liệu"
                                            fullWidth
                                            value={newNguyenLieu.tennl}
                                            onChange={handleNewNguyenLieuChange}
                                        />
                                            <TextField
                                            margin="dense"
                                            id="donvi"
                                            name="donvi"
                                            label="Đơn vị"
                                            select
                                            fullWidth
                                            value={newNguyenLieu.donvi}
                                            onChange={handleNewNguyenLieuChange}
                                            >
                                            {["kg", "lít", "cái"].map((donVi) => (
                                                <MenuItem key={donVi} value={donVi}>
                                                {donVi}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {/* <TextField
                                            margin="dense"
                                            id="soluongton"
                                            name="soluongton"
                                            label="Số lượng tồn"
                                            fullWidth
                                            value={newNguyenLieu.soluongton}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                                handleNewNguyenLieuChange(e);
                                                }
                                            }}
                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                            /> */}
                                            <TextField
                                            margin="dense"
                                            id="toithieu"
                                            name="toithieu"
                                            label="Tồn kho tối thiểu"
                                            fullWidth
                                            value={newNguyenLieu.toithieu}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (!isNaN(value) && Number(value) > 0)) {
                                                handleNewNguyenLieuChange(e);
                                                }
                                            }}
                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
                                        <Button onClick={handleCloseAdd} color="secondary">
                                            Đóng
                                        </Button>
                                        <Button onClick={handleSaveAdd} color="primary">
                                            Lưu
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openEdit} onClose={handleCloseEdit}>
                                    <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            margin="dense"
                                            id="manl"
                                            name="manl"
                                            label="Mã nguyên liệu"
                                            fullWidth
                                            value={newNguyenLieu.manl}
                                            disabled={isEditing} // Chỉ vô hiệu hóa khi chỉnh sửa
                                        />
                                        <TextField
                                            margin="dense"
                                            id="tennl"
                                            name="tennl"
                                            label="Tên nguyên liệu"
                                            fullWidth
                                            value={newNguyenLieu.tennl}
                                            onChange={handleNewNguyenLieuChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="donvi"
                                            name="donvi"
                                            label="Đơn vị"
                                            select
                                            fullWidth
                                            value={newNguyenLieu.donvi}
                                            onChange={handleNewNguyenLieuChange}
                                            >
                                            {["kg", "lít", "cái"].map((donVi) => (
                                                <MenuItem key={donVi} value={donVi}>
                                                {donVi}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            margin="dense"
                                            id="soluongton"
                                            name="soluongton"
                                            label="Số lượng tồn"
                                            fullWidth
                                            value={newNguyenLieu.soluongton}
                                            disabled={isEditing}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                                handleNewNguyenLieuChange(e);
                                                }
                                            }}
                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                            />
                                            <TextField
                                            margin="dense"
                                            id="toithieu"
                                            name="toithieu"
                                            label="Tồn kho tối thiểu"
                                            fullWidth
                                            value={newNguyenLieu.toithieu}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (!isNaN(value) && Number(value) > 0)) {
                                                handleNewNguyenLieuChange(e);
                                                }
                                            }}
                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                            />
                                        <input
                                            id="fileInputEdit"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Button variant="outlined" onClick={() => document.getElementById('fileInputEdit').click()}>
                                            Chọn ảnh
                                        </Button>
                                        <img src={ getImageUrl(selectedFile) }  alt="Selected" style={{ marginTop: '10px', maxHeight: '300px', maxWidth: '100%' }} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseEdit} color="secondary">
                                            Đóng
                                        </Button>
                                        <Button onClick={handleSaveEdit} color="primary">
                                            Cập nhật
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openConfirmDelete} onClose={handleConfirmDeleteClose}>
                                    <DialogTitle>Xóa nguyên liệu</DialogTitle>
                                    <DialogContent>
                                        <p>Bạn có chắc chắn muốn xóa nguyên liệu với mã {selectedNguyenLieu?.manl} - tên {selectedNguyenLieu?.tennl} không?</p>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleConfirmDeleteClose} color="secondary">
                                            Hủy
                                        </Button>
                                        <Button onClick={handleDelete} color="primary">
                                            Đồng ý
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <div className="product-list">
    {filteredNguyenLieuList.map((nguyenLieu) => (
        <div key={nguyenLieu.manl} className="product-item">
            {nguyenLieu.hinhanh ? (
                <img
                    src={NLImages.find(img => img.NguyenLieuID === nguyenLieu.manl)?.image || img1}
                    alt={`Ảnh sản phẩm`}
                />
            ) : (
                <img src={img1} alt={`Ảnh sản phẩm`} />
            )}

            {/* Hiển thị dòng chữ cảnh báo nếu số lượng tồn <= hạn tồn và trạng thái không phải là 1 */}
            {nguyenLieu.soluongton <= nguyenLieu.toithieu && nguyenLieu.trangthai !== 1 && (
                <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>
                    *Nguyên liệu cần nhập thêm!*
                </p>
            )}

            <div className="product-info">
                <h3>ID: {nguyenLieu.manl} - {nguyenLieu.tennl}</h3>
                <p>Số lượng tồn hiện tại: {nguyenLieu.soluongton} {nguyenLieu.donvi}</p>
                <p>Hạn mức tối thiểu: {nguyenLieu.toithieu} {nguyenLieu.donvi}</p>

                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px' }}>Dừng kinh doanh:</p>
                    <a href="#" onClick={() => handleChangeStatus(nguyenLieu.manl)}>
                        <img
                            src={nguyenLieu.trangthai === 0 ? off : on}
                            alt={nguyenLieu.trangthai === 0 ? "Còn làm" : "Đã nghỉ"}
                            style={{ width: '50px', height: '50px' }}
                        />
                    </a>
                </span>

                <div className="product-actions">
                    <Button variant="outlined" onClick={() => handleOpenChiTietNhap(nguyenLieu)}>Chi tiết nhập</Button>
                    {openChiTietNhap && <ChiTietNhapDialog />}
                    <Button variant="outlined" onClick={() => handleClickOpenEdit(nguyenLieu)}>Sửa</Button>
                    <Button variant="outlined" onClick={() => handleOpenConfirmDelete(nguyenLieu)}>Xóa</Button>
                </div>
            </div>
        </div>
    ))}
</div>

                            </>
                        )}
                        {activeCategory === 'phat-sinh' && (
                            
                             <><span className="theloai-container">
                             <Button variant="outlined" onClick={handleClickOpenNLPS}>
                                 Thêm mới
                             </Button>
                            <p className="title">Nguyên liệu phát sinh</p>
                          </span>
                            
                            <div className="order-list">
                            {NLPSList.length === 0 ? (
                              <p variant="h6" align="center" style={{ padding: '20px' }}>
                                Chưa có nguyên liệu phát sinh
                              </p>
                            ) : (
                              <Table sx={{ border: '1px solid #ccc' }}>
                              <TableHead>
                              <TableRow>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Nhân viên tạo</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Nguyên liệu phát sinh</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Ngày</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Số lượng</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Mô tả</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Sửa</TableCell>
                                      <TableCell sx={{ border: '1px solid #ccc' }}>Xóa</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                      {NLPSList.map((nlps) => (
                                          <TableRow key={nlps.manv && nlps.manl && nlps.ngay}>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.manv} - {nlps.tennv}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.manl} - {nlps.tennl}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(nlps.ngay)}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>
                                              {nlps.soluong >= 0 
                                                        ? `${nlps.soluong} ${nlps.donvi}` 
                                                        : `dư ${Math.abs(nlps.soluong)} ${nlps.donvi}`}
                                              </TableCell>
                                        
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.mota}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>  <Button variant="contained" color="primary" onClick={() => handleClickOpenUpdateNLPS(nlps)}>
                                        Sửa
                                        </Button> </TableCell>
                                              
                                              <TableCell sx={{ border: '1px solid #ccc' }}> <Button variant="contained" color="secondary" onClick={() => handleXoaNLPSClick(nlps)}>
                                        Xóa
                                        </Button></TableCell>
                                          </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            )}
                          </div>
                          </>
                        )}
                          {activeCategory === 'nguyen-lieu-trong-ngay' && (
                            
                            <>
                                <div>
                                <h2>Thống kê nguyên liệu sử dụng trong ngày</h2>
                                <div style={{ marginBottom: "16px" }}>
                                    <TextField
                                        label="Chọn ngày"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginRight: "8px" }}
                                    />
                                    <Button variant="contained" color="primary" onClick={handleFetchData}>
                                        Xem thống kê
                                    </Button>
                                </div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nguyên Liệu</TableCell>
                                            <TableCell align='center'>Tổng theo công thức</TableCell>
                                            <TableCell align='center'>Tổng phát sinh</TableCell>
                                            <TableCell align='center'>Tổng thực sử dụng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.length > 0 ? (
                                            data.map((item) => (
                                                <TableRow key={item.manl}>
                                                    <TableCell>{item.manl} - {item.tennl}</TableCell>
                                                    <TableCell align='center'>{item.tongsudung} {item.donvi}</TableCell>
                                                    <TableCell align='center'>
                                                    {item.soluongphatsinh >= 0 
                                                        ? `${item.soluongphatsinh} ${item.donvi}` 
                                                        : `dư ${Math.abs(item.soluongphatsinh)} ${item.donvi}`}
                                                    </TableCell>
                                                    <TableCell  align='center'>{item.tongthuc} {item.donvi}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                                    Không có dữ liệu.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                         </>
                       )}
                    </div>
                    <Dialog open={openNLPS} onClose={handleClickCloseNLPS}>
                                    <DialogTitle>{isUpdate ? "Cập nhật nguyên liệu phát sinh" : "Thêm nguyên liệu phát sinh"}</DialogTitle>
                                    <DialogContent>
                                    <TextField
                                            margin="dense"
                                            id="manl"
                                            name="manl"
                                            label="Nguyên liệu phát sinh"
                                            select
                                            fullWidth
                                            disabled={isUpdate}
                                            value={NLPSSelected.manl}
                                            onChange={handleNLPSChange}
                                        >
                                            {nguyenLieuList.map((nl) => (
                                            <MenuItem key={nl.manl} value={nl.manl}>
                                                  {nl.manl} - {nl.tennl}
                                            </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            margin="dense"
                                            id="ngay"
                                            name="ngay"
                                            label="Ngày"
                                            type="date"
                                            disabled={isUpdate}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={NLPSSelected.ngay}
                                            onChange={handleNLPSChange}
                                        />
                                          <TextField
                                            margin="dense"
                                            type="number"
                                            id="soluong"
                                            name="soluong"
                                            label="Số lượng"
                                            fullWidth
                                            value={NLPSSelected.soluong}
                                            onChange={handleNLPSChange}
                                        />
                                        <FormHelperText sx={{ color: 'red' }}>
                                            *Giá trị bé hơn 0 là đang dư so với công thức, Giá trị lớn hơn 0 là đang âm so với công thức
                                        </FormHelperText>

                                        <TextField
                                            margin="dense"
                                            id="mota"
                                            name="mota"
                                            label="Mô tả"
                                            fullWidth
                                            value={NLPSSelected.mota}
                                            onChange={handleNLPSChange}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClickCloseNLPS} color="secondary">
                                            Đóng
                                        </Button>
                                        <Button onClick={handleSaveNLPSClick} color="primary">
                                            Lưu
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openXoaNLPS} onClose={handleXoaNLPSClose}>
                                    <DialogTitle>Xóa nguyên liệu phát sinh</DialogTitle>
                                    <DialogContent>
                                        <p>Bạn có chắc chắn muốn xóa nguyên liệu phát sinh {NLPSSelected.manl} - {NLPSSelected.tennl} -  ngày {formatDate(NLPSSelected.ngay)} không?</p>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleXoaNLPSClose} color="secondary">
                                            Hủy
                                        </Button>
                                        <Button onClick={handleXoaNLPSSubmit} color="primary">
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
            </div>
        </div>
    );
}

export default QuanLyNguyenLieu;
