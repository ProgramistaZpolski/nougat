exports.run = (args, message, Discord, Prodkt, Uzytnik) => {
    const {
        kround
    } = require('../modules/round');
    let numerek = args[0];
    Prodkt.find({
        _id: numerek
    }, function(err, docs) {
        if(!docs) return;
        if(docs.length) {
            Uzytnik.find({
                uid: message.author.id
            }, function(err, uzyt) {
                if(uzyt.length && (message.author.id != docs[0].usid)) {
                    if(uzyt[0].hajs >= docs[0].cena) {
                        uzyt[0].hajs -= docs[0].cena;
                        Uzytnik.find({
                            uid: docs[0].usid
                        }, function(err, usid) {
                            let procent = kround(Math.random() * (1 - 0) + 0, 1);
                            usid[0].hajs += (docs[0].cena) * procent;
                            usid[0].save();
                        })
                        uzyt[0].save();
                        const sukcesEmbed = new Discord.RichEmbed()
                            .setAuthor('Nougat - Biedronka', 'https://pbs.twimg.com/profile_images/3578001181/990ad36a51b8e483cde968adbb53df5a_400x400.png')
                            .setColor((Math.random() * 0xFFFFFF << 0).toString(16))
                            .setTitle('Pomyślnie kupiłeś przedmiot!')
                            .setDescription('Kurier teraz ci go zawiezie!');
                        message.channel.send({
                            embed: sukcesEmbed
                        });
                        message.author.send('Oto twój ' + docs[0].name).catch(() => {
                            const errEmbed = new Discord.RichEmbed()
                                .setAuthor('Nougat - Biedronka', 'https://pbs.twimg.com/profile_images/3578001181/990ad36a51b8e483cde968adbb53df5a_400x400.png')
                                .setColor(0xF44336)
                                .setTitle('Błąd')
                                .setDescription('Nie można dotrzeć do ciebie. Może masz zablokowane wiadomości od nieznajomych, lub mnie zablokowałeś?');
                        })
                        message.author.send(docs[0].zaw);
                    } else {
                        const biedaEmbed = new Discord.RichEmbed()
                            .setAuthor('Nougat - Biedronka', 'https://pbs.twimg.com/profile_images/3578001181/990ad36a51b8e483cde968adbb53df5a_400x400.png')
                            .setColor(0xF44336)
                            .setTitle('Błąd')
                            .setDescription('Za biedny jesteś');
                        message.channel.send({
                            embed: biedaEmbed
                        });
                    }
                } else {
                    const biedaEmbed = new Discord.RichEmbed()
                        .setAuthor('Nougat - Biedronka', 'https://pbs.twimg.com/profile_images/3578001181/990ad36a51b8e483cde968adbb53df5a_400x400.png')
                        .setColor(0xF44336)
                        .setTitle('Błąd')
                        .setDescription('Nie możesz kupować od siebie!');
                    message.channel.send({
                        embed: biedaEmbed
                    });
                }
            })
        } else {
            const biedaEmbed = new Discord.RichEmbed()
                .setAuthor('Nougat - Biedronka', 'https://pbs.twimg.com/profile_images/3578001181/990ad36a51b8e483cde968adbb53df5a_400x400.png')
                .setColor(0xF44336)
                .setTitle('Błąd')
                .setDescription('Nie znaleziono tego ID');
            message.channel.send({
                embed: biedaEmbed
            });
        }
    })
}