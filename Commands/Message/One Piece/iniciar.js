import { PermissionFlagsBits, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

import Collector from "../../../functions/collector.js"

import { db } from "../../../mongodb/user.js";

/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "iniciar",
  description: "",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let file = new AttachmentBuilder("./images/gol-d-roger.png");

    let botao = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setLabel("Pirata")
      .setCustomId("virarPirata")
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setLabel("Marinheiro")
      .setCustomId("virarMarinheiro")
      .setStyle(ButtonStyle.Primary)
    );

   // console.log(message.author)

    let embed = new EmbedBuilder()
    .setTitle("**Minhas riquezas e tesouros??**")
    .setDescription(`Se vocês quiserem, eu os deixo pegar.\n\nProcurem por ele, deixei tudo naquele lugar!!`)
    .setImage(`https://media.discordapp.net/attachments/1155227861838475368/1155531527401254973/gol-d-roger.png`)
    .setColor("Red")
    .setAuthor({name: `${message.author.globalName}`, iconURL: `${message.author.displayAvatarURL()}`})

    //console.log(embed, file)
    
    let msg = await message.reply({
      embeds: [embed],
      components: [botao],
      content: `${message.author}`
    })

    let userdb = await db.findOne({
         userID: message.author.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: message.author.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: message.author.id })
     }

    Collector(async(i) => {
      if (i.isButton()){
        if (i.customId === "virarPirata"){
          if (i.message.id !== msg.id) return;
          
          if (i.user.id !== message.author.id) return i.reply({
            content: `Ih rapa, você não é ${message.author}... quem é você?`,
            ephemeral: true
          })
          
             if (userdb.start) return i.reply({
               content: `EI! VOCÊ! isso mesmo, você já fez sua escolha!`,
               ephemeral: true
             })

          
await db.updateOne({
         userID: message.author.id
     }, { $set: {
         "start": true,
         "status": 1
     }
     })

           await msg.edit({
             components: []
           })

          return i.reply({
            content: `Você se tornou um pirata, como eu \:D`,
            ephemeral: true
          })
        }
        if (i.customId === "virarMarinheiro"){
          if (i.msg.id !== msg.id) return;

          if (i.user.id !== message.author.id) return i.reply({
            content: `Ih rapa, você não é ${message.author}. quem é você?`,
            ephemeral: true
          })

          if (userdb.start) return i.reply({
            content: `EI! VOCÊ! Isso mesmo, você já fez sua escolha!`,
            ephemeral: true
          })

          await db.updateOne({
            userID: i.user.id
          },{ $set: {
             "start": true,
             "status": 2
            }
          })

          await msg.edit({
            components: []
          })

          return i.reply({
            content: `Você virou marinheiro! Seremos inimigos a partir de agora.`,
            ephemeral: true
          })
        }
      }
    })
  },
};
