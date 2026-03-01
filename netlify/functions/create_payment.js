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

function buildCreateDate() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds())
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

  const secret = process.env.VNP_HASH_SECRET;
  const tmnCode = process.env.VNP_TMN_CODE;
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

  const vnp_TxnRef = 'ORDER_' + Date.now();
  const vnp_CreateDate = buildCreateDate();

  const params = {
    vnp_Amount: Math.round(amount) * 100,
    vnp_Command: 'pay',
    vnp_CreateDate: vnp_CreateDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: event.headers['x-forwarded-for']?.split(',')[0]?.trim() || event.headers['x-client-ip'] || '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan don hang ' + vnp_TxnRef,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Version: '2.1.0',
  };

  const sortedKeys = Object.keys(params).sort();
  const queryParts = sortedKeys.map((k) => k + '=' + encodeURIComponent(params[k]));
  const queryString = queryParts.join('&');

  // VNPay Sandbox thường dùng SHA512(secret + queryString), không phải HMAC-SHA512
  const signData = secret + queryString;
  const vnp_SecureHash = crypto.createHash('sha512').update(signData, 'utf8').digest('hex');

  const paymentUrl = VNP_URL + '?' + queryString + '&vnp_SecureHash=' + vnp_SecureHash;

  return jsonResponse(200, { paymentUrl });
};
