import api,{SAN_PHAM_API_URL,NGUYEN_LIEU_API_URL} from "../API/apiConfig";
export const getDanhSachSanPham = async (maloai) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-danh-sach-sp`, {
            params: { 'maloai': maloai.trim()},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of SanPham:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachTheLoai = async () => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-danh-sach-the-loai`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of TheLoai:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachBangGia = async () => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-danh-sach-bang-gia`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of bang gia:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getBangGiaKhaDung = async () => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-bang-gia-kha-dung`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of bang gia:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getBangGiaKhuyenMai = async () => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-bang-gia-khuyen-mai`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of bang gia:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachCongThuc = async (masp) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-cong-thuc-sp`, {
            params: { 'masp': masp},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of bang gia:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachNguyenLieu= async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-danh-sach-nguyen-lieu`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of bang gia:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const UpdateCongThuc = async (congthuc) => {
    try {
        const response = await api.post(`${SAN_PHAM_API_URL}update-cong-thuc`, congthuc);
        return response.data;
    } catch (error) {
        console.error('Error updating cong thuc:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};


export const themSanPham = async (sp, hinhanh) => {
    const formData = new FormData();
    formData.append('sp', JSON.stringify(sp));
    formData.append('img', hinhanh);

    try {
        const response = await api.post(`${SAN_PHAM_API_URL}them-san-pham`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding new student:', error);
        throw error;
    }
};
export const updateSanPham = async (sp, hinhanh) => {
    const formData = new FormData();
    formData.append('sp', JSON.stringify(sp));
    formData.append('img', hinhanh);

    try {
        const response = await api.post(`${SAN_PHAM_API_URL}update-san-pham`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding new student:', error);
        throw error;
    }
};
export const fetchImage = async (imageName) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}get-img`, {
            params: { name: imageName },
            responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};


export const xoaCongThuc = async (masp) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}xoa-cong-thuc`, {
            params: {
                'masp': masp
            }
        });
        return response.status; // Trả về dữ liệu từ phản hồi nếu cần
    } catch (error) {
        console.error('Error deleting SP:', error);
        throw error;
    }
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Đảm bảo rằng các số được hiển thị với hai chữ số
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    // Trả về ngày tháng năm đã được định dạng
    return `${formattedDay}-${formattedMonth}-${year}`;
};
export const xoaSanPham = async (masp) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}xoa-sp`, {
            params: {
                'masp': masp
            }
        });
        return response.status; // Trả về dữ liệu từ phản hồi nếu cần
    } catch (error) {
        console.error('Error deleting SP:', error);
        throw error;
    }
};
export const xoaKhuyenMai = async (mabg,idctspM,idctspL) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}xoa-khuyen-mai`, {
            params: {
                'mabg': mabg, 'idctspM': idctspM,'idctspL':idctspL
            }
        });
        return response.status; // Trả về dữ liệu từ phản hồi nếu cần
    } catch (error) {
        console.error('Error deleting KM:', error);
        throw error;
    }
};
export const UpdateGiaKhuyenMai = async (khuyenmai) => {
    try {
        const response = await api.post(`${SAN_PHAM_API_URL}update-khuyen-mai`, khuyenmai);
        return response.data;
    } catch (error) {
        console.error('Error updating cong thuc:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const changeGia = async (maloai,giaM,giaL,idctspM,idctspL) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}change-gia`, {
            params: {
                'maloai': maloai,'giaM': giaM, 'giaL': giaL, 'idctspM': idctspM,'idctspL':idctspL
            }
        });
        return response.status; // Trả về dữ liệu từ phản hồi nếu cần
    } catch (error) {
        console.error('Error deleting KM:', error);
        throw error;
    }
};
export const themBangGia = async (data) => {
    try {
        const response = await api.post(`${SAN_PHAM_API_URL}them-bang-gia-khuyen-mai`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const updateBangGia = async (data) => {
    try {
        const response = await api.post(`${SAN_PHAM_API_URL}update-bang-gia`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const xoaBangGia = async (mabg) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}xoa-bang-gia`, {
            params: {
                'mabg': mabg
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};