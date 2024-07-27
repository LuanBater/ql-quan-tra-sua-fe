import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import { getDanhSachNguyenLieu, themNguyenLieu, xoaNguyenLieu, updateNguyenLieu,fetchImage,
    getDanhSachNguyenLieuPhatSinh,themNguyenLieuPhatSinh,updateNguyenLieuPhatSinh,xoaNguyenLieuPhatSinh,formatDate,
    themNhaCungCap,updateNhaCungCap,xoaNhaCungCap
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
import MenuItem from '@mui/material/MenuItem';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import Header from '../HeaderPage/headerpage.jsx';

function QuanLyNguyenLieu({ navItems }) {
    const [activeCategory, setActiveCategory] = useState('nguyen-lieu');
    const [nguyenLieuList, setNguyenLieuList] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openNLPS, setOpenNLPS] = useState(false);
    const [openXoaNLPS, setOpenXoaNLPS] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [NLImages, setNLImages] = useState([]); 
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [newNguyenLieu, setNewNguyenLieu] = useState({
        manl: '',
        tennl: '',
        soluongton: '',
        hinhanh: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedNguyenLieu, setSelectedNguyenLieu] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State để xác định chế độ
    const [NLSPList, setNLPSList] = useState([]);
    const [NLTSSelected, setNLPSSelected] = useState({});
    const fetchNguyenLieu = async () => {
        try {
            const data = await getDanhSachNguyenLieu();
            setNguyenLieuList(data);
        } catch (error) {
            console.error('Error fetching NguyenLieu:', error);
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
        setActiveCategory(categoryId === 1 ? 'nguyen-lieu' : 'phat-sinh');
    };

    const handleClickOpenAdd = () => {
        setNewNguyenLieu({
            manl: '',
            tennl: '',
            soluongton: '',
            hinhanh: '',
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
        } catch (error) {
            console.error('Error adding NguyenLieu:', error);
        }
    };
    

    const handleSaveEdit = async () => {
        try {
            await updateNguyenLieu(newNguyenLieu,selectedFile);
            await fetchNguyenLieu();
            handleCloseEdit();
        } catch (error) {
            console.error('Error update NguyenLieu:', error);
        }
    };

    const handleDelete = async () => {
        if (selectedNguyenLieu) {
            await xoaNguyenLieu(selectedNguyenLieu.manl);
            await fetchNguyenLieu();
            handleConfirmDeleteClose();
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
            manv: 'QL01',
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
            await xoaNguyenLieuPhatSinh(NLTSSelected);
            await fetchNLPS();
            handleXoaNLPSClose();
        } catch (error) {
            console.error('Error update NguyenLieu:', error);
        }
    };
    const handleSaveNLPSClick = async ()=>
    {
        if (isUpdate)
        {
            try {
                await updateNguyenLieuPhatSinh(NLTSSelected);
                await fetchNLPS();
                handleClickCloseNLPS();
            } catch (error) {
                console.error('Error update NguyenLieuPS:', error);
            }
        }
        else{
            try {
                await themNguyenLieuPhatSinh(NLTSSelected);
                await fetchNLPS();
                handleClickCloseNLPS();
            } catch (error) {
                console.error('Error add NguyenLieuPS:', error);
            }
        }
    }
    const handleNLPSChange = (e) => {
        const { name, value } = e.target;
        setNLPSSelected({
            ...NLTSSelected,
            [name]: value
        });
    };
    const handleClickCloseNLPS = async ()=>
        {
            setOpenNLPS(false);
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
                        {activeCategory === 'nguyen-lieu' && (
                            <><span className="theloai-container">
                            <Button variant="outlined" onClick={handleClickOpenAdd}>
                                    Thêm mới
                                </Button>
                            <p className="title">Danh sách nguyên liệu</p>
                          </span>
                                
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
                                    {nguyenLieuList.map((nguyenLieu) => (
                                        <div key={nguyenLieu.manl} className="product-item">
                                            {nguyenLieu.hinhanh ? (
                                                <img 
                                                    src={NLImages.find(img => img.NguyenLieuID === nguyenLieu.manl)?.image || img1} 
                                                    alt={`Ảnh sản phẩm`} 
                                                />
                                            ) : (
                                                <img src={img1} alt={`Ảnh sản phẩm`} />
                                            )}
                                            <div className="product-info">
                                                <h3>ID: {nguyenLieu.manl} - {nguyenLieu.tennl}</h3>
                                                <p>Số lượng tồn: {nguyenLieu.soluongton}</p>
                                                <div className="product-actions">
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
                            {NLSPList.length === 0 ? (
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
                                      {NLSPList.map((nlps) => (
                                          <TableRow key={nlps.manv && nlps.manl && nlps.ngay}>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.manv} - {nlps.tennv}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.manl} - {nlps.tennl}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(nlps.ngay)}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' }}>{nlps.soluong}</TableCell>
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
                                            value={NLTSSelected.manl}
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
                                            value={NLTSSelected.ngay}
                                            onChange={handleNLPSChange}
                                        />
                                            <TextField
                                            margin="dense"
                                            type='number'
                                            id="soluong"
                                            name="soluong"
                                            label="Số lượng"
                                            fullWidth
                                            value={NLTSSelected.soluong}
                                            onChange={handleNLPSChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="mota"
                                            name="mota"
                                            label="Mô tả"
                                            fullWidth
                                            value={NLTSSelected.mota}
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
                                        <p>Bạn có chắc chắn muốn xóa nguyên liệu phát sinh {NLTSSelected.manl} - {NLTSSelected.tennl} -  ngày {formatDate(NLTSSelected.ngay)} không?</p>
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
                </div>
            </div>
        </div>
    );
}

export default QuanLyNguyenLieu;
