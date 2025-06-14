import React, { useEffect, useState , useRef  } from 'react';
import { toPng } from 'html-to-image';
import { useReactToPrint } from "react-to-print";
import InvoicePrint from './InVoicePrint.jsx';
import momoicon from '../../resource/image/momoicon.png';
import CloseIcon from '@mui/icons-material/Close'; 
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
import { menuItemsNV } from '../HeaderPage/Menu.js';
import { xoaDonHang,getDanhSachSanPhamBan, getDanhSachTopping ,taoDonHang,KiemTraKhaDung,thanhToan,MomoThanhToan,VNPayThanhToan, kiemTraTrangThai} from '../../API/QLMuaHang.js';
import { getDanhSachTheLoai ,fetchImage,formatDate} from '../../API/QLSanPham.js';
import { KeyboardReturnOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { FormLabel, Radio, RadioGroup } from '@mui/material';
import MessageDialog from '../modal/MessageDialog.jsx';
const QuanLyBanHang = ({ navItems }) => {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') === null) {
    navigate("/login")
  }
  else if(localStorage.getItem('maquyen') !== 'NV') {
    navigate("/")
  }
  const user = localStorage.getItem("username")
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
  const [imgSP, setImgSP] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentUrl, setPayment] = useState('');
  const [maDonHang, setMaDonHang] = useState();
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  const [timer, setTimer] = useState(null);
  const [checkStatus, setCheckStatus] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successfullList, setSuccessfullList] = useState([]);
    const [messageOpen, setMessageOpen] = useState(false);
     const [messageNote, setMessage] = useState("");
     const handleMessageClose = () => {
       setMessageOpen(false);
     };
  const currentDate = new Date();
  const OutputDate = currentDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
  });
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false); // Đóng Dialog
};
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredProducts = sanPhamList.filter((product) =>
    product.tensp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (openConfirmDialog) {
      // Khởi tạo timer khi dialog mở
      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown); // Dừng đếm ngược khi hết thời gian
            setOpenConfirmDialog(false);
            setTimeLeft(600);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Lưu lại timer để dừng khi đóng dialog
      setTimer(countdown);
    }

    return () => {
      // Dừng timer khi component bị unmount hoặc dialog đóng
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [openConfirmDialog]);
 

  const handlePrintQRCode = () => {
    const qrCodeElement = document.querySelector('.qr-code-container');
    if (qrCodeElement) {
      toPng(qrCodeElement)
        .then((dataUrl) => {
          // Tạo container tạm thời trong DOM
          const printContainer = document.createElement('div');
          printContainer.style.position = 'fixed';
          printContainer.style.top = '0';
          printContainer.style.left = '0';
          printContainer.style.width = '100%';
          printContainer.style.height = '100%';
          printContainer.style.backgroundColor = 'white';
          printContainer.style.zIndex = '10000';
          printContainer.style.display = 'flex';
          printContainer.style.flexDirection = 'column';
          printContainer.style.justifyContent = 'center';
          printContainer.style.alignItems = 'center';
  
          // Thêm tiêu đề "Phiếu thanh toán"
          const title = document.createElement('h1');
          title.textContent = 'Phiếu thanh toán';
          title.style.marginBottom = '20px';
  
          // Thêm dòng hướng dẫn "Mở app Momo quét mã để thanh toán"
          const instruction = document.createElement('p');
          instruction.textContent = 'Mở app Momo quét mã để thanh toán';
          instruction.style.marginBottom = '20px';
          instruction.style.fontSize = '16px';
          instruction.style.color = 'black';
  
          // Thêm hình ảnh QR code vào container
          const img = document.createElement('img');
          img.src = dataUrl;
          img.style.maxWidth = '50%';
          img.style.maxHeight = '50%';
  
          // Đợi hình ảnh QR code tải xong
          img.onload = () => {
            printContainer.appendChild(title);
            printContainer.appendChild(img);
            printContainer.appendChild(instruction); // Thêm hướng dẫn vào container
            document.body.appendChild(printContainer);
  
            // Gọi lệnh in
            window.print();
  
            // Xóa container sau khi in xong
            setTimeout(() => {
              document.body.removeChild(printContainer);
            }, 1000);
          };
  
          img.onerror = () => {
            console.error('Không thể tải ảnh QR Code để in.');
          };
        })
        .catch((error) => {
          console.error('Lỗi khi chụp ảnh QR Code:', error);
        });
    }
  };
  
  
  
  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const handlePaymentChange = (event) => {
      setPaymentMethod(event.target.value);
  };
  const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case 1:
        setActiveCategory('danh-sach-san-pham');
        setSearchTerm("");
        break;
      case 2:
        setActiveCategory('gio-hang');
        break;
      default:
        setActiveCategory('danh-sach-san-pham')
        setSearchTerm("");
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
  const handleRemoveToppingItem = (idctsp, listTopping, toppingToRemove = null) => {
    setOrderList((prev) => 
      prev.map((item) => {
        if (item.idctsp === idctsp && isSameToppings1(item.listTopping, listTopping)) {
          if (toppingToRemove) {
            // Xóa topping cụ thể nếu được chọn
            const updatedToppings = item.listTopping.filter(t => t.idctsp !== toppingToRemove.idctsp);
            return { ...item, listTopping: updatedToppings };
          }
          // Nếu không có topping để xóa, xóa toàn bộ sản phẩm
          return null;
        }
        return item;
      }).filter(item => item !== null)
    );
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
    else{
      alert("Số lượng đặt phải lớn hơn 0!")
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
  };
  const handleRemoveOrderItem = (idctsp, listToppingToRemove) => {
    const isSameToppings = (list1, list2) => {
        if (list1.length !== list2.length) return false;
        return list1.every(t1 => list2.some(t2 => t1.id === t2.id && t1.soluong === t2.soluong));
    };

    const updatedOrderList = orderList.filter(item => 
        !(item.idctsp === idctsp && isSameToppings(item.listTopping, listToppingToRemove))
    );

    setOrderList(updatedOrderList);
};

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;

    const updatedToppings = selectedToppings.map(topping => ({
      ...topping,
      soluong: quantity // Thêm số lượng vào từng topping
  }));

    const khadung = await KiemTraKhaDung(selectedProduct.masp, selectedSize);
    if (khadung < quantity) {
        alert("Số lượng nguyên liệu chỉ còn đủ cho " + khadung + " sản phẩm " + selectedProduct.tensp + " size " + selectedSize);
        return;
    }

    // Lọc ra các sản phẩm trong đơn hàng có cùng ID sản phẩm + size
    let temp;
    if (selectedSize === 'M') {
        temp = orderList.filter(item => item.idctsp === selectedProduct.idctspM);
    } else {
        temp = orderList.filter(item => item.idctsp === selectedProduct.idctspL);
    }

    // Hàm kiểm tra danh sách topping có giống nhau hay không
    const isSameToppings = (list1, list2) => {
        if (list1.length !== list2.length) return false;
        return list1.every(t1 => list2.some(t2 => t1.idctsp === t2.idctsp ));
    };

    let updatedOrderList = [...orderList];
    let found = false;

    for (let i = 0; i < updatedOrderList.length; i++) {
        if (updatedOrderList[i].idctsp === (selectedSize === 'M' ? selectedProduct.idctspM : selectedProduct.idctspL) &&
            isSameToppings(updatedOrderList[i].listTopping, updatedToppings)) {

            // Nếu tìm thấy sản phẩm có cùng topping, cập nhật số lượng
            updatedOrderList[i].soluong += quantity;

            // Cập nhật số lượng của từng topping
            updatedOrderList[i].listTopping = updatedOrderList[i].listTopping.map(t => ({
                ...t,
                soluong: t.soluong + quantity
            }));

            found = true;
            break;
        }
    }

    // Nếu không tìm thấy sản phẩm trùng, thêm mới vào danh sách
    if (!found) {
      
        const orderItem = {
            hinhanh: selectedProduct.hinhanh,
            idctsp: selectedSize === 'M' ? selectedProduct.idctspM : selectedProduct.idctspL,
            tensp: selectedProduct.tensp,
            size: selectedSize,
            soluong: quantity,
            gia: selectedSize === 'M' ? selectedProduct.giaM : selectedProduct.giaL,
            listTopping: updatedToppings,
        };

        updatedOrderList.push(orderItem);
    }

    setOrderList(updatedOrderList);
    handleCloseDialog();
    setMessage("Đã thêm thành công sản phẩm vào đơn hàng!");
    setMessageOpen(true);
};

  // const handleConfirmOrder = async() => {
  //   if (!selectedProduct) return;
  
  //     const khadung = await KiemTraKhaDung(selectedProduct.masp,selectedSize);
  //     if (khadung < quantity)
  //     {
  //       alert("Số lượng nguyên liệu chỉ còn đủ cho " + khadung+  " sản phẩm " + selectedProduct.tensp + " size " + selectedSize);
  //       return;
  //     }
  //     var temp;
  //     if (selectedSize === 'M')
  //       {
  //         temp = orderList.filter(item => item.idctsp === selectedProduct.idctspM);
  //       }
  //     else {
  //       temp = orderList.filter(item => item.idctsp === selectedProduct.idctspL);
  //     }
  //     if (temp !== null)
  //     {
  //       if (temp.listTopping === selectedProduct.listTopping)
  //       {
  //         //continue...
  //       }
  //     }
  //     const updatedToppings = selectedToppings.map(topping => ({
  //       ...topping,
  //       soluong: quantity // Thêm số lượng vào từng topping
  //     }));
  //   const orderItem = {
  //     hinhanh: selectedProduct.hinhanh,
  //     idctsp: selectedSize === 'M' ? selectedProduct.idctspM : selectedProduct.idctspL,
  //     tensp: selectedProduct.tensp,
  //     size: selectedSize,
  //     soluong: quantity,
  //     gia: selectedSize === 'M' ? selectedProduct.giaM : selectedProduct.giaL,
  //     listTopping: updatedToppings,
  //   };

  //   setOrderList([...orderList, orderItem]);
  //   handleCloseDialog();
  //   setMessage("Đã thêm thành công sản phẩm vào đơn hàng!")
  //   setMessageOpen(true);
  // };

  const intervalRef = useRef(null); // Dùng để lưu trữ interval ID

  const handleCloseConfirmDialog = async () => {
      setCheckStatus(false);
  
      // Dừng interval nếu đang chạy
      if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
      }
      // setSuccessfullList(orderList);
      // setSuccessDialogOpen(true);
      await xoaDonHang(maDonHang);
      setMaDonHang(null);
      setOpenConfirmDialog(false);
  };

  const handlePaymentOnline = async () => {

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
      
         const dataCreate = await taoDonHang(user,parseInt(paymentMethod, 10),orders);

        if (parseInt(paymentMethod, 10) === 2)
          {
            
            // const data = await MomoThanhToan(totalPrice);

            // // Chuyển hướng đến URL trả về từ API
            
            // window.location.href = data.payUrl; 

            try {
              const data = await MomoThanhToan(totalPrice, dataCreate.orderId);
              if (data.status === "OK" && data.url) {
                  setTimeLeft(600);
                  setOpenConfirmDialog(true);
                  setPayment(data.deeplink);
                  setCheckStatus(true);
                  setMaDonHang(dataCreate.orderId);
                  // Bắt đầu kiểm tra trạng thái
                  intervalRef.current = setInterval(async () => {
                      try {
                          const statusData = await kiemTraTrangThai(dataCreate.orderId);
                          if (statusData === 2) {
                            clearInterval(intervalRef.current); // Dừng polling
                            intervalRef.current = null;
                              setCheckStatus(false); // Hoặc thực hiện logic khác
                              setOpenConfirmDialog(false);
                              setSuccessfullList(orderList);
                              setOrderList([]);
                              setPaymentMethod(1);
                              setSuccessDialogOpen(true);
                          }
                          else if(statusData === 1)
                          {
                            clearInterval(intervalRef.current); // Dừng polling
                            intervalRef.current = null;
                              setCheckStatus(false); // Hoặc thực hiện logic khác
                              setOpenConfirmDialog(false);
                              await xoaDonHang(maDonHang);
                              setMessage("Thanh toán thất bại! Vui lòng nhấn xác nhận thanh toán lại!")
                              setMessageOpen(true);
                          } else {
                              console.log("Trạng thái hiện tại:", statusData.trangThai);
                          }
                      } catch (error) {
                          console.error("Lỗi khi kiểm tra trạng thái:", error);
                          clearInterval(intervalRef.current); // Dừng polling nếu lỗi
                            intervalRef.current = null;
                      }
                  }, 500); // Kiểm tra mỗi 0.5 giây
              } else {
                  alert("Lỗi thanh toán: " + (data.message || "Không có URL để chuyển hướng"));
              }
          } catch (error) {
              console.error("Error creating order:", error);
              alert("Lỗi thanh toán");
          }
          
          }
          else if (parseInt(paymentMethod, 10) === 1)
          {

            const printWindow = window.open('', '', 'height=1000,width=1000');

            printWindow.document.write('<html><head><title>In hóa đơn</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { text-align: center; font-family: Arial, sans-serif; }');
            printWindow.document.write('table { width: 550px; margin: 0 auto; border-collapse: collapse; }');
            printWindow.document.write('th, td { padding: 8px; border: 1px solid #ddd; text-align: center; }');
            printWindow.document.write('th { background-color: #f4f4f4; }');
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<h1>Hóa đơn</h1>');
            printWindow.document.write('<p style="margin: 0; font-size: 26px; font-weight: bold;">Cửa hàng trà sữa Bater</p>');
            printWindow.document.write('<p style="margin: 0; font-size: 16px;">Địa chỉ: 97 Man Thiện, P. Hiệp Phú, TP. Thủ Đức</p>');
            printWindow.document.write('<p style="margin: 0; font-size: 16px;">Hotline: 0987654321</p>');            
            printWindow.document.write(`<p style="text-align: left;"><strong>Ngày xuất:</strong> ${OutputDate}</p>`);
            printWindow.document.write(`<p style="text-align: left;"><strong>Khách Hàng:</strong> Khách lẻ</p>`);
            printWindow.document.write(`<p style="text-align: left;"><strong>Thanh toán:</strong> Tiền mặt</p>`);
            printWindow.document.write(`<p style="text-align: left;"><strong>Nhân viên bán:</strong> ${user}</p>`);
            printWindow.document.write('<table>');       
            // Header
            printWindow.document.write('<thead>');
            printWindow.document.write('<tr>');
            printWindow.document.write('<th rowspan="2">Sản phẩm</th>');
            printWindow.document.write('<th rowspan="2">Đơn giá</th>');
            printWindow.document.write('<th rowspan="2">SL</th>');
            printWindow.document.write('<th colspan="2">Topping</th>');
            printWindow.document.write('</tr>');
            printWindow.document.write('<tr>');
            printWindow.document.write('<th>Tên</th>');
            printWindow.document.write('<th>Đơn giá</th>');
           // printWindow.document.write('<th>SL</th>');
            printWindow.document.write('</tr>');
            printWindow.document.write('</thead>');
            
            // Body
            printWindow.document.write('<tbody>');
            orderList.forEach(item => {
                // Render sản phẩm
                const rowspan = item.listTopping.length || 1; // Số hàng cần merge (ít nhất 1 nếu không có topping)
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td rowspan="${rowspan}">${item.tensp} - ${item.size}</td>`);
                printWindow.document.write(`<td rowspan="${rowspan}">${item.gia.toLocaleString('vi-VN')}đ</td>`);
                printWindow.document.write(`<td rowspan="${rowspan}">${item.soluong}</td>`);
            
                if (item.listTopping.length > 0) {
                    // Render topping đầu tiên (trong cùng hàng với sản phẩm)
                    const firstTopping = item.listTopping[0];
                    printWindow.document.write(`<td>${firstTopping.tensp}</td>`);
                    printWindow.document.write(`<td>${firstTopping.gia.toLocaleString('vi-VN')}đ</td>`);
                    //printWindow.document.write(`<td>${firstTopping.soluong}</td>`);
                    printWindow.document.write('</tr>');
            
                    // Render các topping còn lại
                    for (let i = 1; i < item.listTopping.length; i++) {
                        const topping = item.listTopping[i];
                        printWindow.document.write('<tr>');
                        printWindow.document.write(`<td>${topping.tensp}</td>`);
                        printWindow.document.write(`<td>${topping.gia.toLocaleString('vi-VN')}đ</td>`);
                        //printWindow.document.write(`<td>${topping.soluong}</td>`);
                        printWindow.document.write('</tr>');
                    }
                } else {
                    // Nếu không có topping
                    printWindow.document.write('<td colspan="3">Không có topping</td>');
                    printWindow.document.write('</tr>');
                }
            });
            printWindow.document.write('</tbody>');
            
            // Footer
            printWindow.document.write('</table>');
            printWindow.document.write(`<p style="text-align: right;"><strong>Tổng giá:</strong> ${totalPrice.toLocaleString('vi-VN')}đ</p>`);
            printWindow.document.write(`<p><strong>❤❤❤ Xin cảm ơn, chúc bạn một ngày tuyệt vời! ❤❤❤</p>`);
            printWindow.document.write('</body></html>');
            
            printWindow.document.close();

              // Gắn sự kiện đóng sau khi in hoặc hủy in
              printWindow.onafterprint = () => {
                  printWindow.close(); // Đóng cửa sổ in
              };
              
              printWindow.focus();
              printWindow.print(); // Bắt đầu in
              // handleCloseConfirmDialog();
            setOrderList([]);
            setPaymentMethod(1);
            setMessage('Thanh toán thành công! Kiểm tra lại "Đơn hàng"')
            setMessageOpen(true);
          };
          
          

        // handleCloseConfirmDialog();
        // setOrderList([]);
        setPaymentMethod(1);
        // alert('Thanh toán thành công! Kiểm tra lại "Đơn hàng"')
      } catch (error) {
        console.error('Error creating order:', error);
        alert("Lỗi tạo đơn hàng");
      }
  };
  const isSameToppings1 = (list1, list2) => {
    if (list1.length !== list2.length) return false;

    // Kiểm tra xem tất cả các phần tử trong list1 có tồn tại trong list2 không (dựa trên idctsp)
    return list1.every(t1 => list2.some(t2 => t1.idctsp === t2.idctsp));
};

  const handleQuantityChange1 = (e, idctsp, listTopping) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;

    setOrderList((prev) =>
      prev.map((item) =>
        item.idctsp === idctsp && isSameToppings1(item.listTopping, listTopping)
          ? { ...item, soluong: newQuantity }
          : item
      )
    );
};

  

  useEffect(() => {
    // Tính tổng tiền mỗi khi orderList thay đổi
    const calculatedTotal = orderList.reduce((total, item) => {
      const totalToppingPrice = item.listTopping && item.listTopping.length > 0
        ? item.listTopping.reduce((sum, topping) => sum + topping.gia , 0)
        : 0;
      return total + ((item.gia + totalToppingPrice) * item.soluong);
    }, 0);
    
    setTotalPrice(calculatedTotal);
  }, [orderList]);

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
          
            {activeCategory === 'danh-sach-san-pham' && (
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
               </div>
               <div className="product-list">
                {filteredProducts.length === 0 ? (
                  <h3>Sản phẩm đang cập nhật</h3>
                ) : (
                  filteredProducts.map((sp) => (
                    <div key={sp.masp} className="product-item">
                      {sp.hinhanh ? (
                        <img
                          src={imgSP.find((img) => img.idsp === sp.masp)?.image || sp}
                          alt={`Ảnh sản phẩm`}
                        />
                      ) : (
                        <img src={trasua} alt={`Ảnh sản phẩm`} />
                      )}
                      <div className="product-info">
                        <h3>{sp.tensp}</h3>
                        <p>
                          Giá:
                          <span style={{ marginLeft: '10px' }}>{sp.giaM.toLocaleString('vi-VN')}đ</span>
                        </p>
                        {sp.khadung === 0 ? (
                          <h3>Sản phẩm tạm hết</h3>
                        ) : (
                          <div className="product-actions">
                            <button onClick={() => handleOpenDialog(sp)}>Thêm vào đơn hàng</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              </>
            )}
           {activeCategory === 'gio-hang' && (
             <><span className="theloai-container">
             <p className="title">Đơn hàng</p>
           </span>
            <div className="order-list">
            <Table sx={{ border: '1px solid #ccc' }}>
  <TableHead>
    <TableRow>
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
      const totalToppingPrice = item.listTopping && item.listTopping.length > 0
        ? item.listTopping.reduce((sum, topping) => sum + topping.gia , 0)
        : 0;

      return (
        <TableRow key={index}>
          <TableCell sx={{ border: '1px solid #ccc' }}>{item.tensp}</TableCell>
          <TableCell sx={{ border: '1px solid #ccc' }}>{item.size}</TableCell>
          <TableCell sx={{ border: '1px solid #ccc' }}>
          <TextField
            type="number"
            value={item.soluong}
            onChange={(e) => handleQuantityChange1(e, item.idctsp,item.listTopping)}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: '10ch' }} // Độ rộng chỉ vừa đủ cho 3 chữ số
          />
          </TableCell>
          <TableCell sx={{ border: '1px solid #ccc' }}>{item.gia.toLocaleString('vi-VN')}đ</TableCell>
          <TableCell sx={{ border: '1px solid #ccc' }}>
  {item.listTopping.length > 0
    ? item.listTopping.map((topping, index) => (
        <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          {topping.tensp} ({topping.gia.toLocaleString('vi-VN')}đ)
          <IconButton 
            size="small"
            onClick={() => handleRemoveToppingItem(item.idctsp, item.listTopping, topping)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      ))
    : 'Không có'}
</TableCell>
          {/* <TableCell sx={{ border: '1px solid #ccc' }}>
            {item.listTopping.length > 0
              ? item.listTopping.map(topping => `${topping.tensp} (${topping.gia.toLocaleString('vi-VN')}đ)`).join(', ')
              : 'Không có'}
          </TableCell> */}
          <TableCell sx={{ border: '1px solid #ccc' }}>
            {((item.gia + totalToppingPrice) * item.soluong).toLocaleString('vi-VN')}đ
          </TableCell>
          <TableCell sx={{ border: '1px solid #ccc' }}>
            <IconButton onClick={() => handleRemoveOrderItem(item.idctsp,item.listTopping)}>
              <RemoveIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    })}
    <TableRow>
      <TableCell colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold' }}>
        Tổng tiền:
      </TableCell>
      <TableCell colSpan={2}>
        {orderList.reduce((total, item) => {
          const totalToppingPrice = item.listTopping && item.listTopping.length > 0
            ? item.listTopping.reduce((sum, topping) => sum + topping.gia , 0)
            : 0;
          return total + ((item.gia + totalToppingPrice) * item.soluong);
        }, 0).toLocaleString('vi-VN')}đ
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

                <div>
                 {orderList.length > 0 && (
                <>
                    {/* Tùy chọn phương thức thanh toán */}
                    <FormLabel component="legend">Phương thức thanh toán</FormLabel>
                    <RadioGroup
                        row
                        value={paymentMethod}
                        onChange={handlePaymentChange}
                        aria-label="payment-method"
                        name="payment-method-group"
                    >
                        <FormControlLabel value='1' control={<Radio />} label="Tiền mặt" />
                        <FormControlLabel value='2' control={<Radio />} label="Thanh toán QR (Momo)" />
                    </RadioGroup>

                   
                </>
            )}
            </div>
                <div className='order-actions'>
                 {orderList.length > 0 && (
                <>
                   
                    {/* Nút Đặt hàng */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePaymentOnline}
                        style={{ marginTop: "10px" }}
                    >
                        Xác nhận thanh toán
                    </Button>
                </>
            )}
            </div>
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
                        <MenuItem value="M">M - {(selectedProduct.giaM).toLocaleString('vi-VN')}đ</MenuItem>
                        <MenuItem value="L">L - {(selectedProduct.giaL).toLocaleString('vi-VN')}đ</MenuItem>
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
  <DialogTitle>Thông tin thanh toán</DialogTitle>
  <DialogContent>
    <h3>Mã đơn hàng: {maDonHang}</h3>
    <h3>Khách hàng: Khách lẻ</h3>
  {orderList.length > 0 ? (
            <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Tên sản phẩm</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Size</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Số lượng</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Giá</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Topping</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Thành giá</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderList.map((item, index) => {
                        const totalToppingPrice = item.listTopping?.reduce(
                            (sum, topping) => sum + topping.gia ,
                            0
                        ) || 0;

                        return (
                            <TableRow key={index}>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.tensp}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.size}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.soluong}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {item.gia.toLocaleString('vi-VN')}đ
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {item.listTopping?.length > 0
                                        ? item.listTopping
                                              .map(
                                                  topping =>
                                                      `${topping.tensp} (${topping.gia.toLocaleString('vi-VN')}đ)`
                                              )
                                              .join(', ')
                                        : 'Không có'}
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {((item.gia + totalToppingPrice) * item.soluong).toLocaleString('vi-VN')}đ
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Tổng tiền:
                        </TableCell>
                        <TableCell>
                            {orderList
                                .reduce((total, item) => {
                                    const totalToppingPrice =
                                        item.listTopping?.reduce(
                                            (sum, topping) => sum + topping.gia ,
                                            0
                                        ) || 0;
                                    return total + (item.gia + totalToppingPrice) * item.soluong;
                                }, 0)
                                .toLocaleString('vi-VN')}đ
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        ) : (
            <p>Danh sách đơn hàng rỗng.</p>
        )}
    <p style={{ textAlign: 'left', marginTop: '10px' }}>
      Thời gian thanh toán còn lại: {formatTime(timeLeft)}
    </p>
    <p style={{ textAlign: 'center', marginTop: '10px' }}>Mã Momo thanh toán</p>
    {paymentUrl !== '' && (
      <div
        className="qr-code-container" // Class để chọn phần tử
        style={{ position: 'relative', textAlign: 'center', margin: 'auto' }}
      >
        <QRCodeCanvas
          value={paymentUrl}
          size={200}
          style={{
            display: 'block',
            margin: 'auto',
          }}
        />
        <img
          src={momoicon}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
          }}
        />
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
    <Button color="primary" onClick={handlePrintQRCode}>
      In Phiếu
    </Button>
  </DialogActions>
</Dialog>;
<Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog} maxWidth="md" fullWidth>
<DialogTitle style={{ fontWeight: 'bold' }}>Thông báo</DialogTitle>
<DialogContent>
        <h3 style={{ fontWeight: 'bold', textAlign: 'center', color: 'green' }}>
            Thanh toán chuyển khoản thành công đơn hàng có mã: {maDonHang}.
        </h3>

        {/* Bảng hiển thị orderList */}
        {successfullList.length > 0 ? (
            <Table sx={{ border: '1px solid #ccc' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Tên sản phẩm</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Size</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Số lượng</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Giá</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Topping</TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>Thành giá</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {successfullList.map((item, index) => {
                        const totalToppingPrice = item.listTopping?.reduce(
                            (sum, topping) => sum + topping.gia ,
                            0
                        ) || 0;

                        return (
                            <TableRow key={index}>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.tensp}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.size}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>{item.soluong}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {item.gia.toLocaleString('vi-VN')}đ
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {item.listTopping?.length > 0
                                        ? item.listTopping
                                              .map(
                                                  topping =>
                                                      `${topping.tensp} (${topping.gia.toLocaleString('vi-VN')}đ)`
                                              )
                                              .join(', ')
                                        : 'Không có'}
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ccc' }}>
                                    {((item.gia + totalToppingPrice) * item.soluong).toLocaleString('vi-VN')}đ
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Tổng tiền:
                        </TableCell>
                        <TableCell>
                            {successfullList
                                .reduce((total, item) => {
                                    const totalToppingPrice =
                                        item.listTopping?.reduce(
                                            (sum, topping) => sum + topping.gia,
                                            0
                                        ) || 0;
                                    return total + (item.gia + totalToppingPrice) ;
                                }, 0)
                                .toLocaleString('vi-VN')}đ
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        ) : (
            <p>Danh sách đơn hàng rỗng.</p>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseSuccessDialog} color="primary">
            Đóng
        </Button>
    </DialogActions>
</Dialog>;

<MessageDialog
                            open={messageOpen}
                            onClose={handleMessageClose}
                            message = {messageNote}
                             />
    </div>
    
  );
};

export default QuanLyBanHang;
