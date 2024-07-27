import api,{THONG_KE_API_URL} from "./apiConfig";
export const getDanhSachCPPS = async () => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}lay-danh-sach-cpps`);
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of cpps:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const themCPPS = async (data) => {
    try {
        const response = await api.post(`${THONG_KE_API_URL}them-chi-phi-phat-sinh`, data);
        return response.data;
    } catch (error) {
        console.error('Error create CPPS:', error);
        throw error;
    }
};
export const updateCPPS = async (data) => {
    try {
        const response = await api.post(`${THONG_KE_API_URL}update-chi-phi-phat-sinh`, data);
        return response.data;
    } catch (error) {
        console.error('Error Update CPPS:', error);
        throw error;
    }
};
export const xoaCPPS = async (macpps) => {
    try {
        const response = await api.get(`${THONG_KE_API_URL}xoa-chi-phi-phat-sinh`, {
            params: {
                'macpps': macpps
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error del CPPS:', error);
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