
import { Client, Guild, Intents, MessageEmbed } from 'discord.js';
import fs from 'fs';
import { Console } from 'console';
import { channel } from 'diagnostics_channel';
import { SlashCommandBuilder } from '@discordjs/builders';

import { comms as _comms } from "./comms.js";
import { alphabet } from './alphabet.js'
import { token, prefix } from './botData.js';

const robot = new Client({
    intents:
        [
            "GUILDS",
            "GUILD_MESSAGES",
            "GUILD_MEMBERS",
            "GUILD_PRESENCES",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_TYPING",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_REACTIONS",
        ]
});

const symbols = new Set(`!@#$%^&*()_+=-~{[]};:'"\`\\|,<.>/?1234567890`.split(''));

const lettersAllowed = new Set(`mMwWeEoOFfuUrR`.split(''))

const lettersNotAllowed = new Set('qtyipadgjklzxcvhbnQTYIPADGJKLZXCVBNйцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ'.split(''));

const translateToMeow = (msg) => {
    return msg.split('').map((char) => (alphabet[char] !== 'SHHH') ? alphabet[char.toUpperCase()] || char : alphabet["!"]).join('');
}

const toMeowphabet = (message) => {
    const words = message.split(' ');
    const meows = Object.values(alphabet);
    const newWords = words.map((word) => {
        if (meows.includes(word)) {
            return word;
        } else if (/[а-яa-dg-lnp-qstvx-z]/i.test(word)) {
            return translateToMeow(word);
        } else if (word.toLowerCase() === ('from') ) {
            
            return translateToMeow(word);
        } else {
            for (let i = 0; i <= word.length; i++) {
                if (word[i + 1] === word[i + 2] || word[i + 2] === word[i + 3] || word[i + 3] === word[i + 4]) {
                    return translateToMeow(word);
                }
                if (word[i] === word[i + 1]) {
                    return translateToMeow(word);
                } else if (word[i].toLowerCase() === 'f') {
                    if (i === word.length - 1) {
                        return translateToMeow(word);
                    } else if (i === word.length - 2 && (word[i + 1].toUpperCase() !== 'R')) {
                        return translateToMeow(word);
                    } else if ((i === word.length - 3) && (word[i + 1].toUpperCase() === 'R') && (word[i + 2].toLowerCase() === 'm')) {
                        return word;
                    } else if ((i !== word.length - 3) && (word[i + 1].toUpperCase() === 'R') && (word[i + 2].toLowerCase() === 'm')) {
                        return word;
                    } else if (word[i + 1] === word[i + 2]) {
                        return translateToMeow(word);
                    } else {
                        return word;
                    }
                } else if (word[i].toLowerCase() === 'm') {
                    if (word[i + 1].toLowerCase() === 'e' || word[i + 1].toLowerCase() === 'u') {
                        return word;
                    } else {
                        return translateToMeow(word);
                    }
                } else {
                    return translateToMeow(word);
                }
            }
        }
    })
    return newWords.join(' ');
};

const reverseTranslate = (message) => {
    let phrase = ''

    for (let i = 0; i <= message.length; i++) {
        let wordLong = message[i] + message[i + 1] + message[i + 2] + message[i + 3]
        let wordMedium = message[i] + message[i + 1] + message[i + 2];
        let wordShort = message[i] + message[i + 1];
        if (message[i] === ' ') {
            phrase += message[i];
            continue;
        }
        if (symbols.has(message[i])) {
            phrase += message[i];
            continue;
        }
        for (let key in alphabet) {
            if (wordLong === alphabet[key]) {
                phrase += key.toLowerCase();
                i = i + 3;
                break;
            }
            if (wordMedium === alphabet[key]) {
                phrase += key.toLowerCase();
                i = i + 2;
                break;
            }
            if (wordShort === alphabet[key]) {
                phrase += key.toLowerCase();
                i = i + 1;
                break;
            }
        }
    }
    return phrase;
}

const isMeowLanguage = (message) => {
    let value = false;
    if (message.length === 1 && symbols.has(message)) {
        return value = true
    }
    for (let i = 0; i < message.length; i++) {
        if (message.length === 1) {
            value = false;
            break;
        }
        if (message.length === 2 && symbols.has(message[0])) {
            value = false;
            break;
        }
        if ((i < message.length - 1 && message[i].toLowerCase() === message[i + 1].toLowerCase()) && (message[i + 1] !== ' ' && !symbols.has(message[i]))) {
            value = false;
            console.log('if')
            break;
        }
        if (lettersAllowed.has(message[i])) {
            console.log('cool')
            value = true;
        }
        if (symbols.has(message[i])) {
            console.log('coolSYMBOL')
            value = true;
        }
        if (!lettersAllowed.has(message[i]) && message[i] !== ' ' && !symbols.has(message[i])) {
            console.log('not cool')
            console.log(message[i])
            value = false
            break;
        }
        if (message.toLowerCase() === 'from') {
            value = false;
           
            break;
        }

        // if (!lettersNotAllowed.has(message[i])) {
        //     value = true;
        // } else if (lettersNotAllowed.has(message[i])) {
        //     value = false;
        //     break;
        // }
    }

    return value;
};

robot.on("ready", function () {
    console.log(robot.user.username + " запустился!");

    const guildId = '897512672503955498';
    const guild = robot.guilds.cache.get(guildId);
    let commands;

    if (guild) {
        commands = guild.commands
    } else {
        commands = robot.application?.commands;
    }

    commands?.create({
        name: 'beep',
        description: 'test command'
    });

    commands?.create({
        name: 'translate',
        description: 'translate command',
        options: [
            {
                name: 'text',
                description: 'a message you want to translate',
                required: true,
                type: 'STRING'
            }
        ]
    })
});

robot.on('messageCreate', (msg) => {
    if (msg.channel.id === '992030591539216524' || msg.channel.type === "DM") {
        
            if (msg.author.username != robot.user.username && msg.author.discriminator != robot.user.discriminator) {
                let comm1 = msg.content.trim() + " ";
                let commName = comm1.slice(0, comm1.indexOf(" "));
                let messArr = comm1.split(" ");
                if (msg.content[0] === prefix) {
                    for (let i = 0; i < _comms.length; i++) {
                        let comm2 = prefix + _comms[i].name;
                        if (comm2 === commName) {
                            _comms[i].out(robot, msg, messArr);
                        } else {
                            msg.delete().catch(console.error);
                            msg.author.send('Wrong command').catch(console.error);
                        }
                    }
                }
            }

            if (msg.channel.type === "DM") {
                console.log('1')
                if (msg.author.bot) return;

                if (isMeowLanguage(msg.content)) {
                    console.log('2')
                    reverseTranslate(msg.content) ?
                        msg.channel.send(reverseTranslate(msg.content)).catch(console.error) :
                        msg.channel.send(`What? I can't understand you`).catch(console.error)
                } else {
                    console.log('3')
                    msg.channel.send(toMeowphabet(msg.content)).catch(console.error);
                }
                return;
            }

            if (msg.author.bot) return;

            if (msg.content.startsWith(prefix)) return;

            if (isMeowLanguage(msg.content)) {

            } else {
                msg.delete().catch(console.error);
                msg.author.send(`Oooops, We speak only Meow language here. To translate something use a slash command \`/translate\`.\r\nYou can also use a \`-translate\` command into our chat, in that case I'll send you a translated message via DM (-translate your message).`).catch(console.error)
                // msg.channel.send(`${msg.author} ` + 'said: ' + toMeowphabet(msg.content));
            }
            // let embed = new MessageEmbed()
            //     .addField(
            //         `:point_right: Welcome!`,
            //         `Hello, welcome to my guild <@${msg.author.id}>!`,
            //         true
            //     )
            //     .addField(
            //         `:zap: Guild Statistics`,
            //         `Server member count: 7`,
            //         true
            //     )
            //     .setColor("YELLOW")

            // msg.channel.send({ embeds: [embed] });
        
            // console.log('ooops, some error has occured');
            // console.error(e.name + ': ' + e.message);
        
    }
});

robot.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'beep') {
            await interaction.reply({
                content: 'Boop!',
                ephemeral: true,
            }).catch(console.error);
        } else if (commandName === 'translate') {
            const msg = options.getString('text')
            await interaction.reply({
                ephemeral: true,
                content: isMeowLanguage(msg) ? reverseTranslate(msg) : toMeowphabet(msg)
            }).catch(console.error);
        }
    } catch (error) {
        console.log(error)
    };

});

robot.on('guildMemberAdd', member => {
    console.log('someone has joined');
    console.log(member.id + ' ' + member.displayName);

    member.send(`Hey, I'm MeowBot from Dolia Cats. Feel free to join our meow-chat. We use Meow language there. Type a slash command \`/translate\` to translate something.\r\nYou can also use a \`-translate\` command into our chat, in that case I'll send you a translated message via DM (-translate your message).`).catch(console.error);
});

robot.on('guildMemberRemove', member => {
    try {
        console.log('someone has left the guild');
        console.log(member.id + ' - ' + member.displayName);
    } catch (error) {
        console.log(error)
        return
    }

});

robot.login(token);

export { toMeowphabet, reverseTranslate, isMeowLanguage }
