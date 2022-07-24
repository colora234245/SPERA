const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
const getLimit = new Map();

module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregistered","kayitsizyap","kayitsiz"],
    Kullanim: "kayıtsız <@ramal/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
    Kategori: "teyit",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.roles.cache.has('970367728147906660') && !message.member.roles.cache.has('970367762050478080') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.noyt)
    if (getLimit.get(message.author.id) >= ayarlar.kayıtsızLimit) return message.reply(`${cevaplar.prefix} Bu komutu kullanım hakkınız dolmuştur.`);
    if(!uye) return message.reply(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@ramal/ID>\``);
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi);
    if(uye.user.bot) return message.reply(cevaplar.bot);
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust);
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.reply(cevaplar.kayıtsız)
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep);
    uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
    uye.setRoles(roller.kayıtsızRolleri)
    if(uye.voice.channel) uye.voice.disconnect()
    let data = await Kullanici.findOne({_id: uye.id});
    if(data && data.Name) await Kullanici.updateOne({_id: uye.id}, {$set: { "Gender": "Kayıtsız" }, $push: { "Names": { Staff: message.member.id, Date: Date.now(), Name: data.Name, State: "Kayıtsıza Atıldı" } } }, { upsert: true })
    uye.Delete()
    uye.removeStaff()
    
    let kayıtsızLog = message.guild.kanalBul("kayıtsız-log")
    if(kayıtsızLog) kayıtsızLog.send({embeds: [ new genEmbed().setDescription(`${uye} isimli üye ${message.author} tarafından **${tarihsel(Date.now())}** tarihinde **${sebep}** nedeniyle \`${message.guild.name}\` sunucusunda kayıtsız üye olarak belirlendi.`)]})
    message.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesi, \`${sebep}\` nedeniyle başarıyla kayıtsız'a gönderildi.`, ephemeral: true,})
    uye.send(`Merhaba ${uye}, **${ayarlar.serverName}** Sunucusun da ${message.author} adlı yetkili tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde kayıtsız'a atıldın.`).catch(x => {
      })
    if(Number(ayarlar.kayıtsızLimit) && ayarlar.kayıtsızLimit > 1) {
      if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        setTimeout(() => {
          getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
        },1000*60*5)
      }
    }
    message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};