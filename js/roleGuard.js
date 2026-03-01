// Role Guard - Bảo vệ các trang admin
import { onAuthStateChange, getUserRole, saveUserData } from './auth.js';

// Mapping role với các trang được phép truy cập
const rolePermissions = {
    'Manager': [
        'dashboard.html',
        'orders.html',
        'tables.html',
        'menu-management.html',
        'kitchen.html',
        'payments.html',
        'staff.html',
        'reports.html',
        'inventory.html',
        'promotions.html'
    ],
    'Admin': [
        'admin.html',
        'dashboard.html',
        'orders.html',
        'tables.html',
        'menu-management.html',
        'kitchen.html',
        'payments.html',
        'staff.html',
        'reports.html',
        'inventory.html',
        'promotions.html'
    ],
    'Waiter': [
        'waiter.html'
    ],
    'Chef': [
        'kitchen.html'
    ],
    'Cashier': [
        'payments.html'
    ],
    'Customer': [
        // Customer không được truy cập trang admin
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
        
        let { user, role } = authData;
        
        // Kiểm tra các email đặc biệt và tự động gán role (ưu tiên kiểm tra email trước)
        if (user.email === 'admin@gmail.com') {
            if (!role || role !== 'Admin') {
                role = 'Admin';
                await saveUserData(user.uid, user.email, 'Admin', user.displayName || 'Admin');
            }
        } else if (user.email === 'waiter@gmail.com') {
            if (!role || role !== 'Waiter') {
                role = 'Waiter';
                await saveUserData(user.uid, user.email, 'Waiter', user.displayName || 'Waiter');
            }
        } else if (user.email === 'chef@gmail.com') {
            if (!role || role !== 'Chef') {
                role = 'Chef';
                await saveUserData(user.uid, user.email, 'Chef', user.displayName || 'Chef');
            }
        } else if (user.email === 'cashier@gmail.com') {
            if (!role || role !== 'Cashier') {
                role = 'Cashier';
                await saveUserData(user.uid, user.email, 'Cashier', user.displayName || 'Cashier');
            }
        } else if (!role) {
            // Nếu không phải email đặc biệt và không có role
            console.error('User không có role');
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Nếu là Customer, không được vào admin
        if (role === 'Customer') {
            window.location.href = '../menu.html';
            return;
        }
        
        // Kiểm tra quyền truy cập trang hiện tại
        if (!checkPermission(role, currentPage)) {
            // Redirect về trang mặc định của role
            const defaultPages = {
                'Manager': '../admin/dashboard.html',
                'Admin': '../manager/admin.html',
                'Waiter': '../manager/waiter.html',
                'Chef': '../manager/kitchen.html',
                'Cashier': '../manager/payments.html'
            };
            
            const defaultPage = defaultPages[role] || '../menu.html';
            window.location.href = defaultPage;
            return;
        }
        
        // Lưu thông tin user vào window để sử dụng ở các trang khác
        window.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: role
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
