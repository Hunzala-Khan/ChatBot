<template>
  <div>
    <h1>Chat Bot</h1>
    <input
      v-model="chatting"
      placeholder="Type message"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">Send</button>
  </div>

  <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
    <p><strong>You:</strong> {{ msg.question }}</p>
    <p><strong>AI:</strong> {{ msg.answer }}</p>
    <hr />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai'
import AITool, { toolsList } from './AI_Tool.js' // ensure correct filename & path

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const chatting = ref('')
const chatHistory = ref([])

// ✅ Keywords to decide when to use AITool
const infoKeywords = ['information', 'detail', 'attendance', 'subject', 'student', 'teacher', 'employee', 'class']

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
        // Argument extraction
        const argRes = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `User message: "${userMessage}".
Tumhe bas ek argument return karna hai (jaise student ka naam, id ya date)
jo function "${matchedTool.name}" ko dena chahiye.
Return sirf argument ka text, extra kuch nahi.`
            }
          ]
        })

        const argument = argRes.choices?.[0]?.message?.content?.trim() || ''
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
input[type='text'] {
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
