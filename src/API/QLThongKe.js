import api,{THONG_KE_API_URL} from "./apiConfig";


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
export const getHoaDonNgay = async (ngay) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-hoa-don-ngay`, {
            params: { 'ngay': ngay},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hd ngay:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getHoaDonThang = async (thang,nam) => {

    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-hoa-don-thang`, {
            params: { 'thang': thang,
                'nam': nam
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hd thang:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getHoaDonQuy = async (year,maquy) => {

    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-hoa-don-quy`, {
            params: { 'year': year,
                'maquy': maquy
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hd thang:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDoanhThuNam= async (year) => {

    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-hoa-don-nam`, {
            params: { 'year': year
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hd nam:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getPhieuNhapThang = async (thang,nam) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-phieu-nhap-thang`, {
            params: { 'thang': thang,
                'nam': nam
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pn thang', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getNguyenLieuSuDung = async (thang,nam) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-thong-ke-nguyen-lieu`, {
            params: { 'thang': thang,
                'nam': nam
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pn thang', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getNguyenLieuNhapTrongThang = async (thang,nam) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-nguyen-lieu-trong-thang`, {
            params: { 'thang': thang,
                'nam': nam
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching nguyenlieu nhap trong thang', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getDoanhThuSanPham = async (thang,nam) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-doanh-thu-san-pham`, {
            params: { 'thang': thang,
                'nam': nam
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pn thang', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getTopSanPham = async () => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-top-san-pham`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of top:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const getTopSanPhamBanCham = async () => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-top-san-pham-ban-cham`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of top:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};