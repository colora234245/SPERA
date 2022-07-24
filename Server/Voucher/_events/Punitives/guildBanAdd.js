const { GuildMember, MessageEmbed } = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */
module.exports = async (ban) => {
    let guild = client.guilds.cache.get(sistem.SERVER.ID);
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor) return;
    if(entry.executor.id == client.user.id) return;
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
    let ceza = new Punitives({ 
        No: cezano,
        Member: ban.user.id,
        Staff: entry.executor.id,
        Type: "Yasaklama",
        Reason: "Sağ-Tık",
        Date: Date.now()
    })
    ceza.save().catch(err => {})
    let findedChannel = guild.kanalBul("ban-log")
    if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter(`${ayarlar ? ayarlar.embedSettings ? ayarlar.embedSettings.Footer ? ayarlar.embedSettings.Footer : ban.guild.name : ban.guild.name : ban.guild.name } • Ceza Numarası: #${cezano}`,ban.user.avatarURL({dynamic: true})).setDescription(`${ban.user.toString()} üyesi, **${tarihsel(Date.now())}** tarihinde ${entry.executor} tarafından **Sağ-Tık** yasaklandırıldı.`)]})
    await Users.updateOne({ _id: entry.executor.id } , { $inc: { "Uses.Ban": 1 } }, {upsert: true})

 }

module.exports.config = {
    Event: "guildBanAdd"
}
