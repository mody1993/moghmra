import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;
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
        roomId: 17441122
    },
    {
        email: process.env.U_MAIL_4,
        password: process.env.U_PASS_4,
        roomId: 330865
    },
    {
        email: process.env.U_MAIL_5,
        password: process.env.U_PASS_5,
        roomId: 330865
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
        roomId: 330865
    },
    {
        email: process.env.U_MAIL_9,
        password: process.env.U_PASS_9,
        roomId: 330865
    },
    {
        email: process.env.U_MAIL_10,
        password: process.env.U_PASS_10,
        roomId: 330865
    },
    {
        email: process.env.U_MAIL_11,
        password: process.env.U_PASS_11,
        roomId: 11066287
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
function sendCommands(client, accountNumber, roomId) {
    client.messaging.sendGroupMessage(
        roomId,
        '!مغامرة قتال'
    );
    console.log(
        `[الحساب ${accountNumber}] تم إرسال !مغامرة قتال إلى الغرفة ${roomId}`
    );
    setTimeout(() => {
        client.messaging.sendGroupMessage(
            roomId,
            '!مغامرة تحالف ايداع كل'
        );
        console.log(
            `[الحساب ${accountNumber}] تم إرسال !مغامرة تحالف ايداع كل إلى الغرفة ${roomId}`
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
            sendCommands(
                client,
                index + 1,
                account.roomId
            );
            setInterval(() => {
                sendCommands(
                    client,
                    index + 1,
                    account.roomId
                );
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
    }, index * 2000);
});
console.log(
    `🚀 بدء تشغيل ${accounts.length} حساب`
);
