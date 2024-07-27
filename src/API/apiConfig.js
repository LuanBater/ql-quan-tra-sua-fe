
import axios from 'axios';

const API_BASE_URL = '/api/';

export const SAN_PHAM_API_URL = `san-pham/`;
export const NGUYEN_LIEU_API_URL = `nguyen-lieu/`;
export const MUA_HANG_API_URL = `don-hang/`;
export const THONG_TIN_API_URL = `thong-tin/`;
export const THONG_KE_API_URL = `thong-ke/`;
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {'X-Custom-Header': 'foobar'}
});

export default api; 
