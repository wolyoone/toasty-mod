const { MessageEmbed } = require("discord.js");
const Guild = require("../Settings/Guild.json")
const Limit = require("../Settings/Limit.json")
const Log = require("../Settings/Log.json")
const Role = require("../Settings/Role.json")

module.exports = class {
    constructor(client) {
        this.client = client;
    }


    async run(eski, yeni) {  
  let tag = Guild.Tag;
  let ikinciTag = Guild.Secondary_Tag;
  let üye = yeni.client.guilds.cache.get(Guild.Sunucu).member(yeni.id);
  let log = yeni.client.channels.cache.get(Log.Auto_Tag_Log);
  let cezalı = Role.Jail.Role;
  let ekip = üye.guild.roles.cache.get(Role.Family_Role);
  let şüpheli = Role.Suspect.Role;
  
  if (!eski.username.includes(tag) && yeni.username.includes(tag)) {
    if (Role.Register.Unregistered.some(e => üye.roles.cache.has(e)) || üye.roles.cache.has(cezalı) || üye.roles.cache.has(şüpheli)) return;
    if (!üye.roles.cache.has(ekip.id)) üye.roles.add(ekip.id).catch(console.error);
    if (log) log.send(`${üye} tagımızı aldı ve aramıza katıldı, hoşgeldin!`).catch(console.error);
    üye.send(`Hey Selam! Tagımızı alıp ailemize katıldığın için sana Dynasty Rolünü verdim. Tekrardan ailemize hoş geldin!`).catch(e => {});
     üye.setNickname(üye.displayName.replace(ikinciTag, tag)).catch(console.error);
  } else if (eski.username.includes(tag) && !yeni.username.includes(tag)) {
    if (log) log.send(`${üye} tagımızı bıraktı, görüşürüz!`);
    üye.send(`Hey Selam! Tagımızı çıkardığın için senden Dynasty Rolünü aldım. Tekrardan ailemize katılmak istersen tagımız. \`${Guild.Tag}\``).catch(e => {});
    if (Limit.Tagli_Alim && !üye.premiumSince) await üye.roles.set(Role.Register.Unregistered);
     üye.setNickname(üye.displayName.replace(tag, ikinciTag)).catch(console.error);
    if (!Limit.Yetkili) {
      if (üye.roles.cache.has(ekip.id)) üye.roles.remove(ekip.id).catch(console.error);
	  let roles = üye.roles.cache.clone().filter(e => e.managed || e.position < ekip.position);
    üye.roles.set(roles).catch();
    } else {
      let roles = üye.roles.cache.clone().filter(e => e.managed).map(e => e.id);
	  roles.concat(Role.Register.Unregistered);
     üye.roles.set(roles).catch();
    }
}
}
};