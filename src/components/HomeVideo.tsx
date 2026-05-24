import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface VideoSettings {
  url: string;
  loop: boolean;
  title?: string;
  subtitle?: string;
}

const HomeVideo = () => {
  const [video, setVideo] = useState<VideoSettings | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'home_video')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setVideo(data.value as unknown as VideoSettings);
      });
  }, []);

  if (!video?.url) return null;

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
          {video.title && (
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-primary-foreground mb-4">
              <span className="text-gradient-gold font-semibold">{video.title}</span>
            </h2>
          )}
          {video.subtitle && (
            <p className="text-primary-foreground/75 text-base lg:text-lg mb-8 lg:mb-10 px-4">
              {video.subtitle}
            </p>
          )}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-gold/20">
            <video
              src={video.url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              playsInline
              loop={video.loop}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeVideo;
