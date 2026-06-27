import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Smile, Check, CheckCheck, ArrowLeft, Briefcase } from 'lucide-react'
import { chatApi } from '../api/chat'
import { requestsApi } from '../api/requests'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { cn, formatDate, getInitials } from '../lib/utils'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)
  const messagesEndRef = useRef(null)

  const rolePath = user?.role?.toLowerCase() === 'client' ? 'customer' : user?.role?.toLowerCase()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const isWorker = user?.role === 'WORKER'
        const [chatRes, reqRes] = await Promise.all([
          chatApi.getConversations(),
          isWorker ? requestsApi.getReceived() : requestsApi.getSent(),
        ])
        const chatList = Array.isArray(chatRes.data) ? chatRes.data : []
        const reqList = Array.isArray(reqRes.data) ? reqRes.data : []

        const grouped = {}
        const nullJobMsgs = []

        chatList.forEach(msg => {
          const otherId = msg.senderId === user?.id ? msg.receiverId : msg.senderId
          if (msg.jobId != null) {
            const key = `${msg.jobId}-${otherId}`
            if (!grouped[key] || new Date(msg.createdAt) > new Date(grouped[key].createdAt)) {
              grouped[key] = { ...msg, otherUserId: otherId }
            }
          } else {
            nullJobMsgs.push({ ...msg, otherUserId: otherId })
          }
        })

        reqList
          .filter(r => r.status === 'ACCEPTED')
          .forEach(req => {
            const otherId = isWorker ? req.clientId : req.workerId
            const otherName = isWorker ? req.clientName : req.workerName
            const key = `req-${req.id}-${otherId}`
            const chatKey = `${req.id}-${otherId}`
            if (!grouped[key] && !grouped[chatKey]) {
              grouped[key] = {
                id: `req-${req.id}`,
                jobId: req.id,
                jobTitle: req.jobTitle,
                otherUserId: otherId,
                senderId: otherId,
                receiverId: user?.id,
                senderName: otherName,
                receiverName: user?.fullName,
                content: 'Work request accepted. Start chatting!',
                createdAt: req.createdAt,
                read: true,
                isRequest: true,
              }
            }
          })

        nullJobMsgs.forEach(msg => {
          const matchKey = Object.keys(grouped).find(k => k.endsWith(`-${msg.otherUserId}`))
          if (matchKey) {
            if (new Date(msg.createdAt) > new Date(grouped[matchKey].createdAt)) {
              grouped[matchKey] = { ...msg, jobId: grouped[matchKey].jobId, isRequest: grouped[matchKey].isRequest ?? false }
            }
          } else {
            const key = `null-${msg.otherUserId}`
            if (!grouped[key] || new Date(msg.createdAt) > new Date(grouped[key].createdAt)) {
              grouped[key] = { ...msg, isRequest: true, jobId: null }
            }
          }
        })

        setConversations(Object.values(grouped).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } catch {
        setConversations([])
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openChat = async (conv) => {
    setActiveChat(conv)
    try {
      const jobId = conv.isRequest ? 0 : conv.jobId
      const { data } = await chatApi.getConversation(jobId, conv.otherUserId)
      setMessages(Array.isArray(data) ? data : [])
      if (!conv.isRequest) {
        await chatApi.markRead(conv.jobId, conv.otherUserId)
        setConversations(prev => prev.map(c =>
          c.jobId === conv.jobId && c.otherUserId === conv.otherUserId ? { ...c, read: true } : c
        ))
      }
    } catch {
      setMessages([])
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !activeChat) return
    const text = messageText
    setSending(true)
    setSendError(null)
    try {
      const payload = {
        receiverId: activeChat.otherUserId,
        jobId: activeChat.isRequest ? null : activeChat.jobId,
        content: text,
      }
      const { data } = await chatApi.send(payload)
      setMessages(prev => [...prev, data])
      setActiveChat(prev => prev ? { ...prev, isRequest: false, jobId: null } : prev)
      setConversations(prev => prev.map(c =>
        c.otherUserId === activeChat.otherUserId
          ? { ...c, content: text, createdAt: new Date().toISOString(), read: true }
          : c
      ))
      setMessageText('')
    } catch (err) {
      const data = err?.response?.data
      const msg = data?.message || (data?.errors ? Object.values(data.errors).join(', ') : null) || err?.message || 'Failed to send message'
      setSendError(msg)
      setTimeout(() => setSendError(null), 5000)
      console.error('Send error:', err)
    }
    setSending(false)
  }

  const otherName = (conv) => conv.senderId === user?.id ? conv.receiverName : conv.senderName
  const otherId = (conv) => conv.senderId === user?.id ? conv.receiverId : conv.senderId

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-6 xl:-mx-8">
      <div className="flex h-full bg-white rounded-2xl border border-primary-500/5 overflow-hidden">
        <div className={cn('w-full lg:w-80 xl:w-96 border-r border-primary-500/5 flex flex-col', activeChat && 'hidden lg:flex')}>
          <div className="p-4 border-b border-primary-500/5">
            <h2 className="text-heading-4 text-primary-500 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-primary-50/50 rounded-xl pl-9 pr-4 py-2 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full shimmer shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 shimmer rounded" />
                      <div className="h-2 w-1/2 shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <p className="text-body-sm text-muted">No conversations yet</p>
                </div>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={`${conv.jobId}-${otherId(conv)}`}
                  onClick={() => openChat(conv)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 text-left hover:bg-primary-50/50 transition-colors border-b border-primary-500/5',
                    activeChat?.jobId === conv.jobId && activeChat?.otherUserId === otherId(conv) && 'bg-secondary-50/50'
                  )}
                >
                  <div className="relative shrink-0">
                    {conv.isRequest ? (
                      <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-accent-600" />
                      </div>
                    ) : (
                      <Avatar name={otherName(conv)} size="md" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-sm font-medium text-primary-500 truncate">{otherName(conv)}</p>
                      <span className="text-caption text-muted shrink-0">{formatDate(conv.createdAt)}</span>
                    </div>
                    <p className="text-caption text-muted truncate mt-0.5">{conv.content}</p>
                    <p className="text-[11px] text-muted/50 mt-0.5">{conv.jobTitle}</p>
                  </div>
                  {!conv.read && conv.receiverId === user?.id && (
                    <span className="w-2 h-2 bg-secondary-500 rounded-full shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className={cn('flex-1 flex flex-col', !activeChat && 'hidden lg:flex')}>
          {activeChat ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500/5">
                <div className="flex items-center gap-3">
                  <button className="lg:hidden p-1" onClick={() => setActiveChat(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar name={otherName(activeChat)} size="md" />
                  <div>
                    <p className="text-body-sm font-medium text-primary-500">{otherName(activeChat)}</p>
                    <p className="text-caption text-muted">{activeChat.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-primary-50 text-muted"><Phone className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-primary-50 text-muted"><Video className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-body-sm text-muted">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={cn('flex', msg.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2.5',
                        msg.senderId === user?.id ? 'bg-secondary-500 text-white rounded-br-md' : 'bg-primary-50 text-primary-500 rounded-bl-md'
                      )}>
                        <p className="text-body-sm">{msg.content}</p>
                        <div className={cn('flex items-center gap-1 mt-1', msg.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                          <span className={cn('text-[10px]', msg.senderId === user?.id ? 'text-white/60' : 'text-muted')}>
                            {formatDate(msg.createdAt)}
                          </span>
                          {msg.senderId === user?.id && (
                            msg.read ? <CheckCheck className="w-3 h-3 text-white/60" /> : <Check className="w-3 h-3 text-white/60" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {sendError && (
                <div className="px-4 py-2 bg-danger/10 text-danger text-caption text-center">{sendError}</div>
              )}

              <form onSubmit={sendMessage} className="p-4 border-t border-primary-500/5">
                <div className="flex items-center gap-2 bg-primary-50/50 rounded-xl px-4 py-2">
                  <button type="button" className="p-1 text-muted hover:text-primary-500"><Paperclip className="w-5 h-5" /></button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-body-sm text-primary-500 placeholder:text-muted/50 py-1.5"
                  />
                  <button type="submit" disabled={!messageText.trim() || sending} className="p-2 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-heading-4 text-primary-500 mb-2">Your Messages</h3>
                <p className="text-body-sm text-muted max-w-xs">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
