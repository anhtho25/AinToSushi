// Firebase v9 Auth và Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    update,
    get,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZNsCgsIMSKsiWE3AcBNQBX_icDhKez38",
    authDomain: "ain-to-sushi.firebaseapp.com",
    databaseURL: "https://ain-to-sushi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ain-to-sushi",
    storageBucket: "ain-to-sushi.firebasestorage.app",
    messagingSenderId: "191817237919",
    appId: "1:191817237919:web:532c656464fe58bd0ce9aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
});

// Lưu user data vào Realtime Database
// role: 'admin' | 'staff' | 'customer'
// position (chỉ cho staff): 'waiter' | 'chef' | 'cashier'
// existingData: { phone, address, photoURL } - giữ lại khi đăng nhập để không mất dữ liệu đã cập nhật trên trang tài khoản
export async function saveUserData(uid, email, role, name = null, position = null, existingData = null) {
    try {
        const userRef = ref(database, `users/${uid}`);
        const updates = {
            email: email,
            role: role,
            position: position || null,
            createdAt: serverTimestamp()
        };
        if (name != null) updates.name = name;
        if (existingData && typeof existingData === 'object') {
            if (existingData.phone !== undefined) updates.phone = existingData.phone;
            if (existingData.address !== undefined) updates.address = existingData.address;
            if (existingData.photoURL !== undefined) updates.photoURL = existingData.photoURL;
        }
        await update(userRef, updates);
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

// Lấy user role từ database
export async function getUserRole(uid) {
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val().role || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

// Lấy user data từ database
async function getUserData(uid) {
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Admin: tạo tài khoản nhân viên (sau khi tạo sẽ đăng xuất, admin cần đăng nhập lại)
export async function createStaffAccount(email, password, name, role, position) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (name) await updateProfile(user, { displayName: name });
    await saveUserData(user.uid, email, role || 'staff', name, position || null);
    await signOut(auth);
    return user.uid;
}

// Đăng ký với email/password (chỉ Customer)
export async function register(email, password, name) {
    try {
        // Tạo user trong Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Cập nhật display name
        if (name) {
            await updateProfile(user, { displayName: name });
        }
        
        // Lưu user data vào Realtime Database với role customer
        await saveUserData(user.uid, email, 'customer', name, null);
        
        // Redirect sau khi đăng ký
        redirectByRole('Customer', email);
        
        return user;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

// Đăng ký với Google (chỉ Customer)
export async function registerWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Kiểm tra nếu là admin@gmail.com thì redirect admin
        if (user.email === 'admin@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/admin.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là waiter@gmail.com thì redirect staff
        if (user.email === 'waiter@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/waiter.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là chef@gmail.com thì redirect staff
        if (user.email === 'chef@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/kitchen.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là cashier@gmail.com thì redirect staff
        if (user.email === 'cashier@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/payments.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra xem user đã có trong database chưa
        const userData = await getUserData(user.uid);
        
        if (!userData) {
            // User mới - lưu với role customer
            await saveUserData(
                user.uid, 
                user.email, 
                'customer', 
                user.displayName || user.email.split('@')[0]
            );
        }
        
        // Redirect sau khi đăng ký
        redirectByRole('customer', user.email);
        
        return user;
    } catch (error) {
        console.error('Google register error:', error);
        throw error;
    }
}

// Đăng nhập với email/password
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Luôn đảm bảo user có dữ liệu profile
        let userData = await getUserData(user.uid);

        // Map các email đặc biệt sang role/position mới
        if (user.email === 'admin@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'admin',
                position: null,
                name: user.displayName || 'Admin'
            };
        } else if (user.email === 'waiter@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'waiter',
                name: user.displayName || 'Waiter'
            };
        } else if (user.email === 'chef@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'chef',
                name: user.displayName || 'Chef'
            };
        } else if (user.email === 'cashier@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'cashier',
                name: user.displayName || 'Cashier'
            };
        } else if (!userData || !userData.role) {
            // Mặc định khách hàng
            userData = {
                email: user.email,
                role: 'customer',
                position: null,
                name: user.displayName || user.email.split('@')[0]
            };
        }

        // Lưu lại userData chuẩn hoá (giữ phone, address, photoURL từ DB để không mất)
        await saveUserData(
            user.uid,
            userData.email,
            userData.role,
            userData.name || null,
            userData.position || null,
            { phone: userData.phone, address: userData.address, photoURL: userData.photoURL }
        );

        redirectByRole(userData.role, user.email);

        return { user, role: userData.role, position: userData.position || null };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Đăng nhập với Google
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Kiểm tra xem user đã có trong database chưa
        let userData = await getUserData(user.uid);
        
        // Map các email đặc biệt sang role/position mới
        if (user.email === 'admin@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'admin',
                position: null,
                name: user.displayName || 'Admin'
            };
        } else if (user.email === 'waiter@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'waiter',
                name: user.displayName || 'Waiter'
            };
        } else if (user.email === 'chef@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'chef',
                name: user.displayName || 'Chef'
            };
        } else if (user.email === 'cashier@gmail.com') {
            userData = {
                ...(userData || {}),
                email: user.email,
                role: 'staff',
                position: 'cashier',
                name: user.displayName || 'Cashier'
            };
        } else if (!userData || !userData.role) {
            // User mới - tự động đăng ký với role customer
            userData = {
                email: user.email,
                role: 'customer',
                position: null,
                name: user.displayName || user.email.split('@')[0]
            };
        }
        
        // Lưu lại userData chuẩn hoá (giữ phone, address, photoURL từ DB để không mất)
        await saveUserData(
            user.uid,
            userData.email,
            userData.role,
            userData.name || null,
            userData.position || null,
            { phone: userData.phone, address: userData.address, photoURL: userData.photoURL }
        );
        
        // Redirect dựa trên role
        redirectByRole(userData.role, user.email);
        
        return { user, role: userData.role, position: userData.position || null };
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
}

// Đăng xuất
export async function logout() {
    try {
        await signOut(auth);
        window.location.href = '../auth/login.html';
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Redirect dựa trên role
function redirectByRole(role, email = '') {
    const roleRedirects = {
        admin: '/manager/admin.html',
        staff: '/manager/staff.html',
        customer: '/'
    };

    // Customer: quay lại đúng trang trước khi đăng nhập (nếu có lưu returnUrl)
    if (role === 'customer') {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl');
        if (returnUrl && returnUrl.length > 0) {
            try {
                const u = new URL(returnUrl, window.location.origin);
                const isSameOrigin = u.origin === window.location.origin;
                const isAuthPage = u.pathname.includes('/auth/login') || u.pathname.includes('/auth/register');
                const isAdminArea = u.pathname.startsWith('/admin') || u.pathname.startsWith('/staff') || u.pathname.includes('/manager/');
                if (isSameOrigin && !isAuthPage && !isAdminArea) {
                    setTimeout(() => { window.location.href = u.href; }, 300);
                    return;
                }
            } catch (e) {}
        }
    }

    const redirectPath = roleRedirects[role] || '/';

    setTimeout(() => {
        window.location.href = redirectPath;
    }, 300);
}

function normalizeRoleAndPosition(rawRole, rawPosition, email = '') {
    let role = rawRole || null;
    let position = rawPosition || null;

    const emailLower = (email || '').toLowerCase();

    if (role) {
        const lower = String(role).toLowerCase();
        if (lower === 'admin' || lower === 'staff' || lower === 'customer') {
            role = lower;
        } else if (lower === 'manager') {
            role = 'admin';
        } else if (lower === 'waiter') {
            role = 'staff';
            position = position || 'waiter';
        } else if (lower === 'chef') {
            role = 'staff';
            position = position || 'chef';
        } else if (lower === 'cashier') {
            role = 'staff';
            position = position || 'cashier';
        } else if (lower === 'customer') {
            role = 'customer';
        }
    }

    // Fallback theo email đặc biệt nếu chưa có role
    if (!role && emailLower) {
        if (emailLower === 'admin@gmail.com') {
            role = 'admin';
            position = null;
        } else if (emailLower === 'waiter@gmail.com') {
            role = 'staff';
            position = 'waiter';
        } else if (emailLower === 'chef@gmail.com') {
            role = 'staff';
            position = 'chef';
        } else if (emailLower === 'cashier@gmail.com') {
            role = 'staff';
            position = 'cashier';
        } else {
            role = 'customer';
            position = null;
        }
    }

    return {
        role: role || null,
        position: position || null
    };
}

// Lấy current user, role và position
export async function getCurrentUser() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getUserData(user.uid);
                if (data && data.disabled === true) {
                    await signOut(auth);
                    if (typeof window !== 'undefined') window.location.href = '../auth/login.html?error=disabled';
                    resolve(null);
                    return;
                }
                const normalized = normalizeRoleAndPosition(data?.role, data?.position, user.email);
                const role = normalized.role;
                const position = normalized.position;
                resolve({ user, role, position });
            } else {
                resolve(null);
            }
        });
    });
}

// Lắng nghe thay đổi auth state
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const data = await getUserData(user.uid);
            if (data && data.disabled === true) {
                await signOut(auth);
                if (typeof window !== 'undefined') window.location.replace('../auth/login.html?error=disabled');
                return;
            }
            const normalized = normalizeRoleAndPosition(data?.role, data?.position, user.email);
            const role = normalized.role;
            const position = normalized.position;
            callback({ user, role, position });
        } else {
            callback(null);
        }
    });
}

// Export auth và database để sử dụng ở nơi khác
export { auth, database };
