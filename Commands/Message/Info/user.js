import { PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

import { db } from "../../../mongodb/user.js";

const FrutasDoDiabo = ["Nenhuma"];


/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "userinfo",
  description: "",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let member;
    if (!message.mentions.users.first()){
      member = message.author;
    } else {
      member = message.mentions.users.first();
    };

    let userdb = await db.findOne({
         userID: member.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: member.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: member.id })
     }

    let akumaNoMi = FrutasDoDiabo[userdb.akumaNoMi];

    
    let embed = new EmbedBuilder()
    .setAuthor({ name: `${member.globalName}`, iconURL: `${member.displayAvatarURL()}`})


    if (userdb.status === 1){
      embed = embed.addFields({
        name: `Informações Gerais`,
        value: `ID: \`${member.id}\`\nBerries: \`${userdb.berries}\``
      },{
        name: `Informações de Pirata`,
        value: `Bando: \`${userdb.pirata.bando}\`\nRecompensa pela Cabeça: \`${userdb.pirata.recompensa}\``
      },{
        name: `Informações do Poder`,
        value: `Força: \`${userdb.força}\`\nVelocidade: \`${userdb.velocidade}\`\nAkuma No Mi: \`${akumaNoMi}\``
      })

      embed = embed.setColor("Red")

      embed = embed.setImage("https://media.discordapp.net/attachments/1155227861838475368/1156720234871402516/Pirate_Flag_of_Jack_Rackham.svg.png?ex=6515ff2a&is=6514adaa&hm=88a1a61e1ef819b7ceef5b2a7cfc0a6e3679f8a4ee30af38f7acbb52e00cd9b4&")

        let button = new ActionRowBuilder()
       .addComponents(
         new ButtonBuilder()
         .setLabel("Cartaz de Procurado")
         .setStyle(ButtonStyle.Primary)
         .setCustomId("cartazDeProcurado")
       )

      message.reply({
        content: `${message.author}`,
        embeds: [embed],
        components: [button]
      })
      
    }

   /* await message.reply({
      content: `${message.author}`,
      embeds: [embed]
    })*/
  },
};
