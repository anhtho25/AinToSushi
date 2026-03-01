const crypto = require('crypto');

function getQueryFromEvent(event) {
  const q = event.queryStringParameters || {};
  if (event.httpMethod === 'POST' && event.body) {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      return { ...q, ...body };
    } catch {
      const pairs = (event.body || '').split('&');
      pairs.forEach((p) => {
        const [k, v] = p.split('=').map((s) => decodeURIComponent(s || ''));
        if (k) q[k] = v;
      });
      return q;
    }
  }
  return q;
}

function verifySecureHash(params, secret) {
  const secureHash = params.vnp_SecureHash;
  const secureHashType = params.vnp_SecureHashType;
  if (!secureHash) return false;

  const filtered = { ...params };
  delete filtered.vnp_SecureHash;
  delete filtered.vnp_SecureHashType;

  const sortedKeys = Object.keys(filtered).sort();
  const queryParts = sortedKeys.map((k) => k + '=' + (filtered[k] ?? ''));
  const queryString = queryParts.join('&');

  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(queryString);
  const expected = hmac.digest('hex');
  return expected === secureHash;
}

exports.handler = async (event, context) => {
  const secret = process.env.VNP_HASH_SECRET;
  if (!secret) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ RspCode: '99', Message: 'Internal error' }),
    };
  }

  const params = getQueryFromEvent(event);
  const isValid = verifySecureHash(params, secret);

  if (!isValid) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ RspCode: '97', Message: 'Invalid checksum' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ RspCode: '00', Message: 'Confirm Success' }),
  };
};
