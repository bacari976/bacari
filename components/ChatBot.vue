<template>
  <div>
    <div v-if="!isOpen" class="chat-bubble-container" @click="openChat">
      <div class="speech-bubble">
        <div class="bubble-content">
          <v-avatar size="28" class="gradient-avatar me-2">
            <span class="text-white font-weight-bold text-body-2">JB</span>
          </v-avatar>
          <div class="bubble-text-container">
            <span class="bubble-text">Besoin d'aide ?</span>
          </div>
        </div>
        <div class="bubble-tail"></div>
        <div class="bubble-pulse"></div>
      </div>
    </div>

    <v-card v-if="isOpen" class="chat-window" elevation="12">
      <v-card-title class="d-flex justify-space-between align-center pa-4 chat-header">
        <div class="d-flex align-center">
          <v-avatar size="36" class="me-3 gradient-avatar">
            <span class="text-white font-weight-bold text-h5">JB</span>
          </v-avatar>
          <div>
            <div class="text-h6 text-white">Ghostwritter bacari</div>
            <div class="text-caption text-blue-darken-2">En ligne</div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="closeChat" />
      </v-card-title>

      <v-card-text class="chat-messages pa-0">
        <div v-if="messages.length === 0" class="pa-4 text-center">
          <v-avatar size="48" class="mb-3 gradient-avatar">
            <span class="text-white font-weight-bold text-h4">JB</span>
          </v-avatar>
          <div class="text-h6 mb-2">Salut ! 👋</div>
          <div class="text-body-2 text-grey-darken-1">Comment puis-je t'aider aujourd'hui ?</div>
        </div>

        <div class="pa-3">
          <div v-for="(message, index) in messages" :key="index" class="message-container mb-4">
            <div v-if="message.type === 'bot'" class="d-flex align-start mb-3">
              <v-avatar size="32" class="me-3 gradient-avatar">
                <span class="text-white font-weight-bold text-body-1">JB</span>
              </v-avatar>
              <div class="bot-message flex-grow-1">
                <v-card class="pa-3" color="surface" elevation="1" rounded="lg">
                  <div v-if="message.isTyping" class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div v-else class="text-body-1 formatted-message" v-html="formatMessage(message.text)"></div>
                </v-card>
              </div>
            </div>

            <div v-if="message.type === 'user'" class="d-flex justify-end mb-3">
              <v-card class="pa-3 user-message" color="primary" elevation="1" rounded="lg" max-width="80%">
                <div class="text-white text-body-1">{{ message.text }}</div>
              </v-card>
            </div>

            <div v-if="message.choices && !isTyping" class="choices-container mt-3 ps-11">
              <div class="d-flex flex-column ga-2">
                <v-btn v-for="(choice, choiceIndex) in message.choices" :key="choiceIndex" :text="choice.text"
                  variant="outlined" color="primary" class="choice-button text-start justify-start" rounded="lg"
                  @click="selectChoice(choice)">
                  <template #prepend>
                    <v-icon :icon="getChoiceIcon(choice.action)" size="18" />
                  </template>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-3 bg-surface-light">
        <v-btn text="🔄 Recommencer" variant="text" color="primary" size="small" @click="restartChat" />
        <v-spacer />
        <v-btn text="Fermer" variant="text" color="grey" size="small" @click="closeChat" />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import type { ChatChoice, ChatMessage, ChatScenario } from '../types/chat'

const isOpen = ref(false)
const isTyping = ref(false)
const messages = ref<ChatMessage[]>([])
const currentScenario = ref<string>('bienvenue')
const scenarios = ref<Record<string, ChatScenario>>({})

const loadScenarios = async () => {
  try {
    const response = await fetch('/scenarios.json')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors du chargement des scénarios:', error)
    return {
      bienvenue: {
        id: 'bienvenue',
        message: 'Salut ! Je suis l\'assistant de Jean Bacari. Comment puis-je t\'aider ?',
        choices: [
          { text: 'Découvrir les services', action: 'services' },
          { text: 'Voir les témoignages', action: 'temoignages' },
          { text: 'Consulter les tarifs', action: 'tarifs' },
          { text: 'Prendre contact', action: 'contact' }
        ]
      }
    }
  }
}

const formatMessage = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

const getChoiceIcon = (action: string): string => {
  const icons: Record<string, string> = {
    services: 'mdi-briefcase',
    temoignages: 'mdi-star',
    tarifs: 'mdi-currency-eur',
    contact: 'mdi-phone',
    storytelling: 'mdi-format-quote-close',
    strategie: 'mdi-chart-line',
    'gain-temps': 'mdi-clock-outline',
    'reserver-appel': 'mdi-calendar-check',
    'contact-whatsapp': 'mdi-whatsapp',
    'scroll-temoignages': 'mdi-arrow-down',
    'scroll-tarifs': 'mdi-arrow-down',
    'scroll-services': 'mdi-arrow-down',
    horaires: 'mdi-clock',
    bienvenue: 'mdi-home'
  }
  return icons[action] || 'mdi-arrow-right'
}

const executeAction = async (action: string) => {
  switch (action) {
    case 'reserver-appel':
      await addBotMessage('Parfait ! Je t\'emmène vers Calendly pour réserver ton appel gratuit')
      setTimeout(() => {
        window.open('https://calendly.com/bacari-bm', '_blank')
        closeChat()
      }, 2500)
      break

    case 'contact-whatsapp':
      await addBotMessage('Je t\'ouvre WhatsApp pour discuter directement avec Jean !')
      openWhatsApp()
      break

    case 'scroll-services':
      await addBotMessage('Direction la section services !')
      scrollToSection('services')
      break

    case 'scroll-temoignages':
      await addBotMessage('Allons voir les témoignages clients !')
      scrollToSection('testimonials')
      break

    case 'scroll-tarifs':
      await addBotMessage('Je t\'emmène voir les tarifs du Starter Pack !')
      scrollToSection('pricing')
      break

    default:
      return false
  }
  return true
}

const openWhatsApp = () => {
  setTimeout(() => {
    closeChat()
  }, 2500)

  setTimeout(() => {
    const phoneNumber = '+33698931336'
    const message = 'Salut Jean ! Je souhaite discuter de tes services LinkedIn'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }, 2700)
}

const scrollToSection = (sectionId: string) => {
  setTimeout(() => {
    closeChat()
  }, 2500)

  setTimeout(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }, 300)
}

const openChat = async () => {
  isOpen.value = true
  await nextTick()
  if (messages.value.length === 0) {
    startConversation()
  }
}

const closeChat = () => {
  isOpen.value = false
}

const startConversation = async () => {
  const welcomeScenario = scenarios.value[currentScenario.value]
  if (welcomeScenario) {
    await addBotMessage(welcomeScenario.message, welcomeScenario.choices)
  }
}

const addBotMessage = async (text: string, choices?: ChatChoice[]) => {
  isTyping.value = true
  const typingMessage: ChatMessage = {
    type: 'bot',
    text: '',
    isTyping: true
  }
  messages.value.push(typingMessage)

  await new Promise(resolve => setTimeout(resolve, 800))

  messages.value.pop()
  const botMessage: ChatMessage = {
    type: 'bot',
    text,
    choices,
    isTyping: false
  }
  messages.value.push(botMessage)
  isTyping.value = false

  await nextTick()
  scrollToBottom()
}

const addUserMessage = (text: string) => {
  const userMessage: ChatMessage = {
    type: 'user',
    text,
    isTyping: false
  }
  messages.value.push(userMessage)
  scrollToBottom()
}

const selectChoice = async (choice: ChatChoice) => {
  addUserMessage(choice.text)

  const actionExecuted = await executeAction(choice.action)
  if (actionExecuted) {
    return
  }

  const nextScenario = scenarios.value[choice.action]
  if (nextScenario) {
    currentScenario.value = choice.action
    await addBotMessage(nextScenario.message, nextScenario.choices)
  }
}

const restartChat = async () => {
  messages.value = []
  currentScenario.value = 'bienvenue'
  await startConversation()
}

const scrollToBottom = () => {
  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages')
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  })
}

onMounted(async () => {
  scenarios.value = await loadScenarios()
})
</script>

<style scoped>
.chat-bubble-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-bubble-container:hover {
  transform: translateY(-2px);
}

.speech-bubble {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  border-radius: 20px;
  padding: 14px 18px;
  box-shadow: 0 8px 30px rgba(var(--v-theme-primary), 0.5);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.bubble-pulse {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  opacity: 0.6;
  animation: pulse 2s infinite;
  z-index: -1;
}

.bubble-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.bubble-text-container {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
}

.bubble-text {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.bubble-subtext {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.1;
}

.bubble-tail {
  position: absolute;
  bottom: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid rgb(var(--v-theme-secondary));
  filter: drop-shadow(0 2px 4px rgba(var(--v-theme-primary), 0.2));
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3) translateY(50px);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) translateY(-10px);
  }
  70% {
    transform: scale(0.9) translateY(0);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

.chat-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  height: 600px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 16px !important;
}

.chat-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
  border-radius: 16px 16px 0 0 !important;
}

@keyframes slideInUp {
  from {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  max-height: 450px;
}

.message-container {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.bot-message {
  max-width: 85%;
}

.user-message {
  max-width: 85%;
}

.choice-button {
  margin-bottom: 8px;
  transition: all 0.3s ease;
  text-transform: none !important;
  font-weight: 500;
  min-height: 44px;
}

.choice-button:hover {
  transform: translateX(8px);
  background-color: rgba(var(--v-theme-primary), 0.1);
}

@media (hover: none) and (pointer: coarse) {
  .choice-button:hover {
    transform: none;
  }

  .choice-button:active {
    transform: scale(0.98);
    background-color: rgba(var(--v-theme-primary), 0.15);
  }

  .chat-bubble-container:hover {
    transform: none;
  }

  .chat-bubble-container:active {
    transform: translateY(1px);
  }

  .speech-bubble:active {
    transform: scale(0.98);
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-outline-variant), 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-outline), 0.5);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-outline), 0.7);
}

@media (max-width: 600px) {
  .chat-window {
    width: calc(100vw - 16px);
    height: calc(100vh - 100px);
    bottom: 8px;
    right: 8px;
    left: 8px;
    border-radius: 12px !important;
  }

  .chat-bubble-container {
    bottom: 20px !important;
    right: 20px !important;
  }

  .speech-bubble {
    padding: 12px 16px;
    border-radius: 18px;
  }

  .bubble-pulse {
    border-radius: 22px;
  }

  .bubble-text {
    font-size: 0.85rem;
  }

  .bubble-subtext {
    font-size: 0.7rem;
  }

  .bubble-tail {
    right: 18px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgb(var(--v-theme-secondary));
    bottom: -6px;
  }

  .chat-messages {
    max-height: calc(100vh - 220px);
  }

  .bot-message {
    max-width: 95%;
  }

  .user-message {
    max-width: 90%;
  }

  .choice-button {
    font-size: 0.875rem;
    padding: 8px 12px;
  }
}

@media (max-width: 360px) {
  .chat-window {
    width: calc(100vw - 12px);
    height: calc(100vh - 80px);
    bottom: 6px;
    right: 6px;
    left: 6px;
  }

  .chat-bubble-container {
    bottom: 16px !important;
    right: 16px !important;
  }

  .speech-bubble {
    padding: 10px 14px;
    border-radius: 16px;
  }

  .bubble-pulse {
    border-radius: 20px;
  }

  .bubble-text {
    font-size: 0.8rem;
  }

  .bubble-subtext {
    font-size: 0.65rem;
  }

  .bubble-tail {
    right: 16px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgb(var(--v-theme-secondary));
    bottom: -5px;
  }

  .choice-button {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

.formatted-message {
  line-height: 1.6;
}

.formatted-message strong {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  font-size: 1.1em;
}

.gradient-avatar {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.3);
}
</style>