const { Client, GatewayIntentBits, ThreadChannel } = require("discord.js");
require("dotenv/config");

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

        if (msg[1] == "pull" || msg[1] == "pr" || msg[1] == "issue") {
            if (msg[2] == null) {
                message.reply('Please specify a Pull Request / Issue');
                return;
            }

            message.reply('[#' + msg[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/pull/" + msg[2] + ")");
            return;
        }

        if (msg[1] == "file" || msg[1] == "path") {
            if (msg[2] == null) {
                message.reply('Please specify a File / Path');
                return;
            }

            message.reply('[' + msgCapitalized[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/tree/main/" + msgCapitalized[2] + ")");
            return;
        }

        if (msg[1] == "wiki" || msg[1] == "docs") {
            if (msg[2] == null) {
                message.reply("[Wiki](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/)");
                return;
            }

            message.reply("[" + msgCapitalized[2] + "](https://github.com/Figura-Goofballs/GoofyPlugin/wiki/" + msg[2] + ")");
            return;
        }

        message.reply("[GitHub Repo](https://github.com/Figura-Goofballs/GoofyPlugin/)");
        return;
    }
})

client.login(process.env.TOKEN);