import React, { useState } from "react";
import { formatDate, themChiTietGia, updateChiTietGia, xoaCTGia } from "../../API/QLSanPham";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import MessageDialog from '../modal/MessageDialog.jsx';

const GiaDialog = ({ open, onClose, product, giaList }) => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageNote, setMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteGiaId, setDeleteGiaId] = useState(null);

  const handleMessageClose = () => {
    setMessageOpen(false);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteGiaId(null); // Reset deleteGiaId
  };

  const [newGia, setNewGia] = useState({
    masp: product ? product.masp : "",
    mabg: "BG01", // Default mã bảng giá, ví dụ: "BG01"
    tenbg: "",
    giasizeM: "",
    giasizeL: "",
    ngayapdung: "",
    ngaykt: "",
  });

  const [isAdding, setIsAdding] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGia({ ...newGia, [name]: value });
  };

  const handleAddGia = async () => {
    if (!newGia.mabg || !newGia.giasizeL || !newGia.giasizeM || !newGia.ngaykt || !newGia.ngayapdung) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      let response;
      if (isAdding) {
        newGia.masp = product.masp;
        response = await themChiTietGia(newGia, product.maloai);
        setMessage("Thêm chi tiết giá thành công!");
        setMessageOpen(true);
      } else {
        newGia.masp = product.masp;
        response = await updateChiTietGia(newGia, product.maloai);
        setMessage("Cập nhật chi tiết giá thành công!");
        setIsAdding(true)
        setMessageOpen(true);
      }
      console.log(response);
      onClose();
    } catch (error) {
      console.error("Lỗi khi xử lý chi tiết giá:", error);
      alert(isAdding ? "Thêm chi tiết giá thất bại!" : "Cập nhật chi tiết giá thất bại!");
      return;
    }
  };

  const handleEditGia = (gia) => {
    setIsAdding(false); // Đặt trạng thái là Cập nhật
    setNewGia(gia); // Cập nhật giá trị nhập liệu để sửa
  };

  const handleDeleteGia = (mabg) => {
    setDeleteGiaId(mabg); // Lưu ID chi tiết giá cần xóa
    setConfirmDeleteOpen(true); // Mở dialog xác nhận
  };

  const confirmDelete = async () => {
    try {
      await xoaCTGia(deleteGiaId, product.masp, product.maloai); // Giả sử có API xóa
      setMessage("Xoá chi tiết giá thành công!");
      setMessageOpen(true);
      handleConfirmDeleteClose(); // Đóng dialog xác nhận
      onClose(); // Đóng dialog chính sau khi xóa thành công
    } catch (error) {
      console.error("Lỗi khi xoá chi tiết giá:", error);
      alert("Xoá chi tiết giá thất bại!");
      handleConfirmDeleteClose(); // Đóng dialog nếu có lỗi
    }
  };

  const handleAddNewGia = () => {
    setIsAdding(true);
    setNewGia({
      masp: product.masp,
      mabg: "BG01", // Default bảng giá
      tenbg: "",
      giasizeM: "",
      giasizeL: "",
      ngayapdung: "",
      ngaykt: "",
    });
  };

  if (!product) {
    return (
      <MessageDialog
        open={messageOpen}
        onClose={handleMessageClose}
        message={messageNote}
      />
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle>
        {isAdding ? `Thêm chi tiết giá cho sản phẩm: ${product.masp} - ${product.tensp}` : `Cập nhật chi tiết giá cho sản phẩm: ${product.masp} - ${product.tensp}`}
      </DialogTitle>
      <DialogContent>
        {giaList.length === 0 ? (
          <Typography variant="h6" align="center" style={{ padding: "20px" }}>
            Không có thông tin giá
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Bảng giá</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Giá Size M</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Giá Size L</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Ngày áp dụng</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Ngày kết thúc</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {giaList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.mabg} - {row.tenbg}</TableCell>
                    <TableCell align="right">
                      {row.giasizeM ? `${row.giasizeM.toLocaleString()}đ` : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {row.giasizeL ? `${row.giasizeL.toLocaleString()}đ` : "-"}
                    </TableCell>
                    <TableCell align="right">{formatDate(row.ngayapdung)}</TableCell>
                    <TableCell align="right">{formatDate(row.ngaykt) || "Chưa kết thúc"}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditGia(row)}
                        style={{ marginRight: "8px" }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteGia(row.mabg)}
                      >
                        Xoá
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewGia}
          style={{ marginTop: "16px" }}
        >
          Thêm mới
        </Button>

        <Typography variant="h6" style={{ margin: "16px 0" }}>
          {isAdding ? "Thêm chi tiết giá mới" : "Cập nhật chi tiết giá"}
        </Typography>
        <Select
          name="mabg"
          value={newGia.mabg}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          disabled={!isAdding}
        >
          <MenuItem value="BG01">Giá Gốc</MenuItem>
          <MenuItem value="BG02">Giá Giảm</MenuItem>
        </Select>
        <TextField
          label="Giá Size M"
          name="giasizeM"
          type="number"
          value={newGia.giasizeM}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Giá Size L"
          name="giasizeL"
          type="number"
          value={newGia.giasizeL}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Ngày áp dụng"
          name="ngayapdung"
          value={newGia.ngayapdung}
          onChange={handleChange}
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Ngày kết thúc"
          name="ngaykt"
          value={newGia.ngaykt}
          onChange={handleChange}
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddGia}
          style={{ marginTop: "16px" }}
        >
          {isAdding ? "Lưu" : "Cập nhật"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          style={{ marginTop: "16px", marginLeft: "8px" }}
        >
          Đóng
        </Button>
      </DialogContent>

      {/* Dialog xác nhận xóa */}
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa chi tiết giá này không?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmDelete}
            style={{ marginTop: "16px" }}
          >
            Xoá
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleConfirmDeleteClose}
            style={{ marginTop: "16px", marginLeft: "8px" }}
          >
            Hủy
          </Button>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default GiaDialog;
