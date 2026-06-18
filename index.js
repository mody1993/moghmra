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

// ==========================
// تشغيل كل حساب بفاصل ثانيتين
// ==========================
accounts.forEach((account, index) => {
    setTimeout(() => {
        const client = new WOLF();

        client.on('ready', () => {
            console.log(`✅ تم تسجيل دخول الحساب ${index + 1}`);

            let depositInProgress = false;

            // ==========================
            // الدورة الجديدة
            // ==========================
            const sendCommands = () => {
                depositInProgress = true;

                // الحساب الأول فقط يسحب 5,000,000
                if (index === 0) {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف سحب ذهب 5000000'
                    );

                    console.log('[الحساب 1] تم إرسال !مغامرة تحالف سحب ذهب 5000000');
                }

                // الحساب الأول فقط يرسل تعزيز بعد 3 ثواني
                if (index === 0) {
                    setTimeout(() => {
                        client.messaging.sendGroupMessage(
                            account.roomId,
                            '!مغامرة تعزيز'
                        );

                        console.log('[الحساب 1] تم إرسال !مغامرة تعزيز');
                    }, 3000);
                }

                // كل الحسابات ترسل قتال 3 مرات
                // أول قتال بعد 6 ثواني
                setTimeout(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة قتال'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال قتال 1`);
                }, 6000);

                // ثاني قتال بعده بثانيتين
                setTimeout(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة قتال'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال قتال 2`);
                }, 8000);

                // ثالث قتال بعده بثانيتين
                setTimeout(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة قتال'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال قتال 3`);
                }, 10000);

                // كل الحسابات ترسل إيداع كل بعد القتال
                setTimeout(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف ايداع كل'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة تحالف ايداع كل`);

                    // بعد ثانيتين نعتبر الإيداع انتهى
                    setTimeout(() => {
                        depositInProgress = false;
                    }, 2000);

                }, 12000);
            };

            // ==========================
            // دورة 31 دقيقة
            // كما هي بدون تغيير
            // ==========================
            const send31MinCommands = () => {
                const startPurchaseCycle = () => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف سحب ذهب 25000'
                    );

                    console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة تحالف سحب ذهب 25000`);

                    // بعد 3 ثواني يرسل شراء 10
                    setTimeout(() => {
                        client.messaging.sendGroupMessage(
                            account.roomId,
                            '!مغامرة شراء 10'
                        );

                        console.log(`[الحساب ${index + 1}] تم إرسال !مغامرة شراء 10`);
                    }, 3000);
                };

                // إذا كان فيه إيداع شغال ينتظر لين ينتهي
                if (depositInProgress) {
                    console.log(`[الحساب ${index + 1}] انتظار انتهاء الإيداع قبل السحب`);

                    const waitInterval = setInterval(() => {
                        if (!depositInProgress) {
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

            // تشغيل الدورة الجديدة بفاصل 3 ثواني بين كل حساب
            setTimeout(() => {
                sendCommands();
            }, 13000 + index * 3000);

            // تكرار الدورة بعد آخر حساب بـ 10 ثواني
            const cycleDelay =
                (accounts.length - 1) * 3000 + 12000 + 10000;

            setInterval(() => {
                sendCommands();
            }, cycleDelay);

            // تكرار دورة 31 دقيقة
            setInterval(() => {
                send31MinCommands();
            }, 1860000);

            // ==========================
            // الحساب الأول فقط - شراء الدرع
            // كما هو بدون تغيير
            // ==========================
            if (index === 0) {
                client.messaging.sendGroupMessage(
                    account.roomId,
                    '!مغامرة تحالف شراء 3 كل'
                );

                console.log('[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل');

                // تكرار شراء الدرع كل 3 دقائق
                setInterval(() => {
                    client.messaging.sendGroupMessage(
                        account.roomId,
                        '!مغامرة تحالف شراء 3 كل'
                    );

                    console.log('[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل');
                }, 180000);
            }
        });

        client.on('error', (err) => {
            console.error(`❌ خطأ في الحساب ${index + 1}:`, err);
        });

        console.log(`⏳ جاري تسجيل دخول الحساب ${index + 1}`);

        client.login(
            account.email,
            account.password
        );

    }, index * 2000);
});

console.log(`🚀 بدء تشغيل ${accounts.length} حساب`);
