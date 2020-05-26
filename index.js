const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const client = new Discord.Client();
const db = require('quick.db');
const ms = require("ms");
const canvas = require("discord-canvas"),
welcomeCanvas = new canvas.Welcome();
const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require("music-uplife");

module.exports = {

bot: client,

version: require("./package.json").version,
   
  start(token, game, name, stats, Prefix, owner, op) {
  if (!token)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot token or invite bot token"
    );
  if (!game)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot game"
    );

  if (!name)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot game playing status"
    );

  if (!stats)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot status"
    );
 /*  if (!status)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me status"
    ); */
  if (!Prefix)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot prefix"
    );
  
  if (!owner)
    return console.log(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot Owner id"
    );
 if (op.music === "true") {
  if(!op.youtubekey) return console.log("[uplife-api]{type: error} ⚠️: make sure your give me youtube v3 api key for music");
  const player = new Player(client, op.youtubekey);
client.player = player;
  }
  
client.on("error", e => {
  console.log("[ERROR] " + e);
});
client.on("disconnected", () => {
  console.log("[WARN] Disconnected from Discord");
  console.log("[LOG] Attempting to log in...");
  client.login(token);
});
    
const GiveawayManagerWithShardSupport = class extends GiveawaysManager {

    async refreshStorage(){
        return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
    }

};

// Create a new instance of your new class
const manager = new GiveawayManagerWithShardSupport(client, {
    storage: __dirname+"/giveaway.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: op.embedcolor,
        reaction: op.reaction
    }
});
client.giveawaysManager = manager;


    client.on("ready", () => {
      console.log(
        "[uplife-api]{type: successfully} ✔️bot online: " +
          client.user.tag +
          " here bot Invite link: " +
          `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`
      );
      
      setInterval(() => {
        var d = Date();
        let a = d.toString();
        const la = game
          .replace("{guilds}", client.guilds.cache.size)
          .replace("{users}", client.users.cache.size)
          .replace("{realTime}", a)
          .replace("{prefix}", Prefix);
        client.user.setPresence({
          activity: {
            name: `${la}`,
            type: `${name}`
          },
          status: `${stats}`
        });
      }, 120000);
   
client.on("shardReady", (shardID) => {
            client.shard.broadcastEval(`
                let logsChannel = client.channels.cache.get("649928981977628673");
        
                if(logsChannel) logsChannel.send('⭕ | Shard #${shardID} is ready!');
            `);
        });
  client.on("shardDisconnect", (shardID) => {
            client.shard.broadcastEval(`
                let logsChannel = client.channels.cache.get("649928981977628673");
    
                if(logsChannel) logsChannel.send('💤 | Shard #${shardID} is disconnected...');
            `);
        });
        client.on("shardReconnecting", (shardID) => {
            client.shard.broadcastEval(`
                let logsChannel = client.channels.cache.get("649928981977628673");
                if(logsChannel) logsChannel.send('⚠️ | Shard #${shardID} is reconnecting...');
            `);
        });
      client.on("shardResume", (shardID) => {
        client.shard.broadcastEval(`
                let logsChannel = client.channels.cache.get("649928981977628673");
                if(logsChannel) logsChannel.send('🍏 | Shard #${shardID} has resumed!');
            `);
      
        });
    });
client.on("message", msg => {
 if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
    const message = msg;
let prefix = db.get(`prefix_${msg.guild.id}`)||Prefix;
 if (!msg.content.startsWith(Prefix)) return; 
   /* reset-prefix Command */
      if (msg.content === `${Prefix}reset-prefix`) {
if(!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply({ 
embed:{ 
title: "only Admin parmission user use this Command.", 
color: 0xff0000
}});
  db.set(`prefix_${msg.guild.id}`, Prefix);
msg.channel.send({ embed: {
title: `✅ | successfully reset prefix to ${Prefix}`,
color: 0x00ff00
 }});
  }  
});  
  
  
  client.on("message", msg => {
 if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
let prefix = db.get(`prefix_${msg.guild.id}`)||Prefix;
const message = msg;
    
    if (msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
      msg.channel.send({ embed:{ title: "My prefix in this server is set to: `"+prefix+"`\nTo reset to default execute `"+Prefix+"reset-prefix` command!", color: 0x0022ff}});
    }
    if (!msg.content.startsWith(prefix)) return;
    if(op.util === "true"){
    /* Util commands */
    if (msg.content === prefix + "ping") {
      msg.channel.send({
        embed: { title: `🏓 **pong** ` + "`" + client.ws.ping + "`" + `ms` }
      });
    }
if(msg.content === prefix + "invite") { 
  msg.channel.send({
    embed: { 
      title: 'Thanks for choosing me!:blush:',
    description: `To add me, follow [this URL](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`
      
    }
  });
}
    if (msg.content === prefix + "botinfo") {
      msg.channel.send({
        embed: {
          title: "Bot info",
          description:
            `name: ${client.user.tag}\nprefix: ${Prefix}\nowner: **${
              client.users.cache.find(e => e.id === owner).tag
            }**\nServers: **${client.guilds.cache.size}**\nMembers: **${
              client.users.cache.size
            }**\nLibrary: **uplife-api**\nUptime:` +
            "`" +
            `${moment.duration(client.uptime).format("d[d] h[h] m[m] s[s]")}` +
            "`",
          image: {
            url:
              "https://cdn.discordapp.com/attachments/580808905979068484/590192336265543681/Tw_1-1.gif"
          },
          color: 0x00ff00
        }
      });
    }
    } 
    if(op.help === "true"){
    if (msg.content === prefix + "help") {
      let Op = new Discord.MessageEmbed()
        Op.setTitle(`help Command | my prefix: ${prefix}`)
 if(op.mod === "true"){       
Op.addField(`MOD COMMANS`, "`setprefix,kick,ban,warm,clear,unban,mute,unmute`", true)
        }
if(op.util === "true"){
Op.addField(
          `UTIL COMMANDS`,
          "`botinfo,ping,help,serverinfo,userinfo,invite`",
          true
        )
}
  if(op.economy === "true"){   
   Op.addField(
          `ECONOMY COMMANDS`,
          "`balance,addmoney,work,daily,resetdaily,leaderboard,dice,delete,coinflip,slots,transfer`",
          true
        )
}
if(op.music === "true"){
        Op.addField(
          `Music COMMANDS`,
          "`play,skip,stop,setvolume,nowplaying,loop-on,loop-off,queue,clear-queue,pause,resume`",
          true
        )
}
if(op.giveaway === "true"){
        Op.addField(`GIVEAWAY COMMANDS`, "`start-giveaway,end-giveaway,reroll-giveaway`", true)
}
if(op.welcomer === "true"){
       Op.addField(`WELCOMER COMMANDS`, "`setimage,setchannel,setcolor,setmessage,weltest`", true)
    }
        Op.addField(`ONWER COMMANDS`, "`serverlist,restart`", true)
        Op.setColor("RANDOM");
      msg.channel.send(Op);
   }
    }   
  });
  
  
  
  client.on("message", async msg => {
    if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
    const message = msg;
 let prefix = db.get(`prefix_${msg.guild.id}`)||Prefix;
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    if(op.util === "true"){
    if (command === "userinfo") {
      let inline = true;
      let resence = true;
      const status = {
        online: "🍏 Online",
        idle: "🌙 Idle",
        dnd: "🔴 Do Not Disturb",
        offline: "⚪ Offline/Invisible"
      };

      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;
      let target = message.mentions.users.first() || message.author;
      let bot;
      if (member.user.bot === true) {
        bot = "✅ Yes";
      } else {
        bot = "❌ No";
      }

      let embed = new Discord.MessageEmbed()
        //.setAuthor(member.user.username)
        .setThumbnail(target.displayAvatarURL())
        .setColor("#00ff00")
        .addField("Full Username", `${member.user.tag}`, inline)
        .addField("ID", member.user.id, inline)
        .addField(
          "Nickname",
          `${
            member.nickname !== null
              ? `✅ Nickname: ${member.nickname}`
              : "❌ None"
          }`,
          true
        )
        .addField("Bot", `${bot}`, inline, true)
        .addField(
          "Status",
          `${status[member.user.presence.status]}`,
          inline,
          true
        )
        .addField(
          "Playing",
          `${
            member.user.presence.activities
              ? `✅ ${member.user.presence.activiy}`
              : "❌ Not playing"
          }`,
          inline,
          true
        )
        .addField(
          "Roles",
          `${member.roles
            .filter(r => r.id !== message.guild.id)
            .map(roles => `<@&${roles.id}>`)
            .join(" **|** ") || "❌No Roles"}`,
          true
        )
        .addField("Joined Discord At", "`"+moment.utc(member.user.createdAt).format('DD/MM/YYYY | HH:mm:ss')+"`", true)
        .setFooter(`Information about ${member.user.username}`)
        .setTimestamp();

      message.channel.send(embed);
    } else if (command === "serverinfo") {
      let ops = new Discord.MessageEmbed()
   ops.setTitle("serverinfo")
   ops.setColor("#ccffff")
  if(msg.guild.icon){
  ops.setThumbnail(msg.guild.iconURL({ size: 2048 }))
                    }
        ops.addField("📂server name", msg.guild.name, true)
        ops.addField("🆔server id", `${msg.guild.id}`, true)
        ops.addField(
          "🏂server Boosts", `${msg.guild.premiumSubscriptionCount || 0}`, true)
        ops.addField("👑server Onwer", `<@${msg.guild.owner.user.id}>`, true)
        ops.addField("🔖server Region", `${msg.guild.region}`, true)
        ops.addField("💤server afk channel", `${msg.guild.afkChannel || "no afk channel"}`, true)
        ops.addField("📜server roles", `${msg.guild.roles.cache.size || 0}`, true)
        ops.addField("😎server emojis", `${msg.guild.emojis.cache.size || 0}`, true)
        ops.addField("📡server channels", `${msg.guild.channels.cache.size || 0}`, true)
        ops.addField("🎪server Create", "`"+`${moment.utc(msg.guild.createdAt).format('DD/MM/YYYY | HH:mm:ss')}`+"`", true);
      msg.channel.send(ops);
    }
    } 
      /* start owner commands */
    
      if(command === "restart"){
   if(message.author.id === owner){
       process.exit(1);
      } else {
        message.channel.send(":x:your not my owner");
      } 
      } else
      if(command === "serverlist"){
      if(message.author.id === owner){
     
    await message.delete();

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let utils = {
   TOTAL_SERVERS : "Total Servers",
      MEMBERS: "Members",
          PAGE: "Page"
        };

        let description = 
        `${utils.TOTAL_SERVERS} : ${message.client.guilds.cache.size}\n\n`+
        message.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
        .slice(0, 10)
        .join("\n");

        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("0099ff")
            .setFooter(client.user.username)
            .setTitle(`${utils.PAGE}: ${page}/${Math.ceil(client.guilds.cache.size/10)}`)
            .setDescription(description);

        let msg = await message.channel.send(embed);
        
        await msg.react("⬅️");
        await msg.react("❌");
        await msg.react("➡️");

        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async(reaction, user) => {

            if(reaction._emoji.name === "⬅️") {

                // Updates variables
                i0 = i0-10;
                i1 = i1-10;
                page = page-1;
                
                // if there is no guild to display, delete the message
                if(i0 < 0){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                
                description = `${utils.TOTAL_SERVERS} : ${client.guilds.cache.size}\n\n`+
                client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
                .slice(i0, i1)
                .join("\n");

                // Update the embed with new informations
                embed.setTitle(`${utils.PAGE}: ${page}/${Math.round(client.guilds.cache.size/10)}`)
                .setDescription(description);
            
                // Edit the message 
                msg.edit(embed);
            
            };

            if(reaction._emoji.name === "➡️"){

                // Updates variables
                i0 = i0+10;
                i1 = i1+10;
                page = page+1;

                // if there is no guild to display, delete the message
                if(i1 > client.guilds.cache.size + 10){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                description = `${utils.TOTAL_SERVERS} : ${client.guilds.cache.size}\n\n`+
      client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
                .slice(i0, i1)
                .join("\n");
                /* Update the embed with new informations */             embed.setTitle(`${utils.PAGE}: ${page}/${Math.round(client.guilds.cache.size/10)}`)               .setDescription(description);          
                // Edit the message 
                msg.edit(embed);
            };
            if(reaction._emoji.name === "❌"){
                return msg.delete(); 
            }
            // Remove the reaction when the user react to the message
            await reaction.users.cache.remove(message.author.id);
        });    
        
      } else {
        message.channel.send(":x:your not my owner");
      } 
      }
      /* start giveaway commands */
  if(op.giveaway === "true"){
      if(command === "start-giveaway"|| command === "sgiveaway"){   if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
      }

    // Giveaway duration
    let giveawayDuration = args[0];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!');
    }
    // Number of winners
    let giveawayNumberWinners = args[1];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }
    // Giveaway prize
    let giveawayPrize = args.slice(2).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: You have to specify a valid prize!');
    }
  client.giveawaysManager.start(message.channel, {
    time: ms(args[0]),
    prize: args.slice(2).join(" "),
    winnerCount: parseInt(args[1]),
    messages: {
        giveaway: op.giveawaymessage,
        giveawayEnded: op.giveawayembed,
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: op.participate,
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
            seconds: "seconds",
            minutes: "minutes",
            hours: "hours",
            days: "days",
            pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
        }
    }
});
  message.channel.send({ embed:{ title: "✅ Successfully start Giveaway", color: 0x00ff00}});   
        
      } else
      if(command === "reroll-giveaway"||command === "rgiveaway"){     if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    } 
                                      let messageID = args[0];              if(!args[0]){
        return message.channel.send(':x: You have to specify a valid message ID!');
    }  
  let giveaway = 
 client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
 client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);
                                                               if(!giveaway){
        return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('Giveaway rerolled!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('This giveaway is not ended!');
        } else {
            console.error(e);
            message.channel.send('An error occured...');
        }
    });
                                                                 
      } else 
      if(command === "end-giveaway"||command === "egiveaway"){
 
if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    } 
        
if(!args[0]){
        return message.channel.send(':x: You have to specify a valid message ID!');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') + '`.');
    }

    // Edit the giveaway
    client.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
    })
    // Success message
    .then(() => {
        // Success message
        message.channel.send('Giveaway will end in less than '+(client.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)){
            message.channel.send('This giveaway is already ended!');
        } else {
            console.error(e);
            message.channel.send('An error occured...');
        }
    });
        
      }    
  }
     /* mod comamnds*/
   if(op.welcomer === "true"){
     if(command === "weltest"){
message.channel.send("✅ | welcome test successfull");
   		client.emit('guildMemberAdd', message.member); 
  } else
 if (command === "setchannel") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          let cha = message.mentions.channels.first();
          if (!cha)
            return message.channel.send({
              embed: {
                title: "❌ | please mention channel",
                color: 0xff0000
              }
            });
          message.channel.send({
            embed: {
              title: "✅ | successfully select channel",
              color: 0x00ff00,
              description: `channel <#${cha.id}>`
            }
          });
          db.set(`channel_${message.guild.id}`, cha.id);
        } else if (command === "setimage") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          let im;
          if(message.attachments.first())im = message.attachments.first().url;
    if(args[0])im = args[0];
          if (!im)
            return message.channel.send({
              embed: {
                title: "❌ | please give me attachment or image url",
                color: 0xff0000
              }
            });
          message.channel.send({
            embed: {
              title: "✅ | successfully set image",
              image: {
                url: im
              },
              color: 0x00ff00
            }
          });
          db.set(`image_${message.guild.id}`, im);
        } else if (command === "setcolor") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me color",
                color: "ff0000"
              }
            });

      if(!args[0].startsWith("#")){
      var color = "#"+args[0];
      } else {
      var color = args[0];
      }
          message.channel.send({
            embed: {
              title: "✅ | successfully set color-" + color,
              color: color
            }
          });
          db.set(`color_${message.guild.id}`, color);
        } else if (command === "setmessage") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me welcome message",
                color: "ff0000"
              }
            });
          
  db.set(`msg_${msg.guild.id}`, args.join(" "));
  msg.channel.send({ embed: {
   title: "`✅` | set welcome message",
   description: args.join(" "),
   color: 0x00ff00
  }});
     }
    }
     if(command === "setprefix"){
if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply({ 
embed:{ 
title: "only Admin parmission user use this Command.", 
color: 0xff0000
}});

      if (args[0].length >= 5)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter prefix that smaller than 5 symbols",
              title: "Error"
            }
          });
db.set(`prefix_${message.guild.id}`, args[0]);
message.channel.send({ embed: {
title: `✅ | successfully set prefix to ${args[0]}`,
color: 0x00ff00
 }});
}
     if(op.mod === "true"){
  if( command === "clear") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "description": "Denied!",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      const amount = parseInt(args[0]);
      if (!amount || amount <= 1 || amount > 101)
        return msg.channel.send({
          embed: {
            title: "Enter number between 2 and 100",
            color: 0xff2222
          }
        });
      msg.channel
        .bulkDelete(amount, true).catch( );
  msg.channel.send({ embed: { title: "✅  `" + args[0] + "` message successfully delete", color: 0x00ff00
    }});
    } else if (command === "ban") {
if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to ban member",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      let BMember = msg.mentions.users.first();
      let BReason = args.slice(1).join(" ");
      if (!BMember)
        return msg.channel.send({
          embed: { title: "user not found🙄(mention user)", color: 0xff0000 }
        });
      if (BMember.id == msg.author.id)
        return msg.reply("are you serious, ban yourself?");
      if (!BReason)
        return msg.channel.send({
          embed: { title: "please give me Reason😌", color: 0xff0000 }
        });
      msg.guild
        .member(BMember)
        .ban({
          reason: BReason
        })
        .then(() => {
          msg.reply({
            embed: {
              title: `✅Successfully banned ${BMember.tag}`,
              color: 0xff0000,
              description: `ban reason: ${BReason}`
            }
          });
        })
        .catch(err => {
          msg.reply("I was unable to ban the member");
          // Log the error
          console.error(err);
        });
    } else if (command === "kick") {
  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to kick member",
      "color": 0xff2222,
      "title": "Error"
    }
  });     
      let KMember = msg.mentions.users.first();
      let KReason = args.slice(1).join(" ");
      if (!KMember)
        return msg.channel.send({
          embed: { title: "user not found🙄", color: 0xff0000 }
        });
      if (KMember.id == msg.author.id)
        return msg.reply("are you serious, kick yourself?");
      if (!KReason)
        return msg.channel.send({
          embed: { title: "please give me Reason😌", color: 0xff0000 }
        });
      msg.guild
        .member(KMember)
        .kick({
          reason: KReason
        })
        .then(() => {
          msg.reply({
            embed: {
              title: `✅Successfully kicked ${KMember.tag}`,
              color: 0xff0000,
              description: `ban reason: ${KReason}`
            }
          });
        })
        .catch(err => {
          msg.reply("I was unable to kick the member");
        });
    } else if(command === "warn"){
let reasons = [
    "I'm sorry, friend, but someone's stray hand today",
    "You asked for it"
  ];

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "Sorry, but you don't have permission to use this!",
      "color": 0xff2222
    }
  });
  let warnedmember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!warnedmember) return message.channel.send({
    embed: {
      "title": "Please mention a user to warn.`😅`",
      "color": 0xff2222
    }
  });
  
  let reason = args.slice(1).join(' ');
  if (!reason) reason = reasons[Math.floor(Math.random() * reasons.length)];
  
if(warnedmember.id === client.user.id) return message.channel.send({embed:{
  title: message.author.username+'your warn me`😶`',
  color: 0xff0000
}});
  
  if(warnedmember.id === owner) return message.channel.send({embed:{
  title: message.author.username+'your warn my Owner`😶`',
  color: 0xff0000
}});

  const warned = new Discord.MessageEmbed()
    .setColor(0xff0000)
    .setDescription(`You have been warned in ${message.guild.name} by ${message.author.username} for: *${reason}*.`)
    .setTitle("Warn")

  let author = message.author.username;

  message.channel.send({
    embed: {
      "description": `***${warnedmember.user.tag} was warned!***\n**Reason: **${reason}`,
      "title": "Warned by " + message.author.username,
      "color": 0xff0000
    }
  });
  await warnedmember.send(warned);      
    } else if (command === "unban") {
      if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to ban member",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      let member = client.users.find(e => e.id === args.join(" "));
      if (!args[0])
        return msg.channel.send({
          embed: { title: "user not found🙄", color: 0xff0000 }
        });
      msg.guild.members.unban(member.id).catch(err => {
        msg.reply("I was unable to unban the member");
      });
      msg.channel.send({
        embed: {
          title: `✅Successfuly unbanned ${member.tag}`,
          color: 0x22ff22
        }
      });
    } else if (command === "mute") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "You don't have permissions, baby",
      "color": 0xff2222
    }
  });
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.channel.send({
    embed: {
      "title": "Couldn't find user :anguished: ",
      "color": 0xff2222
    }
  });
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "The user you are trying to mute is either the same, or higher role than you",
      "color": 0xff2222
    }
  });
  let muterole = message.guild.roles.find(e => e.name === "muted");

  if (!muterole) {
    try {
      muterole = await message.guild.roles.create({ data:{
        name: "muted",
        color: "#000100",
        permissions: []
      }})
      message.guild.channels.forEach(async (channel, id) => {
        await channel.createOverwrite(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  await (tomute.roles.add(muterole.id));
  message.channel.send({
    embed: {
      "title": "Muted",
      "description": `<@${tomute.id}> has been muted by <@${message.author.id}>`,
      "color": 0x00ff00
    }
  });
    } else if (command === "unmute") {
      if (!message.member.hasPermission("MANAGE_MESSAGES"))
        return message.channel.send({
          embed: {
            title: "You don't have permissions, baby",
            color: 0xff2222
          }
        });
      let tomute = message.guild.member(msg.mentions.users.first());
      if (!tomute)
        return message.channel.send({
          embed: {
            title: "Couldn't find user :anguished:(tag User)",
            color: 0xff2222
          }
        });
      if (tomute.hasPermission("MANAGE_MESSAGES"))
        return message.channel.send({
          embed: {
            title:
              "The user you are trying to mute is either the same, or higher role than you",
            color: 0xff2222
          }
        });
      let unmute = msg.guild.roles.find(e => e.name === "muted");
      if (!tomute.roles.has(unmute.id))
        return message.channel.send({
          embed: {
            description: `<@${tomute.id}> already unmuted or haven't been muted`,
            color: 0xff2222,
            title: "Error"
          }
        });
      tomute.roles.remove(unmute.id);
      message.channel.send({
        embed: {
          description: `<@${tomute.id}> has been unmuted by <@${message.author.id}>!`,
          color: 0x22ff22,
          title: "Unmuted"
        }
      });
    } 
   }
          /* music Command */
      if (op.music === "true") {
        if (command === "play" || command === "p") {
if (!message.member.voice.channel)
            return message.channel.send({
              embed: { title: "Join voice channel first!", color: 0xff2222 }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me <Video name or video url>",
                color: 0xff0000
              }
            });
        
 let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          // If there's already a song playing
          if (aSongIsAlreadyPlaying) {
            // Add the song to the queue
            let song = await client.player.addToQueue(
              message.guild.id,
              args.join(" ")
            );
            let data = await Promise.resolve(song.ytdl.getInfo(song.url));
            let songtime = data.length_seconds * 1000;
 message.channel.send(
              new Discord.MessageEmbed()
.setColor("#ccffcc")
.setTitle("Added to queue")            .setThumbnail(song.thumbnail)
.addField("song name:", `**[${song.name}](${song.url})**`, true)
.addField("channel name:", `**${song.author}**`, true)
.addField("video duration:",`**${moment.duration(songtime).format(" H[h] m[m] s[s]")}**`,true)
.setFooter(song.requestedBy.tag, song.requestedBy.displayAvatarURL())
            );
            song.queue.on(
              "songChanged",
              (oldSong, newSong, skipped, repeatMode) => {
                if (repeatMode) {
                  message.channel.send({
                    embed: {
title: `Playing **${newSong.name}** again...`,
thumbnail: { url: song.thumbnail },
 color: 0x00ff00
                    }
                  });
                } else {
                  message.channel.send({
                    embed: {
                      title: `Now playing **${newSong.name}**...`,
thumbnail: { url: song.thumbnail },
        color: 0x00ff00
                    }
                  });
                }
              }
            );
          } else {
            // Else, play the song
            let song = await client.player.play(message.member.voice.channel, args.join(" "), message.author);
            let data = await Promise.resolve(song.ytdl.getInfo(song.url));
            let songtime = data.length_seconds * 1000;
message.channel.send(
              new Discord.MessageEmbed()
.setColor("#ccffcc")
.setTitle("Currently playing")        .setThumbnail(song.thumbnail)
.addField("song name:", `**[${song.name}](${song.url})**`, true)
.addField("channel name:", `**${song.author}**`, true)
.addField("video duration:",`**${moment.duration(songtime).format(" H[h] m[m] s[s]")}**`,true)
.setFooter(song.requestedBy.tag, song.requestedBy.displayAvatarURL())
            );
          }
        } else if (command === "stop") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.stop(message.guild.id);
          message.channel.send({
            embed: { title: "✅ Music stopped!", color: 0x00ff00 }
          });
        } else if (command === "pause") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.pause(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} paused!`, color: 0x00ffcc }
          });
        } else if (command === "resume") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.resume(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} resumed!`, color: 0x00ff00 }
          });
        } else if (command === "setvolume" || command === "volume") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setVolume(message.guild.id, parseInt(args[0]));
          message.channel.send({
            embed: { title: `Volume set to ${args[0]} `, color: 0x0099ff }
          });
        } else if (command === "nowplaying" || command === "np") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.nowPlaying(message.guild.id);
          let data = await Promise.resolve(song.ytdl.getInfo(song.url));
          let songtime = data.length_seconds * 1000;
          let queue = await client.player.getQueue(message.guild.id);
          let now = queue.connection.dispatcher.streamTime;
          message.channel.send({
            embed: {
              title: `Now playing`,
              description: `**[${song.name}](${
                song.url
              })**\nduration-  **${moment
                .duration(now)
                .format(" H[h] m[m] s[s]")} / ${moment
                .duration(songtime)
                .format(" H[h] m[m] s[s]")}**`,
              thumbnail: { url: song.thumbnail },
              color: "RANDOM"
            }
          });
        } else if (command === "loop-on") {
          // Enable repeat mode
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setRepeatMode(message.guild.id, true);
          // Get the current song
          let song = await client.player.nowPlaying(message.guild.id);
          message.channel.send({
            embed: {
              title: `${song.name} will be repeated indefinitely!`,
              color: "RANDOM"
            }
          });
        } else if (command === "loop-off") {
          // Disable repeat mode
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setRepeatMode(message.guild.id, false);
          // Get the current song
          let song = await client.player.nowPlaying(message.guild.id);
          message.channel.send({
            embed: {
              title: `${song.name}  will no longer be repeated indefinitely!`,
              color: "RANDOM"
            }
          });
        } else if (command === "skip") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.skip(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} skipped!`, color: 0xff00ff }
          });
        } else if (command === "queue" || command === "q") {
          let queue = await client.player.getQueue(message.guild.id);
          if (!queue)
            return msg.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          message.channel.send({
            embed: {
              title: "Server queue:",
              color: 0xffff00,
              description: queue.songs
                .map((song, i) => {
                  return `${i === 0 ? "Current" : `#${i + 1}`} - ${
                    song.name
                  } | ${song.author}`;
                })
                .join("\n")
            }
          });
        } else if (command === "clear-queue") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.clearQueue(message.guild.id);
          message.channel.send({
            embed: { title: "✅ Queue cleared!", color: "RANDOM" }
          });
        }
      }
  });

  

client.on('guildMemberAdd', async member => {
   if(op.welcomer === "true"){

  let image = await welcomeCanvas
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setMemberCount(member.guild.memberCount)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ format: 'png', size: 2048 }))
  .setOpacity("border", 0.1)
  .setColor("username-box", "#D3D3D3")
  .setColor("discriminator-box", "#D3D3D3")
  .setColor("message-box", "#D3D3D3")
  .setColor("title", db.get(`color_${member.guild.id}`)||"#ccffcc")
  .setColor("avatar", "#00ff00")
  .setBackground(db.get(`image_${member.guild.id}`)||"https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png")
  .toAttachment();
let attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome.png");

if(db.get(`msg_${member.guild.id}`)){
 var chat = db.get(`msg_${member.guild.id}`).split("{user}").join("<@"+member.user.id+">").split("{servername}").join( member.guild.name).split("{membercount}").join(member.guild.memberCount);
   } else { 
   var chat = `welcome <@${member.user.id}> to **${member.guild.name}**`; 
}
let ch = db.get(`channel_${member.guild.id}`);
if(ch){
var ch1 = member.guild.channels.get(ch);
} else { 
var ch1;
}
 ch1.send(chat, attachment).catch( );
} 
});
    
  client.login(token).catch( );
},
async command(op) {
    client.on("message", async msg => {
      if (msg.channel.type == "dm") return;
      if (msg.author.bot) {
        return;
      }
      var message = msg;
      let prefix = db.get(`prefix_${msg.guild.id}`)||op.prefix;
      if (!msg.content.startsWith(prefix)) return;
      const args = msg.content.slice(prefix.length).split(" ");
      const command = args.shift().toLowerCase();

      var guildicon = message.guild.icon
        ? `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";

      if (command === op.name) {
        if (op.dm === "true") {
          var ssl = message.author;
        } else {
          var ssl = message.channel;
        }
        if (op.msgreact) {
          let react = client.emojis.find(e => e.name === op.msgreact);
          msg.react(react.id);
        }
        if (op.msgdelete) {
          msg.delete({ timeout: op.msgdelete || 10 });
        }

        if (op.send) {
          ssl
            .send(
              op.send
                .split("{guildid}")
                .join(message.guild.id)
                .split("{guildname}")
                .join(message.guild.name)
                .split("{ping}")
                .join(client.ws.ping)
                .split("{authorid}")
                .join(message.author.id)
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL({ size: 2048 }))
                .split("{authorcreate}")
                .join(
                  moment
                    .utc(message.author.createdAt)
                    .format("dddd, MMMM Do YYYY, HH:mm:ss")
                )
                .split("{args}")
                .join(args.join(" "))
            )
            .then(message => {
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.id === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.embed) {
          let embed = op.embed;
          let ha = new Discord.MessageEmbed();
          if (embed.title) {
            ha.setTitle(op.embed.title);
          }
          if (embed.image) {
            ha.setImage(
              op.embed.image
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }
          if (embed.thumbnail) {
            ha.setThumbnail(
              op.embed.thumbnail
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }
          if (embed.color) {
            ha.setColor(op.embed.color);
          }
          if (embed.message) {
            ha.setDescription(
              op.embed.message
                .split("{ping}")
                .join(client.ws.ping)
                .split("{authorid}")
                .join(message.author.id)
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL({ size: 2048 }))
                .split("{guildid}")
                .join(message.guild.id)
                .split("{guildname}")
                .join(message.guild.name)
                .split("{authorcreate}")
                .join(
                  moment
                    .utc(message.author.createdAt)
                    .format("dddd, MMMM Do YYYY, HH:mm:ss")
                )
                .split("{args}")
                .join(args.join(" "))
            );
          }
          if (embed.url) {
            ha.setURL(op.embed.url);
          }
          if (embed.author) {
            ha.setAuthor(
              op.embed.author.name,
              op.embed.author.icon
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon),
              op.embed.author.url
            );
          }
          if (embed.timestamp) {
            ha.setTimestamp(
              op.embed.timestamp.split("{nowdate}").join(new Date())
            );
          }
          if (embed.footer) {
            ha.setFooter(
              op.embed.footer.text,
              op.embed.footer.icon
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }

          ssl
            .send(ha)
            .then(message => {
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.id === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.reply) {
          ssl
            .send(
              `<@${message.author.id}>, ` +
                op.reply
                  .split("{guildid}")
                  .join(message.guild.id)
                  .split("{guildname}")
                  .join(message.guild.name)
                  .split("{ping}")
                  .join(client.ws.ping)
                  .split("{authorid}")
                  .join(message.author.id)
                  .split("{authoravatar}")
                  .join(message.author.displayAvatarURL({ size: 2048 }))
                  .split("{authorcreate}")
                  .join(
                    moment
                      .utc(message.author.createdAt)
                      .format("dddd, MMMM Do YYYY, HH:mm:ss")
                  )
                  .split("{args}")
                  .join(args.join(" "))
            )
            .then(message => {
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.id === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.file) {
          let attachment = new Discord.MessageAttachment(
            op.file
              .split("{guildid}")
              .join(message.guild.id)
              .split("{guildname}")
              .join(message.guild.name)
              .split("{ping}")
              .join(client.ws.ping)
              .split("{authorid}")
              .join(message.author.id)
              .split("{authoravatar}")
              .join(message.author.displayAvatarURL({ size: 2048 }))
              .split("{authorcreate}")
              .join(
                moment
                  .utc(message.author.createdAt)
                  .format("dddd, MMMM Do YYYY, HH:mm:ss")
              )
              .split("{args}")
              .join(args.join(" "))
          );
          ssl
            .send(attachment)
            .then(message => {
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.id === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
      }
    });
  },

  async guildadd(o) {
    client.on("guildCreate", async guild => {
      let icon = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";
      var op = client.channels.find(e => e.name === o.channelname).id;
      if (!o.channelname) op = o.channelid;
      let channel = client.channels.get(op);
      channel.send({
        embed: {
          title: o.title,
          thumbnail: { url: o.thumbnail.replace("{guildicon}", icon) },
          description: o.message
            .replace("{guildname}", guild.name)
            .replace("{guildid}", guild.id)
            .replace("{guildmember}", guild.memberCount)
            .replace("{guildownerid}", guild.owner.user.id)
            .replace("{guildownertag}", guild.owner.user.tag),
          color: o.color
        }
      });
    });
  },

  async guildremove(o) {
    client.on("guildDelete", async guild => {
      let icon = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";
      var op = client.channels.find(e => e.name === o.channelname).id;
      if (!o.channelname) op = o.channelid;
      let channel = client.channels.get(op);
      channel.send({
        embed: {
          title: o.title,
          thumbnail: { url: o.thumbnail.replace("{guildicon}", icon) },
          description: o.message
            .replace("{guildname}", guild.name)
            .replace("{guildid}", guild.id)
            .replace("{guildmember}", guild.memberCount)
            .replace("{guildownerid}", guild.owner.user.id)
            .replace("{guildownertag}", guild.owner.user.tag),
          color: o.color
        }
      });
    });
  },
  async getvar(o) {
    let hao = db.get(`${o.name}_${o.id}`);
    return hao;
  },

  async servervar(o) {
    db.set(`${o.name}_${o.id}`, o.value);

    console.log(
      `server var name-${o.name} server id-${o.id} server value-${o.value}`
    );
  },

  async uservar(o) {
    db.set(`${o.name}_${o.id}`, o.value);

    console.log(
      `user var name-${o.name} user id-${o.id} user value-${o.value}`
    );
  },
  async msgdelete(o) {
    client.on("messageDelete", async msg => {
      let message = msg;

      if (message.channel.type !== "dm") {
        var content = "";
        if (message.content) {
          content = message.content;
        } else {
          content = "<<NO CONTENT>>";
        }

        const embed = new Discord.MessageEmbed()
          .setColor(o.color)
          .setTitle("Message Deleted")
          .addField(
            `User`,
            `<@${message.author.id}> (${message.author.tag})`,
            true
          )
          .addField(`Content`, `${content}`, true)
          .addField(
            `Channel`,
            `<#${message.channel.id}> (${message.channel.name})`,
            true
          );
        if (message.guild.channels.find(e => e.id === o.channelid)) {
          message.guild.channels
            .find(e => e.id === o.channelid)
            .send(embed)
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log(
            `Unable to send message to modLogChannel (${o.channelid})`
          );
        }
      }
    });
  },

  async msgupdate(o) {
    client.on("messageUpdate", function(oldMessage, newMessage) {
      if (
        newMessage.channel.type == "text" &&
        newMessage.cleanContent != oldMessage.cleanContent
      ) {
        var log = newMessage.guild.channels.find(e => e.id === o.channelid);
        log.send({
          embed: {
            color: o.color,
            title: "MESSAGE UPDATE",
            fields: [
              {
                name: "Message send by",
                value: `${newMessage.author}`
              },
              {
                name: "Old message",
                value: `~~${oldMessage.cleanContent}~~`
              },
              {
                name: "New message",
                value: `**${newMessage.cleanContent}**`
              },
              {
                name: "Message link",
                value: `**[click me](${newMessage.url})**`
              }
            ],
            timestamp: new Date(),
            footer: {
              text: "logs",
              icon_url: newMessage.author.displayAvatarURL()
            }
          }
        });
      }
    });
  }
};
