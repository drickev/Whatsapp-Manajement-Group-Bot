const whitelist = [
  "628xxxxxxxxx@s.whatsapp.net", // Add number thats allowed to use add role before @s.whatsapp.net, start with your country code phone number without +
];

module.exports = async function tagAllHandler(sock, msg) {
  const message = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  const sender = msg.key.participant || msg.key.remoteJid;
  const from = msg.key.remoteJid;

  // Hanya grup dan dari whitelist
  if (!message || !from.endsWith("@g.us") || !whitelist.includes(sender)) return;

  // Jika mengandung kata "tag"
  if (message.toLowerCase().includes("tag")) {
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const mentions = groupMetadata.participants.map(p => p.id);

      await sock.sendMessage(from, {
        text: "📢 *PENTING*", // Pesan singkat tanpa menampilkan semua nomor
        mentions
      });
    } catch (err) {
      console.error("❌ Gagal mengirim tag all:", err);
    }
  }
};
