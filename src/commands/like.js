const { Util, MessageEmbed, SnowflakeUtil } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "like",
  description: "Like your favorite songs",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to like a song**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **You must be in the same voice channel as me to use this command!**"
      );
    const player_exists = await client.Manager.get(message.guild.id);
    if (!player_exists)
      return client.sendTime(
        message.channel,
        ":x: | **There is nothing playing right now...**"
      );

    const key = `${message.guild.id}-${player_exists.queue.current.requester.id}`;
    await client.database.likes.ensure(key, {
      user: player_exists.queue.current.requester.id,
      guild: message.guild.id,
      likes: 0,
    });
    await client.database.likes.inc(key, "likes");
    const embed = new MessageEmbed()
      .setAuthor(`Like`, client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .setDescription(
        `I have given a like to the user who added the current song to the queue!`
      );
    await message.channel.send(embed);
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **You must be in a voice channel to use this command.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **You must be in the same voice channel as me to use this command!**"
        );

      const player_exists = await client.Manager.get(interaction.guild_id);
      if (!player_exists)
        return client.sendTime(
          interaction,
          ":x: | **There is nothing playing right now...**"
        );

      const key = `${interaction.guild_id}-${player_exists.queue.current.requester.id}`;
      await client.database.likes.ensure(key, {
        user: player_exists.queue.current.requester.id,
        guild: interaction.guild_id,
        likes: 0,
      });
      await client.database.likes.inc(key, "likes");
      const embed = new MessageEmbed()
        .setAuthor(`Like`, client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `I have given a like to the user who added the current song to the queue!`
        );
      await interaction.send(embed);
    },
  },
};
