

// الحسابات + رقم الغرفة لكل حساب
const accounts = [
{
email: process.env.U_MAIL_1,
password: process.env.U_PASS_1,
roomId: 569
},
{
email: process.env.U_MAIL_2,
password: process.env.U_PASS_2,
roomId: 569
},
{
email: process.env.U_MAIL_3,
password: process.env.U_PASS_3,
roomId: 18555555
},
{
email: process.env.U_MAIL_4,
password: process.env.U_PASS_4,
roomId: 569
},
{
email: process.env.U_MAIL_5,
password: process.env.U_PASS_5,
roomId: 569
},
{
email: process.env.U_MAIL_6,
password: process.env.U_PASS_6,
roomId: 330865
},
{
email: process.env.U_MAIL_7,
password: process.env.U_PASS_7,
roomId: 330865
},
{
email: process.env.U_MAIL_8,
password: process.env.U_PASS_8,
roomId: 22271611
},
{
email: process.env.U_MAIL_9,
password: process.env.U_PASS_9,
roomId: 22271611
},
{
email: process.env.U_MAIL_10,
password: process.env.U_PASS_10,
roomId: 330865
},
{
email: process.env.U_MAIL_11,
password: process.env.U_PASS_11,
roomId: 22271611
},
{
email: process.env.U_MAIL_12,
password: process.env.U_PASS_12,
roomId: 569
},
{
email: process.env.U_MAIL_13,
password: process.env.U_PASS_13,
roomId: 569
},
{
email: process.env.U_MAIL_14,
password: process.env.U_PASS_14,
roomId: 569
}
].filter(acc => acc.email && acc.password);

accounts.forEach((account, index) => {
setTimeout(() => {
const client = new WOLF();

    client.on('ready', () => {
        console.log(
            `✅ تم تسجيل دخول الحساب ${index + 1}`
        );
        // ==========================
        // قتال + إيداع
        // ==========================
        const sendCommands = () => {
            client.messaging.sendGroupMessage(
                account.roomId,
                '!مغامرة قتال'
            );
            console.log(
                `[الحساب ${index + 1}] تم إرسال !مغامرة قتال إلى الغرفة ${account.roomId}`
            );
            setTimeout(() => {
                client.messaging.sendGroupMessage(
                    account.roomId,
                    '!مغامرة تحالف ايداع كل'
                );
                console.log(
                    `[الحساب ${index + 1}] تم إرسال !مغامرة تحالف ايداع كل إلى الغرفة ${account.roomId}`
                );
            }, 3000);
        };
        // ==========================
        // سحب ذهب + شراء 10
        // ==========================
        const send31MinCommands = () => {

    // سحب الذهب
    client.messaging.sendGroupMessage(
        account.roomId,
        '!مغامرة تحالف سحب ذهب 25000'
    );

    console.log(
        `[الحساب ${index + 1}] تم إرسال !مغامرة تحالف سحب ذهب 25000`
    );

    // بعد 3 ثوانٍ شراء 10
    setTimeout(() => {

        client.messaging.sendGroupMessage(
            account.roomId,
            '!مغامرة شراء 10'
        );

        console.log(
            `[الحساب ${index + 1}] تم إرسال !مغامرة شراء 10`
        );

        // بعد 7 ثوانٍ من شراء 10
        setTimeout(() => {
            sendCommands();
        }, 7000);

    }, 3000);
};
        // أول تشغيل
        send31MinCommands();
        // بعد 3 ثوانٍ من شراء 10

        // قتال + إيداع كل 3 دقائق و3 ثوانٍ
        setInterval(() => {
            sendCommands();
        }, 183000);
        // سحب ذهب + شراء 10 كل 31 دقيقة
        setInterval(() => {
            send31MinCommands();
        }, 1860000);
        //// الحساب الأول فقط
if (index === 0) {
    client.messaging.sendGroupMessage(
        account.roomId,
        '!مغامرة تحالف شراء 3 كل'
    );

    console.log(
        '[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل'
    );

    setInterval(() => {
        client.messaging.sendGroupMessage(
            account.roomId,
            '!مغامرة تحالف شراء 3 كل'
        );

        console.log(
            '[الحساب 1] تم إرسال !مغامرة تحالف شراء 3 كل'
        );
    }, 180000);
}
    });
    client.on('error', (err) => {
        console.error(
            `❌ خطأ في الحساب ${index + 1}:`,
            err
        );
    });
    console.log(
        `⏳ جاري تسجيل دخول الحساب ${index + 1}`
    );
    client.login(
        account.email,
        account.password
    );
}, index * 2000);

});

console.log(
    `🚀 بدء تشغيل ${accounts.length} حساب`
);
