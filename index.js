'use strict';
import 'dotenv/config';

const info = {
    key: process.env.TOKEN,
    name: process.env.NAME,
};
fetch('https://h-api.jielong.co/api/CheckIn/EditRecord', {
    method: 'POST',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: info.key,
        date: new Date().toUTCString(),
        host: 'h-api.jielong.co',
    },
    body: JSON.stringify({
        Id: 0,
        ThreadId: process.env.THREADID,
        Number: '',
        Signature: info.name,
        RecordValues: [],
        DateTarget: '',
        IsNeedManualAudit: false,
        MinuteTarget: -1,
        IsNameNumberComfirm: false,
        IsInvisible: false,
        IsAllowInvisible: true,
        IsCurrentUser: true,
    }),
})
    .then(res => res.json())
    .then(res => {
        const jwt = jwtDecode(info.key.split(' ')[1]);
        const time = `有效期：${getTime(jwt.payload.iat)} 至 ${getTime(jwt.payload.exp)}`;
        const content = {
            name: info.name,
            time: time,
            ...res,
        };
        console.log(JSON.stringify(content, null, 4));
        pushMsg(`${res['Type'] === '000001' ? '打卡成功' : '打卡失败'} 有效期至: ${getTime(jwt.payload.exp)}`, JSON.stringify(content, null, 4));
    });

// 推送消息
function pushMsg(title, content) {
    const token = process.env.PUSH_TOKEN;
    const url = 'https://cx.super4.cn/push_msg';
    fetch(`${url}?appkey=${token}&title=${title}&content=${content}`, { method: 'GET' });
}

// 解密 jwt
function jwtDecode(token) {
    const base64UrlDecode = str => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(base64, 'base64');
        return buffer.toString('utf-8');
    };
    const [header, payload, signature] = token.split('.');

    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature,
    };
}

// 转化时间
function getTime(date) {
    const time = new Date(date * 1000);
    return `${time.getMonth() + 1}-${time.getDate()} ${time.getHours() + 8}:${time.getMinutes()}`;
}
