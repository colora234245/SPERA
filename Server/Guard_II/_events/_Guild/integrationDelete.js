const { MessageEmbed, Guild } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Guild} guild
 */


module.exports = async (guild) => {
    let embed = new genEmbed().setTitle("Sunucuda Entagrasyon Silindi!")
    let entry = await guild.fetchAuditLogs({type: 'INTEGRATION_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, undefined ,"Entegrasyon Silindi!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından entegrasyonlar silindi ve silindiği gibi cezalandırıldı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "guildIntegrationsUpdate"
}
