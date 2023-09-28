import { PermissionsBitField } from "discord.js";
import { cooldown } from "../handlers/functions.js";

/**
 * @type {import("..").EventHandler}
 */
export default {
  name: "messageCreate",

  run: async (client, message) => {
    // code
    if (message.author.bot || !message.guild || !message.id) return;
    let prefix = client.config.PREFIX;

    let mentionprefix = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!mentionprefix.test(message.content)) return;
    const [, nprefix] = message.content.match(mentionprefix);
    const args = message.content.slice(nprefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
      if (nprefix.includes(client.user.id)) {
        return client.sendEmbed(
          message,
          ` ${client.config.emoji.success} para ver meus comandos use \`/help\` ou \`${prefix}help\``
        );
      }
    }
    /**
     * @type {import("..").Mcommand}
     */
    const command =
      client.mcommands.get(cmd) ||
      client.mcommands.find(
        (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
      );
    let Owners = client.config.Owners;
    if (!command) return;
    if (command) {
      if (command.owneronly && !Owners.includes(message.author.id)) {
        return client.sendEmbed(
          message,
          `Apenas: ${Owners.map((m) => `<@${m}>`)} podem usar o comando.`
        );
      } else if (
        command.userPermissions &&
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.userPermissions)
        )
      ) {
        return client.sendEmbed(
          message,
          `Você não tem a permissão necessária!`
        );
      } else if (
        command.botPermissions &&
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve(command.botPermissions)
        )
      ) {
        return client.sendEmbed(message, `Eu não tenho a permissão necessária!`);
      } else if (cooldown(message, command)) {
        return client.sendEmbed(
          message,
          ` Você acabou de usar o comando, espere \`${cooldown(
            message,
            command
          ).toFixed()}\` segundos para usar novamente!`
        );
      } else {
        try {
        command.run(client, message, args, prefix);
        } catch (err) {
          message.reply({
            content: `:x: | Ocorreu um erro ao executar esse comando..\n\`\`\`\n${err}\n\`\`\``
          })
        }
      }
    }
  },
};

function escapeRegex(newprefix) {
  return newprefix?.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
