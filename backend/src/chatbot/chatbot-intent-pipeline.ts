import {
  classifyIntentRuleOnly,
  correctRuleIntent,
  resolveFollowUpIntent,
} from './chatbot-intent-rules';
import { shouldPreferRuleOverOllamaIntent } from './chatbot-guardrails';
import {
  type ChatSessionContext,
  emptySessionContext,
} from './chat-session-context';
import type { ChatIntent } from './chatbot.types';

export const INTENT_CONFIDENCE_THRESHOLD = 0.5;

export type IntentPipelineResult = {
  intent: ChatIntent;
  source: 'ollama' | 'rule';
  ruleIntent: ChatIntent;
  ollamaIntent: ChatIntent | null;
  ollamaAccepted: boolean;
  confidence?: number;
};

/**
 * Áp dụng cùng logic guardrail như `ChatbotService.classifyIntent()`:
 * Ollama (nếu accepted) → correctRuleIntent → follow-up → rule wins on conflict.
 */
export function resolveIntentPipeline(
  msg: string,
  ollamaIntent: ChatIntent | null,
  ollamaConfidence: number | null | undefined,
  sessionContext: ChatSessionContext = emptySessionContext(),
): IntentPipelineResult {
  const ruleIntent = classifyIntentRuleOnly(msg, sessionContext);
  const ollamaAccepted =
    ollamaIntent !== null &&
    ollamaIntent !== 'unknown' &&
    (ollamaConfidence ?? 0) >= INTENT_CONFIDENCE_THRESHOLD;

  if (!ollamaAccepted || ollamaIntent === null) {
    return {
      intent: ruleIntent,
      source: 'rule',
      ruleIntent,
      ollamaIntent,
      ollamaAccepted: false,
      confidence: ollamaConfidence ?? undefined,
    };
  }

  let intent = correctRuleIntent(ollamaIntent, msg);
  intent = resolveFollowUpIntent(intent, msg, sessionContext);

  if (shouldPreferRuleOverOllamaIntent(ruleIntent, intent, msg)) {
    intent = resolveFollowUpIntent(
      correctRuleIntent(ruleIntent, msg),
      msg,
      sessionContext,
    );
    return {
      intent,
      source: 'rule',
      ruleIntent,
      ollamaIntent,
      ollamaAccepted: true,
      confidence: ollamaConfidence ?? undefined,
    };
  }

  return {
    intent,
    source: 'ollama',
    ruleIntent,
    ollamaIntent,
    ollamaAccepted: true,
    confidence: ollamaConfidence ?? undefined,
  };
}
