# MÔ TẢ USE CASE – WEBSITE QUẢN LÝ QUÁN ĂN NHẬT BẢN

## 1. USE CASE QUẢN LÝ TÀI KHOẢN

### UC001: Đăng ký tài khoản
**Actor:** Khách vãng lai
**Mô tả:** Khách vãng lai đăng ký tài khoản mới bằng email hoặc Google
**Precondition:** Chưa có tài khoản
**Main Flow:**
1. Khách vãng lai truy cập trang đăng ký
2. Chọn đăng ký bằng email (nhập họ tên, email, mật khẩu) hoặc Google
3. Xác nhận mật khẩu
4. Xác nhận đăng ký
5. Tài khoản được kích hoạt
**Postcondition:** Tài khoản mới được tạo thành công
**Exception:** Email đã tồn tại, thông tin không hợp lệ

### UC002: Đăng nhập
**Actor:** Khách vãng lai, Người dùng, Nhân viên phục vụ, Đầu bếp, Thu ngân, Quản trị viên
**Mô tả:** Khách vãng lai, Người dùng, Nhân viên phục vụ, Đầu bếp, Thu ngân, Quản trị viên đăng nhập vào hệ thống bằng email/Google và mật khẩu
**Precondition:** Người dùng chưa đăng nhập
**Main Flow:**
1. Người dùng truy cập trang đăng nhập
2. Chọn đăng nhập bằng email/mật khẩu hoặc Google
3. Hệ thống xác thực thông tin
**Postcondition:** Đăng nhập thành công, vào đúng trang theo quyền
**Exception:** Thông tin đăng nhập không chính xác

### UC003: Quên mật khẩu
**Actor:** Người dùng
**Mô tả:** Người dùng yêu cầu gửi email đặt lại mật khẩu khi quên 
**Precondition:** có tài khoản trong hệ thống
**Main Flow:**
1. Người dùng chọn "Quên mật khẩu?"
2. Nhập email đã đăng ký
3. Hệ thống gửi link đặt lại mật khẩu qua email
4. Người dùng click vào link
5. Nhập mật khẩu mới
6. Xác nhận mật khẩu mới
7. Cập nhật mật khẩu thành công
**Postcondition:** Mật khẩu được đặt lại thành công
**Exception:** Email không tồn tại, link hết hạn

### UC004: Đăng xuất
**Actor:** Người dùng, Nhân viên phục vụ, Đầu bếp, Thu ngân, Quản trị viên
**Mô tả:** Người dùng đăng xuất khỏi hệ thống
**Precondition:** Đã đăng nhập
**Main Flow:**
1. Người dùng chọn nút "Đăng xuất"
2. Hệ thống xóa session
3. Chuyển hướng về trang chủ
**Postcondition:** Người dùng đã đăng xuất thành công

### UC005: Quản lý hồ sơ cá nhân
**Actor:** Người dùng
**Mô tả:** Người dùng xem và cập nhật thông tin cá nhân, xem lịch sử đặt bàn và đơn hàng
**Precondition:** Đã đăng nhập với vai trò Người dùng
**Main Flow:**
1. Người dùng chọn biểu tượng tài khoản trên thanh điều hướng
2. Xem thông tin hiện tại
3. Chỉnh sửa thông tin (ảnh đại diện, họ tên, SĐT, địa chỉ)
4. Cập nhật thông tin
**Postcondition:** Thông tin cá nhân được cập nhật
**Exception:** Thông tin không hợp lệ



---

## 2. USE CASE CHUNG

### UC006: Xem trang chủ
**Actor:** Khách Vãng lai, người dùng
**Mô tả:** Hiển thị trang chủ với thông tin tổng quan và các chức năng chính
**Precondition:** Không
**Main Flow:**
1. Truy cập trang chủ
2. Hiển thị banner chính với hình ảnh, khẩu hiệu và nút kêu gọi hành động (\"Đặt bàn ngay\", \"Xem thực đơn\")
3. Hiển thị các khối giới thiệu về nhà hàng
4. Hiển thị một số món nổi bật
5. Hiển thị các nút/đường dẫn nhanh đến các trang chức năng
**Postcondition:** Trang chủ được hiển thị 

### UC007: Xem thực đơn 
**Actor:** Khách vãng lai, Người dùng
**Mô tả:** Xem danh sách thực đơn trên website
**Precondition:** Không
**Main Flow:**
1. Truy cập trang thực đơn
2. Hiển thị danh sách món 
3. Người dùng có thể chọn món để xem chi tiết hoặc thêm vào giỏ hàng
**Postcondition:** Thực đơn được hiển thị 

### UC008: Xem chi tiết thực đơn
**Actor:** Khách vãng lai, Người dùng
**Mô tả:** Xem chi tiết một món ăn trên trang chi tiết sản phẩm
**Precondition:** Không
**Main Flow:**
1. Chọn một món cụ thể
2. Hệ thống chuyển đến trang chi tiết món
3. Hiển thị hình ảnh, tên món, danh mục, mô tả, giá
4. Hiển thị danh sách đánh giá của khách hàng khác (nếu có)
5. Hiển thị các món tương tự/cùng danh mục
**Postcondition:** Trang chi tiết món ăn được hiển thị

### UC009: Xem tin tức
**Actor:** Khách vãng lai, Người dùng
**Mô tả:** Xem các bài viết tin tức, sự kiện
**Precondition:**  Không
**Main Flow:**
1. Truy cập trang tin tức
2. Xem tin tức
4. Đọc chi tiết tin tức
**Postcondition:** Tin tức được hiển thị 

### UC010: Xem trang Về chúng tôi
**Actor:** Khách vãng lai, Người dùng
**Mô tả:** Xem trang giới thiệu của quán 
**Precondition:** Không
**Main Flow:**
1. Truy cập trang về chúng tôi
2. Hệ thống hiển thị trang giới thiệu với hình ảnh không gian nhà hàng
3. Hiển thị nội dung giới thiệu về phong cách ẩm thực và câu chuyện thương hiệu
4. Hiển thị thông tin về đầu bếp và cam kết chất lượng phục vụ
5. Hiển thị các nút dẫn đến Đặt bàn và Xem thực đơn
**Postcondition:** Trang Về chúng tôi được hiển thị

### UC011: Chatbot hỗ trợ khách hàng
**Actor:** Khách vãng lai, Người dùng
**Mô tả:** Sử dụng chatbot AI để được hỗ trợ
**Precondition:** Đang truy cập website
**Main Flow:**
1. Nhấn biểu tượng chatbot ở góc màn hình
2. Hệ thống mở cửa sổ chat
3. Người dùng nhập câu hỏi bằng ngôn ngữ tự nhiên
4. Hệ thống phân tích ý định (NLP), truy xuất dữ liệu từ Firebase và hiển thị câu trả lời
**Postcondition:** Nhận được thông tin hỗ trợ tự động
**Exception:** Không nhận diện được ý định thì hệ thống trả lời mặc định

---

## 3. USE CASE NGƯỜI DÙNG

### UC012: Đặt bàn trực tuyến
**Actor:** Người dùng
**Mô tả:** Người dùng đặt bàn trước qua website với ngày giờ, số khách, khu vực bàn, ghi chú
**Precondition:** Đã đăng nhập
**Main Flow:**
1. Chọn "Đặt bàn" và nhập thông tin (tên, SĐT, email, ngày, giờ, số khách,...)
2. Xác nhận đặt bàn
3. Hệ thống kiểm tra tính khả dụng và lưu đặt bàn vào Firebase
**Postcondition:** Đặt bàn thành công, chờ nhân viên xác nhận
**Exception:** Bàn không còn trống thì nhân viên từ chối hoặc liên hệ 

### UC013: Đặt món mang về
**Actor:** Người dùng
**Mô tả:** Thêm món vào giỏ hàng, nhập thông tin giao hàng và xác nhận đặt hàng (COD hoặc VNPay)
**Precondition:** Đã đăng nhập, có sản phẩm trong giỏ hàng
**Main Flow:**
1. Xem giỏ hàng, chỉnh sửa số lượng, nhấn "Tiến hành thanh toán"
2. Nhập/xác nhận thông tin giao hàng, chọn COD hoặc VNPay
3. Xác nhận đặt hàng
4. Hệ thống tạo đơn hàng và hiển thị thông báo thành công
**Postcondition:** Đơn hàng mang về được tạo thành công
**Exception:** Không có

### UC014: Thanh toán trực tuyến (VNPay)
**Actor:** Người dùng, VNPAY
**Mô tả:** Thanh toán đơn hàng mang về qua cổng VNPay
**Precondition:** Đã đăng nhập, có sản phẩm trong giỏ, đã nhập thông tin giao hàng
**Main Flow:**
1. Chọn phương thức VNPay và xác nhận đặt hàng
2. Chuyển hướng đến cổng VNPay
3. Nhập thông tin thẻ
4. Xác thực thanh toán
5. Nhận kết quả thanh toán
6. Quay về trang chủ
**Postcondition:** Thanh toán thành công
**Exception:** Thanh toán thất bại

---

## 4. USE CASE STAFF

### UC015: Tạo đơn hàng
**Actor:** Nhân viên phục vụ
**Mô tả:** Tạo đơn hàng mới cho khách tại bàn
**Precondition:** Bàn đã được đặt, đã đăng nhập với quyền Nhân viên phục vụ
**Main Flow:**
1. Chọn bàn đang phục vụ
2. Chọn món, nhập số lượng và xác nhận tạo đơn
3. Hệ thống tạo đơn hàng, gửi đến bếp và cập nhật trạng thái bàn
**Postcondition:** Đơn hàng mới được tạo và gửi đến bếp
**Exception:** Không có

### UC016: Duyệt và xử lý đơn hàng
**Actor:** Nhân viên phục vụ
**Mô tả:** Nhân viên duyệt đơn, hoàn thành đơn
**Precondition:** Đã đăng nhập với quyền Nhân viên phục vụ, có đơn hàng trong hệ thống
**Main Flow:**
1. Nhân viên chọn tab Quản lý đơn hàng
2. Nhân viên xem chi tiết đơn và thực hiện: Duyệt, hoàn thành, từ chối
3. Hệ thống cập nhật trạng thái đơn
**Postcondition:** Đơn hàng được duyệt/ hủy
**Exception:** Khi hủy đơn phải nhập lý do

### UC017: Xử lý đặt bàn
**Actor:** Nhân viên phục vụ
**Mô tả:** Nhân viên phục vụ xử lý đặt bàn của khách (đặt online hoặc khách đến trực tiếp).
**Precondition:** Đã đăng nhập vào hệ thống
**Main Flow:**
1. Xem sơ đồ bàn và trạng thái bàn
2. Xử lý đặt bàn trực tuyến (xác nhận, gán bàn, hủy)
3. Tạo đặt bàn cho khách walk-in
4. Gán bàn cho khách
5. Cập nhật trạng thái bàn
**Postcondition:** Đặt bàn được xử lý và trạng thái bàn được cập nhật.
**Exception:** Không còn bàn trống thì hiển thị cảnh báo

### UC018: Xử lý đơn hàng tại bếp
**Actor:** Đầu bếp
**Mô tả:** Đầu bếp xem đơn hàng theo trạng thái, cập nhật trạng thái chế biến 
**Precondition:** Đã đăng nhập với quyền Đầu bếp, có đơn hàng mới
**Main Flow:**
1. Đầu bếp chọn Đơn hàng bếp và xem danh sách theo tab trạng thái
2. Đầu bếp chọn đơn, xem chi tiết món và số lượng
3. Đầu bếp bắt đầu chế biến hoặc đánh dấu hoàn thành 
**Postcondition:** Trạng thái đơn hàng tại bếp được cập nhật
**Exception:** Không có

### UC019: Thanh toán đơn hàng
**Actor:** Thu ngân
**Mô tả:** Thu ngân xử lý thanh toán cho đơn hàng  
**Precondition:** Đơn hàng trạng thái READY, đã đăng nhập
**Main Flow:**
1. Xem dashboard thanh toán và danh sách đơn chờ thanh toán
2. Chọn đơn, xem chi tiết và xác nhận thanh toán
3. Hệ thống cập nhật đơn thành COMPLETED
**Postcondition:** Đơn hàng được thanh toán

---

## 5. USE CASE QUẢN TRỊ VIÊN (ADMIN)
### UC020: Xem dashboard thống kê
**Actor:** Quản trị viên
**Mô tả:** Xem tổng quan thống kê hệ thống
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Truy cập Dashboard
2. Xem thống kê doanh thu theo ngày, tuần, tháng
3. Xem doanh thu online, offline
4. Xem Top món bán chạy
**Postcondition:** Dashboard được hiển thị

### UC021: Quản lý bàn ăn
**Actor:** quản trị viên
**Mô tả:** Quản trị viên quản lý danh sách và thông tin các bàn ăn trong nhà hàng.
**Precondition:** Đã đăng nhập vào hệ thống
**Main Flow:**
1. Thêm bàn mới
2. Sửa, xóa bàn (nếu cần)
3. Xem trạng thái bàn
4. Xem sơ đồ bàn
**Postcondition:** Thông tin bàn ăn được cập nhật trong hệ thống.

### UC022: Quản lý đơn hàng
**Actor:** Quản trị viên
**Mô tả:** Quản lý các đơn hàng
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Xem danh sách đơn hàng
2. Xem chi tiết đơn hàng
**Postcondition:** Quản lý đơn hàng thành công

### UC023: Quản lý thực đơn
**Actor:** Quản trị viên
**Mô tả:** Quản lý danh sách thực đơn
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Xem danh sách món ăn
2. Thêm món mới, thêm danh mục mới
3. Sửa, xóa món ăn (nếu cần)
**Postcondition:** Thực đơn được cập nhật

### UC024: Quản lý nhân viên
**Actor:** Quản trị viên
**Mô tả:** Quản lý danh sách nhân viên
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Xem danh sách nhân viên
2. Thêm, sửa thông tin hoặc khóa/mở khóa tài khoản nhân viên
**Postcondition:** Thông tin nhân viên được cập nhật

### UC025: Quản lý đánh giá
**Actor:** Quản trị viên
**Mô tả:** Quản lý đánh giá của người dùng
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Xem danh sách các đánh giá
2. Xem nội dung đánh giá
3. Xóa đánh giá (nếu cần)
**Postcondition:** Quản lý đánh giá được xuất thành công

### UC026: Cấu hình chatbot
**Actor:** Quản trị viên
**Mô tả:** Quản lý cấu hình nội dung mặc định của chatbot 
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Thay đổi thông tin câu trả lời của chatbot
**Postcondition:** Cấu hình chatbot được cập nhật

### UC027: Quản lý tin tức
**Actor:** Quản trị viên
**Mô tả:** Quản nội dung tin tức và bài viết
**Precondition:** Đã đăng nhập với quyền Quản trị viên
**Main Flow:**
1. Xem danh sách tất cả các tin tức
2. Thêm tin tức mới 
3. Chỉnh sửa tin tức hiện có 
4. Xóa tin tức (nếu cần)
**Postcondition:** Quản lý tin tức được xuất thành công









