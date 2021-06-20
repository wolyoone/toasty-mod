const cezalar = require("../models/cezalı.js")
const Role = require("../Settings/Role.json")
const Guild = require("../Settings/Guild.json")
const Discord = require("discord.js")
const Log = require("../Settings/Log.json")
const mute = require("../models/chatmute.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = class {
    constructor(client) {
        this.client = client;
    }

      async run(member) {
        if (Date.now() - member.user.createdTimestamp < ms("5d")) {
            this.client.channels.cache.get(Log.Suspect.Log).send(new Discord.MessageEmbed().setFooter(moment(Date.now()).format("LLL")).setColor("RANDOM").setDescription(`
Şüpheli Kişi: ${member} - **${member.id}**

Kişinin hesabı 5 günden önce açıldığı için Şüpheliye atıldı.
`))
     member.roles.add(Role.Suspect.Role)
 

        }
        let emoji = ""
        if (Date.now() - member.user.createdTimestamp < ms("5d")) {
            emoji = `${this.client.no}`
        } else {
            emoji = `${this.client.ok}`
        }
        member.roles.add(Role.Register.Unregistered)
        cezalar.findOne({ user: member.id }, async (err, res) => {
            if (!res) {

                setTimeout(() => {
                    member.roles.add(Role.Register.Unregistered)
                }, 1500);
              //  this.client.channels.cache.get(Log.Register.Log).send("🎉 Sunucumuza hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. " + emoji + "\n\nSunucu kurallarımız <#727881636296785981> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk ! Tagımızı alarak bizlere destek olabilirsin ! Kayıt olmak için teyit odalarına girip ses teyit vermen gerekiyor yetkililerimiz seninle ilgilenecektir ! İyi eğlenceler.")
            } else if (res) {
                if (res.ceza == false) {
                    setTimeout(() => {
                        member.roles.add(Role.Register.Unregistered)
                    }, 1500)
                   // this.client.channels.cache.get(Log.Register.Log).send("🎉 Sunucumuza hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. " + emoji + "\n\nSunucu kurallarımız <#727881636296785981> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk ! Tagımızı alarak bizlere destek olabilirsin ! Kayıt olmak için teyit odalarına girip ses teyit vermen gerekiyor yetkililerimiz seninle ilgilenecektir ! İyi eğlenceler.")
                } else if (res.ceza == true) {
                    await member.roles.add(Role.Jail.Role)
                  await member.roles.remove(Role.Register.Unregistered)
                  member.roles.remove(Role.Suspect.Role)

                }
            }
if (member.user.username.includes(Guild.Tag)) member.roles.add(Role.Family_Role);
        })
        mute.findOne({ user: member.id }, async (err, res) => {
            if (!res) return
            if (res.muted == true) {
                member.roles.add(Role.Chat_Mute.Role)
            }
        })
    }
};
