<template>
  <div class="chatbot">
    <h1>Chat Bot</h1>

    <div class="chat-box">
      <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
        <p><strong>You:</strong> {{ msg.question }}</p>
        <p><strong>AI:</strong> {{ msg.answer }}</p>
        <hr />
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="chatting"
        placeholder="Type message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai'
import AITools, { toolsList } from './AITools.js' // ✅ correct filename & path

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const chatting = ref('')
const chatHistory = ref([])
const reply = ref('')

// ✅ Keywords to decide when to use AITool
const infoKeywords = [
  'information',
  'detail',
  'attendance',
  'subject',
  'student',
  'teacher',
  'employee',
  'class'
]

async function sendMessage() {
  if (!chatting.value) return
  const userMessage = chatting.value
  chatting.value = ''

  try {
    // 🔍 Check if user is asking for info-related query
    const lowerMsg = userMessage.toLowerCase()
    const shouldUseAITool = infoKeywords.some(word => lowerMsg.includes(word))

    let aiResponse = ''

    if (shouldUseAITool) {
      // 🧠 Try matching tool if info-related
      const toolDescriptions = toolsList
        .map(t => `${t.name}: ${t.description}`)
        .join('\n')

      const toolChoiceRes = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tumhara kaam hai user ke message se yeh decide karna ke kis function kaam karega.
Yeh available tools hain:
${toolDescriptions}

Return sirf us function ka exact name likho (e.g. "getStudentInformationByName")
Agar koi match nahi milta toh likho "none".`
          },
          { role: 'user', content: userMessage }
        ]
      })

      const chosenToolName =
        toolChoiceRes.choices?.[0]?.message?.content?.trim() || 'none'

      const matchedTool = toolsList.find(
        t => t.name.toLowerCase() === chosenToolName.toLowerCase()
      )

      if (matchedTool) {
        // ✅ Argument extraction (improved)
        const argRes = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `User message: "${userMessage}".
Extract sirf main argument value — agar message me number ho to sirf number likho (e.g. "2"),
agar name ho to sirf name likho (e.g. "Ali").
Return kuch aur nahi, sirf clean argument.`
            }
          ]
        })

        let argument = argRes.choices?.[0]?.message?.content?.trim() || ''

        // ✅ Smart cleaning for numeric or text arguments
        if (/(\d+)/.test(argument)) {
          argument = Number(argument.match(/(\d+)/)[0])
        }

        const result = matchedTool.func(argument)
        aiResponse = result
          ? JSON.stringify(result, null, 2)
          : 'Kuch result nahi mila.'
      } else {
        aiResponse = 'Mujhe koi relevant function nahi mila.'
      }
    } else {
      // 💬 GPT normal conversation mode
      const chatRes = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Tum ek friendly AI assistant ho jo user se normal baat karta hai.'
          },
          { role: 'user', content: userMessage }
        ]
      })

      aiResponse =
        chatRes.choices?.[0]?.message?.content ||
        'Sorry, mujhe samajh nahi aya.'
    }

    // 🗂 Add to chat history
    chatHistory.value.push({
      question: userMessage,
      answer: aiResponse
    })
  } catch (err) {
    console.error(err)
    chatHistory.value.push({
      question: userMessage,
      answer: 'Error: ' + err.message
    })
  }
}
</script>

<style>
h1 {
  text-align: center;
  color: rgb(255, 255, 255);
}
.chatbot {
  width: 420px;
  margin: 30px auto;
  padding: 20px;
  background: #000000;
  border-radius: 12px;
  box-shadow: 0 0 10px #fff9f9;
}
.chat-box {
  background: rgb(255, 255, 255);
  padding: 10px;
  border-radius: 10px;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.chat-line {
  margin-bottom: 8px;
}
.input-area {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #000000;
}
button {
  padding: 10px 15px;
  border: none;
  background: #3498db;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #2980b9;
}
</style>
