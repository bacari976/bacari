export interface ChatMessage {
  type: 'bot' | 'user'
  text: string
  choices?: ChatChoice[]
  isTyping: boolean
  isSkillsList?: boolean
}

export interface ChatChoice {
  text: string
  action: string
}

export interface ChatScenario {
  id: string
  message: string
  choices?: ChatChoice[]
} 