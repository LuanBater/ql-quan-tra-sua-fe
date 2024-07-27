import api,{THONG_TIN_API_URL} from "../API/apiConfig";
export const getThongTinNhanVien = async (manv) => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}lay-thong-tin-nhan-vien`, {
            params: { 'manv': manv.trim()},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching info NV:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getThongTinKhachHang = async (makh) => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}lay-thong-tin-khach-hang`, {
            params: { 'makh': makh.trim()},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching info KH:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachNhanVien = async () => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}lay-danh-sach-nhan-vien`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of NhanVien:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachKhachHang = async () => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}lay-danh-sach-khach-hang`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of NhanVien:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const changeNghiLam = async (manv) => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}change-nghi-lam`, {
            params: { 'manv': manv },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching info KH:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const changeQuyen = async (manv,maquyen) => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}change-quyen`, {
            params: { 'manv': manv , 'maquyen': maquyen},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching info KH:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const themNhanVien = async (nv, hinhanh) => {
    const formData = new FormData();
    formData.append('nv', JSON.stringify(nv));
    formData.append('img', hinhanh);

    try {
        const response = await api.post(`${THONG_TIN_API_URL}them-nhan-vien`, formData, {
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
export const updateNhanVien = async (nv, hinhanh) => {
    const formData = new FormData();
    formData.append('nv', JSON.stringify(nv));
    formData.append('img', hinhanh);

    try {
        const response = await api.post(`${THONG_TIN_API_URL}update-nhan-vien`, formData, {
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
export const updateKhachHang = async (data) => {
    try {
        const response = await api.post(`${THONG_TIN_API_URL}update-khach-hang`, data);
        return response.data;
    } catch (error) {
        console.error('Error create PN:', error);
        throw error;
    }
};
export const fetchImage = async (imageName) => {
    try {
        const response = await api.get(`${THONG_TIN_API_URL}get-img`, {
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