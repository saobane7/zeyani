import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface MediaSettings {
  url: string;
  loop: boolean;
  title?: string;
  subtitle?: string;
  mediaType?: 'video' | 'image';
}

const HomeVideo = () => {
  const [media, setMedia] = useState<MediaSettings | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'home_video')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setMedia(data.value as unknown as MediaSettings);
      });
  }, []);

  if (!media?.url) return null;

  // Auto-detect type if not set
  const type =
    media.mediaType ||
    (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(media.url) ? 'video' : 'image');

  return (
    <section className="py-16 lg:py-20 xl:py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gold-line w-16 mx-auto mb-6 lg:mb-8" />
          {media.title && (
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-primary-foreground mb-4">
              <span className="text-gradient-gold font-semibold">{media.title}</span>
            </h2>
          )}
          {media.subtitle && (
            <p className="text-primary-foreground/75 text-base lg:text-lg mb-8 lg:mb-10 px-4">
              {media.subtitle}
            </p>
          )}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-gold/20">
            {type === 'video' ? (
              <video
                src={media.url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                playsInline
                loop={media.loop}
              />
            ) : (
              <img
                src={media.url}
                alt={media.title || 'Image page d’accueil'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeVideo;
