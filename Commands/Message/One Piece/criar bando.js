import { PermissionFlagsBits } from "discord.js";

import { db } from "../../../mongodb/user.js";

/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "criar-bando",
  description: "",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let userdb = await db.findOne({
         userID: message.author.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: message.author.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: message.author.id })
     }

    if (userdb.pirata.bando !== "não-tem") return message.reply({
      content: `Oxente, você já está em um bando pirata. Saia do seu bando primeiro!`
    })

    let nome = args.join(" ");

    if (!nome) return message.reply({
      content: `Você esqueceu de inserir o nome do seu bando. Eita que capitão esperto!\n**\`;criar-bando <nome do bando>\`**`
    })

    await message.reply({
      content: `Seu bando pirata foi criado!`
    })

    let todos = [];
    todos.push({
      _id: `${message.author.id}`
    })

    await db.updateOne({
         userID: message.author.id
     }, { $set: {
         "pirata.bando": `${nome}`,
         "pirata.tripulação": todos
     }
     })
  },
};
