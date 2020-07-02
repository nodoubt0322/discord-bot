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
  const username = message.author.username;

  if (!summary[username]) summary[username] = 0;
  summary[username]++;

  const data = JSON.stringify(summary, null, 2);
  fs.writeFileSync("./summary.json", data);

  if (message.content === "!發言") {
    const arr = [];
    Object.keys(summary).forEach((name) => {
      const times = summary[name];
      arr.push(`${name}發言:   ${times}次`);
    });
    message.channel.send(arr);
    message.channel.send("以上");
  }

  if (message.content === "!未發言") {
    const noTalkArr = Object.keys(summary).filter((item) => summary[item] === 0);
    message.channel.send("尚未發言的有:");
    message.channel.send(noTalkArr);
    message.channel.send("以上");
  }

  // 產生所有人的名單 1
  if (message.content === "!更新名單") {
    message.channel.members.forEach((value) => {
      const name = value.user.username;
      if (!summary[name]) summary[name] = 0;
      const data = JSON.stringify(summary, null, 2);
      fs.writeFileSync("./summary.json", data);
      message.channel.send("名單已更新");
    });
  }

  if (message.content === "!清空" && username === "nodoubt0322") {
    Object.keys(summary).forEach((name) => (summary[name] = 0));
    const data = JSON.stringify(summary, null, 2);
    fs.writeFileSync("./summary.json", data);
    message.channel.send("發言次數已重置");
  }

  // gif
  const content = encodeURI(message.content.split(" ")[1]) || "fail";
  if (message.content.startsWith("!圖片")) {
    giphy.search("gifs", { q: content }).then((res) => {
      const { length } = res.data;
      const index = Math.floor(Math.random() * length) + 1;
      message.channel.send({ files: [res.data[index].images.fixed_height.url] });
    });
  }
});

client.login(process.env.TOKEN);
