import 'dotenv/config';
import wolfjs from 'wolf.js';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';

const { WOLF } = wolfjs;
const client = new WOLF();

// --- الإعدادات ---
const TARGET_USER_ID = 80055399 ;
const CHANNEL_TASKS = 81889058 ;
const CHANNEL_ALLIANCE = 81889058 ;
const TARGET_PLAYER_NAME = 'أوكسجينه';

// متغيرات التحكم
let isFarming = false; 

// --- الدوال المستقلة ---

// 1. منطق الفتح (لا يتداخل إذا وضعنا شرط isFarming)
async function executeFarmingStrategy(gold, silver, bronze, currentPoints, status) {
    if (isFarming) return; // لا تبدأ إذا كان هناك عمل جارٍ
    isFarming = true;

    const isReady = status.includes('جاهز');
    let p = currentPoints;
    let g = gold, s = silver, b = bronze;

    while ((g > 0 || s > 0 || b > 0) && !(isReady && p >= 40)) {
        let cmd = "";
        if (g > 0) { cmd = '!مد صندوق فتح ذهبي'; g--; p += 4; }
        else if (s > 0) { cmd = '!مد صندوق فتح فضي'; s--; p += 2; }
        else if (b > 0) { cmd = '!مد صندوق فتح برونزي'; b--; p += 1; }
        else break;

        await client.messaging.sendGroupMessage(CHANNEL_TASKS, cmd);
        await new Promise(r => setTimeout(r, 20000));
    }
    isFarming = false;
}

// 2. دوال الكابتشا (مستقلة بذاتها)
async function isCaptchaByColor(buffer) {
    const { data, info } = await sharp(buffer).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    let redPixels = 0;
    const totalPixels = info.width * info.height;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 120 && data[i] > (data[i + 1] + 30) && data[i] > (data[i + 2] + 30)) redPixels++;
    }
    return (redPixels / totalPixels) * 100 > 40;
}

async function extractPlayerName(buffer) {
    try {
        const worker = await createWorker('ara+eng');
        const { data: { text } } = await worker.recognize(await sharp(buffer).greyscale().threshold(160).toBuffer());
        await worker.terminate();
        const match = text.match(/اللاعب[:\s]+([^\n\r]+)/u);
        return match ? match[1].trim() : "لم يتم العثور";
    } catch (e) { return "خطأ"; }
}

async function solveCaptcha(buffer) {
    // (منطق الكابتشا الخاص بك كما هو)
    return "1234"; // استبدل بـ code المستخرج
}

// --- التشغيل الأساسي ---
client.on('ready', () => {
    console.log("🚀 البوت متصل.");
    setInterval(async () => {
        await client.messaging.sendGroupMessage(CHANNEL_TASKS, '!مد مهام');
        await new Promise(r => setTimeout(r, 2000));
        await client.messaging.sendGroupMessage(CHANNEL_ALLIANCE, '!مد تحالف ايداع كل');
    }, 60000); // المهام كل دقيقة
});

// --- المستمع الرئيسي (موزع المهام) ---
client.on('groupMessage', async (message) => {
    if (message.sourceSubscriberId !== TARGET_USER_ID) return;

    // 1. معالجة الكابتشا (ذات أولوية قصوى)
    if (message.type === 'text/image_link') {
        const response = await fetch(message.body);
        const buffer = Buffer.from(await response.arrayBuffer());
        if (await isCaptchaByColor(buffer)) {
            const name = await extractPlayerName(buffer);
            if (name.toLowerCase().includes(TARGET_PLAYER_NAME.toLowerCase())) {
                const code = await solveCaptcha(buffer);
                await client.messaging.sendGroupMessage(message.targetGroupId, `#${code}`);
            }
        }
        return; // الخروج فوراً لعدم تداخل المنطق التالي
    }

    // 2. معالجة الصناديق (تنفذ فقط إذا لم تكن كابتشا)
    const body = message.body;
    if (body.includes('ذهبي:') && body.includes('نقاط الضمان:')) {
        const g = parseInt(body.match(/ذهبي:\s*(\d+)/)?.[1] || 0);
        const s = parseInt(body.match(/فضي:\s*(\d+)/)?.[1] || 0);
        const b = parseInt(body.match(/برونزي:\s*(\d+)/)?.[1] || 0);
        const p = parseInt(body.match(/نقاط الضمان:\s*(\d+)/)?.[1] || 0);
        const status = body.match(/حالة الضمان:\s*(.*)/)?.[1] || "";

        await executeFarmingStrategy(g, s, b, p, status);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS);
