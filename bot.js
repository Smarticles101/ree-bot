// todo
//  welcome message @user reeeee
//  memez quotes


const Discord = require('discord.js');
const fetch = require('isomorphic-fetch');
const Sentiment = require('sentiment');

const keys = require('./keys.json');

var Twitter = require('twitter');

var twit = new Twitter(
  keys.twitter
);

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in to ${client.guilds.size} guild(s) as ${client.user.tag}!`);
});

client.on('message', msg => {
  //console.log(msg)

  if (msg.content.includes('!ping')) {
    msg.reply('Pong!');
  }

  if (msg.content.includes('!dad')) {
    fetch("https://icanhazdadjoke.com/", {
      headers: {
        "Accept": "application/json"
      }
    })
    .then(resp => resp.json())
    .then(({joke}) => msg.reply(joke))
  }

  if (msg.content.includes('!leet')) {
    msg.reply(
      msg.cleanContent.replace("!leet ", "")
      .replace(/a|A/g, 4)
      .replace(/e|E/g, 3)
      .replace(/g|G/g, 6)
      .replace(/i|I/g, 1)
      .replace(/o|O/g, 0)
      .replace(/s|S/g, 5)
      .replace(/t|T/g, 7)
    )
  }

  if (msg.content.includes('!nvwls')) {
    msg.reply(msg.cleanContent.replace('!nvwls ', '').replace(/a|e|i|o|u|A|E|I|O|U/g, ""));
  }

  if (msg.content.includes('!sentiment')) {
    twit.get('search/tweets', {q: msg.cleanContent.replace('!sentiment ', ''), count: 100}, function(error, tweets, response) {
      //console.log(tweets);

      var sentiment = new Sentiment();
      let negative = 0;
      let positive = 0;
      let total = 0;

      tweets.statuses.map(twt => {
        let res = sentiment.analyze(twt.text)

        total+=res.score;

        //console.log(twt)

        if (res.score < 0) {
          negative++;
        } else if (res.score > 0) {
          positive++;
        }
      })

      msg.reply(`positive tweets: ${positive}, negative tweets: ${negative}, neutral tweets: ${tweets.statuses.length - positive - negative}, overall score: ${total}`);
   });
  }
});

client.login(keys.discord.token);
