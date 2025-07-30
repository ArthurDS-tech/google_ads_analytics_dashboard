#!/usr/bin/env node

// Script para corrigir problemas de compatibilidade do Node.js com Vite
import { createHash } from 'crypto';

// Patch para crypto.hash que está causando problemas no Vite
if (typeof crypto !== 'undefined' && !crypto.hash) {
  crypto.hash = function(algorithm, data) {
    return createHash(algorithm).update(data).digest('hex');
  };
}

// Patch global para o Node.js
if (typeof globalThis !== 'undefined') {
  if (!globalThis.crypto) {
    globalThis.crypto = crypto;
  }
  if (globalThis.crypto && !globalThis.crypto.hash) {
    globalThis.crypto.hash = function(algorithm, data) {
      return createHash(algorithm).update(data).digest('hex');
    };
  }
}

console.log('✅ Node.js compatibility patches applied');