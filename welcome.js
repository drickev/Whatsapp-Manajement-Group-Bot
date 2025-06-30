const fs = require("fs");

module.exports = async function welcomeHandler(sock, update) {
  if (update.action === "add") {
    try {
      const metadata = await sock.groupMetadata(update.id);
      for (const participant of update.participants) {
        const name = participant.split("@")[0];
        const caption = 
`custom message @${name}
your message here;

        await sock.sendMessage(update.id, {
          image: fs.readFileSync("./banner.jpg"), // Bisa juga .jpg atau .png
          caption: caption,
          mentions: [participant]
        });
      }
    } catch (err) {
      console.error("❌ Error kirim pesan sambutan:", err);
    }
  }
};
