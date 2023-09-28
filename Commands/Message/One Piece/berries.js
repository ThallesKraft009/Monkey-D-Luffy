import { PermissionFlagsBits } from "discord.js";

import { db } from "../../../mongodb/user.js";
/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "berries",
  description: "",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let member;

    if (!message.mentions.users.first()) {
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

    let text;
    if (member.id === message.author.id) {
      text = `💵 | Você tem **\`${userdb.berries}\`** berries!`;
    } else {
      text = `💵 | ${member} tem **\`${userdb.berries}\`** berries!`
    };
    

    message.reply({
      content: text
    })


    
  },
};
