// Role Guard - Bảo vệ các trang admin/staff
import { onAuthStateChange } from './auth.js';

// Mapping role với các trang được phép truy cập
// Chỉ còn 3 role: admin, staff, customer
const rolePermissions = {
    admin: [
        'admin.html',
        'dashboard.html',
        'orders.html',
        'tables.html',
        'menu-management.html',
        'staff.html',
        'reports.html',
        'inventory.html',
        'promotions.html'
    ],
    staff: [
        'staff.html'
    ],
    customer: [
        // Customer không được truy cập trang admin/staff
    ]
};

// Lấy tên file từ URL
function getCurrentPage() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return fileName || 'dashboard.html';
}

// Kiểm tra quyền truy cập
function checkPermission(role, page) {
    if (!role) {
        return false;
    }
    
    const allowedPages = rolePermissions[role] || [];
    return allowedPages.includes(page);
}

// Khởi tạo role guard
export function initRoleGuard() {
    onAuthStateChange(async (authData) => {
        const currentPage = getCurrentPage();
        const isAdminPage = window.location.pathname.includes('admin/') || window.location.pathname.includes('manager/');
        
        // Nếu không phải trang admin/manager, không cần check
        if (!isAdminPage) {
            return;
        }
        
        // Nếu chưa đăng nhập, redirect về login
        if (!authData) {
            window.location.href = '../auth/login.html';
            return;
        }
        
        const { user, role, position } = authData;

        // role bắt buộc phải có
        if (!role) {
            console.error('User không có role');
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Customer không được vào vùng admin/staff
        if (role === 'customer') {
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Kiểm tra quyền truy cập trang hiện tại
        if (!checkPermission(role, currentPage)) {
            // Sai role cho layout hiện tại → đưa về layout đúng với role
            const defaultPages = {
                admin: '../manager/admin.html',
                staff: '../manager/staff.html'
            };
            const defaultPage = defaultPages[role] || '../auth/login.html';
            window.location.href = defaultPage;
            return;
        }
        
        // Lưu thông tin user vào window để sử dụng ở các trang khác
        window.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: role,
            position: position || null
        };
    });
}

// Kiểm tra quyền truy cập một trang cụ thể
export async function hasPermission(role, page) {
    return checkPermission(role, page);
}

// Lấy danh sách trang được phép truy cập của một role
export function getAllowedPages(role) {
    return rolePermissions[role] || [];
}
