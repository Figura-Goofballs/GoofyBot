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
function cooldown(name, max, rate) {
	cooldowns[name] ??= 0
	if (cooldowns[name] > max) {
		return true
	} else {
		cooldowns[name]++
		setTimeout(() => cooldowns[rate]--, rate)
	}
}


client.on('messageCreate', async message => {
	function lost(why) {
		throw { message: `Got lost… (${why})`, magic: true }
	}
	do try {
		var msg = message.toString().toLowerCase().split(' ');
		var msgCapitalized = message.toString().split(' ');

		if (msg[0] == "<@1243329635937288274>" && msg[1] == "how" && msg[2] == "goofy" && msg[3] == "are" && msg[4] == "you")
			return message.reply("100% goofy")

		if (msg[0] == "!gh" || msg[0] == "<@1243329635937288274>") {
			if (msg[1] == "make" && msg[2] == "me" && msg[3] == "a" && msg[4] == "sandwich")
				return void await message.reply("What? Make it yourself.")
			if (msg[1] == "get" && msg[2] == "lost")
				lost("got lost")
			let combMsg = msg[2], combCapMsg = msgCapitalized[2]
			if (msg[2] != null) {
				for (let i = 3; i < msg.length; i++ ) {
					combMsg += "-" + msg[i]
					combCapMsg += "-" + msgCapitalized[i]
				}
			}

			switch (msg[1]) {
				case "pull":
				case "pr":
				case "issue":
					if (cooldown("ref", 5, 2000)) return;
					if (msg[2] == null) {
						await message.reply('Please specify a Pull Request / Issue');
						return;
					}
					await message.reply('[#' + msg[2].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/pull/" + encode(msg[2]) + ")");
					return;

				case "file":
				case "path":
					if (cooldown("ref", 5, 2000)) return;
					if (msg[2] == null) {
						await message.reply('Please specify a File / Path');
						return;
					}
					await message.reply('[' + msgCapitalized[2].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/tree/main/" + encode(msgCapitalized[2]) + ")");
					return;

				case "wiki":
				case "docs":
					if (cooldown("ref", 5, 2000)) return;
					if (msg[2] == null) {
						await message.reply("[Wiki](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/)");
						return;
					}

					await message.reply("[" + msgCapitalized[2].replace("(?=\W)", "\\") + "](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/" + encode(msg[2]) + ")");
					return;

				case "neofetch":
					if (cooldown("ref", 1, 15000)) return;
					const child = require("child_process").spawn("neofetch")
					let resp = "```ansi\n"
					for await (let bodyPart of child.stdout) {
						resp += bodyPart
					}
					// abandon the child
					resp = resp.replace(/\[?25l\[?7l/g, "").replace(/\[20A\[9999999D/g, "").replace(/\[46C/g, "").slice(0, 2000-3) + "```"
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
					if (msg[1] == "make" && msg[2] == "me" && msg[3] == "a" && msg[4] == "sandwich")
						return void await message.reply("Okay.")
					if (msg[1] == "get" && msg[2] == "lost")
						lost("got lost")
					combMsg = msg[2], combCapMsg = msgCapitalized[2]
					if (msg[2] != null) {
						for (let i = 3; i < msg.length; i++ ) {
							combMsg += "-" + msg[i]
							combCapMsg += "-" + msgCapitalized[i]
						}
					}
					switch (msg[1]) {
						case "say":
							await message.reply(message.toString().slice("!gh sudo say ".length))
							return

						case "whoami":
							await message.reply("root")
							return

						default:
							await message.reply("Unknown command `" + msgCapitalized[1] + "`", { ephemeral: true })
							return
					}
					await message.reply("Got lost… (this should never happen!)")
					return


				case "repo":
				case undefined:
					if (cooldown("ref", 5, 2000)) return;
					await message.reply("[GitHub Repo](https://github.com/Figura-Goofballs/GoofyPlugin/)");
					return;

				default:
					await message.reply("Unknown command `" + msgCapitalized[1] + "`", { ephemeral: true })
			}
		}

	} catch (e) {
		await message.reply(`<@402104961812660226> ` + (e.magic ? e.message : `I broke (${e.message})`))
		throw e
	} while (false)
})

client.login(process.env.TOKEN);
