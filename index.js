// بوت مغامرة مدمج
// يبدأ بالكود الثاني ساعة، ثم الكود الأول ساعة، ويتكرر
// دورة السحب والشراء أصبحت كل 61 دقيقة
// في CODE2 أصبح القتال 4 مرات بدل 3 مرات
// في دورة 61 دقيقة صار بين كل حساب وحساب 3 ثواني

import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;


// ==========================
// الإعدادات العامة
// ==========================

// قناة الكود الثاني الموحدة
// في ساعة CODE2 كل الحسابات ترسل في هذه القناة فقط
const CODE2_ROOM_ID = 569;

// مدة كل وضع
// 60 * 60 * 1000 = ساعة كاملة
const MODE_DURATION = 60 * 60 * 1000;

// دورة السحب والشراء
// كانت 31 دقيقة، وتم تعديلها إلى 61 دقيقة
const PURCHASE_INTERVAL = 61 * 60 * 1000;

// الفاصل بين كل حساب وحساب في دورة السحب والشراء
// يعني الحساب 1 يبدأ، بعده الحساب 2 بعد 3 ثواني، وهكذا
const PURCHASE_ACCOUNT_DELAY = 3000;

// شراء 3 كل للحساب الأول فقط كل 3 دقائق
const SHIELD_INTERVAL = 3 * 60 * 1000;


// ==========================
// الحسابات
// ==========================
// roomId هنا تستخدم فقط في ساعة CODE1
// أما ساعة CODE2 فكل الحسابات تستخدم CODE2_ROOM_ID
// إذا تبي تغير غرفة حساب معين في CODE1 غير roomId فقط

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

// هنا يتم تخزين كل حساب بعد تسجيل الدخول
const bots = [];

// عدد الحسابات التي دخلت بنجاح
let readyCount = 0;

// يبدأ التشغيل بالكود الثاني أولًا
let currentMode = 'CODE2';

// مؤقتات الوضع الحالي فقط
// هذه تنحذف عند التبديل بين CODE1 و CODE2
let modeTimers = [];

// مؤقتات الأوامر المستمرة
// هذه لا تنحذف عند التبديل
let continuousTimers = [];


// ==========================
// أدوات مساعدة
// ==========================

// إضافة مؤقت مرة واحدة خاص بالوضع الحالي
function addModeTimeout(callback, delay) {
    const timer = setTimeout(callback, delay);
    modeTimers.push(timer);
    return timer;
}

// إضافة مؤقت متكرر خاص بالوضع الحالي
function addModeInterval(callback, delay) {
    const timer = setInterval(callback, delay);
    modeTimers.push(timer);
    return timer;
}

// حذف مؤقتات الوضع الحالي عند التبديل
function clearModeTimers() {
    for (const timer of modeTimers) {
        clearTimeout(timer);
        clearInterval(timer);
    }

    modeTimers = [];
}

// تحديد الغرفة حسب الوضع الحالي
function getRoom(account) {
    // في CODE2 كل الحسابات تروح لنفس القناة
    if (currentMode === 'CODE2') {
        return CODE2_ROOM_ID;
    }

    // في CODE1 كل حساب يروح لغرفته الخاصة
    return account.roomId;
}

// إرسال أمر للقناة مع طباعة في الكونسول
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
// هذه الأوامر تشتغل في CODE1 و CODE2
// ولا تتوقف عند التبديل بين الوضعين

function startContinuousCommands() {
    console.log('✅ تم تشغيل الأوامر المستمرة');

    // ==========================
    // دورة السحب والشراء كل 61 دقيقة
    // ==========================
    // كل حساب يرسل:
    // 1- !مغامرة تحالف سحب ذهب 750000
    // 2- بعد 3 ثواني يرسل !مغامرة شراء 10
    // وبين كل حساب وحساب 3 ثواني

    const runPurchaseCycle = () => {
        bots.forEach((bot, index) => {
            setTimeout(() => {
                const startCycle = () => {
                    sendCommand(bot, '!مغامرة تحالف سحب ذهب 750000');

                    setTimeout(() => {
                        sendCommand(bot, '!مغامرة شراء 10');
                    }, 3000);
                };

                // إذا الحساب حاليًا في حالة إيداع
                // ينتظر لين يخلص الإيداع ثم يبدأ دورة السحب والشراء
                if (bot.depositInProgress) {
                    console.log(
                        `[الحساب ${bot.index + 1}] انتظار انتهاء الإيداع قبل دورة 61 دقيقة`
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
            }, index * PURCHASE_ACCOUNT_DELAY);
        });
    };

    // أول تشغيل مباشر بعد دخول كل الحسابات
    runPurchaseCycle();

    // تكرار دورة السحب والشراء كل 61 دقيقة
    continuousTimers.push(
        setInterval(runPurchaseCycle, PURCHASE_INTERVAL)
    );

    // ==========================
    // الحساب الأول فقط يرسل شراء 3 كل
    // ==========================

    const firstBot = bots[0];

    if (firstBot) {
        const runShield = () => {
            sendCommand(firstBot, '!مغامرة تحالف شراء 3 كل');
        };

        // أول تشغيل مباشر
        runShield();

        // تكرار كل 3 دقائق
        continuousTimers.push(
            setInterval(runShield, SHIELD_INTERVAL)
        );
    }
}


// ==========================
// CODE2
// ==========================
// في هذا الوضع كل الحسابات تلعب في قناة واحدة فقط
// القناة هي CODE2_ROOM_ID
// هذا الوضع يبدأ أولًا ويستمر ساعة

function startCode2Mode() {
    currentMode = 'CODE2';

    console.log('🚀 بدأ وضع الكود الثاني لمدة ساعة');
    console.log(`📌 كل الحسابات الآن تلعب في القناة ${CODE2_ROOM_ID}`);

    const runCentralCycle = () => {
        if (currentMode !== 'CODE2') return;

        console.log('🔁 بداية دورة الكود الثاني من الحساب 1');

        // تشغيل الحسابات بالتتابع
        // بين كل حساب وحساب 3 ثواني
        bots.forEach((bot, index) => {
            addModeTimeout(() => {
                runCode2AccountCycle(bot, index);
            }, index * 3000);
        });

        // حساب وقت إعادة الدورة:
        // آخر حساب يبدأ بعد: (عدد الحسابات - 1) * 3 ثواني
        // داخل كل حساب الإيداع صار بعد 14 ثانية
        // بعد آخر حساب ننتظر 10 ثواني ثم نعيد الدورة
        const restartDelay =
            (bots.length - 1) * 3000 + 14000 + 10000;

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

    // نحدد أن الحساب دخل مرحلة إيداع/دورة
    // حتى دورة 61 دقيقة لا تتداخل معه
    bot.depositInProgress = true;

    // الحساب الأول فقط يسحب ذهب كبير ويرسل تعزيز
    if (index === 0) {
        sendCommand(bot, '!مغامرة تحالف سحب ذهب 30000000');

        addModeTimeout(() => {
            if (currentMode !== 'CODE2') return;
            sendCommand(bot, '!مغامرة تعزيز');
        }, 3000);
    }

    // كل الحسابات ترسل قتال 4 مرات
    // تم تعديلها من 3 مرات إلى 4 مرات

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

    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;
        sendCommand(bot, '!مغامرة قتال', '(قتال 4)');
    }, 12000);

    // بعد القتال الرابع يرسل إيداع كل
    addModeTimeout(() => {
        if (currentMode !== 'CODE2') return;

        sendCommand(bot, '!مغامرة تحالف ايداع كل');

        // بعد ثانيتين نعتبر الإيداع انتهى
        bot.depositInProgress = false;

    }, 14000);
}


// ==========================
// CODE1
// ==========================
// في هذا الوضع كل حساب يرجع لقناته الخاصة من accounts
// كل حساب يرسل قتال ثم بعد 3 ثواني إيداع كل
// وتتكرر الدورة كل 3 دقائق و3 ثواني

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

                // بعد ثانيتين نعتبر الإيداع انتهى
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
// التبديل بين CODE2 و CODE1
// ==========================
// يبدأ بـ CODE2
// بعد ساعة ينتقل إلى CODE1
// بعد ساعة يرجع CODE2
// ويتكرر بهذا الشكل

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
// كل حساب يدخل بفاصل ثانيتين عن الحساب الذي قبله
// التشغيل لا يبدأ إلا بعد دخول كل الحسابات بنجاح

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
