import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import "../../resource/css/content.css";
import "../../resource/css/product.css";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Header from '../HeaderPage/headerpage.jsx';
import { menuItemsQL } from '../HeaderPage/Menu.js';
import { getTopSanPham,getTopSanPhamBanCham,
formatDate,getHoaDonNgay,getHoaDonThang,getPhieuNhapThang,getHoaDonQuy,getDoanhThuNam,getNguyenLieuSuDung,getDoanhThuSanPham,getNguyenLieuNhapTrongThang
} from '../../API/QLThongKe.js';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { format } from 'date-fns'; // Thêm thư viện date-fns để format ngày tháng
// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const QuanLyThongKe = ({ navItems }) => {
  const navigate = useNavigate();
  if(localStorage.getItem('maquyen') !== "QL") {
    navigate("/")
  }
  const [activeCategory, setActiveCategory] = useState('hoa-don-trong-ngay');
  const user = localStorage.getItem("username")
  const [hoaDonNgayList, setHoaDonNgayList] = useState([]);
  const [hoaDonThangList, setHoaDonThangList] = useState([]);
  const [topSanPhamList, setTopSanPhamList] = useState([]);
  const [SPBanChamList, setSPBanChamList] = useState([]);
  const [hoaDonQuy, setHoaDonQuy] = useState([]);
  const [nguyenLieuSuDungThangList,setNguyenLieuSD]=useState([]);
  const [sanPhamTrongThangList,setSanPhamTrongThang]=useState([]);
  const [nguyenLieuNhapThangList,setNguyenLieuNhapThang]=useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [temp1, setTemp1] = useState('');
  const [temp2, setTemp2] = useState('');


  
  const [selectedYearQuy, setSelectedYearQuy] = useState(2024);
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [totalMonth1, setTotalMonth1] = useState(0);
  const [totalMonth2, setTotalMonth2] = useState(0);
  const [totalMonth3, setTotalMonth3] = useState(0);
  const [totalQuarter, setTotalQuarter] = useState(0);
  const [quarterRevenueData, setQuarterRevenueData] = useState(null);
  const [annualRevenueData, setAnnualRevenueData] = useState(null);
  // Hàm xử lý thay đổi quý
  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
  };

  // Hàm xử lý thay đổi năm
  const handleYearChangeQuy = (event) => {
    setSelectedYearQuy(event.target.value);
  };

  
  

  // Hàm tìm kiếm doanh thu theo quý
  const handleSearchQuy = async () => {
    // Giả sử bạn đã có hàm gọi API để lấy dữ liệu doanh thu từ backend
    const data = await getHoaDonQuy(selectedYearQuy,selectedQuarter);
    setTotalMonth1(data.tongthang1);
    setTotalMonth2(data.tongthang2);
    setTotalMonth3(data.tongthang3);
    setTotalQuarter(data.tongquy);
    
    setQuarterRevenueData({
      labels: [`Tháng ${selectedQuarter === 'Q1' ? 1 : selectedQuarter === 'Q2' ? 4 : selectedQuarter === 'Q3' ? 7 : 10}`, 
               `Tháng ${selectedQuarter === 'Q1' ? 2 : selectedQuarter === 'Q2' ? 5 : selectedQuarter === 'Q3' ? 8 : 11}`,
               `Tháng ${selectedQuarter === 'Q1' ? 3 : selectedQuarter === 'Q2' ? 6 : selectedQuarter === 'Q3' ? 9 : 12}`],
      datasets: [
        {
          label: 'Doanh thu tháng',
          data: [data.tongthang1, data.tongthang2, data.tongthang3],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

////
    const fetchRevenueByYear = async () => {
      try {
        const data = await getDoanhThuNam(selectedYearQuy); // API lấy dữ liệu
        setAnnualRevenueData({
          labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
          datasets: [
            {
              label: 'Doanh thu (VND)',
              data: [data.tongq1, data.tongq2, data.tongq3, data.tongq4],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Lỗi khi fetch doanh thu theo năm:', error);
      }
    };
  /////
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
        break;
      case 3:
        setActiveCategory('hoa-don-trong-quy');
        setSelectedMonth('');
        setSelectedYear('');

        break;
        case 4:
        setActiveCategory('hoa-don-trong-nam');
        setSelectedMonth('');
        setSelectedYear('');
        await fetchRevenueByYear(selectedYearQuy);
        break;
        case 5:
          setActiveCategory('nguyen-lieu-trong-thang');
          setSelectedMonth('');
          setSelectedYear('');
          break;
        case 6:
            setActiveCategory('san-pham-trong-thang');
            setSelectedMonth('');
            setSelectedYear('');
            break;
        case 7:
            setActiveCategory('nguyen-lieu-nhap-thang');
            setSelectedMonth('');
            setSelectedYear('');
            break;
        case 8:
            setActiveCategory('san-pham-ban-chay'); 
            fetchDataTopBanChay();
            break;
        case 9:
            setActiveCategory('san-pham-ban-cham');
            fetchDataTopBanCham();
              break;
      default:
        setActiveCategory('hoa-don-trong-ngay');
        await fetchHoaDonTrongNgay(selectedDate);
        break;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeCategory === 'san-pham-ban-chay') {
          const data = await getTopSanPham();
          setTopSanPhamList(data);
        } else if (activeCategory === 'san-pham-ban-cham') {
          const data = await getTopSanPhamBanCham();
          setSPBanChamList(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    };
  
    fetchData();
  }, [activeCategory]);
  const fetchDataTopBanChay = async () => {
    try {
        const data = await getTopSanPham();
        setTopSanPhamList(data);
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
  };
  const fetchDataTopBanCham = async () => {
    try {
        const data = await getTopSanPhamBanCham();
        setSPBanChamList(data);
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
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
  const fetchNguyenLieuSuDung = async (selectedMonth,selectedYear) => {
        console.log()
        try {
        const data = await getNguyenLieuSuDung(selectedMonth,selectedYear);
        setTemp1(selectedMonth); setTemp2(selectedYear);
        setNguyenLieuSD(data);
        } catch (error) {
        console.error('Error fetching nguyen liệu Trong Thang:', error);
        }
    };
    const fetchSanPhamTrongThang = async (selectedMonth,selectedYear) => {
      console.log()
      try {
      const data = await getDoanhThuSanPham(selectedMonth,selectedYear);
      setTemp1(selectedMonth); setTemp2(selectedYear);
      setSanPhamTrongThang(data);
      } catch (error) {
      console.error('Error fetching sản phẩm Trong Thang:', error);
      }
  };
  const fetchNguyenLieuNhapTrongThang = async (selectedMonth,selectedYear) => {
    console.log()
    try {
    const data = await getNguyenLieuNhapTrongThang(selectedMonth,selectedYear);
    setTemp1(selectedMonth); setTemp2(selectedYear);
    setNguyenLieuNhapThang(data);
    } catch (error) {
    console.error('Error fetching sản phẩm Trong Thang:', error);
    }
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
  const handleSearchNguyenLieuSuDung = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng chọn tháng và năm');
      return;
    }
    await fetchNguyenLieuSuDung(selectedMonth, selectedYear);
  };
  const handleSearchSanPham = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng chọn tháng và năm');
      return;
    }
    await fetchSanPhamTrongThang(selectedMonth, selectedYear);
  };
  const handleSearchNguyenLieuNhapTrongThang = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng chọn tháng và năm');
      return;
    }
    await fetchNguyenLieuNhapTrongThang(selectedMonth, selectedYear);
  };
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredList = nguyenLieuNhapThangList.filter((item) =>
    item.tennl.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
                    Thống kê
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
                              <TableCell colSpan={7} sx={{ border: '1px solid #ccc', textAlign: 'right', fontWeight: 'bold' }}>
                                  Tổng doanh thu ngày:
                              </TableCell>
                              <TableCell colSpan={1} sx={{ border: '1px solid #ccc', textAlign: 'left', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                  {hoaDonNgayList.reduce((total, hoaDon) => total + hoaDon.tonggia, 0).toLocaleString('vi-VN')}đ
                              </TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell sx={{ border: '1px solid #ccc', width: '50px' }}>Mã hóa đơn</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', width: '50px' }}>Mã đơn hàng</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}>Ngày xuất</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', width: '50px' }}>MST</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', width: '150px' }}>Nhân viên duyệt</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', width: '150px' }}>Khách hàng</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}>Chi tiết đơn</TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}>Tổng giá</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {hoaDonNgayList.map((hoaDon, index) => (
                              <TableRow key={index}>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.mahoadon}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.madonhang}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(hoaDon.ngayxuat)}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.mst}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.manv} - {hoaDon.tennv}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.tenkh} </TableCell>
                                  <TableCell sx={{ border: '1px solid #ccc' }}>
                                      {hoaDon.ctdh.map((item) => (
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
                                  <TableCell sx={{ border: '1px solid #ccc' }}>{hoaDon.tonggia.toLocaleString('vi-VN')}đ</TableCell>
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
                  <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
                  <InputLabel id="select-month-label">Chọn tháng</InputLabel>
                  <Select
                    labelId="select-month-label"
                    id="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        Tháng {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
                  <InputLabel id="select-year-label">Chọn năm</InputLabel>
                  <Select
                    labelId="select-year-label"
                    id="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <MenuItem key={2020 + i} value={2020 + i}>
                        Năm {2020 + i}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: '10px',marginTop:'10px' }}
                      onClick={handleSearchThang}
                    >
                      Thống kê
                    </Button>
                  </div>
                  {hoaDonThangList.length === 0 ? (
  <Typography variant="h6" align="center" style={{ padding: '20px' }}>
    Không có hóa đơn trong tháng {temp1}/{temp2}
  </Typography>
) : (
  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
    {/* Tính tổng doanh thu */}
    <Typography variant="h6" align="right" sx={{ padding: '10px', fontWeight: 'bold', color: 'rgba(54, 162, 235, 1)' }}>
      Tổng doanh thu tháng {temp1}: {hoaDonThangList.reduce((acc, row) => acc + row.tong, 0).toLocaleString()}đ
    </Typography>

    <Bar
      data={{
        labels: hoaDonThangList.map((row) => new Date(row.ngay).getDate()), // Chỉ hiển thị ngày
        datasets: [
          {
            label: 'Tổng tiền (VND)',
            data: hoaDonThangList.map((row) => row.tong),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Tổng số hóa đơn',
            data: hoaDonThangList.map((row) => row.soluong),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Thống kê hóa đơn trong tháng ${temp1}/${temp2}`,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ngày',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Giá trị',
            },
          },
        },
      }}
    />
  </div>
)}

                </div>
              )}
              
              {activeCategory === 'hoa-don-trong-quy' && (
              <div>
              <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Chọn năm"
                      type="number"
                      value={selectedYearQuy}
                      onChange={handleYearChangeQuy}
                      fullWidth
                      InputProps={{
                        inputProps: { min: 2020, max: 2030 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Chọn quý"
                      select
                      value={selectedQuarter}
                      onChange={handleQuarterChange}
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="Q1">Quý 1</option>
                      <option value="Q2">Quý 2</option>
                      <option value="Q3">Quý 3</option>
                      <option value="Q4">Quý 4</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="contained" color="primary" onClick={handleSearchQuy} fullWidth style={{ marginLeft: '10px',marginTop:'10px' }}>
                    Thống kê
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {quarterRevenueData && (
                <Paper sx={{ padding: 3 }}>
                  <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Thống kê doanh thu {selectedQuarter === 'Q1' ? 'Quý 1' : selectedQuarter === 'Q2' ? 'Quý 2' : selectedQuarter === 'Q3' ? 'Quý 3' : 'Quý 4'} - Năm {selectedYearQuy}
                  </Typography>
                  <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" align="center">Tổng doanh thu quý</Typography>
                      <Typography variant="h5" color="primary" align="center">
                        {totalQuarter.toLocaleString()} VND
                      </Typography>
                    </Grid>
                  </Grid>


                  <div style={{ marginTop: '30px', width: '80%', margin: '0 auto' }}>
                    <Bar
                      data={quarterRevenueData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Doanh thu trong ${selectedQuarter === 'Q1' ? 'Quý 1' : selectedQuarter === 'Q2' ? 'Quý 2' : selectedQuarter === 'Q3' ? 'Quý 3' : 'Quý 4'} - Năm ${selectedYearQuy}`,
                          },                  
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Tháng',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Doanh thu (VND)',
                            },
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </Paper>
              )}
            </div>
            )}
            {activeCategory === 'nguyen-lieu-trong-thang' && (
            <div className="ingredient-usage">
              <div style={{ marginBottom: '16px' }}>
              <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
              <InputLabel id="select-month-label">Chọn tháng</InputLabel>
              <Select
                labelId="select-month-label"
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
              <InputLabel id="select-year-label">Chọn năm</InputLabel>
              <Select
                labelId="select-year-label"
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <MenuItem key={2020 + i} value={2020 + i}>
                    Năm {2020 + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearchNguyenLieuSuDung}
                  style={{ marginLeft: '10px',marginTop:'10px' }}
                >
                  Thống kê
                </Button>
              </div>

              {nguyenLieuSuDungThangList.length === 0 ? (
                <Typography variant="h6" align="center" style={{ padding: '20px' }}>
                  Không có dữ liệu nguyên liệu sử dụng trong tháng
                </Typography>
              ) : (
                <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                  <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center' }}>
                    Thống kê nguyên liệu sử dụng trong tháng {temp1}/{temp2}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px' , fontWeight: 'bold'}}>Nguyên liệu</TableCell>
                        <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px' , fontWeight: 'bold'}}  align="right">Tổng theo công thức</TableCell>
                        <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px' , fontWeight: 'bold'}}  align="right">Tổng phát sinh</TableCell>
                        <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px' , fontWeight: 'bold'}}  align="right">Tổng thực sử dụng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {nguyenLieuSuDungThangList.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell  sx={{ border: '1px solid #ccc' ,width:'100px'}}>{row.tennl}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' ,width:'100px'}} align="right">{row.tongsudung} {row.donvi}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' ,width:'100px'}} align="right">
                                                        {row.soluongphatsinh >= 0 
                                                        ? `${row.soluongphatsinh} ${row.donvi}` 
                                                        : `dư ${Math.abs(row.soluongphatsinh)} ${row.donvi}`}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' ,width:'100px'}} align="right">{row.tongthuc} {row.donvi}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>
          )}
             {activeCategory === 'san-pham-trong-thang' && (
  <div className="product-stats" style={{ padding: '20px' }}>
    <Typography variant="h5" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#388e3c' }}>
      Thống Kê Sản Phẩm Bán Trong Tháng
    </Typography>

    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <FormControl style={{ minWidth: 120 }}>
        <InputLabel id="select-month-label">Chọn tháng</InputLabel>
        <Select
          labelId="select-month-label"
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ minWidth: 120 }}>
        <InputLabel id="select-year-label">Chọn năm</InputLabel>
        <Select
          labelId="select-year-label"
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <MenuItem key={2020 + i} value={2020 + i}>
              Năm {2020 + i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearchSanPham}
        style={{ marginTop: '10px' }}
      >
        Thống kê
      </Button>
    </div>

    {sanPhamTrongThangList.length === 0 ? (
      <Typography variant="h6" align="center" style={{ padding: '20px', color: '#757575' }}>
        Không có sản phẩm trong tháng
      </Typography>
    ) : (
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#388e3c' }}>
          Thống kê sản phẩm bán được trong tháng {temp1}/{temp2}
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e8f5e9' }}>
                  Tên Sản Phẩm
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e8f5e9' }}>
                  Size
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e8f5e9' }} align="right">
                  Giá Bán
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e8f5e9' }} align="right">
                  Số Lượng Bán
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e8f5e9' }} align="right">
                  Tổng Tiền (VND)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sanPhamTrongThangList.map((row) => (
                <TableRow key={row.idctsp} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f1f8e9' } }}>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.masp} - {row.tensp}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.masize}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }} align="right">{row.giaban.toLocaleString()}đ</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }} align="right">{row.soluongban}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }} align="right">{row.doanhthu.toLocaleString()}đ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )}
  </div>
)}

         {activeCategory === 'san-pham-ban-chay' && (
          <div className="order-list">
            <Typography variant="h5" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
              Sản Phẩm Bán Chạy
            </Typography>
            {topSanPhamList.length === 0 ? (
              <Typography variant="h6" align="center" style={{ padding: '20px', color: '#757575' }}>
                Hiện tại không có sản phẩm nào bán chạy.
              </Typography>
            ) : (
              <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                          Mã Sản Phẩm
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                          Tên Sản Phẩm
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }} align="right">
                          Số Lượng Bán
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }} align="right">
                          Doanh Thu (VND)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topSanPhamList.map((row) => (
                        <TableRow key={row.masp} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f1f8e9' } }}>
                          <TableCell sx={{ border: '1px solid #ccc' }}>{row.masp}</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }}>{row.tensp}</TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                            {row.soluongban}
                          </TableCell>
                          <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                            {row.doanhthu.toLocaleString()}đ
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        )}

             {activeCategory === 'san-pham-ban-cham' && (
            <div className="order-list">
              <Typography variant="h5" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                Sản Phẩm Bán Chậm
              </Typography>
              {SPBanChamList.length === 0 ? (
                <Typography variant="h6" align="center" style={{ padding: '20px', color: '#757575' }}>
                  Hiện tại không có sản phẩm nào bán chậm.
                </Typography>
              ) : (
                <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                  <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                            Mã Sản Phẩm
                          </TableCell>
                          <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                            Tên Sản Phẩm
                          </TableCell>
                          <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }} align="right">
                            Số Lượng Bán
                          </TableCell>
                          <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#e3f2fd' }} align="right">
                            Doanh Thu (VND)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SPBanChamList.map((row) => (
                          <TableRow key={row.masp} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f1f8e9' } }}>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.masp}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }}>{row.tensp}</TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                              {row.soluongban}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                              {row.doanhthu.toLocaleString()}đ
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>
          )}

{activeCategory === 'nguyen-lieu-nhap-thang' && (
  <div className="ingredient-stats">
   <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
  <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
    <InputLabel id="select-month-label">Chọn tháng</InputLabel>
    <Select
      labelId="select-month-label"
      id="month"
      value={selectedMonth}
      onChange={handleMonthChange}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <MenuItem key={i + 1} value={i + 1}>
          Tháng {i + 1}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
    <InputLabel id="select-year-label">Chọn năm</InputLabel>
    <Select
      labelId="select-year-label"
      id="year"
      value={selectedYear}
      onChange={handleYearChange}
    >
      {Array.from({ length: 11 }, (_, i) => (
        <MenuItem key={2020 + i} value={2020 + i}>
          Năm {2020 + i}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <Button
    variant="contained"
    color="primary"
    onClick={handleSearchNguyenLieuNhapTrongThang}
    style={{ marginRight: '10px' }}
  >
    Thống kê
  </Button>

  <TextField
    label="Tìm kiếm theo tên nguyên liệu"
    variant="outlined"
    style={{ flex: '1', marginLeft:"430px", minWidth: '200px' ,maxWidth:'300px'}}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>


    <div>
      
      {filteredList.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          style={{
            padding: '20px',
            fontWeight: 'bold',
            color: '#ff5722',
          }}
        >
          Không có nguyên liệu nhập trong tháng
        </Typography>
      ) : (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
          <Typography
            variant="h6"
            sx={{
              padding: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#4caf50',
            }}
          >
            Thống kê nguyên liệu nhập trong tháng {temp1}/{temp2}
          </Typography>

          {/* Dòng tổng tiền nhập */}
          <Typography
            variant="h6"
            sx={{
              padding: '10px',
              textAlign: 'right',
              fontWeight: 'bold',
            }}
          >
            Tổng tiền nhập trong tháng:{' '}
            {filteredList
              .reduce((acc, row, index) => {
                if (index === 0 || filteredList[index - 1].manl !== row.manl) {
                  return acc + row.tongthanhtien;
                }
                return acc;
              }, 0)
              .toLocaleString()}
            đ
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '140px',
                      fontWeight: 'bold',
                    }}
                  >
                    Mã phiếu nhập
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '100px',
                      fontWeight: 'bold',
                    }}
                  >
                    Ngày nhập
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '150px',
                      fontWeight: 'bold',
                    }}
                  >
                    Tên nguyên liệu
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '150px',
                      fontWeight: 'bold',
                    }}
                    align="right"
                  >
                    Giá nhập / Đơn vị
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '100px',
                      fontWeight: 'bold',
                    }}
                    align="right"
                  >
                    Số lượng
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '50px',
                      fontWeight: 'bold',
                    }}
                    align="right"
                  >
                    Thành tiền (VND)
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '50px',
                      fontWeight: 'bold',
                    }}
                    align="right"
                  >
                    Tổng số lượng nhập
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      width: '50px',
                      fontWeight: 'bold',
                    }}
                    align="right"
                  >
                    Tổng tiền nhập
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.map((row, index) => {
                  const isFirstRowForManl =
                    index === 0 || filteredList[index - 1].manl !== row.manl;
                  const rowSpanManl = filteredList.filter((item) => item.manl === row.manl).length;

                  return (
                    <TableRow key={row.maphieunhap}>
                      <TableCell sx={{ border: '1px solid #ccc' }}>{row.maphieunhap}</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>{formatDate(row.ngaynhap)}</TableCell>
                      {isFirstRowForManl && (
                        <TableCell sx={{ border: '1px solid #ccc' }} rowSpan={rowSpanManl}>
                          {row.tennl}
                        </TableCell>
                      )}
                      <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                        {row.gianhap.toLocaleString()}đ
                      </TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                        {row.soluongnhap} {row.donvi}
                      </TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }} align="right">
                        {row.thanhtien.toLocaleString()}đ
                      </TableCell>
                      {isFirstRowForManl && (
                        <TableCell sx={{ border: '1px solid #ccc' }} rowSpan={rowSpanManl} align="right">
                          {row.tongsoluong} {row.donvi}
                        </TableCell>
                      )}
                      {isFirstRowForManl && (
                        <TableCell sx={{ border: '1px solid #ccc' }} rowSpan={rowSpanManl} align="right">
                          {row.tongthanhtien.toLocaleString()}đ
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
            </div>
          )}



            {activeCategory === 'hoa-don-trong-nam' && (
              <div>
              <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                  <InputLabel id="select-year-quy-label">Chọn năm</InputLabel>
                  <Select
                    labelId="select-year-quy-label"
                    id="year-quy"
                    value={selectedYearQuy}
                    onChange={(e) => setSelectedYearQuy(e.target.value)}
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <MenuItem key={2020 + i} value={2020 + i}>
                        {2020 + i}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchRevenueByYear}
                      fullWidth
                      style={{ marginLeft: '10px',marginTop:'10px' }}
                    >
                      Thống kê
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            
              {annualRevenueData && (
                <Paper sx={{ padding: 3 }}>
                  {/* <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Thống kê doanh thu năm {selectedYearQuy}
                  </Typography> */}
                  <div style={{ marginTop: '30px', width: '80%', margin: '0 auto' }}>
                    <Bar
                      data={annualRevenueData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Doanh thu các quý năm ${selectedYearQuy}`,
                          },
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Quý',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Doanh thu (VND)',
                            },
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </Paper>
              )}
             

            </div>
            
            )}    
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuanLyThongKe;
