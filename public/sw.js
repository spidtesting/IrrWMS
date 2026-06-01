/* eslint-disable no-restricted-globals */
/**
 * IrrWMS service worker — caches shell assets and queues offline stock entries.
 */

const CACHE_NAME = "irrwms-v1";
const OFFLINE_QUEUE_KEY = "irrwms-offline-stock-queue";
const STOCK_ENTRY_API = "/api/v1/stock-entries";

const SHELL_ASSETS = [
  "/",
  "/login",
  "/stock-entry",
  "/manifest.json",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    if (
      request.method === "POST" &&
      new URL(request.url).pathname.startsWith(STOCK_ENTRY_API)
    ) {
      event.respondWith(handleStockEntryPost(request));
    }
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response.ok && request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match("/offline.html"));
    }),
  );
});

async function handleStockEntryPost(request) {
  try {
    const response = await fetch(request.clone());
    if (response.ok) return response;
    throw new Error("Network response not ok");
  } catch {
    const body = await request.clone().json();
    await enqueueStockEntry(body);
    return new Response(
      JSON.stringify({
        success: true,
        queued: true,
        message: "Stock entry queued for sync when online",
      }),
      {
        status: 202,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function enqueueStockEntry(entry) {
  const db = await openQueueDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_KEY, "readwrite");
    const store = tx.objectStore(OFFLINE_QUEUE_KEY);
    store.add({
      ...entry,
      queuedAt: new Date().toISOString(),
      idempotencyKey: entry.idempotencyKey ?? crypto.randomUUID(),
    });
    tx.oncomplete = () => resolve(undefined);
    tx.onerror = () => reject(tx.error);
  });
}

async function flushOfflineQueue() {
  const db = await openQueueDb();
  const entries = await new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_KEY, "readonly");
    const store = tx.objectStore(OFFLINE_QUEUE_KEY);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });

  for (const entry of entries) {
    try {
      const response = await fetch(STOCK_ENTRY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": entry.idempotencyKey,
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        await removeQueuedEntry(entry.idempotencyKey);
      }
    } catch {
      break;
    }
  }
}

async function removeQueuedEntry(idempotencyKey) {
  const db = await openQueueDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_KEY, "readwrite");
    const store = tx.objectStore(OFFLINE_QUEUE_KEY);
    const index = store.index("idempotencyKey");
    const request = index.getKey(idempotencyKey);
    request.onsuccess = () => {
      if (request.result != null) store.delete(request.result);
    };
    tx.oncomplete = () => resolve(undefined);
    tx.onerror = () => reject(tx.error);
  });
}

function openQueueDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("irrwms-offline", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OFFLINE_QUEUE_KEY)) {
        const store = db.createObjectStore(OFFLINE_QUEUE_KEY, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("idempotencyKey", "idempotencyKey", { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

self.addEventListener("sync", (event) => {
  if (event.tag === "flush-stock-queue") {
    event.waitUntil(flushOfflineQueue());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "FLUSH_STOCK_QUEUE") {
    event.waitUntil(flushOfflineQueue());
  }
});
