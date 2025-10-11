<template>
  <div>
    <h1>Chat Bot</h1>
    <input v-model="chatting" placeholder="Type message" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>

    <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
      <p><strong>You:</strong> {{ msg.question }}</p>
      <p><strong>AI:</strong> {{ msg.answer }}</p>
      <hr>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai'
import AITool, { toolsList } from './AITool.js'

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const chatting = ref('')
const chatHistory = ref([])

// 🧩 Simple Query Analyzer
function analyzeQuery(query) {
  query = query.toLowerCase()

  if (query.includes('student id')) return 'getStudentInformationById'
  if (query.includes('student name')) return 'getStudentInformationByName'
  if (query.includes('teacher name')) return 'getTeacherInformationByName'
  if (query.includes('employee name')) return 'getEmployeesInformationByName'
  if (query.includes('attendance')) return 'getAttendanceByDate'

  // Default fallback
  return null
}

// 🧠 Main Chatbot Logic
async function sendMessage() {
  if (!chatting.value) return
  const userInput = chatting.value.trim()

  // 1️⃣ Try to find matching tool
  const detectedTool = analyzeQuery(userInput)
  let toolResult = null

  if (detectedTool) {
    const tool = toolsList.find(t => t.name === detectedTool)
    if (tool) {
      try {
        if (userInput.match(/\d+/)) {
          const id = parseInt(userInput.match(/\d+/)[0])
          toolResult = tool.func(id)
        } else {
          const name = userInput.split('name').pop().trim()
          toolResult = tool.func(name)
        }
      } catch (err) {
        console.error('Tool execution error:', err)
      }
    }
  }

  // 2️⃣ Make AI reply (with data if found)
  const systemPrompt = toolResult
    ? `User asked: "${userInput}". Here is related data: ${JSON.stringify(toolResult)}`
    : `User asked: "${userInput}". No tool matched, reply normally.`

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.value.slice(-10).flatMap(m => [
          { role: 'user', content: m.question },
          { role: 'assistant', content: m.answer }
        ]),
        { role: 'user', content: userInput }
      ]
    })

    const aiReply = res.choices?.[0]?.message?.content || 'No reply'

    chatHistory.value.push({
      question: userInput,
      answer: aiReply
    })
    chatting.value = ''
  } catch (err) {
    console.error(err)
    chatHistory.value.push({
      question: userInput,
      answer: 'Error: ' + err.message
    })
  }
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
