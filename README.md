# Website Quản Lý Quán Ăn Nhật Bản - Sakura Restaurant

## 📋 Mô Tả

Website quản lý quán ăn Nhật Bản là một hệ thống quản lý toàn diện hỗ trợ các hoạt động hàng ngày của nhà hàng, từ quản lý đơn hàng, bàn ăn, thực đơn đến quản lý nhân viên và báo cáo doanh thu.

## 🗂️ Cấu Trúc Thư Mục

```
DOANCS2/
├── css/
│   └── style.css          # File CSS chung cho toàn bộ website
├── admin/
│   ├── login.html         # Trang đăng nhập hệ thống
│   ├── dashboard.html     # Trang Dashboard quản lý
│   ├── orders.html        # Trang quản lý đơn hàng
│   ├── tables.html        # Trang quản lý bàn ăn
│   └── menu-management.html # Trang quản lý thực đơn
├── index.html             # Trang chủ
├── menu.html              # Trang thực đơn
├── reservation.html       # Trang đặt bàn
├── takeout.html           # Trang đặt món mang về
├── USE_CASE_DESCRIPTION.md # Tài liệu mô tả use case
└── README.md              # File hướng dẫn này
```

## 🌐 Các Trang Website

### Trang Khách Hàng

1. **index.html** - Trang chủ
   - Giới thiệu về nhà hàng
   - Món ăn nổi bật
   - Thông tin liên hệ

2. **menu.html** - Trang thực đơn
   - Hiển thị tất cả món ăn theo danh mục
   - Tìm kiếm món ăn
   - Xem giá và mô tả món

3. **reservation.html** - Trang đặt bàn
   - Form đặt bàn trực tuyến
   - Chọn ngày giờ và số lượng người
   - Thông tin nhà hàng

4. **takeout.html** - Trang đặt món mang về
   - Chọn món từ thực đơn
   - Giỏ hàng
   - Form thông tin đặt hàng

### Trang Quản Lý (Admin)

1. **admin/login.html** - Trang đăng nhập
   - Đăng nhập với tài khoản và mật khẩu
   - Chọn vai trò (Quản lý, Nhân viên, Đầu bếp, Thu ngân)

2. **admin/dashboard.html** - Dashboard
   - Thống kê tổng quan
   - Doanh thu, đơn hàng, bàn ăn
   - Đơn hàng gần đây
   - Thao tác nhanh

3. **admin/orders.html** - Quản lý đơn hàng
   - Danh sách tất cả đơn hàng
   - Lọc theo trạng thái, ngày
   - Chi tiết đơn hàng
   - Thanh toán đơn hàng

4. **admin/tables.html** - Quản lý bàn ăn
   - Sơ đồ bàn ăn trực quan
   - Trạng thái bàn (Trống, Đang phục vụ, Đã đặt trước)
   - Thông tin chi tiết từng bàn
   - Đặt bàn, chuyển bàn, thanh toán

5. **admin/menu-management.html** - Quản lý thực đơn
   - Danh sách món ăn
   - Thêm, sửa, xóa món
   - Quản lý trạng thái món (Còn hàng/Hết hàng)
   - Upload hình ảnh món

## 🎨 Thiết Kế

- **Màu sắc chủ đạo:** Đỏ (#d32f2f) và Cam (#f57c00) - màu sắc đặc trưng của Nhật Bản
- **Font:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Responsive:** Hỗ trợ đầy đủ trên desktop, tablet và mobile
- **UI/UX:** Giao diện hiện đại, dễ sử dụng, phù hợp với phong cách Nhật Bản

## 🚀 Cách Sử Dụng

1. Mở file `index.html` trong trình duyệt để xem trang chủ
2. Điều hướng qua các trang bằng menu điều hướng
3. Để truy cập trang quản lý, vào `admin/login.html`
4. Tất cả các trang đều là trang tĩnh, chưa có chức năng backend

## 📱 Tính Năng Chính

### Dành cho Khách Hàng:
- ✅ Xem thực đơn trực tuyến
- ✅ Đặt bàn trực tuyến
- ✅ Đặt món mang về
- ✅ Tìm kiếm món ăn

### Dành cho Quản Lý:
- ✅ Dashboard tổng quan
- ✅ Quản lý đơn hàng
- ✅ Quản lý bàn ăn
- ✅ Quản lý thực đơn
- ✅ Thống kê và báo cáo

## 🔧 Công Nghệ Sử Dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và layout
- **Responsive Design** - Tương thích mọi thiết bị

## 📝 Lưu Ý

- Đây là các trang tĩnh tạm thời, chưa có chức năng backend
- Tất cả các form chưa có xử lý dữ liệu thực tế
- Cần tích hợp backend để website hoạt động đầy đủ

## 🎯 Các Trang Cần Phát Triển Thêm

- Trang quản lý nhân viên
- Trang báo cáo doanh thu
- Trang quản lý kho hàng
- Trang quản lý khuyến mãi
- Trang xử lý đơn hàng cho đầu bếp
- Trang thanh toán chi tiết

## 👥 Vai Trò Người Dùng

1. **Quản lý** - Quyền cao nhất, quản lý toàn bộ hệ thống
2. **Nhân viên phục vụ** - Tạo đơn hàng, quản lý bàn ăn
3. **Đầu bếp** - Xem và xử lý đơn hàng từ bếp
4. **Thu ngân** - Xử lý thanh toán đơn hàng
5. **Khách hàng** - Xem thực đơn, đặt bàn, đặt món

## 📞 Liên Hệ

Nếu có thắc mắc hoặc đề xuất cải thiện, vui lòng liên hệ với đội phát triển.

---

**Phiên bản:** 1.0.0  
**Ngày tạo:** 2024  
**Trạng thái:** Đang phát triển

