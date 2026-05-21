export type Intent = 'lead' | 'support' | 'billing' | 'out_of_scope' | 'spam';

export type Resolution =
  | 'routed_to_owner'
  | 'auto_replied'
  | 'archived'
  | 'awaiting_visitor';

export interface Widget {
  id: string;
  user_id: string | null;
  site_name: string;
  site_url: string | null;
  brand_voice_md: string | null;
  escalation_rules_md: string | null;
  owner_email: string | null;
  embed_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  widget_id: string;
  channel: string;
  visitor_email: string | null;
  intent: Intent | null;
  routed_to: string | null;
  resolution: Resolution | null;
  started_at: string;
  ended_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'frame' | 'owner';
  body: string;
  sent_at: string;
}

export interface TriageResult {
  intent: Intent;
  confidence: number;
  reasoning: string;
  suggested_reply: string;
  should_route_to_owner: boolean;
  visitor_summary: string;
}
