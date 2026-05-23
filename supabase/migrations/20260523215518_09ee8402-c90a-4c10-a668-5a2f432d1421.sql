
-- Update collier variants: silver 26€, gold 24€
UPDATE public.products
SET price = 26,
    variants = '[
      {"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},
      {"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},
      {"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},
      {"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}
    ]'::jsonb
WHERE category = 'colliers';

-- Bracelets at 16€
UPDATE public.products SET price = 16 WHERE category = 'bracelets';

-- Deactivate Ina and Zinda
UPDATE public.products SET is_active = false
WHERE slug IN ('collier-croix-ina', 'collier-croix-zinda');

-- Insert new colliers
INSERT INTO public.products (name, slug, category, price, material, description, short_description, is_active, images, variants, display_order)
VALUES
('Collier Croix d''Air', 'collier-croix-air', 'colliers', 26, 'Argent/Or',
 'La Croix d''Air, originaire de la région montagneuse de l''Aïr au nord du Niger, est un bijou ancestral porté par les Touaregs nomades. Symbole de protection et de lien avec les ancêtres, elle est façonnée à la main par nos artisans selon des techniques traditionnelles.',
 'Symbole de protection des montagnes de l''Aïr',
 true, '[]'::jsonb,
 '[{"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},{"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},{"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},{"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}]'::jsonb,
 10),
('Collier Croix de Madaoua', 'collier-croix-madaoua', 'colliers', 26, 'Argent/Or',
 'La Croix de Madaoua provient de la région de Madaoua au Niger. Reconnue pour ses motifs distinctifs et son élégance sobre, elle incarne l''identité culturelle du peuple touareg.',
 'Élégance sobre des artisans de Madaoua',
 true, '[]'::jsonb,
 '[{"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},{"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},{"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},{"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}]'::jsonb,
 11),
('Collier Croix de Bilma', 'collier-croix-bilma', 'colliers', 26, 'Argent/Or',
 'La Croix de Bilma tire son nom de l''oasis légendaire de Bilma, point de passage des caravanes du sel. Elle symbolise le voyage, le commerce et la rencontre des cultures sahariennes.',
 'Symbole des caravaniers de l''oasis de Bilma',
 true, '[]'::jsonb,
 '[{"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},{"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},{"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},{"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}]'::jsonb,
 12),
('Collier Croix d''Abalak', 'collier-croix-abalak', 'colliers', 26, 'Argent/Or',
 'La Croix d''Abalak, originaire de la ville d''Abalak au Niger, est reconnue pour ses lignes pures et son design équilibré. Un bijou raffiné chargé de l''histoire des pasteurs touaregs.',
 'Pureté des lignes des pasteurs d''Abalak',
 true, '[]'::jsonb,
 '[{"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},{"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},{"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},{"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}]'::jsonb,
 13),
('Collier Croix de Zinder', 'collier-croix-zinder', 'colliers', 26, 'Argent/Or',
 'La Croix de Zinder, issue de la grande ville historique de Zinder au Niger, incarne la richesse de l''héritage haoussa et touareg. Ses motifs raffinés en font une pièce de prestige.',
 'Héritage prestigieux de la ville de Zinder',
 true, '[]'::jsonb,
 '[{"id":"chaine-argente","type":"chain","color":"argente","label":"Chaîne Argentée","price":26},{"id":"chaine-dore","type":"chain","color":"dore","label":"Chaîne Dorée","price":24},{"id":"perle-argente","type":"bead","color":"argente","label":"Perles Argentées","price":26},{"id":"perle-dore","type":"bead","color":"dore","label":"Perles Dorées","price":24}]'::jsonb,
 14);
