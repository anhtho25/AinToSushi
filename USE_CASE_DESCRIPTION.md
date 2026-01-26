# MÔ TẢ USE CASE – WEBSITE QUẢN LÝ QUÁN ĂN NHẬT BẢN

## 1. TỔNG QUAN HỆ THỐNG

Website quản lý quán ăn Nhật Bản là một hệ thống quản lý toàn diện hỗ trợ các hoạt động hàng ngày của nhà hàng, từ quản lý đơn hàng, bàn ăn, thực đơn đến quản lý nhân viên và báo cáo doanh thu.

---

## 2. CÁC ACTOR (NGƯỜI DÙNG)

### 2.1. Quản lý (Manager)
- Quyền cao nhất trong hệ thống
- Quản lý toàn bộ hoạt động của nhà hàng

### 2.2. Nhân viên phục vụ (Waiter/Server)
- Tiếp nhận đơn hàng từ khách hàng
- Quản lý bàn ăn và đơn hàng

### 2.3. Đầu bếp (Chef)
- Xem và xử lý đơn hàng từ bếp
- Cập nhật trạng thái món ăn

### 2.4. Thu ngân (Cashier)
- Xử lý thanh toán đơn hàng
- In hóa đơn

### 2.5. Khách hàng (Customer)
- Đặt bàn trực tuyến
- Xem thực đơn
- Đặt món mang về

---

## 3. CÁC USE CASE CHI TIẾT

### UC-01: Đăng nhập hệ thống
**Actor:** Tất cả nhân viên, Quản lý

**Mô tả:** Người dùng đăng nhập vào hệ thống bằng tài khoản và mật khẩu.

**Luồng sự kiện chính:**
1. Hệ thống hiển thị form đăng nhập
2. Người dùng nhập tên đăng nhập và mật khẩu
3. Hệ thống xác thực thông tin
4. Hệ thống chuyển đến trang chủ tương ứng với quyền của người dùng

**Luồng sự kiện phụ:**
- 3a. Thông tin đăng nhập không hợp lệ
  - 3a.1. Hệ thống hiển thị thông báo lỗi
  - 3a.2. Quay lại bước 2

**Điều kiện tiên quyết:** Người dùng có tài khoản hợp lệ

**Kết quả:** Người dùng đăng nhập thành công vào hệ thống

---

### UC-02: Quản lý thực đơn
**Actor:** Quản lý

**Mô tả:** Quản lý thêm, sửa, xóa các món ăn trong thực đơn.

**Luồng sự kiện chính:**
1. Quản lý chọn "Quản lý thực đơn"
2. Hệ thống hiển thị danh sách các món ăn
3. Quản lý thực hiện một trong các thao tác:
   - Thêm món mới: Nhập thông tin (tên, mô tả, giá, hình ảnh, loại món)
   - Sửa món: Chọn món và cập nhật thông tin
   - Xóa món: Chọn món và xác nhận xóa
   - Thay đổi trạng thái (còn/bán hết)
4. Hệ thống lưu thay đổi
5. Hệ thống cập nhật thực đơn

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Quản lý

**Kết quả:** Thực đơn được cập nhật

---

### UC-03: Quản lý bàn ăn
**Actor:** Nhân viên phục vụ, Quản lý

**Mô tả:** Quản lý trạng thái các bàn ăn (trống, đang phục vụ, đã đặt trước).

**Luồng sự kiện chính:**
1. Nhân viên chọn "Quản lý bàn ăn"
2. Hệ thống hiển thị sơ đồ bàn ăn với trạng thái từng bàn
3. Nhân viên thực hiện:
   - Đặt bàn: Chọn bàn trống, nhập thông tin khách hàng
   - Chuyển bàn: Chọn bàn đang phục vụ và bàn đích
   - Thanh toán: Chọn bàn và chuyển sang thanh toán
   - Xóa đặt bàn: Hủy đặt bàn trước
4. Hệ thống cập nhật trạng thái bàn

**Điều kiện tiên quyết:** Đã đăng nhập

**Kết quả:** Trạng thái bàn được cập nhật

---

### UC-04: Tạo đơn hàng
**Actor:** Nhân viên phục vụ

**Mô tả:** Nhân viên tạo đơn hàng mới cho khách hàng tại bàn.

**Luồng sự kiện chính:**
1. Nhân viên chọn bàn đang phục vụ
2. Hệ thống hiển thị form tạo đơn hàng
3. Nhân viên chọn các món từ thực đơn
4. Nhân viên nhập số lượng cho từng món
5. Nhân viên có thể thêm ghi chú đặc biệt
6. Nhân viên xác nhận tạo đơn
7. Hệ thống tạo đơn hàng và gửi đến bếp
8. Hệ thống cập nhật trạng thái bàn thành "Có đơn hàng"

**Luồng sự kiện phụ:**
- 3a. Món không còn trong thực đơn
  - 3a.1. Hệ thống hiển thị cảnh báo
  - 3a.2. Nhân viên chọn món khác

**Điều kiện tiên quyết:** Bàn đã được đặt, đã đăng nhập

**Kết quả:** Đơn hàng mới được tạo và gửi đến bếp

---

### UC-05: Xử lý đơn hàng tại bếp
**Actor:** Đầu bếp

**Mô tả:** Đầu bếp xem và cập nhật trạng thái chế biến các món ăn.

**Luồng sự kiện chính:**
1. Đầu bếp chọn "Đơn hàng bếp"
2. Hệ thống hiển thị danh sách đơn hàng đang chờ
3. Đầu bếp chọn đơn hàng để xem chi tiết
4. Đầu bếp cập nhật trạng thái từng món:
   - Đang chế biến
   - Đã hoàn thành
5. Khi tất cả món đã hoàn thành, đánh dấu đơn hàng "Sẵn sàng phục vụ"
6. Hệ thống thông báo cho nhân viên phục vụ

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Đầu bếp, có đơn hàng mới

**Kết quả:** Trạng thái đơn hàng được cập nhật

---

### UC-06: Thanh toán đơn hàng
**Actor:** Thu ngân, Nhân viên phục vụ

**Mô tả:** Xử lý thanh toán cho đơn hàng của khách hàng.

**Luồng sự kiện chính:**
1. Nhân viên/Thu ngân chọn bàn cần thanh toán
2. Hệ thống hiển thị chi tiết đơn hàng và tổng tiền
3. Nhân viên áp dụng giảm giá (nếu có)
4. Nhân viên chọn phương thức thanh toán:
   - Tiền mặt
   - Thẻ tín dụng
   - Chuyển khoản
   - Ví điện tử
5. Nhân viên nhập số tiền nhận (nếu tiền mặt)
6. Hệ thống tính tiền thừa (nếu có)
7. Nhân viên xác nhận thanh toán
8. Hệ thống cập nhật trạng thái đơn hàng thành "Đã thanh toán"
9. Hệ thống giải phóng bàn
10. Hệ thống in hóa đơn

**Luồng sự kiện phụ:**
- 5a. Số tiền nhận không đủ
  - 5a.1. Hệ thống hiển thị cảnh báo
  - 5a.2. Quay lại bước 5

**Điều kiện tiên quyết:** Đơn hàng đã hoàn thành, đã đăng nhập

**Kết quả:** Đơn hàng được thanh toán, bàn được giải phóng

---

### UC-07: Đặt bàn trực tuyến
**Actor:** Khách hàng

**Mô tả:** Khách hàng đặt bàn trước qua website.

**Luồng sự kiện chính:**
1. Khách hàng truy cập website
2. Khách hàng chọn "Đặt bàn"
3. Hệ thống hiển thị form đặt bàn
4. Khách hàng nhập thông tin:
   - Tên, số điện thoại
   - Ngày giờ đặt bàn
   - Số lượng người
   - Ghi chú đặc biệt
5. Khách hàng chọn bàn (nếu có sẵn)
6. Khách hàng xác nhận đặt bàn
7. Hệ thống kiểm tra tính khả dụng của bàn
8. Hệ thống gửi xác nhận qua SMS/Email
9. Hệ thống cập nhật lịch đặt bàn

**Luồng sự kiện phụ:**
- 7a. Bàn không còn trống
  - 7a.1. Hệ thống đề xuất bàn khác hoặc thời gian khác
  - 7a.2. Khách hàng chọn lại

**Điều kiện tiên quyết:** Khách hàng có kết nối internet

**Kết quả:** Đặt bàn thành công, nhận xác nhận

---

### UC-08: Xem thực đơn trực tuyến
**Actor:** Khách hàng

**Mô tả:** Khách hàng xem thực đơn trên website.

**Luồng sự kiện chính:**
1. Khách hàng truy cập website
2. Khách hàng chọn "Thực đơn"
3. Hệ thống hiển thị danh sách các loại món:
   - Sashimi
   - Sushi
   - Mì ramen
   - Tempura
   - Các món khác
4. Khách hàng chọn loại món để xem chi tiết
5. Hệ thống hiển thị danh sách món với hình ảnh, mô tả, giá
6. Khách hàng có thể tìm kiếm món theo tên

**Điều kiện tiên quyết:** Khách hàng có kết nối internet

**Kết quả:** Khách hàng xem được thực đơn

---

### UC-09: Đặt món mang về
**Actor:** Khách hàng

**Mô tả:** Khách hàng đặt món để mang về qua website.

**Luồng sự kiện chính:**
1. Khách hàng xem thực đơn
2. Khách hàng thêm món vào giỏ hàng
3. Khách hàng xem giỏ hàng và chỉnh sửa số lượng
4. Khách hàng nhập thông tin giao hàng:
   - Tên, số điện thoại, địa chỉ
   - Thời gian nhận hàng
5. Khách hàng chọn phương thức thanh toán
6. Khách hàng xác nhận đặt hàng
7. Hệ thống tạo đơn hàng mang về
8. Hệ thống gửi xác nhận đơn hàng
9. Hệ thống thông báo cho nhà hàng

**Điều kiện tiên quyết:** Khách hàng có kết nối internet

**Kết quả:** Đơn hàng mang về được tạo thành công

---

### UC-10: Quản lý nhân viên
**Actor:** Quản lý

**Mô tả:** Quản lý thông tin và phân quyền nhân viên.

**Luồng sự kiện chính:**
1. Quản lý chọn "Quản lý nhân viên"
2. Hệ thống hiển thị danh sách nhân viên
3. Quản lý thực hiện:
   - Thêm nhân viên: Nhập thông tin (tên, chức vụ, tài khoản, mật khẩu)
   - Sửa thông tin nhân viên
   - Xóa nhân viên
   - Phân quyền cho nhân viên
4. Hệ thống lưu thay đổi

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Quản lý

**Kết quả:** Thông tin nhân viên được cập nhật

---

### UC-11: Xem báo cáo doanh thu
**Actor:** Quản lý

**Mô tả:** Quản lý xem các báo cáo về doanh thu và hoạt động kinh doanh.

**Luồng sự kiện chính:**
1. Quản lý chọn "Báo cáo"
2. Hệ thống hiển thị các loại báo cáo:
   - Doanh thu theo ngày/tuần/tháng
   - Top món bán chạy
   - Thống kê bàn ăn
   - Thống kê nhân viên
3. Quản lý chọn loại báo cáo và khoảng thời gian
4. Hệ thống hiển thị báo cáo dưới dạng biểu đồ và bảng
5. Quản lý có thể xuất báo cáo ra file Excel/PDF

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Quản lý

**Kết quả:** Quản lý xem được báo cáo chi tiết

---

### UC-12: Quản lý kho hàng
**Actor:** Quản lý

**Mô tả:** Quản lý nguyên liệu và hàng tồn kho.

**Luồng sự kiện chính:**
1. Quản lý chọn "Quản lý kho"
2. Hệ thống hiển thị danh sách nguyên liệu
3. Quản lý thực hiện:
   - Thêm nguyên liệu mới
   - Nhập kho: Cập nhật số lượng nhập
   - Xuất kho: Ghi nhận nguyên liệu sử dụng
   - Xem cảnh báo hết hàng
4. Hệ thống tự động cập nhật số lượng tồn kho
5. Hệ thống cảnh báo khi nguyên liệu sắp hết

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Quản lý

**Kết quả:** Kho hàng được quản lý và cập nhật

---

### UC-13: Quản lý khuyến mãi
**Actor:** Quản lý

**Mô tả:** Tạo và quản lý các chương trình khuyến mãi.

**Luồng sự kiện chính:**
1. Quản lý chọn "Quản lý khuyến mãi"
2. Hệ thống hiển thị danh sách khuyến mãi hiện tại
3. Quản lý tạo khuyến mãi mới:
   - Nhập tên chương trình
   - Chọn loại giảm giá (% hoặc số tiền)
   - Chọn món áp dụng hoặc áp dụng toàn bộ
   - Thiết lập thời gian hiệu lực
4. Hệ thống lưu khuyến mãi
5. Khuyến mãi tự động áp dụng khi khách hàng đặt món

**Điều kiện tiên quyết:** Đã đăng nhập với quyền Quản lý

**Kết quả:** Khuyến mãi được tạo và áp dụng

---

## 4. BIỂU ĐỒ USE CASE

```
┌─────────────────────────────────────────────────────────┐
│                    WEBSITE QUẢN LÝ                      │
│                  QUÁN ĂN NHẬT BẢN                       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼───┐          ┌───▼───┐          ┌───▼───┐
    │Quản lý│          │Nhân   │          │Đầu bếp│
    │       │          │viên   │          │       │
    └───┬───┘          └───┬───┘          └───┬───┘
        │                  │                  │
        │                  │                  │
    ┌───▼───────────────────▼───────────────────▼───┐
    │  UC-01: Đăng nhập hệ thống                    │
    │  UC-02: Quản lý thực đơn                      │
    │  UC-03: Quản lý bàn ăn                        │
    │  UC-04: Tạo đơn hàng                          │
    │  UC-05: Xử lý đơn hàng tại bếp                │
    │  UC-06: Thanh toán đơn hàng                   │
    │  UC-10: Quản lý nhân viên                     │
    │  UC-11: Xem báo cáo doanh thu                 │
    │  UC-12: Quản lý kho hàng                      │
    │  UC-13: Quản lý khuyến mãi                    │
    └───────────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Khách hàng   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │  UC-07: Đặt bàn trực tuyến    │
                    │  UC-08: Xem thực đơn          │
                    │  UC-09: Đặt món mang về       │
                    └───────────────────────────────┘
```

---

## 5. CÁC LUỒNG NGHIỆP VỤ CHÍNH

### Luồng 1: Phục vụ khách tại bàn
1. Khách hàng đến → Nhân viên đặt bàn (UC-03)
2. Nhân viên tạo đơn hàng (UC-04)
3. Đầu bếp xử lý đơn hàng (UC-05)
4. Nhân viên phục vụ món ăn
5. Thu ngân thanh toán (UC-06)
6. Giải phóng bàn

### Luồng 2: Đặt bàn trước
1. Khách hàng đặt bàn trực tuyến (UC-07)
2. Nhận xác nhận
3. Đến nhà hàng → Nhân viên xác nhận đặt bàn
4. Tiếp tục luồng phục vụ tại bàn

### Luồng 3: Đặt món mang về
1. Khách hàng đặt món trực tuyến (UC-09)
2. Nhà hàng nhận đơn và chuẩn bị
3. Khách hàng đến lấy hoặc giao hàng
4. Thanh toán

---

## 6. YÊU CẦU PHI CHỨC NĂNG

- **Hiệu suất:** Hệ thống phải phản hồi trong vòng 2 giây
- **Bảo mật:** Mã hóa thông tin đăng nhập và thanh toán
- **Khả dụng:** Hệ thống hoạt động 24/7
- **Giao diện:** Thân thiện, dễ sử dụng, hỗ trợ tiếng Việt và tiếng Nhật
- **Tương thích:** Hoạt động trên máy tính, tablet và điện thoại

---

## 7. CÁC RÀNG BUỘC

- Mỗi bàn chỉ có thể phục vụ một đơn hàng tại một thời điểm
- Đơn hàng phải được thanh toán trước khi giải phóng bàn
- Chỉ quản lý mới có quyền xóa dữ liệu quan trọng
- Hệ thống phải lưu lại lịch sử tất cả giao dịch

---

## 8. KẾT LUẬN

Hệ thống quản lý quán ăn Nhật Bản được thiết kế để hỗ trợ toàn diện các hoạt động của nhà hàng, từ quản lý đơn hàng, bàn ăn đến báo cáo doanh thu, giúp nâng cao hiệu quả phục vụ và quản lý kinh doanh.

