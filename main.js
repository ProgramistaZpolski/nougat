// moduły node
const Discord = require('discord.js');
const client = new Discord.Client();
const req = require('request');
const rp = require('request-promise');
const mongoose = require('mongoose');
const mongooseAi = require('mongoose-auto-increment');

// ustawienia
const settings = require('./settings.json');

// moduły bota
const kround = require('./modules/round');
const sad = require('./modules/sadownictwo');
const sprzedaj = require('./modules/sprzedaj');
const punkty = require('./modules/punkty');

// komendy bota
const pilka = require('./commands/8pilka');
const yt = require('./commands/yt');
const help = require('./commands/help');
const kup = require('./commands/kup');
const biedronka = require('./commands/biedronka');
const hajs = require('./commands/hajs');
const zaplac = require('./commands/zaplac');
const mono = require('./commands/mono');
const nazwa = require('./commands/nazwa');
const sms = require('./commands/sms');
const userinfo = require('./commands/userinfo');
const statek = require('./commands/statek');
const ciastko = require('./commands/ciastko');
const odwroc = require('./commands/odwroc');
const sprzedajm = require('./commands/sprzedaj');
const pozwij = require('./commands/pozwij');

client.login(settings.token)
.catch((err) => {
    throw new Error("Nie można połączyć się z Discordem. Podałeś poprawny token?")
})
const prefix = settings.prefix;
const ytapi = settings.ytapi;
const cidautora = settings.id;

// KONIEC KONFIGURACJI

// MONGOŁ AREA
mongoose.connect('mongodb://'+settings.mongo);
let db = mongoose.connection;
mongooseAi.initialize(db);
db.on('error', (err) => {
    throw new Error("Nie można się połączyć z bazą danych mongodb. Czy na pewno jest ona uruchomiona i poprawnie podana w pliku settings.json?\n"+err)
});

let userSchema = mongoose.Schema({
    uid: String, // id discorda
    hajs: Number, // stan konta uzytkownika
    zajety: Boolean, // czy dwie minutki minely?
    nick: String, // nick
    posiadane: {
        type: Array,
        "default": []
    } // posiadane itemy po id
});
let produktSchema = mongoose.Schema({
    name: String, // nazwa produktu
    cena: Number, // cena
    zaw: String, // zawartosc przedmiotu - moze to byc link, obrazek, tekst, ogolnie roznie.
    usid: String // id użytkownika wystawiającego
});
let Uzytnik = mongoose.model('Uzytnik', userSchema);

produktSchema.plugin(mongooseAi.plugin, 'Prodkt');
let Prodkt = mongoose.model('Prodkt', produktSchema);
// KONIEC MONGOŁ AREA

client.on('ready', () => { // informacja o zalogowaniu
    console.log(`Nougat zalogowany jako ${client.user.tag}`);
    client.user.setActivity('Na '+client.guilds.size+' serwerach!', {
        type: 'LISTENING'
    })
    Uzytnik.findOneAndUpdate({
        zajety: true
    }, {
        zajety: false
    }, {
        upsert: true
    }, (err) => {
        if (err) throw err;
    });
});

let pozwijmode = []
let pozwijmodev = []
let powod, pozwany; // deklaracja zmiennych do pozwywania

let sprzedajmode = [];
let sprzedajmodev = [];
let sprzedajnazwa = [];
let sprzedajcena = [];
let sprzedajzaw = [];

client.on('message', message => {
    if (message.author.bot) return;
    if (message.guild) {
        punkty.run(message, Uzytnik)
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase(); // wycinanie komendy i argumentow

    if (message.content.startsWith(prefix)) {
        switch (command) {
            case "pozwij":
                // komenda pozwij inicjująca tryb pozywania
                pozwij.run(message, pozwijmode, pozwijmodev);
                break;
            case "help":
                // lista komend
                help.run(message, Discord, prefix, settings.host);
                break;
            case "8pilka":
                pilka.run(args, message, Discord)
                break;
            case "odwroc":
                odwroc.run(args, message);
                break;
            case "ciastko":
                ciastko.run(message, client);
                break;
            case "yt":
                yt.run(args, message, Discord, rp, ytapi);
                break;
            case "userinfo":
                userinfo.run(args, message, Discord);
                break;
            case "statek":
                statek.run(message, client);
                break;
            case "sms":
                sms.run(args, message, Discord);
                break;
            case "mono":
                mono.run(message, Discord);
                break;
            case "zaplac":
                zaplac.run(args, message, Discord, Uzytnik);
                break;
            case "nazwa":
                nazwa.run(args, message, Discord, client);
                break;
            case "bal":
            case "money":
            case "punkty":
            case "hajs":
                hajs.run(args, message, Discord, Uzytnik, cidautora);
                break;
            case "biedronka":
                biedronka.run(message, Discord, Prodkt, Uzytnik, prefix);
                break;
            case "kup":
                kup.run(args, message, Discord, Prodkt, Uzytnik);
                break;
            case "sprzedaj":
                sprzedajm.run(message, Discord, sprzedajmode, sprzedajmodev);
                break;
        }
    }

    sprzedaj.run(message, Discord, Prodkt, sprzedajnazwa, sprzedajmode, sprzedajmodev, sprzedajcena, sprzedajzaw);
    sad.run(message, Discord, pozwijmode, pozwijmodev);
});