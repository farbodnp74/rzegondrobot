//? Bot = telegraf_toplearn_bot
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// const mongoose = require('mongoose');
const schedule = require('node-schedule');

// const scrapedModel = require('./model');

/*const output = [{
    title: 'آ س پ',
    date: '۱۴۰۱/۰۵/۱۵',
    url: 'https://rahavard365.com/asset/583/%d8%a2-%d8%b3-%d9%be',
    strategy: 'فروش',
    percent: '۳٫۷۹٪',
    price: '۴٬۳۵۰',
    buyerNumberPerson: '۱۴۰',
    sellerNumberPerson: '۱۴۵',
    volumeBuyerPerson: '۲٫۸۱۶ M',
    volumeSellerPerson: '۳٫۸۱۶ M',
},
    {

    },
    {

    }];*/

async function connectDB() {
    // await mongoose.connect('mongodb://localhost:27017/scrape_rahavard');
    console.log('Connected to Database');
}

function toEnglish(persianNumber) {
    const pn = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹","٬","٫"];
    const en = ["0","1","2","3","4","5","6","7","8","9","","."];
    let cache = persianNumber;
    for(let i=0; i<12; i++) {
        let reg_fa = new RegExp(pn[i], 'g');
        cache = cache.replace(reg_fa, en[i]);
    }
    return cache;
}

async function scrapeListing(page) {

    await page.goto('https://rahavard365.com/stock');
    const html = await page.content();
    const $ = await cheerio.load(html);

    const list = $('table > tbody > tr').map((index,element) => {
        const titleElement = $(element).find('.symbol');
        const title = $(titleElement).text();
        // const url = 'https://rahavard365.com'+$(titleElement).attr('href');
        const dateElement = $(element).find('[data-type="date-time-data"]');
        const date = new Date($(dateElement).attr('data-order'));
        const percentElement = $(element).find('[data-type="real-close-price-change-percent-data"]');
        const percent = $(percentElement).attr('data-order');
        const priceElement = $(element).find('[data-type="real-close-price-data"]');
        const price = $(priceElement).attr('data-order');


        return {title, date, percent, price};

    }).get();

    return list;
}

async function scrapeOtherItem(page, listing) {

    // const result = [];
    // for(let i=0; i<3; i++) {
    //     await page.goto(listing[i].url);
    //     const html = await page.content();
    //     const $ = await cheerio.load(html);
    //     const strategy = $('#main-gauge-text').text();
    //     const buyerNumberPerson = toEnglish($('.personbuyercount').text());
    //     const sellerNumberPerson = toEnglish($('.personsellercount').text());
    //     const volumeBuyerPerson = toEnglish($('.personbuyvolume').attr('title'));
    //     const volumeSellerPerson = toEnglish($('.personsellvolume').attr('title'));
    //     listing[i].volumeSellerPerson = volumeSellerPerson;
    //     listing[i].volumeBuyerPerson = volumeBuyerPerson;
    //     listing[i].sellerNumberPerson = sellerNumberPerson;
    //     listing[i].buyerNumberPerson = buyerNumberPerson;
    //     listing[i].strategy = strategy;
    //     //console.log(listing[i]);
    //     result.push(listing[i]);
    //    /* const model = new scrapedModel({
    //         title: listing[i].title,
    //         date: listing[i].date,
    //         url: listing[i].url,
    //         strategy: listing[i].strategy,
    //         percent: listing[i].percent,
    //         price: listing[i].price,
    //         buyerNumberPerson: listing[i].buyerNumberPerson,
    //         sellerNumberPerson: listing[i].sellerNumberPerson,
    //         volumeBuyerPerson: listing[i].volumeBuyerPerson,
    //         volumeSellerPerson: listing[i].volumeSellerPerson
    //     });
    //     await model.save();*/
    //     await sleep(1000);

    // }

    // return result;

}

async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

function scheduler() {
    const job = schedule.scheduleJob('26 19 * * *', () => {
        main();
    })
}


async function main() {
    await connectDB();
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const listing = await scrapeListing(page);
    const listWithOtherItem = await scrapeOtherItem(page, listing);
    console.log(listWithOtherItem);
    console.log(listing)
    return listing
    // await scrapedModel.insertMany(listWithOtherItem);
}

main();

require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

// const { TOKEN } = process.env;

//? Create the bot
const myBot = new Telegraf('6249639845:AAFcAQwqXsrfqPTpzJpflQB7wJdCzCZLtD0');

// myBot.use((ctx) => {
//     // console.log(ctx);
//     ctx.reply(ctx.message.text);
// });

myBot.start((ctx) => {
    // ctx.reply("خوش آمدی به آرزگوند");
    ctx.telegram.sendMessage(ctx.chat.id,'خوش آمدی به آرزگوند',{
        reply_markup:{
            inline_keyboard:[
                [{
                text:"فایل شیمی فصل 11" ,callback_data:"fasleh11"
                },
                {
                    text:"فایل شیمی فصل 12" ,callback_data:"fasleh12"
                }]
            ]
        }
    })
});

myBot.action('fasleh11',(ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendChatAction(ctx.chat.id,'upload_document')
    ctx.telegram.sendDocument(ctx.chat.id,{source:"res/doc1.pdf"})
})
myBot.action('fasleh12',(ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendChatAction(ctx.chat.id,'upload_document')
    ctx.telegram.sendDocument(ctx.chat.id,{source:"res/doc2.pdf"})
})


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
    const todos = await main();
    ctx.reply(todos);
});

//? Launch Bot
myBot.launch();
