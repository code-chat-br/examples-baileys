const { delay } = require('@adiwajshing/baileys')
const { readFileSync } = require('fs')

// MD exclusive buttons
const urlButton1 = {
   url: 'https://github.com/jrCleber/exemples-baileys',
   displayText: '⭐ exemples-baileys ⭐',
}
const urlButton2 = {
   url: 'https://github.com/jrCleber/bot-venom-firebase',
   displayText: '⭐ bot-venom-firebase ⭐',
}
const quickReplyButton1 = {
   id: 'id1',
   displayText: 'ReplyBtn1',
}
const quickReplyButton2 = {
   id: 'id2',
   displayText: 'ReplyBtn2',
}
const callButton = {
   displayText: 'Call me 📱',
   phoneNumber: '+55 31 0 0000-000',
}
const buttonsMD = [
   // you can insert even more buttons
   { index: 0, urlButton: urlButton1 },
   { index: 1, urlButton: urlButton2 },
   { index: 2, callButton },
   { index: 3, quickReplyButton: quickReplyButton1 },
   { index: 4, quickReplyButton: quickReplyButton2 },
]

// buttons compatible with legacy version
const buttons = [
   { buttonId: 'id1', buttonText: { displayText: 'Button 01' }, type: 1 },
   { buttonId: 'id2', buttonText: { displayText: 'Button 02' }, type: 1 },
   { buttonId: 'id3', buttonText: { displayText: 'Button 03 📝' }, type: 1 },
]

/**
 * @param {string} jid 
 * @returns {boolean}
 */
const isGroup = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

/**
 * @param {import("../library/library").IWASock} sock 
 */
exports.chatBot = (sock) => {

   /** 
    * @param {string} jid 
    * @param {import("@adiwajshing/baileys").AnyMessageContent} msg 
    * @returns {import("@adiwajshing/baileys").proto.WebMessageInfo}
    */
   const sendMessageWTyping = async (jid, msg) => {
      await sock.presenceSubscribe(jid)
      await delay(500)

      await sock.sendPresenceUpdate('composing', jid)
      await delay(1000)

      await sock.sendPresenceUpdate('paused', jid)

      return await sock.sendMessage(jid, msg)
   }

   sock.ev.on('messages.upsert', ({ messages, type }) => {
      const msg = messages[0]
      const jid = msg.key.remoteJid

      if (!isGroup(jid) && !msg.key.fromMe && jid !== 'status@broadcast') {
         console.log("MESSAGE: ", msg)

         sock.sendReadReceipt(jid, msg.key.participant, [msg.key.id])

         // plain text sending
         if (msg.message.conversation.toLowerCase() === 'text') {
            sendMessageWTyping(jid, { text: 'Text example.' })
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending the common buttons
         if (msg.message.conversation.toLowerCase() === 'btn') {
            const buttonsMessage = {
               text: '*BUTTON TITLE*\n\nButton Description',
               footer: 'footer-btn',
               buttons: buttons,
               headerType: 1
            }
            sendMessageWTyping(jid, buttonsMessage)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending md buttons
         if (msg.message.conversation.toLowerCase() === 'btn md') {
            const template = {
               text: '*BUTTON TITLE*\n\nButton Description',
               footer: 'footer-btn-md',
               templateButtons: buttonsMD
            }
            sendMessageWTyping(jid, template)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending image
         if (msg.message.conversation.toLowerCase() === 'img') {
            const sendImage = {
               // optional
               caption: '```IMAGE TITLE```',
               image: {
                  url: './assets/github.jpg',
                  // url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'
               }
            }
            sendMessageWTyping(jid, sendImage)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending image with buttons
         if (msg.message.conversation.toLowerCase() === 'img btn') {
            const templateImage = {
               // optional
               caption: '```IMAGE TITLE```\n\nDescrption',
               // optional
               footer: 'subtitle',
               image: {
                  url: './assets/github.jpg',
                  // url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'
               },
               buttons: buttons
            }
            sendMessageWTyping(jid, templateImage)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending image with MD buttons
         if (msg.message.conversation.toLowerCase() === 'img btn md') {
            const templateImage = {
               // optional
               caption: '```IMAGE TITLE```\n\nDescrption',
               // optional
               footer: 'subtitle',
               image: {
                  url: './assets/github.jpg',
                  // url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'
               },
               templateButtons: buttonsMD
            }
            sendMessageWTyping(jid, templateImage)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending video
         if (msg.message.conversation.toLowerCase() === 'video') {
            const sendVideo = {
               // optional
               caption: '```VIDEO TITLE```',
               video: {
                  url: './assets/minero_no_espaço.mp4',
               },
               mimetype: 'video/mp4',
               gifPlayback: true
            }
            sendMessageWTyping(jid, sendVideo)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending video with buttons
         if (msg.message.conversation.toLowerCase() === 'video btn') {
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
            sendMessageWTyping(jid, templateVideo)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending video with MD buttons
         if (msg.message.conversation.toLowerCase() === 'video btn md') {
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
            sendMessageWTyping(jid, templateVideo)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending pdf document
         if (msg.message.conversation.toLowerCase() === 'pdf') {
            const sendDoc = {
               fileName: 'github.pdf',
               mimetype: 'application/pdf',
               document: {
                  url: './assets/github.pdf'
                  // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
               }
            }
            sendMessageWTyping(jid, sendDoc)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending pdf document with buttons
         if (msg.message.conversation.toLowerCase() === 'pdf btn') {
            const templateDoc = {
               // optional
               caption: '*DOCUMENT TITLE*\n\nDescrption',
               // optional
               footer: 'subtitle',
               fileName: 'github.pdf',
               mimetype: 'application/pdf',
               document: {
                  url: './assets/github.pdf'
                  // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
               },
               buttons: buttons
            }
            sendMessageWTyping(jid, templateDoc)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending pdf document with MD buttons
         if (msg.message.conversation.toLowerCase() === 'pdf btn md') {
            const templateDoc = {
               // optional
               caption: '```DOCUMENT TITLE```\n\nDescrption',
               // optional
               footer: 'subtitle',
               fileName: 'github.pdf',
               mimetype: 'application/pdf',
               document: {
                  url: './assets/github.pdf'
                  // url: 'https://www2.senado.leg.br/bdsf/bitstream/handle/id/518231/CF88_Livro_EC91_2016.pdf' //  this url may take a while
               },
               templateButtons: buttonsMD
            }
            sendMessageWTyping(jid, templateDoc)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending link with preview
         if (msg.message.conversation.toLowerCase() === 'link') {
            sendMessageWTyping(jid, {
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
            })
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending list
         if (msg.message.conversation.toLowerCase() === 'list') {
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

            sendMessageWTyping(jid, sendList)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending contact
         if (msg.message.conversation.toLowerCase() === 'contact') {
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
            
            sendMessageWTyping(jid, {
               contacts: {
                  displayName: contact.fullName,
                  contacts: [{ vcard, displayName: contact.fullName }]
               }
            })
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

         // sending contact list
         if (msg.message.conversation.toLowerCase() === 'contact list') {
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

            sendMessageWTyping(jid, {
               contacts: {
                  displayName: `${contacts.length} contacts`,
                  contacts: contacts
               }
            })
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }
      }
   })
}