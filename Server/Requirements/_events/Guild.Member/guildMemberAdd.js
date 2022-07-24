const { Collection } = require('discord.js')
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Jails = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const VMutes = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const Mutes = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const Forcebans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const { genEmbed } = require('../../../../Global/Init/Embed');
const getInvite = new Collection()


 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
    let User = await Users.findOne({ _id: member.id }) 
    let Jail = await Jails.findOne({ _id: member.id });
    let Forceban = await Forcebans.findOne({ _id: member.id });
    let Underworld =  await Punitives.findOne({Member: member.id, Type: "Underworld", Active: true})
    const _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
    const _set = global._set = _findServer.Ayarlar
    let OneWeak = Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7;
    member = member.guild.members.cache.get(member.id)
    let cezaPuan = await member.cezaPuan()
    if(_set.otoIsim && User && User.Name && User.Names && User.Gender && User.Gender != "Kayıtsız") {
        await member.setNickname(`${member.user.username.includes(_set.tag) ? _set.tag : (_set.tagsiz ? _set.tagsiz : (_set.tag || ""))} ${User.Name}`).catch(err => {});      
    } else {
        await member.setNickname(`${_set.tagsiz} İsim | Yaş`).catch(err => {})
    }
    if(OneWeak) {
        await member.setRoles(_set.şüpheliRolü)
        await member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucuya katıldı fakat hesabı ${global.tarihHesapla(member.user.createdAt)} açıldığı için şüpheli olarak işaretlendi.`);
        return member.guild.kanalBul("şüpheli-log").send({embeds: [new genEmbed().setDescription(`${member} isimli üye sunucuya katıldı fakat hesabı ${global.tarihHesapla(member.user.createdAt)} açıldığı için şüpheli olarak işaretlendi.`)]});
    };
    if(_set.yasakTaglar && _set.yasakTaglar.some(tag => member.user.username.includes(tag))) {
        await member.setRoles(_set.yasaklıTagRolü)
        await member.guild.kanalBul("yasaklı-tag-log").send({embeds: [new genEmbed().setDescription(`${member} isimli üye sunucuya katıldı fakat isminde yasaklı tag barındırdığından dolayı \`${tarihsel(Date.now())}\` tarihinde yasaklı tag olarak belirlendi.`)]});
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, ismininde \`Yasaklı Tag\` bulundurduğu için cezalı olarak belirlendi.`);
    };
    if(Jail) {
        await member.setRoles(_set.jailRolü)
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, fakat aktif bir cezalandırılması bulunduğu için tekrardan cezalandırıldı. Adalet Mülkün Temelidir!`);
    };
    if(Underworld) {
      await member.setRoles(_set.underworldRolü)
      return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, fakat aktif bir Underworld cezası bulunduğu için tekrardan Underworld'e gönderildi.`);
    };
    if(Forceban) {
        await member.ban({ reason: 'Forceban tarafından yasaklandı.' })
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, fakat Kalkmazban sistemi ile yasaklandığından dolayı sunucumuzda tekrar yasaklandı.`);
    };
    if(cezaPuan >= 50) {
    	await member.setRoles(_set.şüpheliRolü)
	    await member.send({embeds: [new genEmbed().setDescription(`${member.guild.emojiGöster(emojiler.Cezalandırıldı)} ${member} ceza puanın \`${cezaPuan}\` olduğu için otomatik olarak şüpheli hesap olarak belirlendin. Adelet Mülkün Temelidir!`)]}).catch(x => {});
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, Ceza puanı \`50\` üzeri olduğu için şüpheli olarak belirlendi. Adalet Mülkün Temelidir!`);
    }
    if(_set.otoKayıt && User && User.Name && User.Names && User.Gender) {
        if(_set.taglıalım) {
          await rolTanımlama(member,_set.kayıtsızRolleri);
          return hoşgeldinMesajı(member);
        }
        if(User.Gender == "Erkek") {
            await Users.updateOne({_id: member.id}, { $push: { "Names": { Name: User.Name, State: `Oto. Bot Kayıt) (${_set.erkekRolleri.map(x => member.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
            return await rolTanımlama(member,_set.erkekRolleri)
        }
        if(User.Gender == "Kadın") { 
            await Users.updateOne({_id: member.id}, { $push: { "Names": { Name: User.Name, State: `Oto. Bot Kayıt) (${_set.kadınRolleri.map(x => member.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
            return await rolTanımlama(member,_set.kadınRolleri)
        }
    }
    await rolTanımlama(member,_set.kayıtsızRolleri);
    hoşgeldinMesajı(member);

}

client.on('inviteCreate', async invite => {
    invite.guild.invites.fetch().then((guildInvites) => {
        const cacheInvites = new Collection();
        guildInvites.map((inv) => {
          cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
        });
        getInvite.set(invite.guild.id, cacheInvites);
      });
})

client.on('inviteDelete', async invite => {
    setTimeout(async () => {
        invite.guild.invites.fetch().then((guildInvites) => {
          const cacheInvites = new Collection();
          guildInvites.map((inv) => {
            cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
          });
          getInvite.set(invite.guild.id, cacheInvites);
        });
      }, 5000)
})

client.on('ready', async () => {
    const guild = client.guilds.cache.get(sistem.SERVER.ID)
    guild.invites.fetch().then((guildInvites) => {
      const cacheInvites = new Collection();
      guildInvites.map((inv) => {
        cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
      });
      getInvite.set(guild.id, cacheInvites);
    });
})

async function hoşgeldinMesajı(member) {
    const guildInvites = getInvite.get(member.guild.id) || new Collection()
    const invites = await member.guild.invites.fetch();
    const invite = invites.find((inv) => guildInvites.has(inv.code) && inv.uses > guildInvites.get(inv.code).uses) || guildInvites.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
    const cacheInvites = new Collection();
    invites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); });
    getInvite.set(member.guild.id, cacheInvites);
    let odalar = sistem.WELCOME_CHANNELS
    let sesodaları = odalar[Math.floor(Math.random() * odalar.length)]
    let davettaslak;
    if (invite === null) {
        davettaslak = _set.serverName ? _set.serverName : member.guild.name
      } else if (invite === undefined) {
        davettaslak = _set.serverName ? _set.serverName : member.guild.name
      } else if (!invite) {
        davettaslak = _set.serverName ? _set.serverName : member.guild.name
      } else if (invite === member.guild.vanityURLCode) { 
        davettaslak = _set.serverName ? _set.serverName : member.guild.name
      } else {
          davettaslak = member.guild.members.cache.get(invite.inviter.id) ? member.guild.members.cache.get(invite.inviter.id) : _set.serverName ? _set.serverName : member.guild.name
      }
      let hoşgeldinKanal = member.guild.channels.cache.get(_set.hoşgeldinKanalı) || member.guild.kanalBul(_set.hoşgeldinKanalı)
      
      if(hoşgeldinKanal) hoşgeldinKanal.send(`${_set.serverName ? `${_set.serverName}` : member.guild.name}'e Hoş geldin ${member} biz de seni bekliyorduk. 
Seninle birlikte sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı. ${member.guild.emojiGöster(emojiler.Konfeti)}

Hesabın __${global.tarihsel(member.user.createdAt)}__ tarihinde (${global.timeTag(Date.parse(member.user.createdAt))}) oluşturulmuş!
<#${sesodaları}> Kanalında kayıt olabilirsin. Kayıt işleminden sonra <#${ayarlar.kurallarKanalı}> kanalını okumayı unutma.

Sunucumuza ${davettaslak} üyesinin davetiyle katıldın. Tagımızı alarak veya takviye basarak bize destek olabilirsin!
${_set.taglıalım ? `Sunucumuz şu anlık yalnızca **taglı(${_set.tag})** üyelerimize açıktır. Tagımızı alarak içeri giriş sağlayabilirsin. :tada: :tada: :tada:
` : `Tagımız \`${ayarlar.tag}\`. Şimdiden iyi eğlenceler! :tada: :tada: :tada:`}`);

  if(!hoşgeldinKanal) client.logger.log("Lütfen sunucu üzerinden hoşgeldin kanalını belirtin. Bir üye girdi fakat hoşgeldin mesajı atamadım.","error")
}


async function rolTanımlama(üye, rol) {
    let Mute = await Mutes.findOne({ _id: üye.id });
    await üye.setRoles(rol).then(async (ramal) => {
    if(üye.user.username.includes(_set.tag)) await üye.roles.add(_set.tagRolü)
    if(Mute) await üye.roles.add(_set.muteRolü)
    })
}

module.exports.config = {
    Event: "guildMemberAdd"
};