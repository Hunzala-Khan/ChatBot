<template>
  <div>
    <h1>Chat Bot</h1>
    <input v-model="chatting" placeholder="Type message" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>

  <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
    <p><strong>You:</strong> {{ msg.question }}</p>
    <p><strong>AI:</strong> {{ msg.answer }}</p>
    <hr>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const chatting = ref('')
const reply   = ref('')
const chatHistory = ref([])


// ✅  ⬇⬇⬇  updated sendMessage with memory
function sendMessage() {
  if (!chatting.value) return

  // last 15 messages ko model-friendly format me convert
  const contextMessages = chatHistory.value
    .slice(-15)
    .flatMap(m => [
      { role: 'user', content: m.question },
      { role: 'assistant', content: m.answer }
    ])
  
  // naya user message push karne se pehle context + new msg bhejo
  openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...contextMessages,
      { role: 'user', content: chatting.value }
    ]
  })
  .then(res => {
    console.log('FULL RESPONSE:', res)

    reply.value = res.choices?.[0]?.message?.content || 'No reply'

    chatHistory.value.push({
      question: chatting.value,
      answer: reply.value
    })

    chatting.value = ''
  })
  .catch(err => {
    reply.value = 'Error: ' + err.message
    console.error(err)
  })
}
</script>

<style>
/* --- (same CSS as your version) --- */
body {
  background: #4d0000;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
div {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.145);
}
h1 {
  text-align: center;
  color: #000000;
  margin-bottom: 20px;
}
input[type="text"] {
  width: 75%;
  padding: 10px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}
button {
  padding: 10px 18px;
  margin-left: 5px;
  border: none;
  border-radius: 20px;
  background-color: #9000ff;
  color: #000000;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background-color: #000000;
}
.chat-line {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 12px;
  background: hsl(0, 0%, 0%);
  border-left: 4px solid #000000;
}
.chat-line p {
  margin: 5px 0;
  line-height: 1.4;
}
.chat-line strong {
  color: #ff0000;
}
</style>
