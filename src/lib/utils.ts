import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmojiForScore(score: number): string {
  if (score <= 2) return '😡';
  if (score <= 4) return '🙁';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '🤩';
}

export function getEmojiLabel(score: number): string {
  if (score <= 2) return 'Muy bajo';
  if (score <= 4) return 'Bajo';
  if (score <= 6) return 'Regular';
  if (score <= 8) return 'Bueno';
  return 'Excelente';
}

export function generateProjectCode(index: number): string {
  return `PTE-${String(index + 1).padStart(3, '0')}`;
}

export function generateJudgeId(): string {
  return `judge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
