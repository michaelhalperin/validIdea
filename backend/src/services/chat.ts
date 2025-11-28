import prisma from '../utils/prisma';
import { generateChatResponse } from './gemini';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Get chat history for an analysis
 */
export async function getChatHistory(analysisId: string, userId: string) {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true },
  });

  if (!analysis || analysis.userId !== userId) {
    throw new Error('Analysis not found or access denied');
  }

  return (prisma as any).chatMessage.findMany({
    where: { analysisId, userId },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Send a chat message and get AI response
 */
export async function sendChatMessage(
  analysisId: string,
  userId: string,
  message: string
) {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true },
  });

  if (!analysis || analysis.userId !== userId) {
    throw new Error('Analysis not found or access denied');
  }

  // Save user message
  const userMessage = await (prisma as any).chatMessage.create({
    data: {
      userId,
      analysisId,
      role: 'USER',
      content: message,
    },
  });

  // Get chat history
  const history = await getChatHistory(analysisId, userId);

  // Generate AI response
  const assistantResponse = await generateChatResponse(
    analysis as any,
    history,
    message
  );

  // Save assistant message
  const assistantMessage = await (prisma as any).chatMessage.create({
    data: {
      userId,
      analysisId,
      role: 'ASSISTANT',
      content: assistantResponse,
    },
  });

  return {
    userMessage,
    assistantMessage,
  };
}

