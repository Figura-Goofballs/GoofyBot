const { Client, GatewayIntentBits, ThreadChannel } = require("discord.js");
require("dotenv/config"); // ex: ts=2

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.on('ready', () => {
	console.log("Client ready!");
})

client.on('messageCreate', message => {
	var msg = message.toString().toLowerCase().split(' ');
	var msgCapitalized = message.toString().split(' ');

	if (msg[0] == "!gh") {
		if (msg[2] != null) {
			for (let i = 3; i < msg.length; i++ ) {
				msg[2] = msg[2] + "-" + msg[i]
				msgCapitalized[2] = msgCapitalized[2] + "-" + msgCapitalized[i]
			}
		}

		switch (msg[1]) {
			case "pull":
			case "pr":
			case "issue":
				if (msg[2] == null) {
					message.reply('Please specify a Pull Request / Issue');
					return;
				}
				message.reply('[#' + msg[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/pull/" + msg[2] + ")");
				return;

			case "file":
			case "path":
				if (msg[2] == null) {
					message.reply('Please specify a File / Path');
					return;
				}
				message.reply('[' + msgCapitalized[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/tree/main/" + msgCapitalized[2] + ")");
				return;

			case "wiki":
			case "docs":
				if (msg[2] == null) {
					message.reply("[Wiki](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/)");
					return;
				}

				message.reply("[" + msgCapitalized[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/" + msg[2] + ")");
				return;
			default:

				message.reply("[GitHub Repo](https://github.com/Figura-Goofballs/GoofyPlugin/)");
				return;
		}
	}
})

client.login(process.env.TOKEN);
