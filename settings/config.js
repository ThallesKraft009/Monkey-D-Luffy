import { Colors } from "discord.js";

const settings = {
  TOKEN: process.env.token || "Bot_Token",
  PREFIX: ";",
  Owners: ["890320875142930462"],
  Slash: {
    Global: false,
    GuildID: process.env.GuildID || "1134057488518500374",
  },
  embed: {
    color: Colors.Blurple,
    wrongColor: Colors.Red,
  },
  emoji: {
    success: "✅",
    error: "❌",
  },
};

export default settings;
