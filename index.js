import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const ROOM_ID = 569;

// الحسابات
const accounts = [
    { email: process.env.U_MAIL_1, password: process.env.U_PASS_1 },
    { email: process.env.U_MAIL_2, password: process.env.U_PASS_2 },
    { email: process.env.U_MAIL_3, password: process.env.U_PASS_3 },
    { email: process.env.U_MAIL_4, password: process.env.U_PASS_4 },
    { email: process.env.U_MAIL_5, password: process.env.U_PASS_5 },
    { email: process.env.U_MAIL_6, password: process.env.U_PASS_6 },
    { email: process.env.U_MAIL_7, password: process.env.U_PASS_7 },
    { email: process.env.U_MAIL_8, password: process.env.U_PASS_8 },
    { email: process.env.U_MAIL_9, password: process.env.U_PASS_9 },
    { email: process.env.U_MAIL_10, password: process.env.U_PASS_10 },
    { email: process.env.U_MAIL_11, password: process.env.U_PASS_11 },
    { email: process.env.U_MAIL_12, password: process.env.U_PASS_12 },
    { email: process.env.U_MAIL_13, password: process.env.U_PASS_13 }
].filter(acc => acc.email && acc.password);

function sendCommands(client, accountNumber) {

    client.messaging.sendGroupMessage(
        ROOM_ID,
        '!مغامرة قتال'
    );

    console.log(`[الحساب ${accountNumber}] تم إرسال !مغامرة قتال`);

    setTimeout(() => {

        client.messaging.sendGroupMessage(
            ROOM_ID,
            '!مغامرة تحالف ايداع كل'
        );

        console.log(
            `[الحساب ${accountNumber}] تم إرسال !مغامرة تحالف ايداع كل`
        );

    }, 3000);
}

accounts.forEach((account, index) => {

    setTimeout(() => {

        const client = new WOLF();

        client.on('ready', () => {

            console.log(
                `✅ تم تسجيل دخول الحساب ${index + 1}`
            );

            // تشغيل أول مرة
            sendCommands(client, index + 1);

            // تكرار كل 3 دقائق و4 ثواني
            setInterval(() => {
                sendCommands(client, index + 1);
            }, 184000);
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

    }, index * 2000); // تأخير ثانيتين بين الحسابات
});

console.log(
    `🚀 بدء تشغيل ${accounts.length} حساب`
);
