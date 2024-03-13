export function jwt(token) {
    const base64UrlDecode = str => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(base64, 'base64');
        return buffer.toString('utf-8');
    };
    const [header, payload, signature] = token.match('eyJ0e(.*)$')[0].split('.');

    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature,
    };
}

export function pushMsg(title, content) {
    const token = process.env.PUSH_TOKEN;
    if (!token) throw new Error('请设置 PUSH_TOKEN');
    const url = 'https://cx.super4.cn/push_msg';
    fetch(`${url}?appkey=${token}&title=${title}&content=${content}`, { method: 'GET' });
}
