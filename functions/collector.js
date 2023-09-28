import {client} from '../index.js';

async function Collector(func) {
  client.on("interactionCreate", async (i) => {
    try {
    await func(i);
    } catch (err) {
      i.reply({
        content: `❌ | Ocorreu um erro ao executar essa interação..\n\`\`\`\n${err}\n\`\`\``,
        ephemeral: true
      })
    }
  });
}

export default Collector;