const fs = require("fs");
const Discord = require("discord.js");
// const { token } = require("./config.json");
const client = new Discord.Client();
const GphApiClient = require("giphy-js-sdk-core");
const giphy = GphApiClient("QTT424cEg6KX2IOv1KJ6mCKnTWOmTMhI");
const summary = require("./summary.json");

client.once("ready", () => {
  console.log("ready");
});

client.on("message", (message) => {
  // gif
  const content = encodeURI(message.content.replace("!圖片 ", "")) || "fail";
  if (message.content.startsWith("!圖片")) {
    giphy.search("gifs", { q: content }).then((res) => {
      const { length } = res.data;
      const index = Math.floor(Math.random() * length) + 1;
      message.channel.send({ files: [res.data[index].images.fixed_height.url] });
    });
  }
});

client.login(process.env.TOKEN);
