const { VNPay } = require('vnpay');

const VNP_RETURN_URL = 'https://aintosushi.netlify.app/vnpay_return.html';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
  const ipAddr = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || event.headers['x-client-ip'] || '127.0.0.1';

  const vnpay = new VNPay({
    tmnCode,
    secureSecret: secret,
    testMode: true,
    hashAlgorithm: 'SHA512',
  });

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: Math.round(amount),
    vnp_IpAddr: ipAddr,
    vnp_TxnRef,
    vnp_OrderInfo: 'Thanh toan don hang ' + vnp_TxnRef,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: 'vn',
  });

  return jsonResponse(200, { paymentUrl });
};
