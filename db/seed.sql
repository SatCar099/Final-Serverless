-- Mental Health Resources
INSERT INTO resources (title, content, category, image_url) VALUES
(
    'Understanding Anxiety',
    'Anxiety is a natural stress response, but when it becomes overwhelming it can interfere with daily life. Common symptoms include excessive worry, restlessness, difficulty concentrating, and physical tension. Effective strategies include deep breathing exercises, progressive muscle relaxation, limiting caffeine, and seeking professional support when needed.',
    'anxiety',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800'
),
(
    'The Importance of Sleep for Mental Health',
    'Quality sleep is foundational to emotional regulation, cognitive function, and overall mental well-being. Adults need 7–9 hours per night. Poor sleep is linked to increased risk of depression and anxiety. Tips for better sleep include maintaining a consistent schedule, reducing screen time before bed, and creating a calm sleep environment.',
    'self-care',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800'
),
(
    'Mindfulness Meditation for Beginners',
    'Mindfulness is the practice of paying deliberate attention to the present moment without judgment. Even 10 minutes a day can reduce stress, improve focus, and foster emotional resilience. Start by focusing on your breath, noticing thoughts without engaging them, and gently returning your attention when your mind wanders.',
    'mindfulness',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
),
(
    'Recognizing Signs of Depression',
    'Depression goes beyond occasional sadness. Key signs include persistent low mood, loss of interest in activities once enjoyed, changes in appetite or sleep, fatigue, difficulty concentrating, feelings of worthlessness, and in severe cases, thoughts of self-harm. Early recognition and professional support are critical to recovery.',
    'depression',
    'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800'
),
(
    'Building Healthy Social Connections',
    'Strong social bonds are one of the most powerful protective factors for mental health. Loneliness and isolation increase the risk of depression and anxiety. Ways to nurture connections include reaching out regularly to friends and family, joining community groups, volunteering, and practicing active listening to deepen relationships.',
    'relationships',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'
);

-- Helplines (10 countries)
INSERT INTO helplines (country, name, phone, website, available_hours) VALUES
(
    'United States',
    'National Suicide Prevention Lifeline',
    '988',
    'https://988lifeline.org',
    '24/7'
),
(
    'United Kingdom',
    'Samaritans',
    '116 123',
    'https://www.samaritans.org',
    '24/7'
),
(
    'India',
    'iCall',
    '9152987821',
    'https://icallhelpline.org',
    'Mon–Sat, 8am–10pm IST'
),
(
    'Australia',
    'Lifeline Australia',
    '13 11 14',
    'https://www.lifeline.org.au',
    '24/7'
),
(
    'Canada',
    'Crisis Services Canada',
    '1-833-456-4566',
    'https://www.crisisservicescanada.ca',
    '24/7'
),
(
    'Germany',
    'Telefonseelsorge',
    '0800 111 0 111',
    'https://www.telefonseelsorge.de',
    '24/7'
),
(
    'France',
    'SOS Amitié',
    '09 72 39 40 50',
    'https://www.sos-amitie.com',
    '24/7'
),
(
    'South Africa',
    'SADAG Mental Health Line',
    '011 234 4837',
    'https://www.sadag.org',
    '24/7'
),
(
    'Brazil',
    'Centro de Valorização da Vida (CVV)',
    '188',
    'https://www.cvv.org.br',
    '24/7'
),
(
    'Japan',
    'Inochi no Denwa',
    '0120-783-556',
    'https://www.inochinodenwa.org',
    '24/7'
),
(
    'Nepal',
    'Mental Health Helpline Nepal',
    '1660-01-11002',
    'https://www.tponepal.org',
    '24/7'
);

-- Community Posts
INSERT INTO community_posts (nickname, message) VALUES
(
    'quietstar',
    'I started journaling every morning this week and it has genuinely helped me process my feelings before the day begins. Highly recommend giving it a try even for just five minutes.'
),
(
    'hopefulwave',
    'Reminder to anyone reading this: it is okay to not be okay. You don''t have to have everything figured out. One small step at a time is more than enough.'
),
(
    'morninglight42',
    'Had a really tough anxiety episode yesterday but I used the breathing exercises from this app and they actually helped me calm down. Grateful for this community.'
),
(
    'gentlerain',
    'Anyone else find that going for a short walk outside does wonders for their mood? I was skeptical but it has become my go-to reset when things feel overwhelming.'
),
(
    'risingphoenix',
    'Six months of therapy and I finally feel like myself again. If you are on the fence about seeking help, please know it can make a real difference. You deserve support.'
);
