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
    const role = lower.includes("roles1") ? "roles1" : lower.includes("roles1") ? "roles1" : null; // Change roles1 and roles2 with the role thats relate on roles.json

    if (!role || mentions.length === 0) return;

    const roles = loadRoles();

    for (const id of mentions) {
      if (!roles[role].includes(id)) {
        roles[role].push(id);
      }
    }

    saveRoles(roles);

    await sock.sendMessage(from, {
      text: `✅ Succes add member to role *${role}*.`,
      mentions
    });
  },

  handleTagRole: async (sock, msg) => {
    const message = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    const from = msg.key.remoteJid;

    if (!message || !from.endsWith("@g.us")) return;
    const lower = message.toLowerCase();
    const role = lower.includes("tag warfare") ? "roles1" : lower.includes("tag operation") ? "roles2" : null; // Change roles1 and roles2 with the role thats relate on roles.json

    if (!role) return;

    const roles = loadRoles();
    const members = roles[role];

    if (members.length === 0) {
      await sock.sendMessage(from, { text: `⚠️ There's no member on this role *${role}*.` });
      return;
    }

    await sock.sendMessage(from, {
      text: `message`, // Message while tag the role
      mentions: members
    });
  }
};
