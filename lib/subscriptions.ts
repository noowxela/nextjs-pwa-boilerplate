import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type StoredSubscription = PushSubscriptionJSON

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json')

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true })
}

async function readSubscriptions(): Promise<StoredSubscription[]> {
  try {
    const raw = await readFile(SUBSCRIPTIONS_FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as StoredSubscription[]
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return []
    throw error
  }
}

async function writeSubscriptions(subs: StoredSubscription[]) {
  await ensureDataDir()
  await writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), 'utf8')
}

export async function saveSubscription(sub: StoredSubscription) {
  if (!sub.endpoint) {
    throw new Error('Subscription is missing endpoint')
  }
  const subs = await readSubscriptions()
  const next = subs.filter((s) => s.endpoint !== sub.endpoint)
  next.push(sub)
  await writeSubscriptions(next)
}

export async function removeSubscription(endpoint: string) {
  const subs = await readSubscriptions()
  const next = subs.filter((s) => s.endpoint !== endpoint)
  await writeSubscriptions(next)
}

export async function getAllSubscriptions(): Promise<StoredSubscription[]> {
  return readSubscriptions()
}

export async function getFirstSubscription(): Promise<StoredSubscription | null> {
  const subs = await readSubscriptions()
  return subs[0] ?? null
}
