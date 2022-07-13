const { Util, MessageEmbed, SnowflakeUtil } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "ranking",
  description: "View the DJ ranking!",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lb", "leaderboard"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const filtered = await client.database.likes
      .filter((p) => p.guild === message.guild.id)
      .array();
    const sorted = filtered.sort((a, b) => b.likes - a.likes);
    const top10 = sorted.splice(0, 10);

    const embed = new MessageEmbed()
      .setAuthor("DJ Leaderboard", message.guild.iconURL())
      .setColor(client.botconfig.EmbedColor);
    let i = 0;
    for (const data of top10) {
      i = i + 1;
      try {
        embed.addField(
          `${i}) ${client.users.cache.get(data.user).tag}`,
          `${data.likes} likes`
        );
      } catch {
        embed.addField(`${i}) <@${data.user}>`, `${data.likes} likes`);
      }
    }
    return message.channel.send({ embed });
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const filtered = await client.database.likes
        .filter((p) => p.guild === interaction.guild_id)
        .array();
      const sorted = filtered.sort((a, b) => b.likes - a.likes);
      const top10 = sorted.splice(0, 10);

      const embed = new MessageEmbed()
        .setAuthor("DJ Leaderboard", interaction.guild.iconURL())
        .setColor(client.botconfig.EmbedColor);
      let i = 0;
      for (const data of top10) {
        i = i + 1;
        try {
          embed.addField(
            `${i}) ${client.users.cache.get(data.user).tag}`,
            `${data.likes} likes`
          );
        } catch {
          embed.addField(`${i}) <@${data.user}>`, `${data.likes} likes`);
        }
      }
      await interaction.send(embed);
    },
  },
};
