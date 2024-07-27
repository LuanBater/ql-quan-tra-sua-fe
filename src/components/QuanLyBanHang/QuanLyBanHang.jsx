import React, { useEffect, useState } from 'react';
import "../../resource/css/content.css";
import "../../resource/css/product.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import trasua from '../../resource/image/tra-sua-01.jpg';
import Header from '../HeaderPage/headerpage.jsx';
import { menuItemsKH } from '../HeaderPage/Menu.js';
import { getDanhSachSanPhamBan, getDanhSachTopping ,taoDonHang,getDonHangDaDatKhach,getDonHangHoanThanhKhach} from '../../API/QLMuaHang.js';
import { getDanhSachTheLoai ,fetchImage} from '../../API/QLSanPham.js';

const QuanLyBanHang = ({ navItems }) => {
  const [activeCategory, setActiveCategory] = useState('danh-sach-san-pham');
  const [sanPhamList, setSanPhamList] = useState([]);
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [selectedTheLoai, setSelectedTheLoai] = useState('ALL');
  const [toppingList, setToppingList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [orderList, setOrderList] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M'); // Biến tạm lưu kích thước đã chọn
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [sdt, setSDT] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [DaDatList, setDaDatList] = useState([]);
  const [HoanThanhList, setHoanThanhList] = useState([]);
  const [imgSP, setImgSP] = useState([]);
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('danh-sach-san-pham');
        break;
      case 2:
        setActiveCategory('gio-hang');
        break;
      case 3:
        setActiveCategory('don-hang-da-dat');
        fetchDaDatList();
        break;
      case 4:
        setActiveCategory('lich-su-mua-hang');
        fetchHoanThanhList();
        break;
      default:
        setActiveCategory('danh-sach-san-pham');
    }
  };

  const fetchSanPhamList = async () => {
    try {
      const data = await getDanhSachSanPhamBan(selectedTheLoai);
      setSanPhamList(data);
    } catch (error) {
      console.error('Error fetching SanPham List:', error);
    }
  };
  const fetchDaDatList = async () => {
    try {
      const data = await getDonHangDaDatKhach("KH01");
      setDaDatList(data);
    } catch (error) {
      console.error('Error fetching DaDat List:', error);
    }
  };
  const fetchHoanThanhList = async () => {
    try {
      const data = await getDonHangHoanThanhKhach("KH01");
      setHoanThanhList(data);
    } catch (error) {
      console.error('Error fetching HoanThanh List:', error);
    }
  };
  useEffect(() => {
    const fetchAndSetImages = async () => {
        const images = await Promise.all(sanPhamList.map(async (sp) => {
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
}, [sanPhamList]);
  const fetchToppingList = async () => {
    try {
      const data = await getDanhSachTopping();
      if (data.length > 0) {
        const filteredData = data.filter(item => item.khadung !== 0);
        setToppingList(filteredData);
      }
    } catch (error) {
      console.error('Error fetching Topping List:', error);
    }
  };

  const fetchTheLoaiList = async () => {
    try {
      const data = await getDanhSachTheLoai();
      if (data.length > 0) {
        const filteredData = data.filter(item => item.maloai !== "TP");
        filteredData.unshift({ maloai: "ALL", tenloai: "Tất cả" });
        setTheLoaiList(filteredData);
      }
    } catch (error) {
      console.error('Error fetching the list of TheLoai:', error);
    }
  };

  useEffect(() => {
    fetchSanPhamList();
    fetchTheLoaiList();
    fetchToppingList();
  }, [selectedTheLoai]);

  const handleTheLoaiChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTheLoai(selectedValue);
  };
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };
  const handleOpenDialog = (sp) => {
    setSelectedProduct(sp);
    setSelectedToppings([]);
    setQuantity(1);
    setSelectedSize('M'); // Đặt kích thước mặc định khi mở dialog
    setOpen(true);
  };

  const handleCloseDialog = () => {
    console.log(orderList);
    setOpen(false);
  };

  const handleToppingChange = (topping) => {
    const index = selectedToppings.findIndex(t => t.idctsp === topping.idctsp);
    if (index === -1) {
      // Nếu topping chưa được chọn, thêm vào danh sách
      setSelectedToppings([...selectedToppings, topping]);
    } else {
      // Nếu topping đã được chọn, xóa khỏi danh sách
      const newToppings = selectedToppings.filter(t => t.idctsp !== topping.idctsp);
      setSelectedToppings(newToppings);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleQuantityDecrease = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
  };
  const handleRemoveOrderItem = (idctsp) => {
    const updatedOrderList = orderList.filter(item => item.idctsp !== idctsp);
    setOrderList(updatedOrderList);
  };
  const handleConfirmOrder = () => {
    if (!selectedProduct) return;
    const updatedToppings = selectedToppings.map(topping => ({
        ...topping,
        soluong: quantity // Thêm số lượng vào từng topping
      }));
    const orderItem = {
      hinhanh: selectedProduct.hinhanh,
      idctsp: selectedSize === 'M' ? selectedProduct.idctspM : selectedProduct.idctspL,
      tensp: selectedProduct.tensp,
      size: selectedSize,
      soluong: quantity,
      gia: selectedSize === 'M' ? selectedProduct.giaM*(100-selectedProduct.tylegiam)/100 : selectedProduct.giaL*(100-selectedProduct.tylegiam)/100,
      listTopping: updatedToppings,
    };

    setOrderList([...orderList, orderItem]);
    handleCloseDialog();
   
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handlePlaceOrder = async () => {
    // Lặp qua orderList để tạo các mục đơn lẻ
    const orders = orderList.map(item => ({
      idctdh: null,
      idctsp: item.idctsp,
      tensp: item.tensp,
      masize: item.size,
      soluong: item.soluong,
      gia: item.gia,
      listCT_Topping: item.listTopping
    }));
  
    
    try {
        await taoDonHang("KH01",sdt,deliveryAddress,parseInt(paymentMethod, 10),orders);     
        handleCloseConfirmDialog();
        setOrderList([]);
        setSDT('');
        setDeliveryAddress('');
        setPaymentMethod(1);
      } catch (error) {
        console.error('Error creating order:', error);
        alert("Lỗi tạo đơn hàng");
      }
  };
  
  return (
    <div>
      <Header menuItems={menuItemsKH} />
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
          
            {activeCategory === 'danh-sach-san-pham' && (
                <>
                  <div className="theloai-selector">
              <label htmlFor="theloai">Thể loại:</label>
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
               
              <div className="product-list">
                {sanPhamList.map((sp) => (
                  <div key={sp.masp} className="product-item">
                     {sp.hinhanh ? (
                        <img 
                            src={imgSP.find(img => img.idsp === sp.masp)?.image || sp} 
                            alt={`Ảnh sản phẩm`} 
                        />
                    ) : (
                        <img src={trasua} alt={`Ảnh sản phẩm`} />
                    )}
                    <div className="product-info">
                      <h3>{sp.tensp}</h3>
                      <p>
                        Giá:
                        {sp.tylegiam > 0 ? (
                          <>
                            <span style={{ color: "red", marginLeft: '10px' }}>{(sp.giaM * (1 - sp.tylegiam / 100)).toLocaleString('vi-VN')}đ</span>
                            <span style={{ textDecoration: 'line-through', marginLeft: '10px' }}>{sp.giaM.toLocaleString('vi-VN')}đ</span>
                          </>
                        ) : (
                          <span style={{ marginLeft: '10px' }}>{sp.giaM.toLocaleString('vi-VN')}đ</span>
                        )}
                      </p>
                      {sp.khadung === 0 ? (
                        <h3>Sản phẩm tạm hết</h3>
                      ) : (
                        <div className='product-actions'>
                        <button onClick={() => handleOpenDialog(sp)}>Thêm vào giỏ hàng</button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                ))}
              </div>
              </>
            )}
           {activeCategory === 'gio-hang' && (
             <><span className="theloai-container">
             <p className="title">Giỏ hàng</p>
           </span>
            <div className="order-list">
                <Table sx={{ border: '1px solid #ccc' }}> 
                <TableHead>
                    <TableRow>
                    {/* <TableCell>Ảnh sản phẩm</TableCell> */}
                    <TableCell sx={{ border: '1px solid #ccc' }}>Tên sản phẩm</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Size</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Số lượng</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Giá</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Topping</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Thành giá</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderList.map((item, index) => {
                    // Tính tổng giá topping cho sản phẩm
                    const totalToppingPrice = item.listTopping && item.listTopping.length > 0
                        ? item.listTopping.reduce((sum, topping) => sum + topping.gia * topping.soluong, 0)
                        : 0;

                    return (
                        <TableRow key={index}>
                        {/* <TableCell>
                        {item.hinhanh ? (
                        <img 
                              src={imgSP.find(img => img.idsp === item.masp)?.image || item} 
                              alt={`Ảnh sản phẩm`} 
                              style={{ width: '100%' }}
                          />
                        ) : (
                          <img src={trasua} alt={`Ảnh sản phẩm`} />
                        )}
                        </TableCell> */}
                        <TableCell sx={{ border: '1px solid #ccc' }}>{item.tensp}</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>{item.size}</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>{item.soluong}</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>{item.gia.toLocaleString('vi-VN')}đ</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                              {item.listTopping.length > 0 ? (
                                item.listTopping
                                  .map(topping => `${topping.tensp} (${topping.gia.toLocaleString('vi-VN')}đ)`)
                                  .join(', ')
                              ) : (
                                'Không có'
                              )}
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                            {((item.gia + totalToppingPrice) * item.soluong).toLocaleString('vi-VN')}đ
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                            <IconButton onClick={() => handleRemoveOrderItem(item.idctsp)}>
                            <RemoveIcon />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                    {/* Dòng tổng tiền */}
                    <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Tổng tiền:
                    </TableCell>
                    <TableCell colSpan={2}>
                        {orderList.reduce((total, item) => {
                        const totalToppingPrice = item.listTopping && item.listTopping.length > 0
                            ? item.listTopping.reduce((sum, topping) => sum + topping.gia * topping.soluong, 0)
                            : 0;
                        return total + ((item.gia + totalToppingPrice) * item.soluong);
                        }, 0).toLocaleString('vi-VN')}đ
                    </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                <div className='order-actions'>
                {orderList.length > 0 && (
                    <Button variant="contained" color="primary" onClick={handleOpenConfirmDialog}>
                        Đặt hàng
                    </Button>
                )}
            </div>
            </div>
            </>
            )}
            {/* PHẦN ĐƠN HÀNG ĐÃ ĐẶT */}
            {activeCategory === 'don-hang-da-dat' && (
               <><span className="theloai-container">
               <p className="title">Đơn hàng đã đặt</p>
             </span>
            <div className="order-list">
                 {DaDatList.length === 0 ? (
                        <p variant="h6" align="center" style={{ padding: '20px' }}>
                            Chưa có đơn hàng
                        </p>
                    ) : (
                <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Mã đơn hàng</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Ngày tạo</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Địa chỉ Nhận</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Số điện thoại</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Thanh toán</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Trạng thái</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Chi tiết đơn hàng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        {DaDatList.map((order) => (
                            <TableRow key={order.madonhang}>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.madonhang}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.ngaytao}</TableCell> 
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.diachi}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.sdt}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.thanhtoan === 1 ? 'Tiền mặt' : 'Chuyển khoản'}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.trangthai === 0 ? 'Đã đặt' : 'Đã duyệt'}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                    )}
                </div>
                </>
                )}
                {/* PHẦN ĐƠN HÀNG ĐÃ HOÀN THÀNH */}
                {activeCategory === 'lich-su-mua-hang' && (
                   <><span className="theloai-container">
                   <p className="title">Lịch sử mua hàng</p>
                 </span>
            <div className="order-list">
                {HoanThanhList.length === 0 ? (
                        <p variant="h6" align="center" style={{ padding: '20px' }}>
                            Chưa có đơn hàng
                        </p>
                    ) : (
                <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Mã đơn hàng</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Ngày tạo</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Địa chỉ Nhận</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Số điện thoại</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Thanh toán</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Trạng thái</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Chi tiết đơn hàng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        {HoanThanhList.map((order) => (
                            <TableRow key={order.madonhang}>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.madonhang}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.ngaytao}</TableCell> 
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.diachi}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.sdt}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{order.thanhtoan === 1 ? 'Tiền mặt' : 'Chuyển khoản'}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>Hoàn thành</TableCell>
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
      </div>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Thêm vào giỏ hàng</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <Table >
                <TableBody>
                  <TableRow>
                    <TableCell style={{ width: 150 }}>
                    {selectedProduct.hinhanh ? (
                        <img 
                            src={imgSP.find(img => img.idsp === selectedProduct.masp)?.image || selectedProduct} 
                            alt={`Ảnh sản phẩm`} 
                            style={{ width: '100%' }}
                        />
                    ) : (
                        <img src={trasua} alt={`Ảnh sản phẩm`} />
                    )}

                    </TableCell>
                    <TableCell>
                      <TextField
                        label="Tên sản phẩm"
                        value={selectedProduct.tensp}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <TextField
                        select
                        label="Size"
                        value={selectedSize} // Sử dụng biến tạm selectedSize
                        onChange={handleSizeChange}
                        fullWidth
                      >
                        <MenuItem value="M">M - {(selectedProduct.giaM* (1 - selectedProduct.tylegiam / 100)).toLocaleString('vi-VN')}đ</MenuItem>
                        <MenuItem value="L">L - {(selectedProduct.giaL* (1 - selectedProduct.tylegiam / 100)).toLocaleString('vi-VN')}đ</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleQuantityDecrease} aria-label="Decrease quantity">
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          style={{ textAlign: 'center', width: 60 }}
                        />
                        <IconButton onClick={handleQuantityIncrease} aria-label="Increase quantity">
                          <AddIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Tên topping</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Giá</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Chọn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {toppingList.map((topping) => (
                    <TableRow key={topping.idctsp}>
                      <TableCell sx={{ border: '1px solid #ccc' }}>{topping.tensp}</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>{topping.gia.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={selectedToppings.some(t => t.idctsp === topping.idctsp)}
                                onChange={() => handleToppingChange(topping)}
                                color="primary"
                            />
                            }
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
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Đặt hàng</DialogTitle>
        <DialogContent>
        <TextField
         margin="dense"
            label="Số điện thoại người nhận"
            value={sdt}
            onChange={(e) => setSDT(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Địa chỉ nhận hàng"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            fullWidth
          />

          <TextField
            margin="dense"
            select
            label="Phương thức thanh toán"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value='1'>Thanh toán khi nhận hàng</MenuItem>
            <MenuItem value='2'>Thanh toán trực tuyến</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
          <Button onClick={handlePlaceOrder} color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuanLyBanHang;
