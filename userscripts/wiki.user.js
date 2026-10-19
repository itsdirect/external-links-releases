// ==UserScript==
// @name        Guild Wars 2 Wiki Chat Links
// @description Adds gw2:// to chat links on the Guild Wars 2 Wiki
// @author      direct
// @version     1
// @match       https://wiki.guildwars2.com/*
// @grant       none
// ==/UserScript==

const { ChatlinkType, encodeChatlink, decodeChatlink } = await import("https://unpkg.com/@gw2/chatlink@0.1.1/dist/index.mjs");

const SUPPORTED_CHATLINK_TYPES = [
  ChatlinkType.Map,
  ChatlinkType.Achievement,
  ChatlinkType.Wardrobe
];

function createLink(chatlink) {
  const link = document.createElement("a");
  link.href = "gw2://" + encodeURIComponent(chatlink);
  link.className = "external text";
  link.title = "Open in game";
  return link;
}

for (const node of document.querySelectorAll("*")) {
  if (node.dataset.linked) return;

  const chatlink = node.textContent.trim();

  try {
    const { type } = decodeChatlink(chatlink);
    if (!SUPPORTED_CHATLINK_TYPES.includes(type)) continue;
  } catch {
    continue;
  }

  const link = createLink(chatlink);
  node.after(link);
  node.dataset.linked = "";
}

// Achievements

for (const node of document.querySelectorAll(".widget-account-achievement")) {
  if (node.dataset.linked) return;

  const [, id] = /^achievement(\d+)$/.exec(node.dataset.id) ?? [];
  if (id === undefined) continue;

  const target = node.querySelector("th");
  if (target === null) continue;

  const chatlink = encodeChatlink(ChatlinkType.Achievement, id);
  const link = createLink(chatlink);
  target.appendChild(link);
  target.dataset.linked = "";
}
