import api,{USER_API_URL} from "./apiConfig";
export const kiemTraDangKi = async (makh,sdt,email) => {
    try {
        const response = await api.get(`${USER_API_URL}kiem-tra-dang-ki`, {
            params: { 'makh': makh,
                'sdt' : sdt,
                'email':email
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the list of DDK:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const dangKiKhachHang = async (data) => {
    try {
        const response = await api.post(`${USER_API_URL}khach-hang-dang-ki`, data);
        return response.data;
    } catch (error) {
        console.error('Error create sign in:', error);
        throw error;
    }
};
export const login = async (data) => {
    try {
        const response = await api.post(`${USER_API_URL}login`, data);
        if(response.status === 200) {
            const token  = response.data.accessToken;
            const username = response.data.username;
            const password = response.data.password;
            const role = response.data.maquyen;
            console.log(token)
            localStorage.setItem('token', token); 
            localStorage.setItem("username",username)
            localStorage.setItem("password",password)
            localStorage.setItem("maquyen",role)
        }
        // Lưu trữ token vào localStorage
        return response;
    } catch (error) {
        console.error('Error during login', error);
        throw error;
    }
};
export const sendEmail = async (email) => {
    try {
        const response = await api.post(`${USER_API_URL}send-email`, email);
        return response.data;
    } catch (error) {
        console.error('Error create sign in:', error);
        throw error;
    }
};
export const checkTaiKhoan = async (username,email) => {
    try {
        const response = await api.get(`${USER_API_URL}check-tai-khoan`, {
            params: { 'username': username,
                'email' :email
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching check tai khoan:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const doiMatKhau = async (username,password) => {
    try {
        const response = await api.get(`${USER_API_URL}doi-mat-khau`, {
            params: { 'username': username,
                'password': password
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching info KH:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};
export const kiemTraUpdate = async (maquyen,makh,sdt,email) => {
    try {
        const response = await api.get(`${USER_API_URL}kiem-tra-update`, {
            params: { 
                'maquyen': maquyen,
                'makh': makh,
                'sdt' : sdt,
                'email':email
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching checking update:', error);
        throw error; // Optionally, rethrow the error to handle it in the component
    }
};