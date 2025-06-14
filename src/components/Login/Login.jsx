import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Container, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { useNavigate, Link } from 'react-router-dom';
import {dangKiKhachHang,kiemTraDangKi,login,sendEmail,checkTaiKhoan,doiMatKhau} from '../../API/apiUser'
import logo from '../../resource/image/bubble-tea.png';

// Định nghĩa kiểu cho các component
const Root = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const PaperStyled = styled(Paper)({
  padding: '20px',
  maxWidth: '400px',
  width: '100%',
});

const ButtonGroup = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
});

const DialogTitleStyled = styled(DialogTitle)({
  position: 'relative',
});
const InputGroup = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  });
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameKP, setUsernameKP] = useState('');
  const [error, setError] = useState('');
  const [errorDangKi, setErrorDangKi] = useState('');
  const [errorQuenPass, setErrorQuenPass] = useState('');
  const [dialogType, setDialogType] = useState(null); // 'register' or 'forgotPassword'
  const [email, setEmail] = useState('');
  const [passwordDK, setPasswordDK] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [submidNewPassword, setSubmitNewPassword] = useState('');
  const [emailKP, setEmailKP] = useState('');
  const navigate = useNavigate();
  const [otpResponse,setOtpResponse] = useState("Chưa có");
  const [isOTPSubmit, setSubmitOTP] = useState(false);
  const handleLogin = async () => {
    try {
      const input ={
        username: username,
        password: password
      }
      await login(input);
      setError('');
      navigate("/")
  } catch (error) {
      setError('Tài khoản hoặc mật khẩu chưa đứng')
  }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorDangKi('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }
    if (passwordDK === '' || confirmPassword === '' || customerId === '' || address === '' || phone=== ''|| email=== '' ) {
        setErrorDangKi('Không để trống ô dữ liệu');
        return;
      }
      try {
        const data = await kiemTraDangKi(customerId,phone,email);
        if (data === 2) 
        {
            alert("Mã khách hàng này đã được đăng kí")
            return;
        }
        if (data === 3) 
            {
                alert("Số điện thoại này đã được đăng kí")
                return;
            }
        if (data === 4) 
                {
                    alert("Email này đã được đăng kí")
                    return;
                }
      } catch (error) {
        console.error('Error fetching ChoDuyet List:', error);
      }
      try {
        const input = 
        {
            makh: customerId,
            tenkh: fullName,
            diachi: address,
            sdt: phone,
            email: email,
            password: passwordDK
        }
        await dangKiKhachHang(input);
        setCustomerId(''); setAddress(''); setConfirmPassword(''); setEmail(''); setPhone(''); setFullName(''); setPassword('');
        setDialogType(null);
        alert('Đăng kí thành công')
      } catch (error) {
        console.error('Error fetching ChoDuyet List:', error);
      }
    

  };

  const handleRequestOtp = async () => {
    if (!isOTPSubmit){
      if (!usernameKP || !emailKP) {
        setErrorQuenPass('Vui lòng nhập tên người dùng và email');
        return;
      }
      const check = await checkTaiKhoan(usernameKP,emailKP);
      if (check === 1)
      {const input = {
        subject: "Mã khôi phục mật khẩu",
        message: '',
        mailTo: emailKP
      }
      const data = await sendEmail(input);
      setOtpResponse(data);
      alert("Mã OTP đã gửi để email của bạn. Vui lòng kiểm tra!")
    }
  }
    // Thực hiện yêu cầu gửi OTP
    // ...
    console.log('Requesting OTP for:', { username, email });
    setErrorQuenPass('');
  };

  const handleSubmitOtp = async () => {

    if( !isOTPSubmit)
    {
      if (!otp) {
        setErrorQuenPass('Vui lòng nhập mã OTP');
        return;
      }
     if (otp.toString() === otpResponse.toString())
     {
    
      setSubmitOTP(true);
     }
    }
   else{
    if (newpassword !== submidNewPassword)
    {alert ("Password chưa khớp");
      return;
    }
    try {
      await doiMatKhau(usernameKP,newpassword);
      setDialogType(null);
      alert('Đổi mật khẩu thành công')
    } catch (error) {
      console.error('Error đổi mật khẩu:', error);
    }
   }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
  };

  const handleCloseDialog = () => {
    if (isOTPSubmit) {
      setSubmitOTP(false);
      setOtpResponse("chưa có");
    }
    else {
      
      setOtpResponse("chưa có");
      setDialogType(null);
    }
    
  };

  return (
    <Root component="main">
      <PaperStyled elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          <Box display="flex" alignItems="center" justifyContent="center">
            <img src={logo} alt="Logo" style={{ width: '100px', height: '100px', marginRight: '16px' }} />
            <span style={{ fontSize: '2rem' }}>Đăng Nhập</span>
          </Box>
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Tên người dùng"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Mật khẩu"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" align="center" style={{ marginTop: '10px' }}>
            {error}
          </Typography>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#3f51b5' }}>
            Về trang chủ
          </Link>
          <Button onClick={() => handleOpenDialog('forgotPassword')} style={{ textDecoration: 'none', color: 'red' }}>
            Quên mật khẩu?
          </Button>
        </Box>
        <ButtonGroup>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog('register')}
            style={{ flex: 1, marginRight: '10px' }}
          >
            Đăng ký
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ flex: 1 }}
          >
            Đăng Nhập
          </Button>
        </ButtonGroup>
        
        {/* Dialog Đăng Ký */}
        <Dialog open={dialogType === 'register'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitleStyled>
            Đăng Ký
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitleStyled>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Mã KH"
              variant="outlined"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Họ tên"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Địa chỉ"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Số điện thoại"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu"
              variant="outlined"
              type="password"
              value={passwordDK}
              onChange={(e) => setPasswordDK(e.target.value)}
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
            {errorDangKi && (
              <Typography color="error" align="center" style={{ marginTop: '10px' }}>
                {errorDangKi}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleRegister} color="primary">
              Đăng Ký
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Quên Mật Khẩu */}
        <Dialog open={dialogType === 'forgotPassword'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitleStyled>
            Quên Mật Khẩu
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitleStyled>
          <DialogContent>
          {!isOTPSubmit && (
              <>
            <TextField
              margin="normal"
              fullWidth
              label="Tên người dùng"
              variant="outlined"
              value={usernameKP}
              onChange={(e) => setUsernameKP(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={emailKP}
              onChange={(e) => setEmailKP(e.target.value)}
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
            {errorQuenPass && (
              <Typography color="error" align="center" style={{ marginTop: '10px' }}>
                {errorQuenPass}
              </Typography>
            )}
            </>
            )}
           {isOTPSubmit && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Nhập mật khẩu mới"
                  variant="outlined"
                  type="password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Xác nhận mật khẩu"
                  variant="outlined"
                  type="password"
                  value={submidNewPassword}
                  onChange={(e) => setSubmitNewPassword(e.target.value)}
                />
              </>
            )}

          </DialogContent>
          <DialogActions>
     
          
            <Button onClick={handleCloseDialog} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleSubmitOtp} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </PaperStyled>
    </Root>
  );
};

export default Login;
