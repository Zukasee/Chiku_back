const TelegramBot = require('node-telegram-bot-api');

const token = '6984909198:AAGtZby86Y2y7Oav9c5tw9APtUVGfvFoGPs';

const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Received your message');
});