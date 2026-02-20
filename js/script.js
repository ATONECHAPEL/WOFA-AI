/* ==========================================================
   WOFA AI FRONTEND CORE (Future-Ready v2 - 2026)
   Clean • Stable • Auth-Ready • Production Safe
   ========================================================== */

/* =========================
   GLOBAL STATE
   ========================= */
let isSending = false;
let autoSpeakEnabled = true;
let wakeLock = null;

/* =========================
   DOM REFERENCES (SAFE)
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const darkToggle = document.getElementById("darkToggle");

const languageSelector = document.getElementById("languageSelector");
const voiceTypeSelector = document.getElementById("voiceTypeSelector");
const autoSpeakToggleBtn = document.getElementById("autoSpeakToggleBtn");

const chatHistoryList = document.getElementById("chatHistoryList");
const newChatBtn = document.getElementById("newChatBtn");
const chatSearchInput = document.getElementById("chatSearchInput");

const exportTxtBtn = document.getElementById("exportTxtBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

/* =========================
   CONFIG
   ========================= */
const API_BASE_URL =
  window.WOFA_CONFIG?.API_BASE_URL ||
  "https://wofa-ai-backend.onrender.com/api";

/* =========================
   STORAGE KEYS
   ========================= */
const STORAGE_KEY_ALL_CHATS = "wofaChatConversations";
const STORAGE_KEY_ACTIVE_CHAT_ID = "wofaActiveChatId";
const STORAGE_KEY_AUTOSPEAK = "wofaAutoSpeakEnabled";
const STORAGE_KEY_LANGUAGE = "wofaSelectedLanguage";
const STORAGE_KEY_VOICE = "wofaSelectedVoice";

/* =========================
   UTILITIES
   ========================= */
function sanitizeHTML(text) {
  return String(text || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function scrollToBottom() {
  if (!chatBox) return;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function generateId() {
  return "chat_" + Date.now() + "_" + Math.random().toString(36).substring(2);
}

/* =========================
   WAKE LOCK
   ========================= */
async function enableWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch {}
}

async function disableWakeLock() {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch {}
}

/* =========================
   CHAT STORAGE
   ========================= */
function getAllChats() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_ALL_CHATS)) || [];
}

function saveAllChats(chats) {
  localStorage.setItem(STORAGE_KEY_ALL_CHATS, JSON.stringify(chats));
}

function getActiveChatId() {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_CHAT_ID);
}

function setActiveChatId(id) {
  localStorage.setItem(STORAGE_KEY_ACTIVE_CHAT_ID, id);
}

function getActiveChat() {
  return getAllChats().find(c => c.id === getActiveChatId()) || null;
}

function updateActiveChat(chat) {
  const chats = getAllChats();
  const index = chats.findIndex(c => c.id === chat.id);
  if (index !== -1) {
    chats[index] = chat;
    saveAllChats(chats);
  }
}

function createNewChat(title = "New Conversation") {
  const chats = getAllChats();

  const newChat = {
    id: generateId(),
    title,
    createdAt: new Date().toISOString(),
    messages: []
  };

  chats.unshift(newChat);
  saveAllChats(chats);
  setActiveChatId(newChat.id);

  renderChatHistory();
  renderActiveChat();
}

/* =========================
   RENDERING
   ========================= */
function renderActiveChat() {
  if (!chatBox) return;

  const chat = getActiveChat();
  chatBox.innerHTML = "";

  if (!chat || chat.messages.length === 0) {
    chatBox.innerHTML = `
      <div class="message ai">
        <strong>Hello 👋 I’m WOFA AI</strong><br><br>
        Ask me anything to begin learning.
      </div>
    `;
    return;
  }

  chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message " + msg.role;
    div.innerHTML = sanitizeHTML(msg.message).replace(/\n/g, "<br>");
    chatBox.appendChild(div);
  });

  scrollToBottom();
}

function renderChatHistory(search = "") {
  if (!chatHistoryList) return;

  chatHistoryList.innerHTML = "";

  getAllChats()
    .filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase())
    )
    .forEach(chat => {
      const item = document.createElement("div");
      item.className = "chat-history-item";
      item.textContent = chat.title;

      item.onclick = () => {
        setActiveChatId(chat.id);
        renderChatHistory(chatSearchInput?.value || "");
        renderActiveChat();
      };

      chatHistoryList.appendChild(item);
    });
}

/* =========================
   MESSAGE HANDLING
   ========================= */
function saveMessage(role, message) {
  const chat = getActiveChat();
  if (!chat) return;

  chat.messages.push({
    role,
    message,
    time: new Date().toISOString()
  });

  updateActiveChat(chat);
}

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "message user";
  div.innerHTML = sanitizeHTML(text).replace(/\n/g, "<br>");
  chatBox.appendChild(div);

  saveMessage("user", text);
  scrollToBottom();
}

function addAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message ai";
  div.innerHTML = sanitizeHTML(text).replace(/\n/g, "<br>");
  chatBox.appendChild(div);

  saveMessage("ai", text);
  scrollToBottom();

  if (autoSpeakEnabled) speak(text);
}

/* =========================
   SPEECH SYSTEM
   ========================= */
function speak(text) {
  if (!text) return;

  speechSynthesis.cancel();
  enableWakeLock();

  const cleaned = text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/```[\s\S]*?```/g, "");

  const utter = new SpeechSynthesisUtterance(cleaned);
  utter.lang = localStorage.getItem(STORAGE_KEY_LANGUAGE) || "en-US";
  utter.rate = 0.8;
  utter.pitch = 0.9;
  utter.volume = 1;

  utter.onend = disableWakeLock;
  utter.onerror = disableWakeLock;

  speechSynthesis.speak(utter);
}

window.stopSpeaking = () => {
  speechSynthesis.cancel();
  disableWakeLock();
};

/* =========================
   SEND QUESTION
   ========================= */
async function sendQuestion() {
  if (isSending || !input) return;

  const question = input.value.trim();
  if (!question) return;

  if (!getActiveChat()) createNewChat();

  addUserMessage(question);
  input.value = "";

  isSending = true;

  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    addAIMessage(data.answer || "No response generated.");
  } catch {
    addAIMessage("Unable to connect. Please try again.");
  }

  isSending = false;
}

window.sendQuestion = sendQuestion;

/* =========================
   AUTOSPEAK
   ========================= */
function toggleAutoSpeak() {
  autoSpeakEnabled = !autoSpeakEnabled;
  localStorage.setItem(STORAGE_KEY_AUTOSPEAK, autoSpeakEnabled);
  if (autoSpeakToggleBtn) {
    autoSpeakToggleBtn.textContent = autoSpeakEnabled
      ? "🔊 Auto Speak: ON"
      : "🔇 Auto Speak: OFF";
  }
}
window.toggleAutoSpeak = toggleAutoSpeak;

/* =========================
   EXPORT
   ========================= */
if (exportTxtBtn) {
  exportTxtBtn.onclick = () => {
    const chat = getActiveChat();
    if (!chat) return;

    let content = "WOFA AI Conversation\n\n";
    chat.messages.forEach(m => {
      content += `${m.role.toUpperCase()}:\n${m.message}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wofa_chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {

  autoSpeakEnabled =
    localStorage.getItem(STORAGE_KEY_AUTOSPEAK) !== "false";

  if (!getAllChats().length) createNewChat();
  else if (!getActiveChatId())
    setActiveChatId(getAllChats()[0].id);

  renderChatHistory();
  renderActiveChat();

});