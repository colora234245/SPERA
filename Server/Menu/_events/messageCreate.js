const { Message } = require("discord.js");

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
      if (!global.sistem.botSettings.Prefixss.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let ramal = message.client;
    args = args.splice(1);
    let calistirici;
    
    if(ramal.commands.has(komutcuklar) || ramal.aliases.has(komutcuklar)) {
          calistirici = ramal.commands.get(komutcuklar) || ramal.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(ramal, message, args);
    } 

};

module.exports.config = {
    Event: "messageCreate"
};