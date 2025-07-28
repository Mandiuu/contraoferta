import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Target, Briefcase, Users, Settings, X, TrendingUp, Shield } from 'lucide-react';
const Contraoferta = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('general');
  const [showTopics, setShowTopics] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  
  // AI Configuration
  const [useAI, setUseAI] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const messagesEndRef = useRef(null);

  const negotiationTopics = {
    general: {
      icon: MessageCircle,
      name: "Conversación General",
      color: "from-purple-400 to-pink-400",
      description: "Consejos generales de negociación"
    },
    salary: {
      icon: TrendingUp,
      name: "Negociación Salarial",
      color: "from-green-400 to-blue-400",
      description: "Cómo pedir un aumento de sueldo"
    },
    workplace: {
      icon: Briefcase,
      name: "Ambiente Laboral",
      color: "from-blue-400 to-indigo-400",
      description: "Negociar condiciones de trabajo"
    },
    business: {
      icon: Target,
      name: "Negocios y Contratos",
      color: "from-orange-400 to-red-400",
      description: "Negociaciones comerciales"
    },
    personal: {
      icon: Users,
      name: "Relaciones Personales",
      color: "from-pink-400 to-purple-400",
      description: "Negociar en relaciones familiares y personales"
    },
    confidence: {
      icon: Shield,
      name: "Confianza y Presencia",
      color: "from-indigo-400 to-purple-400",
      description: "Desarrollar confianza al negociar"
    }
  };

  const quickResponses = [
    "¿Cómo negocio un aumento de sueldo?",
    "Tengo miedo de parecer agresiva al negociar",
    "¿Qué hago si me interrumpen durante una negociación?",
    "¿Cómo preparo una negociación importante?",
    "Consejos para negociar trabajo remoto",
    "¿Cómo respondo a un 'no' en una negociación?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-configure Gemini API key
    const apiKey = 'AIzaSyCeJfTdFC5XPTsh5TxYr76UHPq_aA1Aep4';
    
    console.log('🔍 Auto-configuring Gemini API key...');
    
    if (apiKey && apiKey.length > 10) {
      setGeminiApiKey(apiKey);
      setUseAI(true);
      console.log('✅ Gemini API key configured automatically');
      console.log('🤖 AI responses are now enabled');
    }

    if (!showNameModal && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `¡Hola ${userName}! 👋 Soy Contraoferta, tu consejera de negociación. 

💪 **¿En qué puedo ayudarte?**
• Negociación salarial
• Confianza al negociar  
• Ambiente laboral
• Contratos y negocios
• Relaciones personales

Hazme cualquier pregunta o usa los temas de arriba. ¡Vamos a potenciar tu negociación! ✨`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [showNameModal, userName, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const callGeminiAPI = async (userMessage, userName, currentTopic, conversationHistory) => {
    if (!geminiApiKey || !useAI) {
      console.log('❌ No API key or AI disabled');
      return null;
    }
    
    try {
      const topicContext = negotiationTopics[currentTopic] 
        ? `Contexto actual: ${negotiationTopics[currentTopic].name} - ${negotiationTopics[currentTopic].description}`
        : 'Conversación general';
      
      const historyContext = conversationHistory.length > 0 
        ? `\n\nHistorial reciente: ${conversationHistory.slice(-3).join(', ')}`
        : '';

      const prompt = `Eres Contraoferta, una experta consejera especializada en ayudar a mujeres con negociación y desarrollo profesional. Tu personalidad es empática, práctica y motivadora.

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE en español
- Sé DIRECTA y natural - evita introducciones repetitivas o fórmulas
- Si ya estamos conversando, continúa de forma fluida sin saludos formales
- VARÍA completamente tu estilo de respuesta cada vez
- No uses frases como "¡Hola!" "Entiendo que..." "Esa es una buena pregunta" repetidamente
- Ve directo al punto cuando sea apropiado
- Máximo 150 palabras
- Da consejos específicos y accionables
- Conecta con negociación cuando sea relevante, pero de forma natural

ESTILOS VARIADOS (alterna entre estos):
- Respuesta directa inmediata
- Pregunta reflexiva + consejo
- Dato + estrategia práctica
- Validación + técnica específica
- Solo el consejo sin introducción

CONTEXTO:
- Usuario: ${userName}
- ${topicContext}${historyContext}

PREGUNTA/COMENTARIO: "${userMessage}"

Responde de manera única, directa y útil:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 45,
            topP: 0.95,
            maxOutputTokens: 300,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return aiResponse;
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      return null;
    }
  };

  const saveApiKey = (apiKey) => {
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      setUseAI(true);
      return true;
    }
    return false;
  };

  const removeApiKey = () => {
    setGeminiApiKey('');
    setUseAI(false);
  };

  const getAdviceResponse = (userMessage, topic) => {
    return `Entiendo tu pregunta sobre "${userMessage}". Como Contraoferta, tu consejera de negociación, estoy aquí para ayudarte con estrategias y técnicas de negociación.

💪 **¿Te gustaría que te ayude con alguno de estos temas?**
• Cómo negociar tu salario o un aumento
• Desarrollar confianza para negociar
• Estrategias para el ambiente laboral
• Técnicas para contratos y negocios
• Negociación en relaciones personales

Háblame sobre cualquier situación específica donde necesites negociar y te daré consejos personalizados. ¡Estoy aquí para potenciar tus habilidades! ✨`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, inputText]);
    
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      let responseContent = null;
      let isAIResponse = false;
      
      if (useAI && geminiApiKey) {
        responseContent = await callGeminiAPI(currentInput, userName, currentTopic, conversationHistory);
        
        if (responseContent && !responseContent.includes('❌') && !responseContent.includes('⏳') && !responseContent.includes('🔧')) {
          isAIResponse = true;
        } else {
          responseContent = null;
        }
      }
      
      if (!responseContent) {
        responseContent = getAdviceResponse(currentInput, currentTopic);
        isAIResponse = false;
      }

      const delay = isAIResponse ? 800 : 1000 + Math.random() * 1000;
      
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: responseContent,
          timestamp: new Date(),
          isAI: isAIResponse
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, delay);
      
    } catch (error) {
      console.error('❌ Error generating response:', error);
      setTimeout(() => {
        const fallbackResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: getAdviceResponse(currentInput, currentTopic),
          timestamp: new Date(),
          isAI: false
        };
        setMessages(prev => [...prev, fallbackResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickResponse = (response) => {
    setInputText(response);
    setTimeout(() => handleSend(), 100);
  };

  const handleTopicChange = (topicKey) => {
    setCurrentTopic(topicKey);
    setShowTopics(false);
    
    const topicInfo = negotiationTopics[topicKey];
    const topicMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Perfecto, ${userName}! 🎯 Has seleccionado **${topicInfo.name}**.

${topicInfo.description}

Estoy aquí para ayudarte con estrategias específicas, consejos prácticos y técnicas comprobadas en esta área. 

¿Qué aspecto específico te gustaría explorar primero? Puedes hacerme cualquier pregunta o usar las sugerencias de abajo.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, topicMessage]);
  };

  const saveName = () => {
    if (userName.trim()) {
      setShowNameModal(false);
    }
  };

  if (showNameModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Contraoferta
            </h1>
            <p className="text-gray-600 text-lg">Tu consejera personal de negociación</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo te gusta que te llamen?
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveName()}
              placeholder="Tu nombre..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              autoFocus
            />
          </div>

          <button
            onClick={saveName}
            disabled={!userName.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg"
          >
            ¡Empezar a Negociar! 💪
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>🌟 Te ayudaré a desarrollar confianza y habilidades sólidas de negociación</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Contraoferta</h1>
                <p className="text-sm text-gray-600">Consejera de Negociación para Mujeres</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTopics(!showTopics)}
                className="bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-lg text-purple-700 font-medium transition-colors flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Temas
              </button>
              
              <button
                onClick={() => setShowSettingsModal(true)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {useAI && geminiApiKey ? '🤖 IA Activa' : 'Configurar IA'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Panel */}
      {showTopics && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Elige un tema específico:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(negotiationTopics).map(([key, topic]) => (
                <button
                  key={key}
                  onClick={() => handleTopicChange(key)}
                  className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                    currentTopic === key 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`bg-gradient-to-r ${topic.color} rounded-lg w-8 h-8 flex items-center justify-center`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">{topic.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto p-4 pb-32">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-purple-500' 
                  : 'bg-gradient-to-r from-pink-400 to-purple-400'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                  message.type === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <div className="whitespace-pre-line">{message.content}</div>
                  {message.isAI && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        🤖 <span>Respuesta generada por IA</span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Responses */}
      {messages.length >= 1 && (
        <div className="fixed bottom-32 left-4 right-4 max-w-4xl mx-auto z-10">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowQuickResponses(!showQuickResponses)}
              className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">💡 Preguntas frecuentes</span>
                <span className="text-xs text-gray-500">({quickResponses.length})</span>
              </div>
              <div className={`transform transition-transform duration-200 ${showQuickResponses ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {showQuickResponses && (
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex flex-wrap gap-1.5">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleQuickResponse(response);
                        setShowQuickResponses(false);
                      }}
                      className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-xs transition-colors whitespace-nowrap hover:scale-105 transform"
                    >
                      {response}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-400">Haz clic en cualquier pregunta para enviarla</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Hola ${userName}, ¿en qué negociación puedo ayudarte hoy?`}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              {useAI && geminiApiKey ? '🤖 IA Activada • ' : ''}Contraoferta - Tu consejera personal de negociación
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">⚙️ Configuración de IA</h3>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${useAI && geminiApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">
                    Estado de IA: {useAI && geminiApiKey ? 'Activada' : 'Desactivada'}
                  </span>
                </div>
                
                {geminiApiKey ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 mb-2">
                      ✅ API Key Configurada
                    </p>
                    <p className="text-xs text-green-600 mb-3">
                      Key: ••••••••{geminiApiKey.slice(-4)}
                    </p>
                    <p className="text-xs text-green-700 mb-2">
                      🤖 La IA generará respuestas personalizadas y contextualmente relevantes para cada situación de negociación.
                    </p>
                    <button
                      onClick={removeApiKey}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Remover API Key
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 mb-2">
                      ⚠️ No hay API Key configurada
                    </p>
                    <p className="text-xs text-yellow-700 mb-3">
                      Sin IA, usaré respuestas pre-programadas. Para respuestas más inteligentes y personalizadas, configura tu API key de Gemini:
                    </p>
                    
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="Pega tu API key de Gemini aquí..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        onPaste={(e) => {
                          const apiKey = e.clipboardData.getData('text');
                          if (apiKey && saveApiKey(apiKey)) {
                            alert('✅ API key guardada! Ahora tendrás respuestas más inteligentes.');
                            setShowSettingsModal(false);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const apiKey = e.target.value;
                            if (apiKey && saveApiKey(apiKey)) {
                              alert('✅ API key guardada! Ahora tendrás respuestas más inteligentes.');
                              setShowSettingsModal(false);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        Obtén tu API key gratuita en: https://makersuite.google.com/app/apikey
                      </p>
                      <p className="text-xs text-gray-400">
                        💡 También puedes escribir directamente tu API key y presionar Enter
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">🧠 Características de IA</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Consejos personalizados según tu situación específica</li>
                  <li>• Análisis contextual de cada pregunta de negociación</li>
                  <li>• Frases exactas adaptadas a tu estilo y contexto</li>
                  <li>• Estrategias dinámicas basadas en la conversación</li>
                  <li>• Respuestas que consideran desafíos únicos de las mujeres</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contraoferta;