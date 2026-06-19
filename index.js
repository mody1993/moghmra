مغامرة معزز

import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

// ==========================
// الحسابات + رقم الغرفة لكل حساب
// ==========================
const accounts = [
    { email: process.env.U_MAIL_1, password: process.env.U_PASS_1, roomId: 569 },
    { email: process.env.U_MAIL_2, password: process.env.U_PASS_2, roomId: 569 },
    { email: process.env.U_MAIL_3, password: process.env.U_PASS_3, roomId: 569 },
    { email: process.env.U_MAIL_4, password: process.env.U_PASS_4, roomId: 569 },
    { email: process.env.U_MAIL_5, password: process.env.U_PASS_5, roomId: 569 },
    { email: process.env.U_MAIL_6, password: process.env.U_PASS_6, roomId: 569 },
    { email: process.env.U_MAIL_7, password: process.env.U_PASS_7, roomId: 569 },
    { email: process.env.U_MAIL_8, password: process.env.U_PASS_8, roomId: 569 },
    { email: process.env.U_MAIL_9, password: process.env.U_PASS_9, roomId: 569 },
    { email: process.env.U_MAIL_10, password: process.env.U_PASS_10, roomId: 569 },
    { email: process.env.U_MAIL_11, password: process.env.U_PASS_11, roomId: 569 },
    { email: process.env.U_MAIL_12, password: process.env.U_PASS_12, roomId: 569 },
    { email: process.env.U_MAIL_13, password: process.env.U_PASS_13, roomId: 569 },
    { email: process.env.U_MAIL_14, password: process.env.U_PASS_14, roomId: 569 }
].filter(acc => acc.email && acc.password);

// نخزن هنا كل الحسابات بعد تسجيل الدخول
const bots = [];

let readyCount = 0;
let centralCycleStarted = false;

// ==========================
// تشغيل دورة القتال المركزية
// ==========================
function startCentralCycle() {
    if (centralCycleStarted) return;
    centralCycleStarted = true;

    console.log('🚀 بدأت الدورة المركزية للحسابات');

    const runCycle = () => {
        console.log('🔁 بداية دورة جديدة من الحساب 1');

        bots.forEach((bot, index) => {
            // كل حساب يبدأ بعد الحساب السابق بـ 3 ثواني
            setTimeout(() => {
                runAccountCycle(bot, index);
            }, index * 3000);
        });

        // وقت انتهاء آخر حساب:
        // فرق الحسابات + وقت وصول آخر حساب للإيداع + انتظار 10 ثواني
        const restartDelay =
            (bots.length - 1) * 3000 + 12000 + 10000;

        setTimeout(() => {
            console.log('✅ آخر حساب أرسل الإيداع، انتظار 10 ثواني انتهى، إعادة الدورة');
            runCycle();
        }, restartDelay);
    };

    runCycle();
}

// ==========================
// دورة الحساب الواحد
// ==========================
function runAccountCycle(bot, index) {
    const { client, account } = bot;

    bot.depositInProgress = true;

    // الحساب الأول فقط يسحب 5,000,000
    if (index === 0) {
        client.messaging.sendGroupMessage(
            account.roomId,
            '!مغامرة تحالف سحب ذهب 5000000'
        );

        console.log('[الحساب 1] تم إرسال !مغامرة تحالف سحب ذهب 5000000');

        // الحساب الأول فقط يرسل تعزيز بعد 3 ثواني
        setTimeout(() => {
            client.messaging.sendGroupMessage(
                account.roomId,
                '!مغامرة تعزيز'
            );

            console.log('[الحساب 1] تم إرسال !مغامرة تعزيز');
        }, 3000);
    }

    // كل الحسابات ترسل قتال 3 مرات
    setTimeout(() => {
        client.messaging.sendGroupMessage(account.roomId, '!مغامرة قتال');
        console.log(`[الحساب ${index + 1}] تم إرسال قتال 1`);
    }, 6000);

    setTimeout(() => {
        client.messaging.sendGroupMessage(account.roomId, '!مغامرة قتال');
        console.log(`[الحساب ${index + 1}] تم إرسال قتال 2`);
    }, 8000);

    setTimeout(() => {
        client.messaging.sendGroupMessage(account.roomId, '!مغامرة قتال');
        console.log(`[الحساب ${index + 1}] تم إرسال قتال 3`);
    }, 10000);

    // كل الحسابات ترسل إيداع بعد القتال
    setTimeout(() => {
        client.messaging.sendGroupMessage(
            account.roomId,
            '!مغامرة تحالف ايداع كل'
        );

        console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة تحالف ايداع كل`);

        setTimeout(() => {
            bot.depositInProgress = false;
        }, 2000);

    }, 12000);
}

// ==========================
// تشغيل الحسابات
// ==========================
accounts.forEach((account, index) => {
    setTimeout(() => {
        const client = new WOLF();

        const bot = {
            client,
            account,
            depositInProgress: false
        };

        bots[index] = bot;

        client.on('ready', () => {
            console.log(`✅ تم تسجيل دخول الحساب ${index + 1}`);

            readyCount++;

            // ==========================
            // دورة 31 دقيقة كما هي
            // ==========================
            const send31MinCommands = () => {
                const startPurchaseCycle = () => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف سحب ذهب 25000'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة تحالف سحب ذهب 25000`);

                    setTimeout(() => {
                        client.messaging.sendGroupMessage(
                            account.roomId,
                            '!مغامرة شراء 10'
                        );

                        console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة شراء 10`);
                    }, 3000);
                };

                // إذا كان الحساب في إيداع، ينتظر لين يخلص
                if (bot.depositInProgress) {
                    console.log(`[الحساب ${index + 1}] انتظار انتهاء الإيداع قبل دورة 31 دقيقة`);

                    const waitInterval = setInterval(() => {
                        if (!bot.depositInProgress) {
                            clearInterval(waitInterval);
                            startPurchaseCycle();
                        }
                    }, 1000);

                    return;
                }

                startPurchaseCycle();
            };

            // أول تشغيل لدورة 31 دقيقة
            send31MinCommands();

            // تكرار دورة 31 دقيقة
            setInterval(() => {
                send31MinCommands();
            }, 1860000);

            // ==========================
            // الحساب الأول فقط - شراء الدرع
            // ==========================
            if (index === 0) {
                client.messaging.sendGroupMessage(
                    account.roomId,
                    '!مغامرة تحالف شراء 3 كل'
                );

                console.log('[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل');

                setInterval(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف شراء 3 كل'
                    );

                    console.log('[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل');
                }, 180000);
            }

            // لا تبدأ الدورة المركزية إلا بعد دخول كل الحسابات
            if (readyCount === accounts.length) {
                startCentralCycle();
            }
        });

        client.on('error', (err) => {
            console.error(`❌ خطأ في الحساب ${index + 1}:`, err);
        });

        console.log(`⏳ جاري تسجيل دخول الحساب ${index + 1}`);

        client.login(account.email, account.password);

    }, index * 2000);
});

console.log(`🚀 بدء تشغيل ${accounts.length} حساب`);
