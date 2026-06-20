// بوت مغامرة مدمج
// يبدأ بالكود الثاني ساعة، ثم الكود الأول ساعة، ويتكرر
// دورة 31 دقيقة وشراء 3 كل مستمرة دائمًا

import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

// ==========================
// الإعدادات العامة
// ==========================

// قناة الكود الثاني الموحدة
const CODE2_ROOM_ID = 569;

// مدة كل وضع: ساعة
const MODE_DURATION = 60 * 60 * 1000;

// دورة 31 دقيقة
const PURCHASE_INTERVAL = 31 * 60 * 1000;

// شراء 3 كل للحساب الأول فقط كل 3 دقائق
const SHIELD_INTERVAL = 3 * 60 * 1000;

// ==========================
// الحسابات
// roomId هنا تستخدم في ساعة الكود الأول فقط
// أما ساعة الكود الثاني فكل الحسابات تستخدم CODE2_ROOM_ID
// ==========================
const accounts = [
    { email: process.env.U_MAIL_1, password: process.env.U_PASS_1, roomId: 569 },
    { email: process.env.U_MAIL_2, password: process.env.U_PASS_2, roomId: 569 },
    { email: process.env.U_MAIL_3, password: process.env.U_PASS_3, roomId: 569 },
    { email: process.env.U_MAIL_4, password: process.env.U_PASS_4, roomId: 569 },
    { email: process.env.U_MAIL_5, password: process.env.U_PASS_5, roomId: 569 },
    { email: process.env.U_MAIL_6, password: process.env.U_PASS_6, roomId: 569 },
    { email: process.env.U_MAIL_7, password: process.env.U_PASS_7, roomId: 5757 },
    { email: process.env.U_MAIL_8, password: process.env.U_PASS_8, roomId: 5757 },
    { email: process.env.U_MAIL_9, password: process.env.U_PASS_9, roomId: 5757 },
    { email: process.env.U_MAIL_10, password: process.env.U_PASS_10, roomId: 5755 },
    { email: process.env.U_MAIL_11, password: process.env.U_PASS_11, roomId: 5757 },
    { email: process.env.U_MAIL_12, password: process.env.U_PASS_12, roomId: 569 },
    { email: process.env.U_MAIL_13, password: process.env.U_PASS_13, roomId: 569 },
    { email: process.env.U_MAIL_14, password: process.env.U_PASS_14, roomId: 569 }
].filter(acc => acc.email && acc.password);

// ==========================
// المتغيرات العامة
// ==========================

const bots = [];

let readyCount = 0;

// يبدأ بالكود الثاني أولًا
let currentMode = 'CODE2';

// مؤقتات الوضع الحالي فقط
// عند التبديل من كود لكود نحذفها حتى لا تتداخل الأوامر
let modeTimers = [];

// مؤقتات الأوامر المستمرة
// هذه لا تنحذف عند التبديل
let continuousTimers = [];

// ==========================
// أدوات مساعدة
// ==========================

function addModeTimeout(callback, delay) {
    const timer = setTimeout(callback, delay);
    modeTimers.push(timer);
    return timer;
}

function addModeInterval(callback, delay) {
    const timer = setInterval(callback, delay);
    modeTimers.push(timer);
    return timer;
}

function clearModeTimers() {
    for (const timer of modeTimers) {
        clearTimeout(timer);
        clearInterval(timer);
    }

    modeTimers = [];
}

// تحديد الغرفة حسب الوضع الحالي
function getRoom(account) {
    if (currentMode === 'CODE2') {
        return CODE2_ROOM_ID;
    }

    return account.roomId;
}

// إرسال آمن مع طباعة في الكونسول
function sendCommand(bot, command, label = '') {
    const roomId = getRoom(bot.account);

    bot.client.messaging.sendGroupMessage(roomId, command);

    console.log(
        `[الحساب ${bot.index + 1}] تم إرسال ${command} إلى الغرفة ${roomId} ${label}`
    );
}

// ==========================
// الأوامر المستمرة دائمًا
// ==========================

function startContinuousCommands() {
    console.log('✅ تم تشغيل الأوامر المستمرة');

    // دورة 31 دقيقة لكل الحسابات
    const runPurchaseCycle = () => {
        bots.forEach((bot) => {
            const startCycle = () => {
                sendCommand(bot, '!مغامرة تحالف سحب ذهب 25000');

                setTimeout(() => {
                    sendCommand(bot, '!مغامرة شراء 10');
                }, 3000);
            };

            // إذا الحساب حاليًا يودع، ننتظر انتهاء الإيداع
            if (bot.depositInProgress) {
                console.log(
                    `[الحساب ${bot.index + 1}] انتظار انتهاء الإيداع قبل دورة 31 دقيقة`
                );

                const wait = setInterval(() => {
                    if (!bot.depositInProgress) {
                        clearInterval(wait);
                        startCycle();
                    }
                }, 1000);

                return;
            }

            startCycle();
        });
    };

    // أول تشغيل مباشر
    runPurchaseCycle();

    continuousTimers.push(
        setInterval(runPurchaseCycle, PURCHASE_INTERVAL)
    );

    // الحساب الأول فقط شراء 3 كل
    const firstBot = bots[0];

    if (firstBot) {
        const runShield = () => {
            sendCommand(firstBot, '!مغامرة تحالف شراء 3 كل');
        };

        // أول تشغيل مباشر
        runShield();

        continuousTimers.push(
            setInterval(runShield, SHIELD_INTERVAL)
        );
    }
}

// ==========================
// الكود الثاني
// كل الحسابات في قناة واحدة فقط
// ==========================

function startCode2Mode() {
    currentMode = 'CODE2';

    console.log('🚀 بدأ وضع الكود الثاني لمدة ساعة');
    console.log(`📌 كل الحسابات الآن تلعب في القناة ${CODE2_ROOM_ID}`);

    const runCentralCycle = () => {
        if (currentMode !== 'CODE2') return;

        console.log('🔁 بداية دورة الكود الثاني من الحساب 1');

        bots.forEach((bot, index) => {
            addModeTimeout(() => {
                runCode2AccountCycle(bot, index);
            }, index * 3000);
        });

        // بعد انتهاء آخر حساب من الإيداع ينتظر 10 ثواني ثم يعيد الدورة
        const restartDelay =
            (bots.length - 1) * 3000 + 12000 + 10000;

        addModeTimeout(() => {
            if (currentMode !== 'CODE2') return;

            console.log('✅ انتهت دورة الكود الثاني، إعادة الدورة');
            runCentralCycle();
        }, restartDelay);
    };

    runCentralCycle();
}

function runCode2AccountCycle(bot, index) {
    if (currentMode !== 'CODE2') return;

    bot.depositInProgress = true;

    // الحساب الأول فقط يسحب 5 مليون ثم يرسل تعزيز
    if (index === 0) {
        sendCommand(bot, '!مغامرة تحالف سحب ذهب 5000000');

        addModeTimeout(() => {
            if (currentMode !== 'CODE2') return;
            sendCommand(bot, '!مغامرة تعزيز');
        }, 3000);
    }

    // كل الحسابات ترسل قتال 3 مرات
    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;
        sendCommand(bot, '!مغامرة قتال', '(قتال 1)');
    }, 6000);

    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;
        sendCommand(bot, '!مغامرة قتال', '(قتال 2)');
    }, 8000);

    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;
        sendCommand(bot, '!مغامرة قتال', '(قتال 3)');
    }, 10000);

    // الإيداع بعد القتال
    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;

        sendCommand(bot, '!مغامرة تحالف ايداع كل');

        addModeTimeout(() => {
            bot.depositInProgress = false;
        }, 2000);

    }, 12000);
}

// ==========================
// الكود الأول
// كل حساب يرجع لقناته الخاصة
// ==========================

function startCode1Mode() {
    currentMode = 'CODE1';

    console.log('🚀 بدأ وضع الكود الأول لمدة ساعة');
    console.log('📌 كل حساب الآن يلعب في قناته الخاصة من accounts');

    const runCode1Cycle = () => {
        if (currentMode !== 'CODE1') return;

        bots.forEach((bot) => {
            bot.depositInProgress = true;

            sendCommand(bot, '!مغامرة قتال');

            addModeTimeout(() => {
                if (currentMode !== 'CODE1') return;

                sendCommand(bot, '!مغامرة تحالف ايداع كل');

                addModeTimeout(() => {
                    bot.depositInProgress = false;
                }, 2000);

            }, 3000);
        });
    };

    // أول تشغيل مباشر
    runCode1Cycle();

    // تكرار كل 3 دقائق و3 ثواني
    addModeInterval(runCode1Cycle, 183000);
}

// ==========================
// التبديل بين الكودين كل ساعة
// ==========================

function startModeSwitcher() {
    // يبدأ بالكود الثاني
    startCode2Mode();

    setInterval(() => {
        console.log('🔄 تبديل الوضع الآن');

        // حذف مؤقتات الوضع السابق فقط
        clearModeTimers();

        // تصفير حالة الإيداع عند التبديل
        bots.forEach(bot => {
            bot.depositInProgress = false;
        });

        if (currentMode === 'CODE2') {
            startCode1Mode();
        } else {
            startCode2Mode();
        }

    }, MODE_DURATION);
}

// ==========================
// تسجيل دخول الحسابات
// ==========================

accounts.forEach((account, index) => {
    setTimeout(() => {
        const client = new WOLF();

        const bot = {
            client,
            account,
            index,
            depositInProgress: false
        };

        bots[index] = bot;

        client.on('ready', () => {
            console.log(`✅ تم تسجيل دخول الحساب ${index + 1}`);

            readyCount++;

            // لا يبدأ التشغيل إلا بعد دخول كل الحسابات
            if (readyCount === accounts.length) {
                console.log('✅ جميع الحسابات دخلت بنجاح');

                startContinuousCommands();
                startModeSwitcher();
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
