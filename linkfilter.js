const allowedLinks = [
  "your_allowed_link_here",
];

const isWhitelisted = (text) => {
  return allowedLinks.some(link => text.includes(link));
};

module.exports = async function linkFilter(sock, msg) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const message = msg.message;

  let text = "";
  if (message.conversation) {
    text = message.conversation;
  } else if (message.extendedTextMessage) {
    text = message.extendedTextMessage.text;
  } else if (message.imageMessage?.caption) {
    text = message.imageMessage.caption;
  } else if (message.videoMessage?.caption) {
    text = message.videoMessage.caption;
  }

  const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9\-]+\.[a-z]{2,}(\/[^\s]*)?/gi;
  const hasLink = urlRegex.test(text);

  if (hasLink && !isWhitelisted(text)) {
    try {
      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: msg.key.id,
          participant: msg.key.participant || from,
        },
      });

      await sock.sendMessage(from, {
        text: `your_custom_message_here, @${sender.split("@")[0]}!`,
        mentions: [sender],
      });
    } catch (err) {
      console.error("❌ Failed to delete the link:", err);
    }
  }
};
