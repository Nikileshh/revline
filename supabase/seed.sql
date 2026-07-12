-- ============================================================
-- RevLine — starter content (edit freely from the admin panel)
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- ============================================================

update public.site_settings set
  instagram_url = 'https://www.instagram.com/revline.club',
  whatsapp_community_url = 'https://chat.whatsapp.com/REPLACE_ME',
  contact_email = 'revline.club@gmail.com',
  terms_md = $md$
## Terms & Conditions

**1. Participation is voluntary.** All RevLine sessions — running, football, turf, trekking, swimming and other activities — involve physical exertion. You participate at your own risk and confirm you are medically fit to take part.

**2. Liability.** RevLine organisers and crew are not responsible for any injury, loss, or damage to personal belongings during sessions or while travelling to and from venues.

**3. Registration.** Your spot is confirmed only after you complete the registration form (and payment, where applicable). Spots are limited and first-come-first-served; late arrivals may lose their spot to the waitlist.

**4. Conduct.** Respect the crew, fellow members, and the venue. Abusive or unsafe behaviour leads to removal from the session and the community.

**5. Photos & media.** Sessions are photographed and filmed. By attending you consent to RevLine using this media on our website and social channels. Tell a crew member if you'd like to opt out.

**6. Weather & changes.** Outdoor sessions may be rescheduled or relocated due to weather or venue issues. We'll notify registered members via WhatsApp.

**7. Minors.** Participants under 18 need consent from a parent or guardian.
$md$
where id;

insert into public.events (slug, title, sport, description, rules, venue, event_date, capacity, status, registration_open, questions) values
(
  'sunday-turf-football',
  'Sunday Turf Football',
  'football',
  'Weekend 7-a-side football on turf. All levels welcome — teams are balanced on the day so everyone gets a real game. Bring your energy; we bring the bibs and the ball.',
  E'- Wear turf shoes or flat-soled trainers (no metal studs)\n- Arrive 15 minutes early for warm-up\n- Carry water and a towel\n- Respect the referee''s calls',
  'Turf Arena (venue shared in WhatsApp group)',
  now() + interval '5 days',
  24,
  'upcoming',
  true,
  '[{"id":"q_level","label":"How would you rate your football level?","type":"select","required":true,"options":["Beginner","Intermediate","Advanced"]},{"id":"q_position","label":"Preferred position (optional)","type":"text","required":false},{"id":"q_why","label":"Why do you want to join RevLine?","type":"textarea","required":true}]'::jsonb
),
(
  'sunrise-trail-run',
  'Sunrise Trail Run — 5K & 10K',
  'running',
  'An early-morning group run with 5K and 10K routes. Pacers for every speed, cooldown stretches after, and breakfast plans that are honestly half the reason we show up.',
  E'- Routes: 5K (all levels) and 10K (intermediate+)\n- Carry water; hydration point at the halfway mark\n- Stay with your pace group',
  'City Lake Entrance Gate 2',
  now() + interval '12 days',
  40,
  'upcoming',
  true,
  '[{"id":"q_distance","label":"Which distance are you running?","type":"select","required":true,"options":["5K","10K"]},{"id":"q_pace","label":"Comfortable pace (min/km), if you know it","type":"text","required":false},{"id":"q_why","label":"Why do you want to join RevLine?","type":"textarea","required":true}]'::jsonb
),
(
  'monsoon-trek',
  'Monsoon Waterfall Trek',
  'trekking',
  'A guided one-day trek through green trails to a waterfall viewpoint. Moderate difficulty, unforgettable views, and the best group photos of the season.',
  E'- Moderate 8 km trail; basic fitness required\n- Trekking shoes mandatory\n- Carry 2L water, snacks, raincover\n- Follow the trail lead at all times',
  'Base village (carpool details in WhatsApp group)',
  now() - interval '9 days',
  30,
  'completed',
  false,
  '[]'::jsonb
);

insert into public.crew_members (name, role, bio, sort_order) values
('Founder', 'Founder & Head Coach', 'Started RevLine to turn solo workouts into a movement. Plans every session and still loses at football.', 0),
('Crew Member 2', 'Run Lead', 'Keeps the pace groups honest and the playlists better.', 1),
('Crew Member 3', 'Football Lead', 'Organises the turf battles and swears the teams are always fair.', 2),
('Crew Member 4', 'Trek Lead', 'Knows every trail within 100 km. Safety first, summit photos second.', 3);

insert into public.testimonials (name, label, quote, sort_order) values
('Arjun', 'Member since 2025', 'I came for one turf session and never left. The energy here is unreal — you push harder because everyone around you is pushing too.', 0),
('Sneha', 'Runner', 'As a total beginner I was nervous, but the pacers stayed with me the whole 5K. Now Sundays are non-negotiable.', 1),
('Rahul', 'Trekker', 'Best community I''ve joined. Well-organised sessions, great people, and the trek photos go hard.', 2);
