import { InteractionType, PermissionsBitField, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from "discord.js";
import { db } from '../mongodb/guild.js';

/**
 * @type {import("..").EventHandler}
 */
export default {
  name: "interactionCreate",

  run: async (client, interaction) => {
    // code
    if (interaction.user.bot || !interaction.guild) return;
    if (interaction.type == InteractionType.ApplicationCommand) {
      const command = client.scommands.get(interaction.commandName);
      if (!command) {
        return client.send(interaction, {
          content: `\`${interaction.commandName}\` está inválido`,
          ephemeral: true,
        });
      } else {
        if (
          command.userPermissions &&
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPermissions)
          )
        ) {
          return client.sendEmbed(
            interaction,
            `Você não tem a permissão necessária!`
          );
        } else if (
          command.botPermissions &&
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPermissions)
          )
        ) {
          return client.sendEmbed(
            interaction,
            `Eu não tenho permissão!`
          );
        } else {
          command.run(client, interaction);
        }
      }
    } else if (interaction.isButton()){
      if (interaction.customId === "ticket-abrir"){

        let guilddb = await db.findOne({
         guild: interaction.guild.id
     })
      
     if(!guilddb){
         const newuser = new db({ guild: interaction.guild.id })
         await newuser.save();
         
         guilddb = await db.findOne({ guild: interaction.guild.id })
     }

        

        let cargos = guilddb.ticket;
        
 let cargo = getByKeyName(cargos, `${interaction.message.id}`)
cargo = interaction.guild.roles.cache.get(cargo);
        

    try {
  let channel = await interaction.guild.channels.create({
	       name: `ticket_${interaction.user.username}`,
	       type: ChannelType.GuildText,
        	permissionOverwrites: [
	      	   {
		          	id: interaction.guild.id,
		          	deny: [PermissionsBitField.Flags.ViewChannel],
	          	},	{
		         	id: interaction.user.id,
			        allow: [PermissionsBitField.Flags.ViewChannel],
	          	},{
               id: cargo.id,
			        allow: [PermissionsBitField.Flags.ViewChannel],
              },
	          ],
});

      interaction.reply({
        content: `Ticket criado sm ${channel}!`,
        ephemeral: true
      })

      channel.send({
        content: `${interaction.user} ||${cargo}||`,
        embeds: [new EmbedBuilder()
                .setTitle("Ticket aberto!")
                .setDescription("Para fechar o ticket, aperte no botão abaixo!")
                .setColor("Yellow")
                .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`
                })],
        components: [new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setLabel("Fechar")
              .setCustomId("ticket-fechar")
              .setStyle(ButtonStyle.Danger))]
      })
    } catch (err) {
      console.log(err)
      await interaction.reply({
        content: `:x: | Ocorreu um erro ao criar o ticket...\`\`\`\n${err}\n\`\`\``,
        ephemeral: true
      })
    }
        
      }
  if (interaction.customId === "ticket-fechar"){
    await interaction.reply({
      content: "Ticket fechando em 5 segundos.."
    })

           setTimeout(async() => {
             await interaction.channel.delete();
           })
  }
    }
  },
};

function getByKeyName(array, keyName) {
   for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      if (obj.hasOwnProperty(keyName)) {
         return obj[keyName];
      }
   }
   return undefined; // Se não encontrar a chave, retorna undefined
  }