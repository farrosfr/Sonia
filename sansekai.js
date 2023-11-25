const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./key.json");

module.exports = sansekai = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    //var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    //const isCmd2 = body.startsWith(prefix);
    const command = body.trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (!m.isGroup) {
      console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
    } else if (m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

    const joinPhrases = [
      "bergabung",  
      "joined",  
    ];
    
    if (joinPhrases.some(
      phrase => body.toLowerCase().includes(phrase.toLowerCase())
      )) { 
      const welcomeMsg = `Selamat datang di grup, @${m.chat} !`;
      client.sendMessage(m.chat, welcomeMsg);
    }
    
    if (true) {
      switch (command) {
        case "sonia": case "/sonia": case "sonia,": case "/sonia,":
          try {
            // tidak perlu diisi apikeynya disini, karena sudah diisi di file key.json
            if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${command} Apa itu resesi`);
            const configuration = new Configuration({
              apiKey: setting.keyopenai,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createChatCompletion({
          model: "gpt-4-1106-preview",
          messages: [
            {"role": "system", "content": "Nama anda adalah Sonia, Asisten AI Solar Nusantara (perusahaan energi terbarukan) yang lucu."},
            {"role": "system", "content": "Tedi Wintoko adalah co-founder: solar-nusantara.id, sonus.id, Indonesiaterang.id, layana.id (perusahaan IT), token-anagata.id."},
            {"role": "system", "content": "Jika ada pertanyaan seputar produk energi baru dan paket material bisa kunjungi web https://sonus.id atau hubungi whatsapp +6282180000575."},
            {role: "user", content: text}],
          });
          m.reply(`${response.data.choices[0].message.content}`);
          } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
          } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error :"+ error.message);
          }
        }
          break;
        case "img": 
          try {
            // tidak perlu diisi apikeynya disini, karena sudah diisi di file key.json
            if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
            if (!text) return reply(`Membuat gambar dari AI.\n\nContoh:\n${command} Wooden house on snow mountain`);
            const configuration = new Configuration({
              apiKey: setting.keyopenai,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createImage({
              model:"dall-e-3",
              prompt: text,
              n: 1,
              size: "1024x1024", // you can change the size of the image here
            });
            //console.log(response.data.data[0].url) // see the response
            client.sendImage(from, response.data.data[0].url, text, mek);
            } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
          } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error :"+ error.message);
          }
        }
          break;
          case "sc": 
           m.reply("Bot ini menggunakan script dari https://github.com/Sansekai/Wa-OpenAI");
          break
        default: {
          if (budy.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!budy.toLowerCase()) return;
            if (argsLog || (!m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
            } else if (argsLog || (m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
            }
          }
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});


