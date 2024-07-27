import api,{NGUYEN_LIEU_API_URL} from "./apiConfig";

export const getDanhSachNguyenLieu = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-danh-sach-nguyen-lieu`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of NL:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const xoaNguyenLieu = async (manl) => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}xoa-nl`, {
            params: {
                'manl': manl
            }
        });
        return response.status; // Trả về dữ liệu từ phản hồi nếu cần
    } catch (error) {
        console.error('Error deleting NL:', error);
        throw error;
    }
};

export const getDanhSachDonDatMua = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-danh-sach-don-dat`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of DDM:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const getDanhSachPhieuNhap = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-danh-sach-phieu-nhap`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of PN:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const getDanhSachNhaCungCap = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-danh-sach-nha-cung-cap`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of NCC:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachNguyenLieuDeXuat = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}/lay-danh-sach-nguyen-lieu-de-xuat`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of DeXuat:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const taoDonDatMua = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}tao-don-dat-mua`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const taoPhieuNhap = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}tao-phieu-nhap`, data);
        return response.data;
    } catch (error) {
        console.error('Error create PN:', error);
        throw error;
    }
};
export const getCTDDM = async (madondat) => {
    console.log('Fetching CTDDM for madondat:', madondat);
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-chi-tiet-don-dat`, {
            params: { madondat }
        });
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error get CTDDM:', error);
        throw error;
    }
};

export const getCTPN = async (mapn) => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}lay-chi-tiet-phieu-nhap`, {
            params: { mapn }
        });
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error get CTDDM:', error);
        throw error;
    }
};

export const themNguyenLieu = async (nguyenLieu, hinhanh) => {
    const formData = new FormData();
    formData.append('nl', JSON.stringify(nguyenLieu));
    formData.append('imgNguyenLieu', hinhanh);

    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}them-nguyen-lieu`, formData, {
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
        const response = await api.get(`${NGUYEN_LIEU_API_URL}get-img`, {
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
export const updateNguyenLieu = async (nguyenLieu, hinhanh) => {
    const formData = new FormData();
    formData.append('nl', JSON.stringify(nguyenLieu));
    formData.append('imgNguyenLieu', hinhanh);

    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}update-nguyen-lieu`, formData, {
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
export const getDanhSachNguyenLieuPhatSinh = async () => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}/lay-nguyen-lieu-phat-sinh`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of ps:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const themNguyenLieuPhatSinh = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}them-nguyen-lieu-phat-sinh`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const updateNguyenLieuPhatSinh = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}update-nguyen-lieu-phat-sinh`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const xoaNguyenLieuPhatSinh = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}xoa-nguyen-lieu-phat-sinh`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const themNhaCungCap = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}them-nha-cung-cap`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const updateNhaCungCap = async (data) => {
    try {
        const response = await api.post(`${NGUYEN_LIEU_API_URL}update-nha-cung-cap`, data);
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
        throw error;
    }
};
export const xoaNhaCungCap = async (mancc) => {
    try {
        const response = await api.get(`${NGUYEN_LIEU_API_URL}xoa-nha-cung-cap`, {
            params: {
                'mancc': mancc
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error create DDM:', error);
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