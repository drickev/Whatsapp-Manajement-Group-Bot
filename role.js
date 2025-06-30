const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../../data/roles.json");
const whitelist = ["628xxxxx@s.whatsapp.net"]; // Nomor admin

function loadRoles() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveRoles(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  assignToRole: async (sock, msg) => {
    const message = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    const sender = msg.key.participant || msg.key.remoteJid;
    const from = msg.key.remoteJid;

    if (!message || !from.endsWith("@g.us") || !whitelist.includes(sender)) return;
    if (!message.toLowerCase().startsWith("addrole")) return;

    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const lower = message.toLowerCase();
    const role = lower.includes("warfare") ? "Warfare" : lower.includes("operation") ? "Operation" : null;

    if (!role || mentions.length === 0) return;

    const roles = loadRoles();

    for (const id of mentions) {
      if (!roles[role].includes(id)) {
        roles[role].push(id);
      }
    }

    saveRoles(roles);

    await sock.sendMessage(from, {
      text: `✅ Berhasil menambahkan member ke role *${role}*.`,
      mentions
    });
  },

  handleTagRole: async (sock, msg) => {
    const message = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    const from = msg.key.remoteJid;

    if (!message || !from.endsWith("@g.us")) return;
    const lower = message.toLowerCase();
    const role = lower.includes("tag warfare") ? "Warfare" : lower.includes("tag operation") ? "Operation" : null;

    if (!role) return;

    const roles = loadRoles();
    const members = roles[role];

    if (members.length === 0) {
      await sock.sendMessage(from, { text: `⚠️ Belum ada member di role *${role}*.` });
      return;
    }

    await sock.sendMessage(from, {
      text: `📢 *PENTING*`,
      mentions: members
    });
  }
};
