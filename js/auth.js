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
export async function saveUserData(uid, email, role, name = null) {
    try {
        const userRef = ref(database, `users/${uid}`);
        const userData = {
            email: email,
            role: role,
            createdAt: serverTimestamp()
        };
        
        if (name) {
            userData.name = name;
        }
        
        await set(userRef, userData);
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
            return snapshot.val().role;
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
        
        // Lưu user data vào Realtime Database với role Customer
        await saveUserData(user.uid, email, 'Customer', name);
        
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
        
        // Kiểm tra nếu là admin@gmail.com thì redirect đến manager/admin.html
        if (user.email === 'admin@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/admin.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là waiter@gmail.com thì redirect đến manager/waiter.html
        if (user.email === 'waiter@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/waiter.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là chef@gmail.com thì redirect đến manager/kitchen.html
        if (user.email === 'chef@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/kitchen.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra nếu là cashier@gmail.com thì redirect đến manager/payments.html
        if (user.email === 'cashier@gmail.com') {
            setTimeout(() => {
                window.location.href = '../manager/payments.html';
            }, 500);
            return user;
        }
        
        // Kiểm tra xem user đã có trong database chưa
        const userData = await getUserData(user.uid);
        
        if (!userData) {
            // User mới - lưu với role Customer
            await saveUserData(
                user.uid, 
                user.email, 
                'Customer', 
                user.displayName || user.email.split('@')[0]
            );
        }
        
        // Redirect sau khi đăng ký
        redirectByRole('Customer', user.email);
        
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

        let role = await getUserRole(user.uid);

        // Kiểm tra các email đặc biệt và tự động gán role
        if (user.email === 'waiter@gmail.com') {
            if (!role || role !== 'Waiter') {
                await saveUserData(user.uid, user.email, 'Waiter', user.displayName || 'Waiter');
            }
            role = 'Waiter';
            redirectByRole(role, user.email);
            return { user, role };
        }

        if (user.email === 'admin@gmail.com') {
            if (!role || role !== 'Admin') {
                await saveUserData(user.uid, user.email, 'Admin', user.displayName || 'Admin');
            }
            role = 'Admin';
            redirectByRole(role, user.email);
            return { user, role };
        }

        if (user.email === 'chef@gmail.com') {
            if (!role || role !== 'Chef') {
                await saveUserData(user.uid, user.email, 'Chef', user.displayName || 'Chef');
            }
            role = 'Chef';
            redirectByRole(role, user.email);
            return { user, role };
        }

        if (user.email === 'cashier@gmail.com') {
            if (!role || role !== 'Cashier') {
                await saveUserData(user.uid, user.email, 'Cashier', user.displayName || 'Cashier');
            }
            role = 'Cashier';
            redirectByRole(role, user.email);
            return { user, role };
        }

        // Nếu chưa có trong database → tự tạo Customer
        if (!role) {
            await saveUserData(
                user.uid,
                user.email,
                'Customer',
                user.displayName || user.email.split('@')[0]
            );
            role = 'Customer';
        }

        redirectByRole(role, user.email);

        return { user, role };
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
        
        // Kiểm tra các email đặc biệt và tự động gán role
        if (user.email === 'waiter@gmail.com') {
            if (!userData || userData.role !== 'Waiter') {
                await saveUserData(user.uid, user.email, 'Waiter', user.displayName || 'Waiter');
            }
            userData = { role: 'Waiter' };
            redirectByRole(userData.role, user.email);
            return { user, role: userData.role };
        }

        if (user.email === 'admin@gmail.com') {
            if (!userData || userData.role !== 'Admin') {
                await saveUserData(user.uid, user.email, 'Admin', user.displayName || 'Admin');
            }
            userData = { role: 'Admin' };
            redirectByRole(userData.role, user.email);
            return { user, role: userData.role };
        }

        if (user.email === 'chef@gmail.com') {
            if (!userData || userData.role !== 'Chef') {
                await saveUserData(user.uid, user.email, 'Chef', user.displayName || 'Chef');
            }
            userData = { role: 'Chef' };
            redirectByRole(userData.role, user.email);
            return { user, role: userData.role };
        }

        if (user.email === 'cashier@gmail.com') {
            if (!userData || userData.role !== 'Cashier') {
                await saveUserData(user.uid, user.email, 'Cashier', user.displayName || 'Cashier');
            }
            userData = { role: 'Cashier' };
            redirectByRole(userData.role, user.email);
            return { user, role: userData.role };
        }
        
        if (!userData) {
            // User mới - tự động đăng ký với role Customer
            await saveUserData(
                user.uid, 
                user.email, 
                'Customer', 
                user.displayName || user.email.split('@')[0]
            );
            userData = { role: 'Customer' };
        }
        
        // Redirect dựa trên role
        redirectByRole(userData.role, user.email);
        
        return { user, role: userData.role };
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
    // Kiểm tra nếu là admin@gmail.com thì redirect đến manager/admin.html
    if (email === 'admin@gmail.com') {
        setTimeout(() => {
            window.location.href = '../manager/admin.html';
        }, 500);
        return;
    }
    
    // Kiểm tra nếu là waiter@gmail.com thì redirect đến manager/waiter.html
    if (email === 'waiter@gmail.com') {
        setTimeout(() => {
            window.location.href = '../manager/waiter.html';
        }, 500);
        return;
    }
    
    // Kiểm tra nếu là chef@gmail.com thì redirect đến manager/kitchen.html
    if (email === 'chef@gmail.com') {
        setTimeout(() => {
            window.location.href = '../manager/kitchen.html';
        }, 500);
        return;
    }
    
    // Kiểm tra nếu là cashier@gmail.com thì redirect đến manager/payments.html
    if (email === 'cashier@gmail.com') {
        setTimeout(() => {
            window.location.href = '../manager/payments.html';
        }, 500);
        return;
    }
    
    const roleRedirects = {
        'Manager': '../admin/dashboard.html',
        'Admin': '../manager/admin.html',
        'Waiter': '../manager/waiter.html',
        'Chef': '../manager/kitchen.html',
        'Cashier': '../manager/payments.html',
        'Customer': '../index.html'
    };

    // Customer: quay lại đúng trang trước khi đăng nhập (nếu có lưu returnUrl)
    if (role === 'Customer') {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl');
        if (returnUrl && returnUrl.length > 0) {
            try {
                const u = new URL(returnUrl, window.location.origin);
                if (u.origin === window.location.origin &&
                    !u.pathname.includes('auth/login') &&
                    !u.pathname.includes('auth/register')) {
                    setTimeout(() => { window.location.href = returnUrl; }, 300);
                    return;
                }
            } catch (e) {}
        }
    }

    const redirectPath = roleRedirects[role] || '../index.html';

    setTimeout(() => {
        window.location.href = redirectPath;
    }, 300);
}

// Lấy current user và role
export async function getCurrentUser() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = await getUserRole(user.uid);
                resolve({ user, role });
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
            const role = await getUserRole(user.uid);
            callback({ user, role });
        } else {
            callback(null);
        }
    });
}

// Export auth và database để sử dụng ở nơi khác
export { auth, database };
