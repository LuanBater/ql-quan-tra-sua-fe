import api,{NGUYEN_LIEU_API_URL,SAN_PHAM_API_URL,MUA_HANG_API_URL} from "./apiConfig";
export const getDanhSachSanPhamBan = async (maloai) => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-danh-sach-sp-ban`, {
            params: { 'maloai': maloai.trim()},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of SanPham:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDanhSachTopping = async () => {
    try {
        const response = await api.get(`${SAN_PHAM_API_URL}lay-danh-sach-topping`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of SanPham:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const taoDonHang = async (makh, sdt, diachi, thanhtoan, list_sanpham) => {
    try {
        const response = await api.post(`${MUA_HANG_API_URL}tao-don-hang`, {
            makh,
            sdt,
            diachi,
            thanhtoan,
            list_sanpham
        });

        // Trả về dữ liệu phản hồi từ API
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
export const getDonHangDaDatKhach = async (makh) => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}lay-don-hang-da-dat-khach`, {
            params: { 'makh': makh},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of DDK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDonHangHoanThanhKhach = async (makh) => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}lay-don-hang-hoan-thanh-khach`, {
            params: { 'makh': makh},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of HTK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDonHangDaDat = async () => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}lay-don-hang-da-dat`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of DDK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};

export const getDonHangHoanThanh = async () => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}lay-don-hang-hoan-thanh`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of HTK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getHoaDon = async () => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}lay-danh-sach-hoa-don`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of HTK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const xemHoaDon = async (madonhang) => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}xem-hoa-don`,madonhang);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of HTK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const duyetDonHang = async (manv,madonhang) => {
    try {
        const response = await api.get(`${MUA_HANG_API_URL}duyet-don-hang`, {
            params: { 'manv': manv,
                        'madonhang': madonhang}
        });
        return response.data;
    } catch (error) {
        console.error('Error duỵet:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const hoanThanhDonHang = async (data) => {
    try {
        const response = await api.post(`${MUA_HANG_API_URL}hoan-thanh-don-hang`, data);
        return response.data;
    } catch (error) {
        console.error('Error create PN:', error);
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