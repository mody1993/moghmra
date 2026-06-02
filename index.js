import 'dotenv/config';
import wolfjs from 'wolf.js';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';

const { WOLF } = wolfjs;
const client = new WOLF();

const TARGET_USER_ID = 80055399;
const CHANNEL_ID = 81889058;
const ALLOWED_PLAYERS = ['أوكسجينه', 'أوكسجيته', 'أوكسجيئه'];

let globalTimer = 0;

// --- الدوال الأساسية (بدون تغيير) ---
async function isCaptchaByColor(buffer) { /* ... نفس الكود السابق ... */ }
async function extractPlayerName(buffer) { /* ... نفس الكود السابق ... */ }
async function solveCaptcha(buffer) { /* ... نفس الكود السابق ... */ }

// --- المعالجة الرئيسية للكابتشا ---
client.on('groupMessage', async (message) => {
    if (message.sourceSubscriberId != TARGET_USER_ID || message.targetGroupId != CHANNEL_ID || message.type !== 'text/image_link') return;
    try {
        const response = await fetch(message.body);
        const buffer = Buffer.from(await response.arrayBuffer());
        if (!(await isCaptchaByColor(buffer))) return;
        const playerName = await extractPlayerName(buffer);
        if (ALLOWED_PLAYERS.some(n => playerName.includes(n))) {
            const code = await solveCaptcha(buffer);
            if (code) await client.messaging.sendGroupMessage(CHANNEL_ID, `#${code}`);
        }
    } catch (err) { console.error("⚠️ خطأ كابتشا:", err.message); }
});

// --- وظيفة فحص الصناديق (معدلة لترجع Promise) ---
const sendBoxCommand = () => {
    return new Promise((resolve) => {
        client.messaging.sendGroupMessage(CHANNEL_ID, '!مد صندوق');
        
        const responseHandler = (message) => {
            if (message.targetGroupId == CHANNEL_ID && message.body.startsWith('/me 📦 حالة الصناديق')) {
                const matchA = message.body.match(/حالة الضمان:\s*(.*)/);
                const matchB = message.body.match(/الجهاز الزمني:\s*(.*)/);
                const a = matchA ? matchA[1].trim() : "";
                const b = matchB ? matchB[1].trim() : "";

                let tempTimer = 0;
                if (b.includes("غير نشط")) {
                    if (!a.includes("غير جاهز")) {
                        client.messaging.sendGroupMessage(CHANNEL_ID, '!مد صندوق ضمان وقت');
                        tempTimer = 3 * 60 * 60;
                    }
                } else {
                    const h = b.match(/(\d+)س/);
                    const m = b.match(/(\d+)د/);
                    const s = b.match(/(\d+)ث/);
                    if (h) tempTimer += parseInt(h[1]) * 3600;
                    if (m) tempTimer += parseInt(m[1]) * 60;
                    if (s) tempTimer += parseInt(s[1]);
                }
                
                globalTimer = tempTimer;
                console.log(`⏱ تم تحديث التايمر إلى: ${globalTimer} ثانية`);
                client.removeListener('groupMessage', responseHandler);
                resolve(); // إبلاغ الدالة بأننا انتهينا من التحديث
            }
        };

        client.on('groupMessage', responseHandler);
        // تأمين إضافي: إذا لم تصل رسالة خلال 10 ثواني، تابع العمل
        setTimeout(() => {
            client.removeListener('groupMessage', responseHandler);
            resolve();
        }, 10000);
    });
};

// --- حلقة المهام ---
const startTaskLoop = async () => {
    while (true) {
        try {
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مد مهام');
            await new Promise(resolve => setTimeout(resolve, 2000));
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مد تحالف ايداع كل');

            if (globalTimer > 0) {
                // تكرار كل دقيقة (64 ثانية)
                globalTimer = Math.max(0, globalTimer - 64);
                console.log(`⏳ التايمر يقل: ${globalTimer} ثانية متبقية.`);
                await new Promise(resolve => setTimeout(resolve, 64000));
                
                // إذا وصل للصفر بعد الخصم، نحدث البيانات
                if (globalTimer === 0) {
                    console.log("⏱ انتهى التايمر، جاري التحديث...");
                    await sendBoxCommand();
                }
            } else {
                // إذا كان 0 أصلاً، ننتظر 5 دقائق (306 ثانية) ونحدث البيانات
                console.log("⏳ التايمر 0، انتظار 306 ثانية للتحديث.");
                await new Promise(resolve => setTimeout(resolve, 306000));
                await sendBoxCommand();
            }
        } catch (err) {
            console.error("⚠️ خطأ في الحلقة:", err.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

client.on('ready', async () => {
    console.log("🚀 البوت يعمل الآن");
    
    // 1. انتظار التحديث الأول للتايمر قبل بدء أي شيء
    await sendBoxCommand();
    
    // 2. تحديث دوري كل 30 دقيقة
    setInterval(sendBoxCommand, 30 * 60 * 1000);

    // 3. بدء الحلقة (سيبدأ الآن والتايمر لديه قيمة صحيحة)
    startTaskLoop();
});

client.login(process.env.U_MAIL, process.env.U_PASS);
