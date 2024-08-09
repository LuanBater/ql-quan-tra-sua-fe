import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import trasua01 from '../../resource/image/default-tra-sua.png';
import {xoaCongThuc, getDanhSachSanPham, getDanhSachTheLoai, getDanhSachBangGia, 
        getDanhSachCongThuc,getDanhSachNguyenLieu,updateSanPham,themSanPham,
        xoaSanPham,fetchImage, UpdateCongThuc,getBangGiaKhaDung,getBangGiaKhuyenMai,UpdateGiaKhuyenMai,xoaKhuyenMai ,changeGia,
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
  const [KhaDungPrices, setKhaDungPrices] = useState([]);
  const [KhuyenMaiPrices, setKhuyenMaiPrices] = useState([]);
  const [categories, setCategories] = useState([]); // Initialize categories as an empty array
  const [open, setOpen] = useState(false);
  const [openKMDialog, setopenKMDialog] = useState(false);
  const [openGiaDialog, setOpenGiaDialog] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDeletePrice, SetopenDeletePrice] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openPrice, SetopenPrice] = useState(false);
  const [priceNewCode, setPriceNewCode] = useState('');
  const [newProduct, setNewProduct] = useState({
    masp: '',
    tensp: '',
    maloai: '',
    giaM: '',
    giaL: '',
    hinhanh: '',
    mabg: 'BG01',
  });
  const [selectBangGia, SetSelectBangGia] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected image file
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  
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
  const [newMota, setNewMoTa] = useState('');
  const [NguyenLieuList, setNguyenLieuList] = useState([]);
  const [imgSP, setImgSP] = useState([]);
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('products');
        break;
      case 2:
        setActiveCategory('categories');
        break;
      case 3:
        setActiveCategory('prices');
        break;
      default:
        setActiveCategory('products'); // Default to products
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
    const fetchBangGiaKhaDung = async () => {
      try {
        const data = await getBangGiaKhaDung();
        setKhaDungPrices(data);
        console.log('Fetched Prices:', data);
      } catch (error) {
        console.error('Error fetching BangGia:', error);
      }
    };

    fetchBangGiaKhaDung();
  }, []);
  useEffect(() => {
    const fetchBangGiaKhuyenMai = async () => {
      try {
        const data = await getBangGiaKhuyenMai();
        setKhuyenMaiPrices(data);
        console.log('Fetched Prices:', data);
      } catch (error) {
        console.error('Error fetching BangGia:', error);
      }
    };

    fetchBangGiaKhuyenMai();
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
      soluong: newSoLuong,
      mota: '', // You may add description here if needed
    };
    setCongThuc([...congThuc, newIngredient]);

    // Clear input fields
    setNewNguyenLieu('');
    setnewTenNL('');
    setNewSoLuong('');
    setNewMoTa('');
  };
  const handleDelete = async () => {
    if (editProduct) {
        await xoaSanPham(editProduct.masp);
        fetchSanPhams();
        handleConfirmDeleteClose();
    }
};
const handleOpenConfirmDelete = (product) => {
  setEditProduct(product);
  setOpenConfirmDelete(true);
};
const handleopenKMDialog = (product) => {
  setEditProduct(product);
  setPriceNewCode(product.mabg);
  setopenKMDialog(true);
};
const handleopenGiaDialog = (product) => {
  setEditProduct(product)
  setOpenGiaDialog(true);
};
const handlePriceChange = (event) => {
  setPriceNewCode(event.target.value);
};
const handleClosePriceDialog = () => {
  setopenKMDialog(false);
  setOpenGiaDialog(false);
};
const handlechangePrice = async ()=>
{
  if (editProduct.maloai === 'TP') {
    editProduct.giaL = editProduct.giaM;
  }
  try {
    await changeGia(editProduct.maloai,editProduct.giaM,editProduct.giaL,editProduct.idctspM,editProduct.idctspL);
    fetchSanPhams();
    setOpenGiaDialog(false);
    alert('Cập nhật giá thành công!');
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra trong quá trình cập nhật chi tiết giá');
  }
}
const handleSavePrice = async () => {
  console.log(priceNewCode);
  if (isMabgInKhuyenMaiList(priceNewCode,KhuyenMaiPrices)){
  
  const input = {
    mabgcu: editProduct.mabg,
    mabgmoi: priceNewCode,
    giaM: editProduct.giaM,
    giaL: editProduct.giaL,
    idctspM: editProduct.idctspM,
    idctspL:editProduct.idctspL
  }
  try {
    await UpdateGiaKhuyenMai(input);
    fetchSanPhams();
    setopenKMDialog(false);
    alert('Cập nhật giá khuyến mãi thành công!');
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra trong quá trình cập nhật chi tiết giá khuyến mãi');
  }
  }
  else{
    setopenKMDialog(false);
    return;
  }
  
};
const handleDeleteKM = async () => {

  try {
    await xoaKhuyenMai(editProduct.mabg,editProduct.idctspM,editProduct.idctspL);
    fetchSanPhams();
    setopenKMDialog(false);
    alert('Xóa giá khuyến mãi thành công!');
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra trong quá trình xóa khuyến mãi');
  }

  
};
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
      alert('Cập nhật công thức thành công!');
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra trong quá trình cập nhật công thức');
    }
  };
  const isMabgInKhuyenMaiList = (mabg, KhuyenMaiPrices) => {
    return KhuyenMaiPrices.some(km => km.mabg === mabg);
  };

  const handleClickOpenPrice = () => {
    SetSelectBangGia({
       mabg: '',
       tenbg: '',
       tylegiam: '',
       ngayapdung: '',
       ngaykt: '',
       manv: user,
       loaigia: 'SP',
    });
    setIsUpdate(false);
    SetopenPrice(true);
};
const handleClickOpenUpdatePrice = (bg) => {
  SetSelectBangGia(bg);
    setIsUpdate(true);
    SetopenPrice(true);
};
const handleXoaPriceClick = (bg) => {
  SetSelectBangGia(bg);
    SetopenDeletePrice(true);
};
const handleXoaPriceClose = () => {
  SetopenDeletePrice(false);
};
const handleXoaPriceSubmit = async () => {
    try {
        await xoaBangGia(selectBangGia.mabg);
        await fetchBangGia();
        handleXoaPriceClose();
        alert("Xóa thành công")
    } catch (error) {
        console.error('Error Xoa BG:', error);
    }
};
const handleSavePriceClick = async ()=>
{
    if (isUpdate)
    {
        try {
            await updateBangGia(selectBangGia);
            await fetchBangGia();
            handleClickClosePrice();
        } catch (error) {
            console.error('Error update BG:', error);
        }
    }
    else{
        try {
            await themBangGia(selectBangGia);
            await fetchBangGia();
            handleClickClosePrice();
        } catch (error) {
            console.error('Error add BG:', error);
        }
    }
}
const handleBangGiaChange = (e) => {
    const { name, value } = e.target;
    SetSelectBangGia({
        ...selectBangGia,
        [name]: value
    });
};
const handleClickClosePrice = async ()=>
    {
        SetopenPrice(false);
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
          {activeCategory === 'products' && (
                <><span className="theloai-container">
                <div className="theloai-selector">
                  <label htmlFor="theloai">Thể loại</label>
                  <select id="theloai" name="theloai" onChange={handleTheLoaiChange} value={selectedTheLoai}>
                    <option value="" disabled>Chọn 1 thể loại</option>
                    {theLoaiList.length === 0 ? (
                      <option value="" disabled>Loading...</option>
                    ) : (
                      theLoaiList.map((theloai) => (
                        <option key={theloai.maloai} value={theloai.maloai}>{theloai.tenloai}</option>
                      ))
                    )}
                  </select>
                </div>
                <p className="title">Danh sách sản phẩm</p>
              </span>
          
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
                    id="mabg"
                    name="mabg"
                    label="Chọn bảng giá"
                    select
                    fullWidth
                    value={newProduct.mabg}
                    onChange={handleNewProductChange}
                  >
                    {KhaDungPrices.map((price) => (
                      <MenuItem key={price.mabg} value={price.mabg}>
                        {price.tenbg}
                      </MenuItem>
                    ))}
                  </TextField>

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
                {products.map((product) => (
                  <div key={product.masp} className="product-item">
                     {product.hinhanh ? (
                        <img 
                            src={imgSP.find(img => img.idsp === product.masp)?.image || trasua01} 
                            alt={`Ảnh sản phẩm`} 
                        />
                    ) : (
                        <img src={trasua01} alt={`Ảnh sản phẩm`} />
                    )}
                    <div className="product-info">
                      <h3>ID: {product.masp} - {product.tensp}</h3>
                      <div className="product-actions">
                      <button onClick={() => handleopenGiaDialog(product)}>Giá</button>
                        <button onClick={() => handleopenKMDialog(product)}>Sale</button>
                        <button  onClick={() => handleOpenCongThucDialog(product)}>Công thức</button>
                        <button onClick={() => handleOpenEditDialog(product) }>Sửa</button>
                        <button onClick={() => handleOpenConfirmDelete(product)}>Xóa</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeCategory === 'prices' && (
            <>
               
            <span className="theloai-container">
            <Button variant="outlined" onClick={handleClickOpenPrice}>
                  Thêm mới
                </Button> 
                <p className="title">Bảng giá</p>
              </span>
            <div className="product-list">
              {prices.map((price) => (
                <div key={price.mabg} className="product-item">
                  <div className="product-info">
                    <h3>ID: {price.mabg} - {price.tenbg}</h3>
                    <p>Loại: {price.loaigia === 'SP' ? 'Giá sản phẩm' : 'Giá topping' }</p>
                    <p>Tỷ lệ giảm: {price.tylegiam}%</p>
                    <p>Ngày áp dụng: {formatDate(price.ngayapdung)}</p>
                    <p>Ngày kết thúc: {price.ngaykt !== null ? formatDate(price.ngaykt) : ''}</p>
                    <p>Mã nhân viên tạo: {price.manv}</p>
                    <div className="product-actions">
                      <Button variant="outlined"  onClick={() => handleClickOpenUpdatePrice(price)} >Sửa</Button>
                      <Button variant="outlined" onClick={() => handleXoaPriceClick(price)} >Xóa</Button>
                    </div>
                  </div>
                </div>
              ))}
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
      <Dialog open={openCongThucDialog} onClose={() => setOpenCongThucDialog(false)}>
        <DialogTitle>Công thức sản phẩm</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã NL</TableCell>
                <TableCell>Tên NL</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {congThuc.map((nguyenLieu, index) => (
                <TableRow key={index}>
                  <TableCell>{nguyenLieu.manl}</TableCell>
                  <TableCell>{nguyenLieu.tennl}</TableCell>
                  <TableCell>{nguyenLieu.soluong}</TableCell>
                  <TableCell>{nguyenLieu.mota}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleDeleteNguyenLieu(index)}>Xóa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{ marginTop: '10px' }}>
            <FormControl fullWidth>
              <InputLabel id="nguyenLieuLabel">Chọn nguyên liệu</InputLabel>
              <Select
                labelId="nguyenLieuLabel"
                id="nguyenLieu"
                value={newNguyenLieu}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setNewNguyenLieu(selectedValue);
                  const selectedIngredient = NguyenLieuList.find(item => item.manl === selectedValue);
                  setnewTenNL(selectedIngredient.tennl);
                }}
                fullWidth
              >
                {NguyenLieuList.map((nguyenLieu) => (
                  <MenuItem key={nguyenLieu.manl} value={nguyenLieu.manl}> {nguyenLieu.manl}-{nguyenLieu.tennl}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Số lượng"
              type="number"
              style={{ marginTop: '10px' }}
              value={newSoLuong}
              onChange={(e) => setNewSoLuong(e.target.value)}
              fullWidth
            />
            <TextField
              label="Mô tả"
              type="text"
              style={{ marginTop: '10px' }}
              value={newMota}
              onChange={(e) => setNewMoTa(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={handleAddNguyenLieu} style={{ marginTop: '10px' }}>Thêm nguyên liệu</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCongThucDialog(false)} color="secondary">
            Đóng
          </Button>
          <Button onClick={handleUpdateCongThuc} color="primary">
            Cập nhật
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
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }} color="primary">
      Lưu
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
    <Dialog open={openKMDialog} onClose={handleClosePriceDialog}>
        <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
        <DialogContent>
        {editProduct.maloai !== 'TP' && (
          KhuyenMaiPrices.length > 0 ? (
            <TextField
              margin="dense"
              id="mabg"
              name="mabg"
              label="Khuyến mãi khả dụng"
              select
              fullWidth
              value={priceNewCode}
              onChange= {handlePriceChange}
            >
              {KhuyenMaiPrices.map((price) => (
                <MenuItem key={price.mabg} value={price.mabg}>
                  {price.tenbg}
                </MenuItem>
              ))}
            </TextField>
          ) : (
                <TextField
                margin="dense"
                id="khuyenMai"
                name="khuyenMai"
                fullWidth
                value={"Không có khuyến mãi khả dụng"}
                aria-readonly
            />
          )
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePriceDialog} color="primary">
            Đóng
          </Button>
          {editProduct.maloai !== 'TP' && (
          <Button onClick={handleSavePrice} color="primary">
            Cập nhật
          </Button>)}
          {editProduct.mabg && isMabgInKhuyenMaiList(editProduct.mabg, KhuyenMaiPrices) && (
            <Button onClick={handleDeleteKM} color="secondary">
              Xóa KM
            </Button>
          )}

        </DialogActions>
      </Dialog>
      <Dialog open={openGiaDialog} onClose={handleClosePriceDialog}>
        <DialogTitle>Chi tiết giá</DialogTitle>
        <DialogContent>
           {editProduct.maloai !== 'TP' && (<p>Giá Size M</p>)}
           {editProduct.maloai === 'TP' && (<p>Giá Topping</p>)}
          <TextField
                    margin="dense"
                    id="giaM"
                    name="giaM"
                    
                    fullWidth
                    value={editProduct.giaM}đ
                    onChange={(e) => setEditProduct({ ...editProduct, giaM: e.target.value })}
                  />
                     {editProduct.maloai !== 'TP' && (<p>Giá Size L</p>)}
                  {editProduct.maloai !== 'TP' && (
                    <TextField
                      margin="dense"
                      id="giaL"
                      name="giaL"
                      
                      fullWidth
                      value={editProduct.giaL}đ
                      onChange={(e) => setEditProduct({ ...editProduct, giaL: e.target.value })}
                    />
                  )}
          {/* Add other price fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePriceDialog} color="primary">
            Đóng
          </Button>
          <Button onClick={handlechangePrice} color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPrice} onClose={handleClickClosePrice}>
      <DialogTitle>{isUpdate ? "Cập nhật bảng giá" : "Thêm bảng giá"}</DialogTitle>
      <DialogContent>
      <FormControl fullWidth margin="dense">
       <InputLabel id="gender-label">Loại giá</InputLabel>
         <Select
           labelId="gender-label"
            id="loaigia"
            name="loaigia"
            value={selectBangGia.loaigia}
            onChange={handleBangGiaChange}
            disabled={isUpdate}
          >
          <MenuItem value="SP">Giá sản phẩm</MenuItem>
           <MenuItem value="TP">Giá topping</MenuItem>
            </Select>
          </FormControl>
      <TextField
          margin="dense"
          id="mabg"
          name="mabg"
          label="Mã bảng giá"
          fullWidth
          disabled={isUpdate}
          value={selectBangGia.mabg}
          onChange={handleBangGiaChange}
      />
      <TextField
          margin="dense"
          id="tenbg"
          name="tenbg"
          label="Tên bảng giá"
          fullWidth
          value={selectBangGia.tenbg}
          onChange={handleBangGiaChange}
      />
       <TextField
      margin="dense"
      type='number'
      id="tylegiam"
      name="tylegiam"
      label="Tỷ lệ giảm (%)"
      fullWidth
      value={selectBangGia.tylegiam}
      onChange={handleBangGiaChange}
      />
      <TextField
      margin="dense"
      id="ngayapdung"
      name="ngayapdung"
      label="Ngày Áp dụng"
      type="date"
      fullWidth
      InputLabelProps={{
      shrink: true,
      }}
      value={selectBangGia.ngayapdung}
      onChange={handleBangGiaChange}
      />
      <TextField
      margin="dense"
      id="ngaykt"
      name="ngaykt"
      label="Ngày kết thúc"
      type="date"
      fullWidth
      InputLabelProps={{
      shrink: true,
      }}
      value={selectBangGia.ngaykt}
      onChange={handleBangGiaChange}
      />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleClickClosePrice} color="secondary">
      Đóng
      </Button>
      <Button onClick={handleSavePriceClick} color="primary">
      Lưu
      </Button>
      </DialogActions>
      </Dialog>
      <Dialog open={openDeletePrice} onClose={handleXoaPriceClose}>
      <DialogTitle>Xóa bảng giá</DialogTitle>
      <DialogContent>
      <p>Bạn có chắc chắn muốn xóa bảng giá {selectBangGia.mabg} - {selectBangGia.tenbg} không?</p>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleXoaPriceClose} color="secondary">
      Hủy
      </Button>
      <Button onClick={handleXoaPriceSubmit} color="primary">
      Đồng ý
      </Button>
      </DialogActions>
      </Dialog>


    </div>
    </div>
  );
};

export default QuanLySanPham;
