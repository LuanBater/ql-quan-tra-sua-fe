import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import GiaDialog from "./GiaDialog";
import trasua01 from '../../resource/image/default-tra-sua.png';
import {xoaCongThuc, getDanhSachSanPham, getDanhSachTheLoai, getDanhSachBangGia, getDoanhThuSanPhamTrongNgay,getChiTietGia,
        getDanhSachCongThuc,getDanhSachNguyenLieu,updateSanPham,themSanPham,
        xoaSanPham,fetchImage, UpdateCongThuc,getBangGiaKhuyenMai,UpdateGiaKhuyenMai,xoaKhuyenMai ,changeGia,
        formatDate, themBangGia,updateBangGia,xoaBangGia} from '../../API/QLSanPham';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {menuItemsQL} from '../HeaderPage/Menu.js';
import Header from '../HeaderPage/headerpage.jsx';
import { useNavigate } from 'react-router-dom';
import { Paper, TableContainer, Typography } from '@mui/material';
import MessageDialog from '../modal/MessageDialog.jsx';
function QuanLySanPham ({navItems}) {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "QL") {
    navigate("/")
  }
  const user = localStorage.getItem("username")
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [selectedTheLoai, setSelectedTheLoai] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('products'); // Default to products
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]); // Initialize categories as an empty array
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openGiaDialog, setOpenGiaDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [giaList, setGiaList] = useState([]);
  const [priceNewCode, setPriceNewCode] = useState('');
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageNote, setMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    masp: '',
    tensp: '',
    maloai: '',
    giaM: '',
    giaL: '',
    hinhanh: '',
    mabg: 'BG01',
  });
  const handleMessageClose = () => {
    setMessageOpen(false);
  };
  const handleQuantityChange = (index, newQuantity) => {
    // Kiểm tra giá trị mới có hợp lệ không (ví dụ: không âm)
    if (newQuantity < 0) {
      alert("Số lượng không thể nhỏ hơn 0");
      return;
    }
  
    // Tạo bản sao của danh sách công thức
    const updatedCongThuc = [...congThuc];
  
    // Cập nhật số lượng của nguyên liệu tại vị trí `index`
    updatedCongThuc[index] = {
      ...updatedCongThuc[index],
      soluong: newQuantity,
    };
  
    // Cập nhật lại state
    setCongThuc(updatedCongThuc);
  };
  
  const fetchChiTietGia = async (product) => {

    const tempMaLoai = product.maloai === "TP" ? "TP" : "SP";
    try {
      const data = await getChiTietGia(product.masp,tempMaLoai);
      setGiaList(data);
      console.log('Fetched Products:', data);
    } catch (error) {
      console.error('Error fetching SanPhams:', error);
    }
  };
  const handleOpenGiaDialog = async (product) => {
    setSelectedProduct(product);
    setOpenGiaDialog(true);
    fetchChiTietGia(product);
  };
  const handleCloseGiaDialog = () => {
    setOpenGiaDialog(false);
    setSelectedProduct(null);
    setGiaList([]);
  };
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected image file
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState({});
   const handleFetchData = async () => {
              if (!selectedDate) {
                  alert("Vui lòng chọn ngày!");
                  return;
              }
              try {
                  const response = await getDoanhThuSanPhamTrongNgay(selectedDate);
                  setData(response);
              } catch (error) {
                  console.error("Lỗi khi lấy dữ liệu thống kê:", error);
                  alert("Không thể lấy dữ liệu. Vui lòng thử lại sau.");
              }
          };
  const handleOpenEditDialog = async (product) => {
    setEditProduct(product);
    if (String(product.hinhanh)) {
      try {
          // Lấy URL hình ảnh từ API
          const imageUrl = await fetchImage(String(product.hinhanh));

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

    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  // State for handling formula (cong thuc) dialog
  const [openCongThucDialog, setOpenCongThucDialog] = useState(false);
  const [congThuc, setCongThuc] = useState([]); // List of ingredients for formula
  const [newNguyenLieu, setNewNguyenLieu] = useState('');
  const [newSoLuong, setNewSoLuong] = useState('');
  const [newTenNL, setnewTenNL] = useState('');
  const [newDonVi, setnewDonVi] = useState('');
  const [newMota, setNewMoTa] = useState('');
  const [NguyenLieuList, setNguyenLieuList] = useState([]);
  const [imgSP, setImgSP] = useState([]);
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('products');
        setSearchTerm("");
        break;
      case 2:
        setActiveCategory('san-pham-trong-ngay');
        
        break;
      case 3:
        setActiveCategory('categories');
        break;
      default:
        setActiveCategory('products'); // Default to products
        setSearchTerm("");
    }
  };
  const getImageUrl = (file) => {
    if (file) {
        return URL.createObjectURL(file);
    }
    return trasua01; // Sử dụng ảnh mặc định nếu không có file
};
  useEffect(() => {
    const fetchAndSetImages = async () => {
        const images = await Promise.all(products.map(async (sp) => {
            try {
                const image = await fetchImage(sp.hinhanh);
                return { idsp: sp.masp, image };
            } catch (error) {
                console.error('Error fetching image:', error);
                return { idsp: sp.masp, image: null };
            }
        }));
        setImgSP(images);
    };
    
    fetchAndSetImages();
}, [products]);

  const fetchTheLoaiList = async () => {
    try {
      const data = await getDanhSachTheLoai();
      if (data.length > 0) {
        data.unshift({ maloai: "ALL", tenloai: "Tất cả" });
        setTheLoaiList(data);
        setCategories(data.filter(theloai => theloai.maloai !== "ALL")); // Exclude "ALL" from categories
        setSelectedTheLoai("ALL"); // Set default selected category to "Tất cả"
      }
      console.log('Fetched TheLoai List:', data);
    } catch (error) {
      console.error('Error fetching the list of TheLoai:', error);
    }
  };

  useEffect(() => {
    fetchTheLoaiList();
  }, []);

  const fetchSanPhams = async () => {
    setProducts([]); // Clear products before fetching new list
    try {
      const data = await getDanhSachSanPham(selectedTheLoai);
      setProducts(data);
      console.log('Fetched Products:', data);
    } catch (error) {
      console.error('Error fetching SanPhams:', error);
    }
  };
  useEffect(() => {
    fetchSanPhams();
  }, [selectedTheLoai]);


    const fetchBangGia = async () => {
      try {
        const data = await getDanhSachBangGia();
        setPrices(data);
        console.log('Fetched Prices:', data);
      } catch (error) {
        console.error('Error fetching BangGia:', error);
      }
    };
    useEffect(() => {
    fetchBangGia();
  }, []);
 

  
  useEffect(() => {
    const fetchNguyenLieu = async () => {
      try {
        const data = await getDanhSachNguyenLieu();
        setNguyenLieuList(data);
        console.log('Fetched NguyenLieu:', data);
      } catch (error) {
        console.error('Error fetching NguyenLieu:', error);
      }
    };

    fetchNguyenLieu();
  }, []);
  const handleTheLoaiChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTheLoai(selectedValue);
  };

  const handleClickOpen = () => {

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleChooseImage = () => {
    // Trigger file input click
    document.getElementById('fileInput').click();
  };

  const handleSave = async () => {
    console.log(newProduct);
    // Check if mabg is selected, otherwise alert user
    const duplicateProducts = products.filter(product => product.masp === newProduct.masp);
    if (duplicateProducts.length > 0) {
        alert('Mã sản phẩm đã tồn tại trong danh sách!');
        return;
    }
    
    if (newProduct.tenSP === '' ||newProduct.maloai=== '' ||newProduct.giaM=== '' ) {
      alert('Vui lòng không bỏ trống dữ liệu!');
      return;
  }
  if (selectedFile === null) {
    alert("Vui lòng chọn ảnh cho sản phẩm!")
    // const response = await fetch(trasua01);
    // const blob = await response.blob();
    // const defaultFile = new File([blob], 'default-tra-sua.png', { type: blob.type });
    // setSelectedFile(defaultFile);
}

  try {
   
    await themSanPham(newProduct,selectedFile);
    setSelectedFile(null);
    fetchSanPhams();
    setOpen(false); // Close the dialog
    setMessage("Thêm Sản phẩm mới thành công!")
    setMessageOpen(true);
  } catch (error) {
      console.error('Error adding NguyenLieu:', error);
  }

    console.log('New Product:', newProduct);
    
  };

  const handleOpenCongThucDialog = async (product) => {
    try {
      const data = await getDanhSachCongThuc(product.masp);
      setCongThuc(data);
      setEditProduct(product);
      setOpenCongThucDialog(true);
      console.log('Fetched CongThuc:', data);
    } catch (error) {
      console.error('Error fetching CongThuc:', error);
    }
  };

  const handleAddNguyenLieu = () => {
    // Validate input
    if (!newNguyenLieu || !newSoLuong) {
      alert('Vui lòng nhập đầy đủ thông tin nguyên liệu!');
      return;
    }
  
      // Check if the ingredient already exists in the formula
      const existingIngredient = congThuc.find(item => item.manl === newNguyenLieu);
      if (existingIngredient) {
        alert('Nguyên liệu này đã có trong công thức!');
        return;
      }

    // Add new ingredient to formula list
    const newIngredient = {
      manl: newNguyenLieu, // Assuming manl is the ID of nguyen lieu
      tennl: newTenNL,
      donvi: newDonVi,
      soluong: newSoLuong,
      mota: newMota, // You may add description here if needed
    };
    setCongThuc([...congThuc, newIngredient]);

    // Clear input fields
    setNewNguyenLieu('');
    setnewTenNL('');
    setNewSoLuong('');
    setNewMoTa('');
    setnewDonVi('');
  };
  const handleDelete = async () => {
    if (editProduct) {
      try {
        await xoaSanPham(editProduct.masp);
        fetchSanPhams();
        handleConfirmDeleteClose();
        setMessage("Xóa sản phẩm thành công!")
        setMessageOpen(true);
      } catch (error) {
        console.error('Error:', error);
        handleConfirmDeleteClose();
        setMessage("Xóa sản phẩm không thành công!")
        setMessageOpen(true);
      }
        
    }
};
const handleOpenConfirmDelete = (product) => {
  setEditProduct(product);
  setOpenConfirmDelete(true);
};


const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};
const filteredProducts = products.filter((product) =>
  product.tensp.toLowerCase().includes(searchTerm.toLowerCase())
);


const handleConfirmDeleteClose = () => {
  setOpenConfirmDelete(false);
};
  const handleDeleteNguyenLieu = (index) => {
    const updatedCongThuc = [...congThuc];
    updatedCongThuc.splice(index, 1);
    setCongThuc(updatedCongThuc);
  };
  const handleUpdateCongThuc = async () => {
    console.log(congThuc);
    if (congThuc.length === 0) {
      alert('Phải chọn ít nhất 1 nguyên liệu');
      return;
    }
  
    // Nếu ngược lại thì tạo vòng lặp fetch API lưu từng dòng của congthuc
    try {
      await xoaCongThuc(editProduct.masp);
      for (const item of congThuc) {
        const temp = {
          masp: editProduct.masp,
          manl: item.manl,
          soluong: item.soluong,
          mota: item.mota
        }
        console.log(temp);
        await UpdateCongThuc (temp) ;
        
      }
      setOpenCongThucDialog(false);
      setMessage("Cập nhật công thức thành công!")
      setMessageOpen(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra trong quá trình cập nhật công thức');
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
          {activeCategory === 'products' && (
                <>
                <div className="theloai-container">
                  <div className="theloai-selector">
                    <label htmlFor="theloai">Thể loại</label>
                    <select
                      id="theloai"
                      name="theloai"
                      onChange={handleTheLoaiChange}
                      value={selectedTheLoai}
                    >
                      <option value="" disabled>Chọn 1 thể loại</option>
                      {theLoaiList.length === 0 ? (
                        <option value="" disabled>Loading...</option>
                      ) : (
                        theLoaiList.map((theloai) => (
                          <option key={theloai.maloai} value={theloai.maloai}>
                            {theloai.tenloai}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
              
                  <div className="search-container">
                  <label htmlFor="search">Tìm kiếm:</label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Nhập tên sản phẩm"
                    className="search-input" // Thêm class để chỉnh sửa ô tìm kiếm
                  />
                </div>

              
                  <p className="title">Danh sách sản phẩm</p>
                </div>
              
              
          
              <Button variant="outlined" onClick={handleClickOpen}>
                Thêm mới
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogContent>
                  <TextField
                    margin="dense"
                    id="maloai"
                    name="maloai"
                    label="Mã loại"
                    select
                    fullWidth
                    value={newProduct.maloai}
                    onChange={handleNewProductChange}
                  >
                    {categories.map((theloai) => (
                      <MenuItem key={theloai.maloai} value={theloai.maloai}>
                        {theloai.tenloai}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    margin="dense"
                    id="masp"
                    name="masp"
                    label="Mã sản phẩm"
                    fullWidth
                    value={newProduct.masp}
                    onChange={handleNewProductChange}
                  />
                  <TextField
                    margin="dense"
                    id="tensp"
                    name="tensp"
                    label="Tên sản phẩm"
                    fullWidth
                    value={newProduct.tensp}
                    onChange={handleNewProductChange}
                  />
                  <input
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Button variant="outlined" onClick={handleChooseImage}>
                    Chọn ảnh
                  </Button>
                  {selectedFile && (
                    <img src={getImageUrl(selectedFile)} alt="Selected" style={{ marginTop: '10px', maxHeight: '300px', maxWidth: '100%' }} />
                  )}
                 
                  <TextField
                    margin="dense"
                    id="giaM"
                    name="giaM"
                    label={newProduct.maloai !== 'TP' ? "Giá Size M" : "Giá Topping"}
                    fullWidth
                    value={newProduct.giaM}
                    onChange={handleNewProductChange}
                  />
                  {newProduct.maloai !== 'TP' && (
                    <TextField
                      margin="dense"
                      id="giaL"
                      name="giaL"
                      label="Giá Size L"
                      fullWidth
                      value={newProduct.giaL}
                      onChange={handleNewProductChange}
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Đóng
                  </Button>
                  <Button onClick={handleSave} color="primary">
                    Lưu
                  </Button>
                </DialogActions>
              </Dialog>
              <div className="product-list">
              {filteredProducts.length === 0 ? (
  <p>Không có sản phẩm nào phù hợp.</p>
) : (
  filteredProducts.map((product) => (
    <div key={product.masp} className="product-item">
      {/* Hiển thị hình ảnh sản phẩm */}
      <img
        src={product.hinhanh 
          ? imgSP.find(img => img.idsp === product.masp)?.image || trasua01 
          : trasua01}
        alt={`Ảnh sản phẩm`}
      />
      
      <div className="product-info">
        {/* Hiển thị thông tin sản phẩm */}
        <h3>ID: {product.masp} - {product.tensp}</h3>
        
        <div className="product-actions">
          {/* Các nút chức năng */}
          <button onClick={() => handleOpenGiaDialog(product)}>Giá</button>
          <button onClick={() => handleOpenCongThucDialog(product)}>Công thức</button>
          <button onClick={() => handleOpenEditDialog(product)}>Sửa</button>
          <button onClick={() => handleOpenConfirmDelete(product)}>Xóa</button>
        </div>
      </div>

      {/* Hiển thị hộp thoại giá */}
      <GiaDialog
        open={openGiaDialog}
        onClose={handleCloseGiaDialog}
        product={selectedProduct}
        giaList={giaList}
      />
    </div>
  ))
)}

                
      </div>
            </>
          )}
          {activeCategory === 'san-pham-trong-ngay' && (
                            
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
                                {data.length === 0 ? (
                                  <Typography variant="h6" align="center" style={{ padding: '20px' }}>
                                    Không có sản phẩm trong tháng
                                  </Typography>
                                ) : (
                                  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                                    <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                                        Thống kê sản phẩm bán được trong ngày {formatDate(selectedDate)}
                                      </Typography>
                                    <TableContainer component={Paper}>
                                      <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px' , fontWeight: 'bold'}}>Tên sản phẩm</TableCell>
                                            <TableCell  sx={{ border: '1px solid #ccc' ,width:'20px' , fontWeight: 'bold'}}>Size</TableCell>
                                            <TableCell  sx={{ border: '1px solid #ccc' ,width:'50px' , fontWeight: 'bold'}} align="right">Giá bán</TableCell>
                                            <TableCell   sx={{ border: '1px solid #ccc' ,width:'50px' , fontWeight: 'bold'}}align="right">Số lượng bán</TableCell>
                                            <TableCell   sx={{ border: '1px solid #ccc' ,width:'50px' , fontWeight: 'bold'}}align="right">Tổng tiền (VND)</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {data.map((row) => (
                                            <TableRow key={row.idctsp}>
                                              <TableCell sx={{ border: '1px solid #ccc' ,width:'100px'}}>{row.masp} - {row.tensp}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' ,width:'20px'}}>{row.masize}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}} align="right">{row.giaban.toLocaleString()}đ</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}} align="right">{row.soluongban}</TableCell>
                                              <TableCell sx={{ border: '1px solid #ccc' ,width:'50px'}} align="right">{row.doanhthu.toLocaleString()}đ</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                )}
                            </div>
                         </>
                       )}
          
          {activeCategory === 'categories' && (
            <>
            <span className="theloai-container">
                <p className="title">Thể loại</p>
              </span>
            <div className="product-list">
              {categories.map((category) => (
                <div key={category.maloai} className="product-item">
                  ID: {category.maloai} - {category.tenloai}
                  <div className="product-info">
                    <div className="product-actions">
                      {/* <Button variant="outlined">Sửa</Button>
                      <Button variant="outlined">Xóa</Button> */}
                    </div>
                  </div>
                </div>
              ))}             
            </div>
            </>
          )} 
        </div>
        
      </div>
      {/* Cong thuc dialog */}
      <Dialog open={openCongThucDialog} onClose={() => setOpenCongThucDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle>Công thức sản phẩm</DialogTitle>
  <DialogContent>
    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
      <TableHead>
        <TableRow>
          <TableCell><b>Mã nguyên liệu</b></TableCell>
          <TableCell><b>Tên nguyên liệu</b></TableCell>
          <TableCell><b>Số lượng</b></TableCell>
          <TableCell><b>Đơn vị</b></TableCell>
          <TableCell><b>Mô tả</b></TableCell>
          <TableCell><b>Thao tác</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {congThuc.map((nguyenLieu, index) => (
          <TableRow key={index}>
            <TableCell>{nguyenLieu.manl}</TableCell>
            <TableCell>{nguyenLieu.tennl}</TableCell>
            <TableCell>
              <TextField
                type="number"
                value={nguyenLieu.soluong}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                size="small"
                sx={{ width: '100px' }}
              />
            </TableCell>
            <TableCell>{nguyenLieu.donvi}</TableCell>
            <TableCell>{nguyenLieu.mota}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteNguyenLieu(index)}
              >
                Xóa
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <div style={{ marginTop: '20px' }}>
      <p><b>Thêm nguyên liệu mới vào công thức</b></p>
      <FormControl fullWidth margin="normal">
        <InputLabel id="nguyenLieuLabel">Chọn nguyên liệu</InputLabel>
        <Select
          labelId="nguyenLieuLabel"
          id="nguyenLieu"
          value={newNguyenLieu}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setNewNguyenLieu(selectedValue);

            const selectedIngredient = NguyenLieuList.find(item => item.manl === selectedValue);
            if (selectedIngredient) {
              setnewTenNL(selectedIngredient.tennl);
              setnewDonVi(selectedIngredient.donvi);
            }
          }}
        >
          {NguyenLieuList.map((nguyenLieu) => (
            <MenuItem key={nguyenLieu.manl} value={nguyenLieu.manl}>
              {nguyenLieu.manl} - {nguyenLieu.tennl} ({nguyenLieu.donvi})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Số lượng"
        type="number"
        fullWidth
        margin="normal"
        value={newSoLuong}
        onChange={(e) => setNewSoLuong(e.target.value)}
      />
      <TextField
        label="Mô tả"
        type="text"
        fullWidth
        margin="normal"
        value={newMota}
        onChange={(e) => setNewMoTa(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNguyenLieu}
        sx={{ marginTop: '10px' }}
      >
        Thêm nguyên liệu
      </Button>
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenCongThucDialog(false)} variant="outlined" color="secondary">
      Đóng
    </Button>
    <Button onClick={handleUpdateCongThuc} variant="contained" color="primary">
      Cập nhật
    </Button>
  </DialogActions>
</Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
  <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      id="maloai"
      name="maloai"
      label="Mã loại"
      select
      fullWidth
      value={editProduct.maloai}
      onChange={(e) => setEditProduct({ ...editProduct, maloai: e.target.value })}
    >
      {categories.map((theloai) => (
        <MenuItem key={theloai.maloai} value={theloai.maloai}>
          {theloai.tenloai}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      margin="dense"
      id="masp"
      name="masp"
      label="Mã sản phẩm"
      fullWidth
      value={editProduct.masp}
      disabled // Mã sản phẩm không thể chỉnh sửa
    />
    <TextField
      margin="dense"
      id="tensp"
      name="tensp"
      label="Tên sản phẩm"
      fullWidth
      value={editProduct.tensp}
      onChange={(e) => setEditProduct({ ...editProduct, tensp: e.target.value })}
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
    <img src={getImageUrl(selectedFile)} alt="Selected" style={{ marginTop: '10px', maxHeight: '300px', maxWidth: '100%' }} />
    
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditDialog} color="secondary">
      Đóng
    </Button>
    <Button onClick={async () => {
      try {
        await updateSanPham(editProduct, selectedFile);
        setSelectedFile(null);
        fetchSanPhams();
        handleCloseEditDialog();
        setMessage("Cập nhật sản phẩm thành công!")
        setMessageOpen(true);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }} color="primary">
      Cập nhật
    </Button>
  </DialogActions>
</Dialog>
    <Dialog open={openConfirmDelete} onClose={handleConfirmDeleteClose}>
      <DialogTitle>Xóa Sản Phẩm</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa sản phẩm với mã {editProduct?.masp} - tên {editProduct?.tensp} không?</p>
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
    <MessageDialog
                            open={messageOpen}
                            onClose={handleMessageClose}
                            message = {messageNote}
                             />
    </div>
    </div>
  );
};

export default QuanLySanPham;
