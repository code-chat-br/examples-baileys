const makeWaSocket = require('@adiwajshing/baileys').default
const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys')
const { checkPath } = require('./utils/check.js')
const P = require('pino')
const { unlink } = require('fs')
const { chatBot } = require('./examples/examples.js')
const { chatStorage } = require('./store/storeChat.js')

/* folders where the authentication files will be saved */
const pathMD = './sessionsMD/'

/* authentication file name */
const fileAuth = 'auth_info.json'

/**
 * @param {import('@adiwajshing/baileys').BaileysEventEmitter} sock
 */
const connectionUpdate = (sock) => {
   sock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) console.log('qrcode: ', qr);

      if (connection === 'close') {
         const shouldRecnnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut

         if (shouldRecnnect) connectOnWhatsapp()

         if (shouldRecnnect === false) {
            const removeAuth = pathMD + fileAuth
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }

      if (connection === 'open') console.log('CONNECTED WHATSAPP MD')
   })
}

const connectOnWhatsapp = async () => {

   const { version, isLatest } = await fetchLatestBaileysVersion()

   checkPath(pathMD)

   const { saveState, state } = useSingleFileAuthState(pathMD + fileAuth)

   const config = {
      printQRInTerminal: true,
      connectTimeoutMs: 60_000,
      auth: state,
      logger: P({ level: 'error' }),
      // version: [2, 2204, 13],
      version,
      async getMessage(key) {
         return { conversation: 'oi' };
      },
   }

   const sock = makeWaSocket(config)

   connectionUpdate(sock.ev)

   sock.ev.on('creds.update', saveState)

   // start the bot
   chatBot(sock)

   // chat history
   chatStorage(sock)
}

// init
connectOnWhatsapp()