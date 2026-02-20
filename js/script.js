/* ==========================================================
   WOFA AI FRONTEND CORE (Teaching Restored Version - 2026)
   Clean • Structured • Lesson Auto-Teach Restored
   ========================================================== */

/* =========================
   GLOBAL STATE
   ========================= */
let isSending = false;
let autoSpeakEnabled = true;
let lessonTriggered = false;

/* =========================
   DOM REFERENCES
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const autoSpeakToggleBtn = document.getElementById("autoSpeakToggleBtn");

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

  renderActiveChat();
}

/* =========================
   RENDER CHAT
   ========================= */
function renderActiveChat() {
  if (!chatBox) return;

  const chat = getActiveChat();
  chatBox.innerHTML = "";

  if (!chat || chat.messages.length === 0) {
    chatBox.innerHTML = `
      <div class="message ai">
        <strong>Hello 👋 I’m WOFA AI</strong><br><br>
        Select a lesson or ask me anything to begin learning.
      </div>
    `;
    return;
  }

  chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message " + msg.role;
    div.innerHTML = formatMessage(msg.message);
    chatBox.appendChild(div);
  });

  scrollToBottom();
}

/* =========================
   FORMAT MESSAGE (Clean Outline)
   ========================= */
function formatMessage(text) {
  let clean = sanitizeHTML(text);

  // Remove markdown headings from outline
  clean = clean.replace(/^##\s*/gm, "");

  return clean.replace(/\n/g, "<br>");
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
  div.innerHTML = formatMessage(text);
  chatBox.appendChild(div);

  saveMessage("user", text);
  scrollToBottom();
}

function addAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message ai";
  div.innerHTML = formatMessage(text);
  chatBox.appendChild(div);

  saveMessage("ai", text);
  scrollToBottom();
}

/* =========================
   PROMPT BUILDERS
   ========================= */
function buildTeachingPrompt(topic) {
  return `
You are WOFA AI teacher.

IMPORTANT RULES:

1. First generate exactly 10 lesson outline points.
2. DO NOT use markdown symbols like ## in outline.
3. Use clean numbering format:
   1. Title
   1.1 Subpoint
   1.2 Subpoint
4. After outline, begin teaching section.
5. Teaching section may use explanation symbols.
6. Keep outline clean and professional.
7. No emojis in outline.

Topic:
${topic}
  `;
}

/* =========================
   SEND QUESTION
   ========================= */
async function sendQuestion(forceTeach = false) {
  if (isSending || !input) return;

  const question = input.value.trim();
  if (!question && !forceTeach) return;

  if (!getActiveChat()) createNewChat();

  const finalQuestion = question || "Begin teaching selected lesson.";

  addUserMessage(finalQuestion);
  input.value = "";

  isSending = true;

  const prompt = forceTeach
    ? buildTeachingPrompt(finalQuestion)
    : finalQuestion;

  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: prompt })
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
   AUTO TEACH WHEN LESSON CLICKED
   ========================= */
window.autoTeachLesson = function(courseTitle, lessonTitle) {
  lessonTriggered = true;

  const topic = lessonTitle || courseTitle;
  if (!topic) return;

  if (!getActiveChat())
    createNewChat("Lesson: " + topic);

  input.value = topic;
  sendQuestion(true);
};

/* =========================
   ENTER KEY SEND
   ========================= */
if (input) {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion(false);
    }
  });
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

  renderActiveChat();
});