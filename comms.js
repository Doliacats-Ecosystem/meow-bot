
import Discord from 'discord.js';
import { alphabet } from './alphabet.js';

import { isMeowLanguage } from './bot.js'
import { reverseTranslate } from './bot.js'

const translate = (robot, msg, args) => {
    args = msg.content.split(' ');
    if (args.length > 1) {
        args.shift();
        args = args.join(' ');
        msg.delete().catch(console.error);
        if (isMeowLanguage(args)) {
            msg.author.send(reverseTranslate(args)).catch(console.error);
        } else {
            msg.author.send(args.split('').map((char) => (alphabet[char] !== 'SHHH') ? alphabet[char.toUpperCase()] || char : alphabet["!"]).join('')).catch(console.error);
        }
    } else {
        msg.delete().catch(console.error);
    }
}

export const comms = [
    {
        name: "translate",
        out: translate,
        about: "Перевод"
    },
];


