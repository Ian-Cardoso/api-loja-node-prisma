import { vi } from 'vitest'

export const prisma = {
  categoria: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  produto: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  usuario: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}