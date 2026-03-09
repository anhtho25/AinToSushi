/**
 * AI Chatbot với NLP - Ain Tō Sushi
 * Phát hiện ý định (intent): menu, giá, giờ mở cửa, địa chỉ, đặt bàn.
 */
(function () {
    'use strict';

    const CONFIG = {
        restaurantName: 'Ain Tō Sushi',
        address: '123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh',
        openingHours: '10:00 - 22:00 (tất cả các ngày trong tuần)',
        phone: '1900 xxxx hoặc 0908 210 770',
        reservationUrl: 'reservation.html',
        menuUrl: 'menu.html'
    };

    const FIREBASE_BASE = 'https://ain-to-sushi-default-rtdb.asia-southeast1.firebasedatabase.app';
    const FIREBASE_MENU_URL = FIREBASE_BASE + '/menu/menuOnline.json';
    const FIREBASE_CHATBOT_CONFIG_URL = FIREBASE_BASE + '/chatbot/config.json';
    const FIREBASE_CONVERSATIONS_PATH = 'chatbot/conversations';

    var botConfig = { openingHours: CONFIG.openingHours, address: CONFIG.address, phone: CONFIG.phone };

    function loadBotConfig() {
        fetch(FIREBASE_CHATBOT_CONFIG_URL)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data && typeof data === 'object') {
                    if (data.openingHours != null) botConfig.openingHours = data.openingHours;
                    if (data.address != null) botConfig.address = data.address;
                    if (data.phone != null) botConfig.phone = data.phone;
                }
            })
            .catch(function () {});
    }

    function getSessionId() {
        var key = 'chatbotSessionId';
        try {
            var id = localStorage.getItem(key);
            if (id) return id;
            id = 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
            localStorage.setItem(key, id);
            return id;
        } catch (e) {
            return 's' + Date.now();
        }
    }

    function saveChatToFirebase(sessionId, userText, botText) {
        var url = FIREBASE_BASE + '/' + FIREBASE_CONVERSATIONS_PATH + '/' + encodeURIComponent(sessionId) + '.json';
        fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (existing) {
                var messages = (existing && existing.messages) ? existing.messages : [];
                var t = Date.now();
                messages.push({ from: 'user', text: userText, time: t });
                messages.push({ from: 'bot', text: botText.replace(/<[^>]+>/g, ''), time: t + 1 });
                return fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify({ messages: messages, updatedAt: t + 1 }),
                    headers: { 'Content-Type': 'application/json' }
                });
            })
            .catch(function () {});
    }

    // Chuẩn hóa tiếng Việt: bỏ dấu, lowercase
    function normalizeText(str) {
        if (!str || typeof str !== 'string') return '';
        const map = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'À': 'a', 'Á': 'a', 'Ả': 'a', 'Ã': 'a', 'Ạ': 'a', 'Ă': 'a', 'Ằ': 'a', 'Ắ': 'a', 'Ẳ': 'a', 'Ẵ': 'a', 'Ặ': 'a', 'Â': 'a', 'Ầ': 'a', 'Ấ': 'a', 'Ẩ': 'a', 'Ẫ': 'a', 'Ậ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y', 'đ': 'd'
        };
        let s = str.toLowerCase().trim();
        return s.split('').map(c => map[c] || c).join('').replace(/\s+/g, ' ');
    }

    // Các mẫu từ khóa / cụm cho từng intent (đã chuẩn hóa)
    const INTENT_PATTERNS = {
        menu: [
            'menu', 'thuc don', 'thực đơn', 'mon an', 'món ăn', 'cho xem', 'xem menu', 'co mon', 'có món',
            'co sushi', 'có sushi', 'sushi', 'maki', 'sashimi', 'com', 'cơm', 'salad', 'do uong', 'đồ uống',
            'quan co', 'quán có', 'co ban', 'có bán', 'danh sach mon', 'danh sách món', 'cac mon', 'các món'
        ],
        price: [
            'gia', 'giá', 'bao nhieu', 'bao nhiêu', 'tien', 'tiền', 'tam bao nhieu', 'tầm bao nhiêu',
            'gia bao nhieu', 'giá bao nhiêu', 'sushi ca hoi', 'sushi cá hồi', 'ca hoi', 'cá hồi',
            'gia mon', 'giá món', 'bang gia', 'bảng giá', 'don gia', 'đơn giá'
        ],
        opening_hours: [
            'gio', 'giờ', 'mo cua', 'mở cửa', 'dong cua', 'đóng cửa', 'may gio', 'mấy giờ',
            'hoat dong', 'hoạt động', 'phuc vu', 'phục vụ', 'ban ngay', 'ban đêm', 'thu may', 'thứ mấy'
        ],
        address: [
            'dia chi', 'địa chỉ', 'o dau', 'ở đâu', 'duong', 'đường', 'quan', 'quận', 'thanh pho', 'thành phố',
            'toa do', 'tọa độ', 'di nhu the nao', 'đi như thế nào', 'chi duong', 'chỉ đường'
        ],
        reservation: [
            'dat ban', 'đặt bàn', 'con ban', 'còn bàn', 'ban cho', 'bàn cho', 'nguoi', 'người',
            'cho 2', 'cho 4', 'cho 6', 'ban truoc', 'đặt trước', 'reservation', 'cho toi dat', 'cho tôi đặt',
            'con ban khong', 'còn bàn không', 'dat truoc', 'đặt trước'
        ]
    };

    function detectIntent(text) {
        const n = normalizeText(text);
        if (!n) return { intent: 'unknown', score: 0 };

        let best = { intent: 'unknown', score: 0 };
        for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
            let score = 0;
            for (const p of patterns) {
                if (n.includes(p)) score += p.length;
                if (n === p) score += 10;
            }
            if (score > best.score) best = { intent, score };
        }
        return best;
    }

    function formatPrice(num) {
        if (num == null || num === '') return '—';
        const n = Number(num);
        if (isNaN(n)) return String(num);
        return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
    }

    let menuCache = null;
    let menuCacheTime = 0;
    const CACHE_TTL = 60000;

    function getMenuFromFirebase() {
        return new Promise(function (resolve) {
            if (menuCache && (Date.now() - menuCacheTime < CACHE_TTL)) {
                resolve(menuCache);
                return;
            }
            fetch(FIREBASE_MENU_URL)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    const list = !data || typeof data !== 'object' ? [] : Object.entries(data).map(function (e) { return { id: e[0], ...e[1] }; });
                    menuCache = list;
                    menuCacheTime = Date.now();
                    resolve(list);
                })
                .catch(function () { resolve(menuCache || []); });
        });
    }

    function buildResponse(intent, userText, menuList) {
        var cfg = botConfig;
        var n = normalizeText(userText);
        switch (intent) {
            case 'menu': {
                if (!menuList || menuList.length === 0) {
                    return 'Hiện tại tôi chưa lấy được thực đơn. Bạn vui lòng xem trực tiếp tại <a href="' + CONFIG.menuUrl + '" target="_blank">Thực đơn</a> nhé.';
                }
                const byCat = {};
                menuList.forEach(function (m) {
                    const c = (m.category || 'Khác').trim();
                    if (!byCat[c]) byCat[c] = [];
                    byCat[c].push(m.name || m.title || 'Món');
                });
                const lines = ['Thực đơn ' + CONFIG.restaurantName + ' gồm các nhóm:\n'];
                Object.keys(byCat).sort().forEach(function (c) {
                    lines.push('• ' + c + ': ' + (byCat[c].slice(0, 5).join(', ')) + (byCat[c].length > 5 ? '...' : ''));
                });
                lines.push('\nXem đầy đủ tại <a href="' + CONFIG.menuUrl + '" target="_blank">Thực đơn</a>.');
                return lines.join('\n');
            }
            case 'price': {
                if (!menuList || menuList.length === 0) {
                    return 'Tôi chưa lấy được bảng giá. Bạn xem tại <a href="' + CONFIG.menuUrl + '" target="_blank">Thực đơn</a> nhé.';
                }
                const nameLower = n.replace(/gia|giá|bao nhieu|tiền|tam|bang|don/gi, '').trim();
                const matches = menuList.filter(function (m) {
                    const t = normalizeText((m.name || m.title || ''));
                    return t && (t.includes(nameLower) || nameLower.split(/\s+/).every(function (w) { return w.length < 2 || t.includes(w); }));
                });
                if (matches.length === 0) {
                    const sample = menuList.slice(0, 3).map(function (m) {
                        return (m.name || m.title) + ': ' + formatPrice(m.price);
                    }).join('\n');
                    return 'Bạn có thể nói rõ tên món (ví dụ: "Sushi cá hồi giá bao nhiêu?"). Một vài món:\n' + sample + '\nXem hết tại <a href="' + CONFIG.menuUrl + '" target="_blank">Thực đơn</a>.';
                }
                const reply = matches.slice(0, 5).map(function (m) {
                    return '• ' + (m.name || m.title) + ': ' + formatPrice(m.price);
                }).join('\n');
                return reply;
            }
            case 'opening_hours':
                return 'Giờ mở cửa: ' + (cfg.openingHours || CONFIG.openingHours) + '.';
            case 'address':
                return 'Địa chỉ: ' + (cfg.address || CONFIG.address) + '.';
            case 'phone':
                return 'Số điện thoại: ' + (cfg.phone || CONFIG.phone) + '.';
            case 'reservation':
                return 'Bạn có thể đặt bàn trực tuyến tại <a href="' + CONFIG.reservationUrl + '" target="_blank">Đặt bàn</a>, hoặc gọi điện để chúng tôi xếp chỗ cho bạn.';
            default:
                return 'Xin chào! Tôi có thể giúp bạn: xem menu, hỏi giá món, giờ mở cửa, địa chỉ, số điện thoại, hoặc đặt bàn. Bạn muốn hỏi gì?';
        }
    }

    function createWidget() {
        const wrap = document.createElement('div');
        wrap.id = 'chatbot-wrap';
        wrap.className = 'chatbot-wrap';
        wrap.innerHTML =
            '<button type="button" id="chatbot-toggle" class="chatbot-toggle" aria-label="Mở chatbot">💬</button>' +
            '<div id="chatbot-panel" class="chatbot-panel" aria-hidden="true">' +
            '  <div class="chatbot-header">' +
            '    <span class="chatbot-title">' + CONFIG.restaurantName + ' – Trợ lý</span>' +
            '    <button type="button" id="chatbot-close" class="chatbot-close" aria-label="Đóng">×</button>' +
            '  </div>' +
            '  <div class="chatbot-messages" id="chatbot-messages"></div>' +
            '  <div class="chatbot-input-wrap">' +
            '    <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Nhập câu hỏi..." autocomplete="off">' +
            '    <button type="button" id="chatbot-send" class="chatbot-send" aria-label="Gửi">Gửi</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(wrap);

        const panel = document.getElementById('chatbot-panel');
        const toggle = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const messagesEl = document.getElementById('chatbot-messages');
        const inputEl = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        function appendMessage(text, isUser) {
            const div = document.createElement('div');
            div.className = 'chatbot-msg ' + (isUser ? 'chatbot-msg-user' : 'chatbot-msg-bot');
            const inner = document.createElement('div');
            inner.className = 'chatbot-msg-inner';
            inner.innerHTML = text.replace(/\n/g, '<br>');
            div.appendChild(inner);
            messagesEl.appendChild(div);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function setLoading(on) {
            sendBtn.disabled = on;
            sendBtn.textContent = on ? '...' : 'Gửi';
        }

        function openPanel() {
            panel.setAttribute('aria-hidden', 'false');
            wrap.classList.add('chatbot-open');
            inputEl.focus();
        }

        function closePanel() {
            panel.setAttribute('aria-hidden', 'true');
            wrap.classList.remove('chatbot-open');
        }

        toggle.addEventListener('click', function () {
            if (wrap.classList.contains('chatbot-open')) closePanel(); else openPanel();
        });
        closeBtn.addEventListener('click', closePanel);

        function send() {
            var text = (inputEl.value || '').trim();
            if (!text) return;
            inputEl.value = '';
            appendMessage(text, true);
            setLoading(true);
            getMenuFromFirebase().then(function (menuList) {
                var intent = detectIntent(text).intent;
                var reply = buildResponse(intent, text, menuList);
                setTimeout(function () {
                    appendMessage(reply, false);
                    setLoading(false);
                    saveChatToFirebase(getSessionId(), text, reply);
                }, 400);
            });
        }

        sendBtn.addEventListener('click', send);
        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); send(); }
        });

        appendMessage('Xin chào! Tôi là trợ lý của ' + CONFIG.restaurantName + '. Bạn có thể hỏi về menu, giá món, giờ mở cửa, địa chỉ, số điện thoại hoặc đặt bàn.', false);
    }

    function init() {
        if (document.getElementById('chatbot-wrap')) return;
        loadBotConfig();
        createWidget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
