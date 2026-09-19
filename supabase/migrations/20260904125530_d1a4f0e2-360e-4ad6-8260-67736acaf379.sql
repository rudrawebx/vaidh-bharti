insert into public.products (slug, name, category_id, short_description, description, benefits, ingredients, usage_instructions, images, price, mrp, stock, net_quantity, is_featured, is_best_seller, is_new_arrival, subscription_available, subscription_discount_pct, sort_order)
values
 ('red-onion-hair-oil','Red Onion Hair Oil',(select id from public.categories where slug='hair-care'),
  'Non-sticky, non-greasy herbal hair oil for glossy, strong hair.',
  'Vaidh Bharti Red Onion Hair Oil is an Ayurvedic proprietary preparation for external use on the hair and scalp, made in a non-sticky, non-greasy base.',
  array['Intended for regular external hair and scalp care','Non-sticky, non-greasy base','Ayurvedic proprietary medicine, for external use only'],
  'Herbal hair oil with red onion. The full ingredient list is printed on the product label.',
  'Apply to the scalp and hair, massage gently and leave for the time advised on the label. External use only.',
  array['/__l5e/assets-v1/30feeb0e-ccdf-494b-931a-3c956955e76f/prod-oils.png'],
  349, 449, 40, '100 ml', true, true, false, false, 0, 1),

 ('uder-shaant-powder','Uder Shaant Powder',(select id from public.categories where slug='powders'),
  'Traditional Ayurvedic churna intended to support digestive comfort.',
  'Uder Shaant Powder is a traditional Ayurvedic churna prepared from classically processed herbs, intended to be taken as part of a personalized plan.',
  array['Traditional churna preparation','Simple to include in a daily routine','Best used under practitioner guidance'],
  'Classically processed Ayurvedic herbs. The full ingredient list is printed on the product label.',
  'Take as advised by your Ayurvedic practitioner, usually with warm water.',
  array['/__l5e/assets-v1/30feeb0e-ccdf-494b-931a-3c956955e76f/prod-oils.png'],
  299, 399, 40, '100 g', true, false, false, true, 10, 2),

 ('himalayan-suryatapi-pure-shilajit','Himalayan Suryatapi Pure Shilajit',(select id from public.categories where slug='shilajit'),
  'Purified Shilajit resin sourced from Himalayan rocks.',
  'Himalayan Suryatapi Pure Shilajit is a purified and filtered Shilajit resin, a substance long used in Ayurveda as a Rasayana, supplied for traditional use in small quantities.',
  array['Purified and filtered resin','Classical Rasayana substance in Ayurveda','A small quantity is used at a time, as directed'],
  'Purified Shilajit resin. Full details are printed on the product label.',
  'Dissolve a small quantity (as advised) in warm water or milk. Use only as directed.',
  array['/__l5e/assets-v1/30feeb0e-ccdf-494b-931a-3c956955e76f/prod-oils.png'],
  1499, 1999, 25, '20 g', true, true, false, true, 10, 3),

 ('shakti-panch-gold-extra','Shakti Panch Gold Extra',(select id from public.categories where slug='capsules'),
  'Ayurvedic preparation in convenient capsule form.',
  'Shakti Panch Gold Extra is an Ayurvedic preparation presented in capsule form, intended to be used as part of a personalized Ayurvedic plan.',
  array['Convenient capsule format','Measured, consistent quantity','Best used under practitioner guidance'],
  'Ayurvedic herbal ingredients. The full ingredient list is printed on the product label.',
  'Take as advised by your Ayurvedic practitioner.',
  array['/__l5e/assets-v1/30feeb0e-ccdf-494b-931a-3c956955e76f/prod-oils.png'],
  899, 1099, 30, '30 capsules', true, false, true, false, 0, 4),

 ('saffron-herbal-cream','Saffron Herbal Cream',(select id from public.categories where slug='skin-care'),
  'Herbal cream with saffron for daily external skin care.',
  'Vaidh Bharti Saffron Herbal Cream is a herbal skin care preparation enriched with saffron and herbal ingredients, intended for gentle external use as part of a daily routine.',
  array['Gentle herbal preparation with saffron','For external daily skin care','Made in the Ayurvedic tradition'],
  'Saffron with a herbal skin-care base including coconut, almond, jojoba and lotus derived ingredients. The full ingredient list is printed on the product label.',
  'Apply a small amount to clean skin and massage gently. Discontinue if irritation occurs.',
  array['/__l5e/assets-v1/30feeb0e-ccdf-494b-931a-3c956955e76f/prod-oils.png'],
  399, 499, 35, '50 g', false, false, true, false, 0, 5);

insert into public.product_variants (product_id, label, price, mrp, stock, sort_order)
select id, '10 g', 849, 1099, 20, 1 from public.products where slug='himalayan-suryatapi-pure-shilajit'
union all
select id, '20 g', 1499, 1999, 25, 2 from public.products where slug='himalayan-suryatapi-pure-shilajit'
union all
select id, '50 g', 3299, 4199, 10, 3 from public.products where slug='himalayan-suryatapi-pure-shilajit'
union all
select id, '100 g', 299, 399, 40, 1 from public.products where slug='uder-shaant-powder'
union all
select id, '250 g', 649, 849, 20, 2 from public.products where slug='uder-shaant-powder';

insert into public.faqs (question, answer, category, sort_order) values
 ('What is Ayurveda?','Ayurveda is a traditional Indian system of health that looks at the whole person — constitution, digestion, routine, sleep and state of mind — rather than a single symptom. Its aim is to restore balance and support wellbeing over the long term.','general',1),
 ('What is Nadi Pariksha?','Nadi Pariksha is a classical Ayurvedic pulse assessment. The practitioner reads the pulse at the wrist to understand your constitution and current imbalances. It is used alongside a detailed conversation about your health and routine.','treatments',2),
 ('What is Panchakarma?','Panchakarma is a structured programme of traditional Ayurvedic cleansing and rejuvenation therapies. It includes a preparation phase, the main therapies and a guided recovery phase with diet and lifestyle support.','treatments',3),
 ('How does an Ayurvedic consultation work?','The consultation begins with an unhurried conversation about your history, followed by assessment including Nadi Pariksha. You then receive a personalized plan covering therapies, herbal formulations where appropriate, diet and daily routine.','treatments',4),
 ('How should I prepare for my consultation?','Bring any recent medical reports and a list of medicines you are currently taking. It helps to note down your typical daily routine, diet, sleep and digestion before you arrive.','booking',5),
 ('Do I need an appointment?','An appointment is recommended so that you receive an unhurried consultation. You can book online from the Book Consultation page, or reach us by phone or WhatsApp.','booking',6),
 ('Is online consultation available?','Please contact us on WhatsApp or by phone to confirm current availability for remote consultation before travelling.','booking',7),
 ('How do I order products online?','Browse the Shop, add items to your cart and complete checkout. You can pay online or choose cash on delivery where available.','orders',8),
 ('How long does delivery take?','Orders are usually dispatched within 2 working days and delivered in 3 to 7 working days depending on your location.','orders',9),
 ('Can I return a product?','Sealed, unused products can be returned within 7 days of delivery if they arrive damaged or incorrect. Please see the Refund Policy page for full details.','orders',10);
