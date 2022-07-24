const { GuildMember, MessageEmbed, Message, Guild, GuildChannel } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    let embed = new genEmbed().setTitle("Sunucuda Webhook Kaldırıldı!")
    let entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, undefined ,"Webhook Silme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` kanalında webhook sildi ve sildiği gibi cezalandırıldı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "webhookUpdate"
}
