# exemples-baileys - under development

### [**Telegram group**](https://t.me/codechatBR)

This project is based on the use of the [**Baileys**](https://adiwajshing.github.io/Baileys/) library, and its main objective is to facilitate its use.

## Getting started Multidevice

```js
const makeWaSocket = require('@adiwajshing/baileys').default
const { 
   useSingleFileAuthState, 
   DisconnectReason, 
   fetchLatestBaileysVersion, 
   delay 
} = require('@adiwajshing/baileys')
const P = require('pino')
const { unlink } = require('fs')

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
      version: version,
      getMessage: async key => {
         return { conversation: 'oi' };
      },
   }

   const sock = makeWaSocket(config)

   connectionUpdate(sock.ev)

   sock.ev.on('creds.update', saveState)

   sock.ev.on('messages.upsert', async ({ messages, type }) => {
      const msg = messages[0]
      const jid = msg.key.remoteJid

      if (msg.key.fromMe === false && jid !== 'status@broadcast') {

         await sock.presenceSubscribe(jid)
         await delay(500)

         await sock.sendPresenceUpdate('composing', jid)
         await delay(1000)

         await sock.sendPresenceUpdate('paused', jid)

         sock.sendMessage(jid, { text: 'Text example.' })
            .then(result => console.log('RESULT: ', result))
            .catch(err => console.log('ERROR: ', err))

      }
   }
}

```
## Basic Functions

### Chatting

#### Sending text
```js
sock.sendMessage('<phoneNumber>@s.whatsapp.net', { text: 'Text example.' })
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', { text: 'Text example.' })
```
#### Sending the common buttons
```js
const buttons = [
   { buttonId: 'id1', buttonText: { displayText: 'Button 01' }, type: 1 },
   { buttonId: 'id2', buttonText: { displayText: 'Button 02' }, type: 1 },
   { buttonId: 'id3', buttonText: { displayText: 'Button 03 📝' }, type: 1 },
]

const buttonsMessage = {
   text: '*BUTTON TITLE*\n\nButton Description',
   footer: 'footer-btn',
   buttons: buttons,
   headerType: 1
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', buttonsMessage)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', buttonsMessage)
```
#### Sending Buttons MD
```js
const buttonsMD = [
   { 
      index: 0, 
      urlButton: {
          url: 'https://github.com/jrCleber/exemples-baileys',
         displayText: '⭐ exemples-baileys ⭐',
      }
   },
   {
      index: 1,
      callButton: { displayText: 'Call me 📱', phoneNumber: '+55 31 0 0000-000', }
   },
   {
      index: 2,
      quickReplyButton: { id: 'id1', displayText: 'ReplyBtn1' }
   },
   {
      index: 3,
      quickReplyButton: { id: 'id2', displayText: 'ReplyBtn2' }
   }
]

const templateButtons = {
   text: '*BUTTON TITLE*\n\nButton Description',
   footer: 'footer-btn-md',
   templateButtons: buttonsMD
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateButtons)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateButtons)
```
#### Sending image
```js
const sendImage = {
   // optional
   caption: '```IMAGE TITLE```',
   image: {
      url: './assets/image.jpg',
      // url: 'https://domain/image.jpeg'
   }
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendImage)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendImage)
```
#### Sending image with buttons
```js
const buttons = [
   { buttonId: 'id1', buttonText: { displayText: 'Button 01' }, type: 1 },
   { buttonId: 'id2', buttonText: { displayText: 'Button 02' }, type: 1 },
   { buttonId: 'id3', buttonText: { displayText: 'Button 03 📝' }, type: 1 },
]

const templateImage = {
   // optional
   caption: '```IMAGE TITLE```\n\nDescrption',
   // optional
   footer: 'subtitle',
   image: {
      url: './assets/image.jpg',
      // url: 'https://domain/image.jpeg'
   },
   buttons: buttons
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateImage)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateImage)
```
#### Sending image with MD buttons
```js
const buttonsMD = [
   { 
      index: 0, 
      urlButton: {
          url: 'https://github.com/jrCleber/exemples-baileys',
         displayText: '⭐ exemples-baileys ⭐',
      }
   },
   {
      index: 1,
      callButton: { displayText: 'Call me 📱', phoneNumber: '+55 31 0 0000-000', }
   },
   {
      index: 2,
      quickReplyButton: { id: 'id1', displayText: 'ReplyBtn1' }
   },
   {
      index: 3,
      quickReplyButton: { id: 'id2', displayText: 'ReplyBtn2' }
   }
]

const templateImage = {
   // optional
   caption: '```IMAGE TITLE```\n\nDescrption',
   // optional
   footer: 'subtitle',
   image: {
      url: './assets/image.jpg',
      // url: 'https://domain/image.jpeg'
   },
   templateButtons: buttonsMD
}
sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateImage)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

   // or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateImage)
```
#### Sending video
```js
const sendVideo = {
   // optional
   caption: '```VIDEO TITLE```',
   video: {
      url: './assets/video.mp4',
   },
   mimetype: 'video/mp4',
   gifPlayback: true
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendVideo)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendVideo)
```
#### Sending video with buttons
```js
const buttons = [
   { buttonId: 'id1', buttonText: { displayText: 'Button 01' }, type: 1 },
   { buttonId: 'id2', buttonText: { displayText: 'Button 02' }, type: 1 },
   { buttonId: 'id3', buttonText: { displayText: 'Button 03 📝' }, type: 1 },
]

const templateVideo = {
   // optional
   caption: '```VIDEO TITLE```\n\nDescrption',
   // optional
   footer: 'subtitle',
   video: {
      url: './assets/minero_no_espaço.mp4',
   },               
   mimetype: 'video/mp4',
   gifPlayback: true,
   buttons: buttons
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateVideoe)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateVideoe)
```
#### Sending video with MD buttons
```js
const buttonsMD = [
   { 
      index: 0, 
      urlButton: {
          url: 'https://github.com/jrCleber/exemples-baileys',
         displayText: '⭐ exemples-baileys ⭐',
      }
   },
   {
      index: 1,
      callButton: { displayText: 'Call me 📱', phoneNumber: '+55 31 0 0000-000', }
   },
   {
      index: 2,
      quickReplyButton: { id: 'id1', displayText: 'ReplyBtn1' }
   },
   {
      index: 3,
      quickReplyButton: { id: 'id2', displayText: 'ReplyBtn2' }
   }
]

const templateVideo = {
   // optional
   caption: '```VIDEO TITLE```\n\nDescrption',
   // optional
   footer: 'subtitle',
   video: {
      url: './assets/minero_no_espaço.mp4',
   },               
   mimetype: 'video/mp4',
   gifPlayback: true,
   templateButtons: buttonsMD
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateVideoe)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateVideoe)
```
#### Sending pdf document
```js
const sendDoc = {
   fileName: 'document.pdf',
   mimetype: 'application/pdf',
   document: {
      url: './assets/document.pdf'
      // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
   }
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendDoc)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendDoc)
```
#### Sending pdf document with buttons
```js
const buttons = [
   { buttonId: 'id1', buttonText: { displayText: 'Button 01' }, type: 1 },
   { buttonId: 'id2', buttonText: { displayText: 'Button 02' }, type: 1 },
   { buttonId: 'id3', buttonText: { displayText: 'Button 03 📝' }, type: 1 },
]

const templateDoc = {
   // optional
   caption: '*DOCUMENT TITLE*\n\nDescrption',
   // optional
   footer: 'subtitle',
   fileName: 'document.pdf',
   mimetype: 'application/pdf',
   document: {
      url: './assets/documet.pdf'
      // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
   },
   buttons: buttons
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateDoc)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateDoc)
```
#### Sending pdf document with MD buttons
```js
const buttonsMD = [
   { 
      index: 0, 
      urlButton: {
          url: 'https://github.com/jrCleber/exemples-baileys',
         displayText: '⭐ exemples-baileys ⭐',
      }
   },
   {
      index: 1,
      callButton: { displayText: 'Call me 📱', phoneNumber: '+55 31 0 0000-000', }
   },
   {
      index: 2,
      quickReplyButton: { id: 'id1', displayText: 'ReplyBtn1' }
   },
   {
      index: 3,
      quickReplyButton: { id: 'id2', displayText: 'ReplyBtn2' }
   }
]

const templateDoc = {
   // optional
   caption: '```DOCUMENT TITLE```\n\nDescrption',
   // optional
   footer: 'subtitle',
   fileName: 'document.pdf',
   mimetype: 'application/pdf',
   document: {
      url: './assets/document.pdf'
      // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
   },
   templateButtons: buttonsMD
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateDoc)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', templateDoc)
```
#### Sending link with preview
```js
const createLink = {
   forward: {
      key: { fromMe: true },
      message: {
         extendedTextMessage: {
            text: 'https://github.com/code-chat-br/exemples-baileys',
            matchedText: 'https://github.com/code-chat-br/exemples-baileys',
            canonicalUrl: 'https://github.com/code-chat-br/exemples-baileys',
            title: 'GitHub - jrCleber/exemples-baileys',
            description: 'Contribute to jrCleber/exemples-baileys development by creating an account on GitHub.',
            // optional
            jpegThumbnail: readFileSync('./assets/github.jpg')
         }
      }
   }
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', createLink)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', createLink)
```
#### Sending list
```js
const sections = [
   {
      title: 'CATEGORY 01',
      rows: [
         { title: 'Row 01', description: 'Description 01', rowId: 'rid1' },
         { title: 'Row 02', description: 'Description 02', rowId: 'rid2' },
         { title: 'Row 03', description: 'Description 03', rowId: 'rid3' },
      ],
   },
   {
      title: 'CATEGORY 02',
      rows: [
         { title: 'Row 01', description: 'Description 01', rowId: 'rid4' },
         { title: 'Row 02', description: 'Description 02', rowId: 'rid5' },
         { title: 'Row 03', description: 'Description 03', rowId: 'rid6' },
         { title: 'Row 04', description: 'Description 04', rowId: 'rid7' },
      ],
   },
   {
      title: 'CATEGORY 03',
      rows: [
         { title: 'Row 01', description: 'Description 01', rowId: 'rid8' },
         { title: 'Row 02', description: 'Description 02', rowId: 'rid9' },
      ],
   },
]

 const sendList = {
   title: '🌎 *LIST TITLE* 🌎\n',
   text: 'Click the *button* and see the list items\n',
   buttonText: 'Clique here',
   footer: 'footet-list\nlink: https://github.com/jrCleber/exemples-baileys',
   sections: sections
}

sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendList)
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', sendList)
```
#### Sending contact
```js
const contact = {
   fullName: 'Name contact',
   waid: '553100000000',
   phoneNumber: '+55 31 9 0000-0000'
}
const vcard =
   'BEGIN:VCARD\n' +
   'VERSION:3.0\n' +
   'FN:' +
   contact.fullName +
   '\n' +
   'item1.TEL;waid=' +
   contact.waid +
   ':' +
   contact.phoneNumber +
   '\n' +
   'item1.X-ABLabel:Celular\n' +
   'END:VCARD'

sock.sendMessage('<phoneNumber>@s.whatsapp.net', {
   contacts: {
      displayName: contact.fullName,
      contacts: [{ vcard, displayName: contact.fullName }]
   }
})
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', {
   contacts: {
      displayName: contact.fullName,
      contacts: [{ vcard, displayName: contact.fullName }]
   }
})
```
#### Sending contact list
```js
const contactList = [
   {
      fullName: 'Name contact 01',
      waid: '553100000001',
      phoneNumber: '+55 31 9 0000-0001',
   },
   {
      fullName: 'Name contact 02',
      waid: '553100000002',
      phoneNumber: '+55 31 9 0000-0002',
   },
   {
      fullName: 'Name contact 03',
      waid: '553100000003',
      phoneNumber: '+55 31 9 0000-0003',
   },
   {
      fullName: 'Name contact 04',
      waid: '553100000004',
      phoneNumber: '+55 31 9 0000-0004',
   },
]
const contacts = Array.from(contactList, c => {
   return {
      displayName: c.fullName,
      vcard:
         'BEGIN:VCARD\n' +
         'VERSION:3.0\n' +
         'FN:' +
         c.fullName +
         '\n' +
         'item1.TEL;waid=' +
         c.waid +
         ':' +
         c.phoneNumber +
         '\n' +
         'item1.X-ABLabel:Celular\n' +
         'END:VCARD',
   }
})

sock.sendMessage('<phoneNumber>@s.whatsapp.net', {
   contacts: {
      displayName: `${contacts.length} contacts`,
      contacts: contacts
   }
})
   .then(result => console.log('RESULT: ', result))
   .catch(err => console.log('ERROR: ', err))

// or
const result = await sock.sendMessage('<phoneNumber>@s.whatsapp.net', {
   contacts: {
      displayName: `${contacts.length} contacts`,
      contacts: contacts
   }
})
```