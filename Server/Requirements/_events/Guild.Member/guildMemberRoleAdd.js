const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');

module.exports = async (member, role) => {
    const Log = await member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
    if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000)) return;  
    if(member.guild.roles.cache.get(role.id).position < member.guild.roles.cache.get(roller.tagRolü).position) return;
    await Users.updateOne({_id: member.id},  { $push: { "Roles": { rol: role.id, mod: Log.executor.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true }).exec()
    let logChannel = member.guild.kanalBul("rol-ver-log")
    if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${member} isimli üyeye ${global.tarihsel(Date.now())} ${Log.executor} tarafından ${role} adlı rol verildi.`)]})  

}

module.exports.config = {
    Event: "guildMemberRoleAdd"
}