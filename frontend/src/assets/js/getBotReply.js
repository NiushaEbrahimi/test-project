// src/chatbot/getBotReply.js
import chatbotDb from '../../../public/data/chatbot_db.json';

function getBotReply(input) {
  if (!input) return chatbotDb.unknown_responses[0];

  const q = input.toLowerCase().trim();

  // Normalize: remove trailing ?/؟ and collapse spaces
  const normalized = q
    .replace(/[؟?]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Check exact match
  if (chatbotDb.exact_replies[normalized]) {
    return chatbotDb.exact_replies[normalized];
  }

  // 2. Check keyword-based replies
  for (const { keywords, reply } of chatbotDb.keyword_replies || []) {
    if (keywords.some(kw => normalized.includes(kw))) {
      return reply;
    }
  }

  // 3. Fallback
  return chatbotDb.unknown_responses[0];
}

export default getBotReply;