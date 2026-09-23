'use server'

import webpush from 'web-push'
import {
  getAllSubscriptions,
  removeSubscription,
  saveSubscription,
  type StoredSubscription,
} from '../lib/subscriptions'

function requireVapidKeys() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    throw new Error(
      'Missing VAPID keys. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env.local (see .env.example). Run `npm run vapid` to generate them.'
    )
  }

  webpush.setVapidDetails('mailto:dev@localhost', publicKey, privateKey)
}

export async function subscribeUser(sub: StoredSubscription) {
  requireVapidKeys()
  await saveSubscription(sub)
  return { success: true }
}

export async function unsubscribeUser(endpoint: string) {
  requireVapidKeys()
  if (!endpoint) {
    throw new Error('unsubscribeUser requires a subscription endpoint')
  }
  await removeSubscription(endpoint)
  return { success: true }
}

export async function sendNotification(message: string) {
  requireVapidKeys()

  const subscriptions = await getAllSubscriptions()
  if (subscriptions.length === 0) {
    throw new Error('No subscription available. Subscribe from the app first.')
  }

  const payload = JSON.stringify({
    title: 'Test Notification',
    body: message,
    icon: '/icon.png',
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        sub as unknown as webpush.PushSubscription,
        payload
      )
    )
  )

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length === results.length) {
    console.error('Error sending push notification:', failed)
    return { success: false, error: 'Failed to send notification' }
  }

  if (failed.length > 0) {
    console.error('Some push notifications failed:', failed)
  }

  return { success: true }
}
