const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "emojiyükle",
    Komut: ["emojioluştur", "emojiekle", "emekle", "emyükle"],
    Kullanim: "emojiyükle <Emoji/Emoji Bağlantısı> <Emoji Adı>",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, msg, args) {

    if(!ayarlar.staff.includes(msg.member.id) && !msg.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => msg.member.roles.cache.has(oku))) return msg.react(msg.guild.emojiGöster(emojiler.Iptal));
    const hasEmoteRegex = /<a?:.+:\d+>/gm
    const emoteRegex = /<:.+:(\d+)>/gm
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm
    const isim = `${ayarlar.serverName ? ayarlar.serverName : 'ramal'}_${Math.round((Math.random()*9999))}`
    const message = msg.content.match(hasEmoteRegex)
      if (emoji = emoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1", isim, msg)
      else 
      if (emoji = animatedEmoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1", isim, msg)
      else {
        let [link, ad] = args.slice(0).join(" ").split(" ");
        if (!link) return msg.channel.send(`${cevaplar.prefix} Lütfen bir bağlantı belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
        if (!ad) return msg.channel.send(`${cevaplar.prefix} Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
        EmojiYükle(link, ad, msg)
      }
    }
};

function EmojiYükle(link, ad, message) {
  message.guild.emojis.create(link, ad)
  .then(emoji => message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${emoji.name}\` adında emoji oluşturuldu. (${emoji})`)]}).then(x => {
    message.react(message.guild.emojiGöster(emojiler.Onay))  
    setTimeout(() => {
          x.delete()

      }, 7500);
  }))

  .catch(console.error);
}