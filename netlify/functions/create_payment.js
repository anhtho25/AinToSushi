const crypto = require('crypto');

const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = 'https://aintosushi.netlify.app/vnpay_return.html';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function pad2(n) {
  return n.toString().padStart(2, '0');
}

// VNPAY yêu cầu GMT+7 (Vietnam)
function buildCreateDate() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const vn = new Date(utc + 7 * 60 * 60 * 1000);
  return (
    vn.getFullYear().toString() +
    pad2(vn.getMonth() + 1) +
    pad2(vn.getDate()) +
    pad2(vn.getHours()) +
    pad2(vn.getMinutes()) +
    pad2(vn.getSeconds())
  );
}

function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  const secret = (process.env.VNP_HASH_SECRET || '').trim();
  const tmnCode = (process.env.VNP_TMN_CODE || '').trim();
  if (!secret || !tmnCode) {
    return jsonResponse(500, { error: 'VNP_HASH_SECRET or VNP_TMN_CODE not configured' });
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonResponse(400, { error: 'Missing or invalid amount' });
  }

  const orderId = body.orderId ? String(body.orderId).trim() : '';
  const returnUrl = orderId ? VNP_RETURN_URL + '?orderId=' + encodeURIComponent(orderId) : VNP_RETURN_URL;

  const vnp_TxnRef = 'ORDER_' + Date.now();
  const vnp_CreateDate = buildCreateDate();
  // Thời gian hết hạn: GMT+7, thường = CreateDate + 15 phút (VNPAY bắt buộc)
  const vnDate = new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 7 * 60) * 60000);
  vnDate.setMinutes(vnDate.getMinutes() + 15);
  const vnp_ExpireDate =
    vnDate.getFullYear().toString() +
    pad2(vnDate.getMonth() + 1) +
    pad2(vnDate.getDate()) +
    pad2(vnDate.getHours()) +
    pad2(vnDate.getMinutes()) +
    pad2(vnDate.getSeconds());

  const params = {
    vnp_Amount: Math.round(amount) * 100,
    vnp_Command: 'pay',
    vnp_CreateDate: vnp_CreateDate,
    vnp_CurrCode: 'VND',
    vnp_ExpireDate: vnp_ExpireDate,
    vnp_IpAddr: event.headers['x-forwarded-for']?.split(',')[0]?.trim() || event.headers['x-client-ip'] || '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan don hang ' + vnp_TxnRef,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Version: '2.1.0',
  };

  const sortedKeys = Object.keys(params).sort();
  // Chuỗi ký = đúng query string gửi lên VNPAY (encoded, space = + như PHP)
  // VNPAY verify bằng cách lấy query nhận được và so HMAC.
  function urlEncode(str) {
    return encodeURIComponent(str).replace(/%20/g, '+');
  }
  const queryString = sortedKeys
    .map((k) => k + '=' + urlEncode(String(params[k])))
    .join('&');
  const hashData = queryString;

  let vnp_SecureHash;
  const useLegacyHash = process.env.VNP_LEGACY_HASH === '1' || process.env.VNP_LEGACY_HASH === 'true';
  if (useLegacyHash) {
    // Một số merchant cũ: SHA512(secret + hashData)
    vnp_SecureHash = crypto.createHash('sha512').update(secret + hashData, 'utf8').digest('hex');
  } else {
    // VNPay 2.1.0 chuẩn: HMAC-SHA512(key=secret, data=hashData)
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(hashData, 'utf8');
    vnp_SecureHash = hmac.digest('hex');
  }

  const paymentUrl = VNP_URL + '?' + queryString + '&vnp_SecureHash=' + vnp_SecureHash;

  return jsonResponse(200, { paymentUrl });
};
