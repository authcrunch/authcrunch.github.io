import {useEffect, useRef, useState, type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ArrowsPointingOutIcon, PauseIcon, PlayIcon} from '@heroicons/react/24/outline';
import styles from './styles.module.css';

const scenes = [
  {label: 'Sign in', x: .18, y: .49},
  {label: 'Access policy', x: .54, y: .40},
  {label: 'Allow access', x: .84, y: .32},
];
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

export default function GatewayIllustration(): ReactNode {
  const image = useBaseUrl('/img/home/glass-gateway-1672.webp');
  const viewport = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{width: number; height: number} | null>(null);
  const [scene, setScene] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return undefined;
    const measure = () => setBounds({width: element.clientWidth, height: element.clientHeight});
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    visibility.observe(element);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => {
      setScene(motion.matches ? null : 0);
      setPlaying(!motion.matches);
    };
    applyPreference();
    setReady(true);
    motion.addEventListener('change', applyPreference);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      motion.removeEventListener('change', applyPreference);
    };
  }, []);

  useEffect(() => {
    if (!playing || !visible) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setScene(current => ((current ?? -1) + 1) % scenes.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [playing, visible]);

  let transform: string | undefined;
  if (bounds) {
    const {width, height} = bounds;
    const imageHeight = width * 941 / 1672;
    const scale = scene === null ? 1 : width < 500 ? 2.5 : 2;
    const focus = scene === null ? null : scenes[scene];
    const x = focus ? clamp(width / 2 - width * scale * focus.x, width - width * scale, 0) : 0;
    const y = focus ? clamp(height / 2 - imageHeight * scale * focus.y, height - imageHeight * scale, 0) : (height - imageHeight) / 2;
    transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  const selectScene = (index: number) => {
    setPlaying(false);
    setScene(index);
  };

  return (
    <figure className={styles.artwork} aria-label="Authentication and authorization illustration" data-scene={scene === null ? 'overview' : scene} data-playing={playing}>
      <div className={styles.viewport} ref={viewport}>
        <img
          src={image}
          width="1672"
          height="941"
          alt="A sign-in portal sends an identity through a glass access-policy gateway. Two applications are allowed; a third is denied."
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={styles.image}
          style={transform ? {top: 0, transform} : undefined}
        />
      </div>
      <figcaption className={styles.caption}>
        {!ready && <div className={styles.staticLabels}><span>Sign in</span><span>Check access</span><span>Reach apps</span></div>}
        {ready && <>
          <div className={styles.scenes} role="group" aria-label="Illustration focus">
            {scenes.map((item, index) => <button type="button" key={item.label} aria-pressed={scene === index} onClick={() => selectScene(index)}>{item.label}</button>)}
          </div>
          <div className={styles.playback}>
            <button type="button" aria-label={playing ? 'Pause illustration' : 'Play illustration'} title={playing ? 'Pause illustration' : 'Play illustration'} onClick={() => {
              if (!playing && scene === null) setScene(0);
              setPlaying(current => !current);
            }}>{playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}</button>
            <button type="button" aria-label="Show whole illustration" title="Show whole illustration" onClick={() => {setPlaying(false); setScene(null);}}><ArrowsPointingOutIcon aria-hidden="true" /></button>
          </div>
        </>}
      </figcaption>
    </figure>
  );
}
