import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../../resource/css/header.css";
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import banner1 from '../../resource/image/banner-tra-sua-1.jpg';
import banner2 from '../../resource/image/banner-tra-sua-3.jpg';
import banner3 from '../../resource/image/banner-tra-sua-2.jpg';
import logo from '../../resource/image/bubble-tea.png';
import userInfo from '../../resource/image/info.png';
import change from '../../resource/image/rotation-lock.png';
import { Dialog, DialogTitle, DialogContent, TextField, Button,Box } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import {getThongTinNhanVien,getThongTinKhachHang,updateThongTinNhanVien,updateKhachHang} from '../../API/QLThongTin'
import {sendEmail,doiMatKhau,kiemTraUpdate} from '../../API/apiUser'
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
const InputGroup = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  });
function HeaderPage({menuItems}) {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("maquyen");
    const navigate = useNavigate();
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [userInfoData, setUserInfoData] = useState({});
    const [isOTPSubmit, setSubmitOTP] = useState(false);
    const [otpResponse,setOtpResponse] = useState("Chưa có");
    const InputGroup = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  });
    const handleClickLog = () => {
        if(username) {
          localStorage.removeItem("username");
          localStorage.removeItem("maquyen");
          localStorage.removeItem("token");
        } 
        navigate("/login");
    };

    const handleOpenChangePasswordDialog = () => {
        setOpenChangePasswordDialog(true);
    };

    const handleCloseChangePasswordDialog = () => {
        setOpenChangePasswordDialog(false);
        setSubmitOTP(false);
        setOtpResponse('Chưa có');
    };

    const handleOpenUserInfoDialog = async() => {
        // Fetch user info based on role and set it to userInfoData
        if (role === 'KH') {
            const data = await getThongTinKhachHang(username)
            setUserInfoData(data);
        } else {
            const data = await getThongTinNhanVien(username)
            setUserInfoData(data);
        }
        setOpenUserInfoDialog(true);
    };

    const handleCloseUserInfoDialog = () => {
        setOpenUserInfoDialog(false);
    };
    const handleRequestOtp = async () => {
          if (!newPassword || !confirmPassword) {
            alert('Vui lòng không bỏ trống dữ liệu!');
            return;
          }
          if (role === 'KH')
          {
            const data = await getThongTinKhachHang(username);
            const input = {
                subject: "Mã OTP đổi mật khẩu",
                message: '',
                mailTo: data.email
              }
              const OTP = await sendEmail(input);
              setOtpResponse(OTP);
              alert("Mã OTP đã gửi để email của bạn. Vui lòng kiểm tra!")
          }
          else{
            const data = await getThongTinNhanVien(username);
            const input = {
                subject: "Mã OTP đổi mật khẩu",
                message: '',
                mailTo: data.email
              }
              const OTP = await sendEmail(input);
              setOtpResponse(OTP);
              alert("Mã OTP đã gửi để email của bạn. Vui lòng kiểm tra!")
          }
      
    }
    const handleChangePassword = async () => {

        if( !isOTPSubmit)
        {
          if (!otp) {
            alert('Vui lòng nhập mã OTP');
            return;
          }
         if (otp.toString() === otpResponse.toString())
         {
        
          setSubmitOTP(true);
         }
        }
       else{
        if (newPassword !== confirmPassword)
        {alert ("Password chưa khớp");
          return;
        }
        try {
          await doiMatKhau(username,newPassword);
          setOpenChangePasswordDialog(false);
          if(username) {
            localStorage.removeItem("username");
            localStorage.removeItem("maquyen");
            localStorage.removeItem("token");
          } 
          navigate("/login");
          alert('Đổi mật khẩu thành công. Vui lòng đăng nhập lại')
        } catch (error) {
          console.error('Error đổi mật khẩu:', error);
        }
       }
      };
      const handleSelectUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfoData({
            ...userInfoData,
            [name]: value
        });
      };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, // 5000 milliseconds = 5 seconds
        appendDots: (dots) => (
            <div style={{ bottom: '20px' }}>
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
          ),
      };

    const images = [
        { id: 1, url: banner1 },
        { id: 2, url: banner2 },
        { id: 3, url: banner3 },
    ];
    const handlUpdateThongTinClick = async() => 
    
        {

        if(userInfoData.ten === '' || userInfoData.diachi === '' || userInfoData.sdt === ''|| userInfoData.email === ''){
            alert("Không bỏ trống các ô thông tin!");
            return;
        }
       
        const duplicateProducts1 =await kiemTraUpdate(role,userInfoData.ma,userInfoData.sdt,userInfoData.email);
        if (duplicateProducts1 === 2) {
          alert('Số điện thoại này đã có người sử dụng!');
          return;
        }
        const duplicateProducts2 = await kiemTraUpdate(role,userInfoData.ma,userInfoData.sdt,userInfoData.email);
        if (duplicateProducts2===3) {
          alert('Email đã có người đã có người sử dụng!');
          return;
        }
      
    
          if(role === 'KH')
          {
            const input = {
                makh: userInfoData.ma,
                tenkh: userInfoData.ten,
                diachi: userInfoData.diachi,
                sdt: userInfoData.sdt,
                email: userInfoData.email
            } 
            try {
                await updateKhachHang(input);
                setOpenUserInfoDialog(false);
                alert("Cập nhật thông tin cá nhân thành công!")
                
            } catch (error) {
                console.error('Error update user:', error);
            }
          }
          else{
            const input = {
                manv: userInfoData.ma,
                tennv: userInfoData.ten,
                phai: userInfoData.phai,
                ngaysinh: userInfoData.ngaysinh,
                diachi:userInfoData.diachi,
                sdt: userInfoData.sdt,
                hinhanh: userInfoData.hinhanh,
                email: userInfoData.email,
                nghilam: userInfoData.nghilam,
                maquyen: userInfoData.maquyen
            }
            try {
                await updateThongTinNhanVien(input);
                setOpenUserInfoDialog(false);
                alert("Cap nhat thong tin ca nhan thanh cong!")
                
            } catch (error) {
                console.error('Error update user:', error);
            }
          }
     };
      
    return (
        <div className="header-page-container">
            <div className="header-page-top">
                <div className="header-page-left">
                    <div className="logo" onClick={() => window.location.href = '/'}>
                        <img src={logo} alt="Logo" className="logo-img"/>
                    </div>
                </div>
                <div className="header-page-center">
                    <div className="banner">
                        <Slider {...settings}>
                            {images.map((image) => (
                                <div key={image.id}>
                                    <img src={image.url} alt={`Slide ${image.id}`} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="header-page-right">
                    <div className="user-info">
                        {username ? (
                            <>
                                <button onClick={handleClickLog}>Đăng xuất</button>
                                <div className="user-details">
                                    <button onClick={handleOpenUserInfoDialog}> 
                                        <img src={userInfo} alt="Thông tin cá nhân" className="button-img"/>
                                    </button>
                                </div>
                                <div className="user-details">
                                    <button onClick={handleOpenChangePasswordDialog}> 
                                        <img src={change} alt="Đổi mật khẩu" className="button-img"/>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button onClick={() => window.location.href = '/login'}>Đăng nhập</button>
                        )}
                    </div>
                </div>
            </div>
            <nav className="nav-bar">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a href={item.link}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>

            <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nhập mật khẩu mới"
                        variant="outlined"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Xác nhận mật khẩu"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                     <InputGroup>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Mã OTP"
                        variant="outlined"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Button
                        onClick={handleRequestOtp}
                        color="primary"
                        style={{ marginLeft: '10px' }}
                    >
                        Lấy mã
                    </Button>
                    </InputGroup>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangePasswordDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleChangePassword}  color="primary">
                        Đổi mật khẩu
                    </Button>
                    </DialogActions>
            </Dialog>

            <Dialog open={openUserInfoDialog} onClose={handleCloseUserInfoDialog}>
                <DialogTitle>Thông tin cá nhân</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        id="ma"
                        name="ma"
                        fullWidth
                        label={userInfoData.ma}
                        variant="outlined"
                        disabled
                    />
                    <TextField
                        margin="normal"
                        id="ten"
                        name="ten"
                        fullWidth
                        label="Họ tên"
                        variant="outlined"
                        value={userInfoData.ten}
                        onChange={handleSelectUserInfoChange}
                        // disabled
                    />
                    {role !== 'KH' && (
                        <>
                              <FormControl fullWidth margin="dense">
                                <InputLabel id="gender-label">Phái</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="phai"
                                    name="phai"
                                    value={userInfoData.phai}
                                    onChange={handleSelectUserInfoChange}
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
                            value={userInfoData.ngaysinh}
                            onChange={handleSelectUserInfoChange}
                        />
                        </>
                    )}
                    <TextField
                        margin="normal"
                        id="diachi"
                        name="diachi"
                        fullWidth
                        label="Địa chỉ"
                        variant="outlined"
                        value={userInfoData.diachi}
                        onChange={handleSelectUserInfoChange}
                    />
                    <TextField
                        margin="normal"
                        id="sdt"
                        name="sdt"
                        fullWidth
                        label="SĐT"
                        variant="outlined"
                        value={userInfoData.sdt}
                        onChange={handleSelectUserInfoChange}
                    />
                    <TextField
                        margin="normal"
                        id="email"
                        name="email"
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={userInfoData.email}
                        onChange={handleSelectUserInfoChange}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserInfoDialog}  color="secondary"  >
                        Đóng
                    </Button>
                    <Button onClick={handlUpdateThongTinClick} color="primary">
                       Cập nhật
                    </Button>
                    </DialogActions>
            </Dialog>
        </div>
    );
}

export default HeaderPage;
