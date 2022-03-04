const { makeInMemoryStore } = require('@adiwajshing/baileys')
const { checkPath } = require('../utils/check')

/**
 * @param {import("../library/library").IWASock} sock 
 */
exports.chatStorage = (sock) => {
   checkPath('./temp')

   const store = makeInMemoryStore({})

   /* saves the state to a file every 10s */
   setInterval(() => store.writeToFile('./temp/wa_store.json'), 10_000);

   /* can be read from a file */
   store.readFromFile('./temp/wa_store.json');

   /**
    * will listen from this socket
    * the store can listen from a new socket once the current socket outlives its lifetime
    */
   store.bind(sock.ev);

   sock.ev.on('chats.set', () => {
      console.log('chats: ', store.chats.all());
   });

   sock.ev.on('contacts.set', () => {
      console.log('contacts: ', Object.values(store.contacts));
   });
}