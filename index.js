const DiscordMusicBot = require("./src/structures/DiscordMusicBot");
const client = new DiscordMusicBot();

client.build();

module.exports = client;
