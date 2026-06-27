import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useSocket(userId) {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const subscriptionsRef = useRef(new Map())

  useEffect(() => {
    if (!userId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {},
      reconnectDelay: 5000,
      heartbeatsIncoming: 4000,
      heartbeatsOutgoing: 4000,
      onConnect: () => {
        setConnected(true)
      },
      onDisconnect: () => {
        setConnected(false)
      },
      onStompError: () => {
        setConnected(false)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe())
      subscriptionsRef.current.clear()
      client.deactivate()
    }
  }, [userId])

  const subscribe = (destination, callback) => {
    if (!clientRef.current || !connected) return null

    const subscription = clientRef.current.subscribe(destination, message => {
      const data = JSON.parse(message.body)
      callback(data)
    })
    subscriptionsRef.current.set(destination, subscription)
    return subscription
  }

  const unsubscribe = (destination) => {
    const sub = subscriptionsRef.current.get(destination)
    if (sub) {
      sub.unsubscribe()
      subscriptionsRef.current.delete(destination)
    }
  }

  const send = (destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      })
    }
  }

  return { connected, subscribe, unsubscribe, send }
}
