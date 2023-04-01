//? Bot = telegraf_toplearn_bot

// require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

// const { TOKEN } = process.env;

//? Create the bot
const myBot = new Telegraf(tOKEN);

// myBot.use((ctx) => {
//     // console.log(ctx);
//     ctx.reply(ctx.message.text);
// });

myBot.start((ctx) => {
    ctx.reply("خوش آمدی به آرزگوند");
});

myBot.help((ctx) => {
    ctx.reply(`دستورات \n /start : خوش آمد گویی`);
});

//? Update Types
myBot.on("sticker", (ctx) => {
    ctx.reply("هه هه استیکر میفرستی");
});
myBot.on("voice", (ctx) => {
    ctx.reply("هه هه ویس میفرستی");
});
myBot.on("text", (ctx) => {
    ctx.reply("هه هه متن میفرستی");
});
myBot.on("location", (ctx) => {
    ctx.reply("هه هه لوکیشن وای خدا ");
});
myBot.on("document", (ctx) => {
    ctx.reply("هه هه داکیومنت واسه چی");
});

// myBot.on("message", (ctx) => {
//     ctx.reply("من پیام نمی پذیرم فقط دستور");
// });

//? Custom Command
myBot.command("sayHi", (ctx) => {
    ctx.reply(`سلام ${ctx.message.text.split(" ")[1]}`);
});

//? Hear Command
myBot.hears("messi", (ctx) => {
    ctx.reply("بهترین مکان برای یادگیری");
});

myBot.command("todos", async (ctx) => {
    const todos = await axios.get("https://jsonplaceholder.ir/todos");
    ctx.reply(todos.data[1]);
});

//? Launch Bot
myBot.launch();
