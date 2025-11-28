import prisma from '../utils/prisma';
import { sendMarketAlertEmail } from './email';

interface AlertCheckResult {
  triggered: boolean;
  message: string;
  data?: any;
}

/**
 * Check and trigger market alerts
 */
export async function checkMarketAlerts(userId?: string): Promise<void> {
  const whereClause = userId ? { userId, isActive: true } : { isActive: true };
  
  const alerts = await (prisma as any).marketAlert.findMany({
    where: whereClause,
    include: {
      idea: {
        include: {
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
      user: true,
    },
  });

  for (const alert of alerts) {
    try {
      const result = await checkAlert(alert);
      if (result.triggered) {
        // Update last triggered
        await (prisma as any).marketAlert.update({
          where: { id: alert.id },
          data: { lastTriggered: new Date() },
        });

        // Send notification
        if (alert.user.notifyEmail) {
          await sendMarketAlertEmail(
            alert.user.email,
            alert.idea?.title || 'Market Alert',
            result.message,
            result.data
          );
        }

        // Trigger webhook if configured
        if (alert.user.webhookUrl) {
          await triggerWebhook(alert.user.webhookUrl, {
            alertId: alert.id,
            alertType: alert.alertType,
            message: result.message,
            data: result.data,
          });
        }
      }
    } catch (error) {
      console.error(`[MarketAlerts] Error checking alert ${alert.id}:`, error);
    }
  }
}

/**
 * Check a single alert
 */
async function checkAlert(alert: any): Promise<AlertCheckResult> {
  // This is a simplified version - in production, you'd integrate with:
  // - Google Trends API for search volume
  // - News APIs for competitor launches
  // - Crunchbase API for funding/news
  // - Custom web scraping for competitor monitoring

  switch (alert.alertType) {
    case 'COMPETITOR_LAUNCH':
      // Check if competitors have launched (simplified - would use real APIs)
      return {
        triggered: false, // Placeholder
        message: 'No new competitor launches detected',
      };

    case 'MARKET_SIZE_CHANGE':
      // Monitor market size changes
      return {
        triggered: false,
        message: 'Market size stable',
      };

    case 'SIMILAR_IDEA_LAUNCH':
      // Check for similar ideas launching
      return {
        triggered: false,
        message: 'No similar ideas launched recently',
      };

    case 'INDUSTRY_NEWS':
      // Monitor industry news
      return {
        triggered: false,
        message: 'No significant industry news',
      };

    default:
      return {
        triggered: false,
        message: 'Alert check completed',
      };
  }
}

/**
 * Trigger webhook
 */
async function triggerWebhook(url: string, data: any): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[MarketAlerts] Webhook error:', error);
  }
}

/**
 * Create a market alert
 */
export async function createMarketAlert(
  userId: string,
  data: {
    ideaId?: string;
    alertType: string;
    keywords?: string[];
    competitorNames?: string[];
  }
) {
  return (prisma as any).marketAlert.create({
    data: {
      userId,
      ideaId: data.ideaId || null,
      alertType: data.alertType,
      keywords: data.keywords || [],
      competitorNames: data.competitorNames || [],
    },
  });
}

/**
 * Get user's market alerts
 */
export async function getUserMarketAlerts(userId: string) {
  return (prisma as any).marketAlert.findMany({
    where: { userId },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Update market alert
 */
export async function updateMarketAlert(
  alertId: string,
  userId: string,
  data: {
    isActive?: boolean;
    keywords?: string[];
    competitorNames?: string[];
  }
) {
  const alert = await (prisma as any).marketAlert.findUnique({
    where: { id: alertId },
  });

  if (!alert || alert.userId !== userId) {
    throw new Error('Alert not found or access denied');
  }

  return (prisma as any).marketAlert.update({
    where: { id: alertId },
    data,
  });
}

/**
 * Delete market alert
 */
export async function deleteMarketAlert(alertId: string, userId: string) {
  const alert = await (prisma as any).marketAlert.findUnique({
    where: { id: alertId },
  });

  if (!alert || alert.userId !== userId) {
    throw new Error('Alert not found or access denied');
  }

  return (prisma as any).marketAlert.delete({
    where: { id: alertId },
  });
}

