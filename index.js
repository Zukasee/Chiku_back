const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const webAppUrl = 'https://chiku-shavarma.netlify.app';

const token = '6984909198:AAGtZby86Y2y7Oav9c5tw9APtUVGfvFoGPs';

const app = express()

app.use(express.json())
app.use(cors())


const bot = new TelegramBot(token, {polling: true});
const userArtem = 1315400828
const userCanser = 1232347839

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text

  if (text === '/start') {
    // await bot.sendMessage(chatId, 'df', {
    //     reply_markup: {
    //         keyboard: [
    //             [{text: chatId, web_app: {url: webAppUrl }}]
    //         ]
    //     }
    // })

    await bot.sendMessage(chatId, 'Добро пожаловать в кафе от Чику через Telegram бот!', {
      reply_markup: {
          inline_keyboard: [
              [{text: 'сделать заказ', web_app: {url: webAppUrl}}]
          ]
      }
  })

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      console.log(data)
      bot.sendMessage(chatId, 'Поздавляю с покупкой')
    } catch (e) {
      console.log(e)
  }
  }
}
});

app.post('/', async (req,res) => {
  const {userName, userPhone, comment, order, queryId} = req.body
  let userMessage = userName + ' ваш заказ:\n\n'
    try {
      for (const index in order) {
        if (order.hasOwnProperty(index)) {
          const item = order[index]

          const itemName = item.name
          const itemQuantity = item.quantity
          const itemOptions = item.options[item.optionIndex]

          if (itemOptions) {
            const itemSecondName = itemOptions.name
            const itemCoast = itemOptions.coast

            userMessage += ` ${itemName} ${itemSecondName} ${itemQuantity} шт, по цене ${itemCoast} р\n`
          }  else {
            userMessage += `${itemName} - ошибка в опциях\n`;
          }

        }
      }

      userMessage += `\nпринят и будет готов через 15 минут\nСпасибо что выбираете шаурму у Чику!!!`



      await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'упешный заказ',
        input_message_content: {message_text: userMessage}
      })
      await bot.sendMessage(userArtem, 'НОВЫЙ ЗАКАЗ!')
      await bot.sendMessage(userArtem, userMessage)
      return res.status(200).json({})
    } catch {
      await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Не удалось приобрести товар',
        input_message_content: {message_text:'Не удалось приобрести товар' + userName}
      })
      return res.status(500).json({})
  }
})


const PORT = 8000
app.listen(PORT, () => console.log('server strart on port' + PORT))