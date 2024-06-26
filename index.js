const { Client, GatewayIntentBits, ThreadChannel } = require("discord.js");
require("dotenv/config"); // ex: ts=2 sw=2

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

const encode = a => a

client.on('ready', () => {
	console.log("Client ready!");
})

let cooldowns = {}
let shutup = false
function cooldown(name, max, rate, inc = 1) {
	cooldowns[name] ??= 0
	if (cooldowns[name] > max) {
		return true
	} else {
		cooldowns[name]++
		setTimeout(() => cooldowns[name]--, rate)
	}
}

client.on('messageCreate', async message => {
	console.log(`<@${client.user.id}>`)
	function lost(why) {
		throw { message: `Got lost… (${why})`, magic: true }
	}
	do try {
		var msg = message.toString().toLowerCase().split(' ');
		var msgCapitalized = message.toString().split(' ');

		if (msg[0] == `<@${client.user.id}>` && msg[1] == "how" && msg[2] == "goofy" && msg[3] == "are" && msg[4] == "you")
			return message.reply("100% goofy")
	
		console.log(msg)

		if (msg[0].startsWith("!"))
			msg[0] = msg[0].replace(/^!/, ""), msgCapitalized[0] = msgCapitalized[0].replace(/^!/, "")
		else if (msg[0] == `<@${client.user.id}>`)
			msg.shift(), msgCapitalized.shift()
		else
			return

			console.log(message.toString());
			const aid = message.author.id
			if (cooldown("bruteforce" + aid, 3, 1000))
				return void await message.reply("bruteforce moment, go away")
			if (msg[0] == "make" && msg[1] == "me" && msg[2] == "a" && msg[3] == "sandwich")
				return void await message.reply("What? Make it yourself.")
			if (msg[0] == "get" && msg[1] == "lost")
				lost("got lost")
			let combMsg = msg[1], combCapMsg = msgCapitalized[1]
			if (msg[1] != null) {
				for (let i = 3; i < msg.length; i++ ) {
					combMsg += "-" + msg[i]
					combCapMsg += "-" + msgCapitalized[i]
				}
			}
console.log(msg[0])
			switch (msg[0]) {
				case "github":
				case "gh":
					switch(msg[1]) {
						case "pull":
						case "pr":
						case "issue":
							if (cooldown("ref", 5, 2000)) return void await message.reply("Cooldown...");
							if (msg[2] == null) {
								await message.reply('Please specify a Pull Request / Issue');
								return;
							}
							await message.reply('[#' + msg[2].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/pull/" + encode(msg[2]) + ")");
							return;

						case "file":
						case "path":
							if (cooldown("ref", 5, 2000)) return void await message.reply("Cooldown...");
							if (msg[2] == null) {
								await message.reply('Please specify a File / Path');
								return;
							}
							await message.reply('[' + msgCapitalized[2].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/tree/main/" + encode(msgCapitalized[2]) + ")");
							return;
						case "repo":
						case undefined:
							if (cooldown("ref", 5, 2000)) return void await message.reply("Cooldown...");
							await message.reply("[GitHub Repo](https://github.com/Figura-Goofballs/GoofyPlugin/)");
							return;
						default:
							await message.reply("Unknown subcommand `" + msgCapitalized[1] + "` (try `!help`)", { ephemeral: true })
							return;
					}
					return;
				case "wiki":
				case "docs":
					if (cooldown("ref", 5, 2000)) return void await message.reply("Cooldown...");
					if (msg[1] == null) {
						await message.reply("[Wiki](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/)");
						return;
					}

					await message.reply("[" + msgCapitalized[1].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/" + encode(msg[1]) + ")");
					return;

				case "neofetch":
					if (cooldown("ref", 1, 15000)) return void await message.reply("Cooldown...");
					const child = require("child_process").spawn("neofetch")
					let resp = ""
					for await (let bodyPart of child.stdout) {
						resp += bodyPart
					}
					// abandon the child
					resp = "```ansi\n" + resp
						.replace(/(?<=\[)(?=m)/g, "0")
						.replace(/\[0m(?=\[3\dm)/g, "")
						.replace(/\[?25l\[?7l/g, "")
						.replace(/\[20A\[9999999D/g, "")
						.replace(/\[46C/g, "")
						.replace(/\[4\dm   \[4\dm[^]+$/, "")
						.slice(11, 1989) + "```"
					await message.reply(resp)
					return

				case "say":
					let text = message.toString().slice("!gh say ".length)
					await message.reply(text.includes("no") ? "nah" : "no")
					return

				case "crash":
					await message.reply("ight bye")
					process.exit(1)

				case "wu":
					if (cooldown("gwuh", 3, 5000)) return;
					await message.reply("<:gwuh:1241438866833936434>")
					return

				case "whoami":
					return void await message.reply(`<@${message.author.id}>`)

				case "sudo":
					if (!message.member.roles.cache.has("1243395049170014259"))
						return void await message.reply(`<@${message.author.id}> is not in the sudoers ${/*<@&1243395049170014259>*/""}file. This incident will be reported.`)
					msg.shift(); msgCapitalized.shift()
					if (msg[0] == "make" && msg[1] == "me" && msg[2] == "a" && msg[3] == "sandwich")
						return void await message.reply("Okay.")
					if (msg[0] == "get" && msg[1] == "lost")
						lost("got lost")
					combMsg = msg[1], combCapMsg = msgCapitalized[1]
					if (msg[1] != null) {
						for (let i = 3; i < msg.length; i++ ) {
							combMsg += "-" + msg[i]
							combCapMsg += "-" + msgCapitalized[i]
						}
					}
					switch (msg[0]) {
						case "say":
							await message.reply(message.toString().slice("!gh sudo say ".length))
							return

						case "`say`":
							await message.reply('`' + message.toString().slice("!gh sudo say ".length) + "`")
							return

						case "whoami":
							await message.reply("root")
							return

						case "shutup":
							shutup = !shutup
							await message.reply(`${shutup ? "ignoring" : "listening for"} \`!gh\` (until I restart)`)
							return

						case "mksudo":
						case "rmsudo":
							let who = /^(<@(?<uid>\d+)>|(?<username>[a-z0-9_.]{2,32}))$/.exec(msg[1])?.groups
							if (who.uid)
								who = message.guild.members.fetch(+who.uid)
							else if (who.username)
								who = message.guild.members.fetch(who.username)
							else
								return void await message.reply("invalid user — need either a mention or a username not " + msg[1])
							if (!who)
								return void await message.reply("unfortunately they don't exist")
							let goal = msg[0] == "mksudo"
							  , cur  = who.roles.cache.has("1243395049170014259")
							switch (goal + cur) {
								case "falsefalse":
									await message.reply("they already aren't")
								case "truetrue":
									await message.reply("they already are")
								case "truefalse":
									await who.roles.add("1243395049170014259")
									await message.reply("they are a sudoer now")
								case "falsetrue":
									await who.roles.remove("1243395049170014259")
									await message.reply("they aren't a sudoer anymore")
							}
							return

						default:
							await message.reply("Unknown command `" + msgCapitalized[0] + "`", { ephemeral: true })
							return
					}
					await message.reply("Got lost… (this should never happen!)")
					return

				default:
					await message.reply("Unknown command `" + msgCapitalized[0] + "` (try `!help`)", { ephemeral: true })
		}

	} catch (e) {
		await message.reply(`<@402104961812660226> ` + (e.magic ? e.message : `I broke (${e.message})`))
		throw e
	} while (false)
})

client.login(process.env.TOKEN);
