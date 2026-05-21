import type { Intent, Resolution, TriageResult } from './types';

// Three fictional widgets with 12 seed conversations total.
// All names/brands are fictional. No real customer or insider references.

export interface SeedWidget {
  embed_id: string;
  site_name: string;
  site_url: string;
  brand_voice_md: string;
  escalation_rules_md: string;
  owner_email: string;
}

export interface SeedConversation {
  embed_id: string;
  visitor_email: string;
  intent: Intent;
  routed_to: string | null;
  resolution: Resolution;
  started_minutes_ago: number;
  messages: { sender: 'visitor' | 'frame' | 'owner'; body: string; offset_seconds: number }[];
  triage: TriageResult;
}

export const SEED_WIDGETS: SeedWidget[] = [
  {
    embed_id: 'tpa-roof-001',
    site_name: 'Tampa Roofing Co',
    site_url: 'https://tampa-roofing-example.com',
    brand_voice_md:
      'Friendly, plain-spoken Florida contractor. No jargon. Always confirm property type (single-family / townhome / condo) and roof material if known. Free inspection within 24 hours during peak season.',
    escalation_rules_md:
      'Route to owner if: visitor mentions storm damage, active leak, insurance claim, or asks for a quote over $5k. Auto-reply for: general pricing questions, scheduling availability, warranty questions.',
    owner_email: 'owner@tampa-roofing-example.com',
  },
  {
    embed_id: 'bloom-photo-002',
    site_name: 'Studio Bloom Photography',
    site_url: 'https://studiobloom-example.com',
    brand_voice_md:
      'Warm, considered, just a touch lyrical. Wedding and family portrait studio in the Pacific Northwest. Always mention that we offer a free 20-minute consultation call before booking.',
    escalation_rules_md:
      'Route to owner if: visitor mentions a specific wedding date, asks for elopement pricing, or has a destination shoot. Auto-reply for: package questions, location availability, turnaround time.',
    owner_email: 'hi@studiobloom-example.com',
  },
  {
    embed_id: 'westside-auto-003',
    site_name: 'Westside Auto Repair',
    site_url: 'https://westside-auto-example.com',
    brand_voice_md:
      'Direct, no-BS, mechanic-shop voice. Honest pricing. Always confirm year/make/model before quoting any work. AAA-approved, ASE-certified techs.',
    escalation_rules_md:
      'Route to owner if: visitor reports a check-engine light, transmission issue, or asks about a major repair over $1k. Auto-reply for: oil change pricing, hours, tire rotation availability.',
    owner_email: 'shop@westside-auto-example.com',
  },
];

export const SEED_CONVERSATIONS: SeedConversation[] = [
  // ----- Tampa Roofing Co -----
  {
    embed_id: 'tpa-roof-001',
    visitor_email: 'mike.alvarez@gmail.com',
    intent: 'lead',
    routed_to: 'owner@tampa-roofing-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 18,
    messages: [
      { sender: 'visitor', body: "Hey, I've got a leak in my dining room ceiling after last week's storm. Single-family in South Tampa, asphalt shingle roof, maybe 14 years old.", offset_seconds: 0 },
      { sender: 'frame', body: 'Sorry you are dealing with that. Storm damage on a 14-year-old asphalt roof is exactly what we handle. I am flagging this for the owner now and someone will reach out within an hour to schedule a free inspection. What is the best phone number?', offset_seconds: 12 },
      { sender: 'visitor', body: '813-555-0144. Insurance claim is open with State Farm if that helps.', offset_seconds: 41 },
      { sender: 'frame', body: 'Got it. Insurance claim noted. The owner will call 813-555-0144 within the hour with next steps and an inspection slot.', offset_seconds: 55 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.96,
      reasoning: 'Active leak after storm + 14-year asphalt roof + open insurance claim. Matches three escalation triggers (storm damage, active leak, insurance claim). High-intent buyer with clear timeline urgency.',
      suggested_reply: 'Acknowledge the leak, confirm property/material, capture phone, route to owner immediately.',
      should_route_to_owner: true,
      visitor_summary: 'Mike Alvarez, South Tampa single-family, 14yr asphalt shingle, storm leak in dining room ceiling, State Farm claim open. Phone 813-555-0144.',
    },
  },
  {
    embed_id: 'tpa-roof-001',
    visitor_email: 'jen.parker@yahoo.com',
    intent: 'lead',
    routed_to: 'owner@tampa-roofing-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 95,
    messages: [
      { sender: 'visitor', body: 'Looking for a quote to replace the roof on a 2200 sq ft townhome in Westchase. Current roof is original from 2007, tile.', offset_seconds: 0 },
      { sender: 'frame', body: 'Tile replacement on a 2007 townhome in Westchase, totally something we do. A full replacement on that size is typically a multi-day job and definitely above the $5k threshold I send to the owner directly. Mind sharing the best email or phone?', offset_seconds: 14 },
      { sender: 'visitor', body: 'jen.parker@yahoo.com or 727-555-0210. Hoping to start in the next month.', offset_seconds: 39 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.92,
      reasoning: 'Full tile replacement on 2200 sq ft = clearly over $5k threshold. Concrete timeline (next month). Townhome property type confirmed. Routes to owner.',
      suggested_reply: 'Acknowledge the project, capture contact, route to owner for quote scheduling.',
      should_route_to_owner: true,
      visitor_summary: 'Jen Parker, Westchase townhome, 2200 sqft tile from 2007, full replacement, start in 30 days. 727-555-0210.',
    },
  },
  {
    embed_id: 'tpa-roof-001',
    visitor_email: 'curious.homeowner@gmail.com',
    intent: 'support',
    routed_to: null,
    resolution: 'auto_replied',
    started_minutes_ago: 240,
    messages: [
      { sender: 'visitor', body: "What's the typical warranty on a new shingle roof?", offset_seconds: 0 },
      { sender: 'frame', body: 'On asphalt shingle, the manufacturer warranty is usually 25 to 30 years on materials and we add a 10-year workmanship warranty on top. Tile and metal are different. Want me to pull up the warranty sheet by material?', offset_seconds: 9 },
      { sender: 'visitor', body: 'No, that answers it. Thanks!', offset_seconds: 28 },
    ],
    triage: {
      intent: 'support',
      confidence: 0.94,
      reasoning: 'General warranty question, no project intent, no urgency. Auto-reply per escalation rules (warranty questions = auto-reply).',
      suggested_reply: 'Answer the warranty question in brand voice, offer follow-up. Do not route.',
      should_route_to_owner: false,
      visitor_summary: 'Visitor asked about shingle warranty terms. Answered, no follow-up needed.',
    },
  },
  {
    embed_id: 'tpa-roof-001',
    visitor_email: 'spam.sender.bot@example.net',
    intent: 'spam',
    routed_to: null,
    resolution: 'archived',
    started_minutes_ago: 360,
    messages: [
      { sender: 'visitor', body: 'BUY DISCOUNTED SOLAR PANELS NOW!!! Click https://totallylegit.example to claim your offer.', offset_seconds: 0 },
      { sender: 'frame', body: 'Thanks, but this looks like a sales pitch, not a roofing question. Archiving so we keep the owner inbox clean.', offset_seconds: 4 },
    ],
    triage: {
      intent: 'spam',
      confidence: 0.99,
      reasoning: 'Unsolicited promotional message with link, all caps, off-topic for roofing. Classic spam pattern. Archived without routing.',
      suggested_reply: 'Polite dismissal, no engagement, archive immediately.',
      should_route_to_owner: false,
      visitor_summary: 'Spam: solar panel sales pitch. Archived.',
    },
  },
  // ----- Studio Bloom Photography -----
  {
    embed_id: 'bloom-photo-002',
    visitor_email: 'sarah.h@protonmail.com',
    intent: 'lead',
    routed_to: 'hi@studiobloom-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 33,
    messages: [
      { sender: 'visitor', body: "Hi! We're getting married September 14th next year at Mount Hood. Looking for a photographer who can do both the ceremony and a sunrise first-look at Trillium Lake the morning before.", offset_seconds: 0 },
      { sender: 'frame', body: "September 14th at Mount Hood with a sunrise first-look at Trillium, that sounds absolutely beautiful. Specific date plus a destination spread is owner-call territory. Mind if I pass this along and have her reach out about the free 20-minute consultation?", offset_seconds: 15 },
      { sender: 'visitor', body: 'Yes please! sarah.h@protonmail.com is best.', offset_seconds: 46 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.97,
      reasoning: 'Specific wedding date + destination/multi-location shoot = two escalation triggers. Visitor is qualified (locked-in date 13 months out, two-shoot scope). High routing priority.',
      suggested_reply: 'Validate the location detail in brand voice, offer the free consult, capture email, route to owner.',
      should_route_to_owner: true,
      visitor_summary: 'Sarah H., wedding Sept 14, 2027 Mount Hood + Trillium sunrise first-look. Wants ceremony + multi-location coverage. Email sarah.h@protonmail.com.',
    },
  },
  {
    embed_id: 'bloom-photo-002',
    visitor_email: 'family.from.seattle@gmail.com',
    intent: 'lead',
    routed_to: 'hi@studiobloom-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 110,
    messages: [
      { sender: 'visitor', body: 'Hi, we are eloping in the Columbia Gorge next month and want a 2-hour photo coverage. Just the two of us plus our dog. Any availability?', offset_seconds: 0 },
      { sender: 'frame', body: 'A two-person elopement with a pup in the Gorge, that is one of our favorite kinds of shoot. Elopement pricing and availability questions go straight to the owner. What is the rough date and the best email?', offset_seconds: 18 },
      { sender: 'visitor', body: 'June 8th. family.from.seattle@gmail.com', offset_seconds: 38 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.93,
      reasoning: 'Elopement pricing inquiry = explicit escalation trigger. Concrete date (June 8) and clear scope. Routes to owner.',
      suggested_reply: 'Warm acknowledgment, capture date and email, route to owner for elopement pricing.',
      should_route_to_owner: true,
      visitor_summary: 'Couple eloping June 8 in Columbia Gorge, two people + dog, 2-hour coverage needed. Email family.from.seattle@gmail.com.',
    },
  },
  {
    embed_id: 'bloom-photo-002',
    visitor_email: 'lurker@gmail.com',
    intent: 'support',
    routed_to: null,
    resolution: 'auto_replied',
    started_minutes_ago: 415,
    messages: [
      { sender: 'visitor', body: 'How long until I get the gallery after a session?', offset_seconds: 0 },
      { sender: 'frame', body: 'Family sessions deliver a private gallery in about 3 weeks, weddings in about 6 weeks. Sneak peeks land within 48 hours of the shoot so you have something to share right away. Want to chat about a session?', offset_seconds: 11 },
      { sender: 'visitor', body: 'Just curious for now, thanks!', offset_seconds: 30 },
    ],
    triage: {
      intent: 'support',
      confidence: 0.91,
      reasoning: 'Turnaround time question is explicitly listed in escalation rules as auto-reply. No booking intent expressed.',
      suggested_reply: 'Answer turnaround in brand voice, gentle nudge toward a conversation, do not route.',
      should_route_to_owner: false,
      visitor_summary: 'General turnaround time question. No active booking intent.',
    },
  },
  {
    embed_id: 'bloom-photo-002',
    visitor_email: 'casey.lo@gmail.com',
    intent: 'support',
    routed_to: null,
    resolution: 'auto_replied',
    started_minutes_ago: 720,
    messages: [
      { sender: 'visitor', body: 'Do you travel outside the PNW?', offset_seconds: 0 },
      { sender: 'frame', body: 'Yes, we do travel for weddings and elopements. Domestic travel is built into the day-rate, international is quoted case-by-case. If you have a specific destination in mind let me know and I can set up the free 20-minute consult so the owner can talk specifics.', offset_seconds: 13 },
      { sender: 'visitor', body: 'Cool, will think on it.', offset_seconds: 35 },
    ],
    triage: {
      intent: 'support',
      confidence: 0.85,
      reasoning: 'General location availability question. No specific destination or date provided. Auto-reply per escalation rules.',
      suggested_reply: 'Confirm travel willingness, mention free consult, soft route to owner only if visitor returns with specifics.',
      should_route_to_owner: false,
      visitor_summary: 'Asked if studio travels outside PNW. Answered, no specifics shared.',
    },
  },
  // ----- Westside Auto Repair -----
  {
    embed_id: 'westside-auto-003',
    visitor_email: 'd.chen@outlook.com',
    intent: 'lead',
    routed_to: 'shop@westside-auto-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 42,
    messages: [
      { sender: 'visitor', body: 'My 2018 Subaru Outback just threw a CEL on the highway, feels like a misfire. Any chance you can look at it today or tomorrow?', offset_seconds: 0 },
      { sender: 'frame', body: 'Check-engine light plus a possible misfire on a 2018 Outback. That is exactly the kind of diagnosis I send straight to the shop owner. What is the best number to reach you?', offset_seconds: 11 },
      { sender: 'visitor', body: '503-555-0188. I work from home so anytime today is fine.', offset_seconds: 35 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.98,
      reasoning: 'Check-engine light is explicit escalation trigger. Year/make/model confirmed (2018 Subaru Outback). Same-day urgency. Routes immediately.',
      suggested_reply: 'Acknowledge the CEL urgency, capture phone, route to owner for diagnosis scheduling.',
      should_route_to_owner: true,
      visitor_summary: 'D. Chen, 2018 Subaru Outback, CEL + suspected misfire, same-day diagnosis needed. Phone 503-555-0188.',
    },
  },
  {
    embed_id: 'westside-auto-003',
    visitor_email: 'priya.r@gmail.com',
    intent: 'lead',
    routed_to: 'shop@westside-auto-example.com',
    resolution: 'routed_to_owner',
    started_minutes_ago: 188,
    messages: [
      { sender: 'visitor', body: 'Transmission slipping on my 2014 Honda Pilot. Mostly when going from 2nd to 3rd. Worth even looking at or am I cooked?', offset_seconds: 0 },
      { sender: 'frame', body: 'Transmission slip on a 2014 Pilot is worth a proper look. Could be a fluid issue, could be heavier. Either way it is a major-repair conversation, so I am routing you to the owner. Best number or email?', offset_seconds: 13 },
      { sender: 'visitor', body: 'priya.r@gmail.com, prefer email.', offset_seconds: 34 },
    ],
    triage: {
      intent: 'lead',
      confidence: 0.95,
      reasoning: 'Transmission issue is explicit escalation trigger and almost certainly a $1k+ repair conversation. Routes to owner.',
      suggested_reply: 'Honest framing (could be fluid, could be heavier), no false promise, route to owner.',
      should_route_to_owner: true,
      visitor_summary: 'Priya R., 2014 Honda Pilot, transmission slipping 2->3 shift, prefers email contact.',
    },
  },
  {
    embed_id: 'westside-auto-003',
    visitor_email: 'jp.singh@gmail.com',
    intent: 'support',
    routed_to: null,
    resolution: 'auto_replied',
    started_minutes_ago: 320,
    messages: [
      { sender: 'visitor', body: 'How much for a standard oil change on a 2020 Toyota Camry?', offset_seconds: 0 },
      { sender: 'frame', body: 'Standard synthetic oil change on a 2020 Camry runs $79.95 with a multi-point inspection. We do not need an appointment for oil changes, walk-ins welcome 7am-6pm Monday through Saturday.', offset_seconds: 10 },
      { sender: 'visitor', body: 'Perfect, will swing by tomorrow.', offset_seconds: 24 },
    ],
    triage: {
      intent: 'support',
      confidence: 0.96,
      reasoning: 'Oil change pricing is explicitly listed as auto-reply trigger. Year/make confirmed. Standard transactional question.',
      suggested_reply: 'Quote the price, confirm walk-in policy, no need to route.',
      should_route_to_owner: false,
      visitor_summary: 'JP S., 2020 Camry, standard oil change quote requested. Plans walk-in tomorrow.',
    },
  },
  {
    embed_id: 'westside-auto-003',
    visitor_email: 'random.lurker@gmail.com',
    intent: 'out_of_scope',
    routed_to: null,
    resolution: 'archived',
    started_minutes_ago: 540,
    messages: [
      { sender: 'visitor', body: 'do you sell used cars', offset_seconds: 0 },
      { sender: 'frame', body: 'We are a repair shop, not a dealership, so no used cars here. But if you are inspecting one before purchase we do pre-purchase inspections for $129 by appointment. Want me to grab a slot?', offset_seconds: 9 },
      { sender: 'visitor', body: 'nah ok thanks', offset_seconds: 24 },
    ],
    triage: {
      intent: 'out_of_scope',
      confidence: 0.88,
      reasoning: 'Visitor asked about a service we do not offer (used car sales). Offered an adjacent service (pre-purchase inspection) but visitor declined. Archive.',
      suggested_reply: 'Redirect to an adjacent real service, do not push, archive when visitor disengages.',
      should_route_to_owner: false,
      visitor_summary: 'Asked about used car sales (not offered). Offered PPI, visitor declined.',
    },
  },
];
