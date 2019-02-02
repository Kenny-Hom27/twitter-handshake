const Twit = require("twit");
const axios = require("axios");
const config = require("./config");

console.log("Running Handshake Twitter Bot");

// TWITTER API
const HSDemoPro = new Twit(config.twitterConfig);

const stream = HSDemoPro.stream("statuses/filter", { track: "HSDemoPro" });

stream.on("tweet", tweetEvent);

// Holds messages and makes sure repeats dont get sent
const tweetMessages = {};

// Is called when HSDemoPro is @mentioned and calls the postNote function
function tweetEvent(event) {
  const user = event.in_reply_to_screen_name;
  const text = event.text;
  const tweetBy = event.user.screen_name;

  if (user === "HSDemoPro") {
    // makes sure case sensitivity isn't an issue for repeat messages
    if (tweetMessages[text.toLowerCase()]) {
      return;
    } else {
      tweetMessages[text.toLowerCase()] = true;
    }

    postNote(text, tweetBy);
  }
}

// HANDSHAKE API

const notePage = "https://ps2.dev.handshake.com/api/latest/customer_notes";
const customer = "/api/latest/customers/137";
const auth = {
  auth: {
    username: config.handShakeUsername,
    password: config.handshakePassword
  }
};

// Function that posts a note to handshake when called

function postNote(text, tweetBy) {
  const handshakePost = {
    customer: customer,
    text: text,
    name: tweetBy
  };

  axios.post(notePage, handshakePost, auth).catch(function(error) {
    console.log(error);
  });
}
