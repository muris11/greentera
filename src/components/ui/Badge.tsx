import { Level, TreeStage, WasteType } from '@prisma/client';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

interface LevelBadgeProps {
  level: Level;
  className?: string;
}

export function LevelBadge({ level, className = '' }: LevelBadgeProps) {
  const badgeClass = {
    BRONZE: 'badge-bronze',
    SILVER: 'badge-silver',
    GOLD: 'badge-gold',
  }[level];

  const emoji = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
  }[level];

  return (
    <span className={`${badgeClass} ${className}`}>
      {emoji} {level}
    </span>
  );
}

interface WasteBadgeProps {
  type: WasteType;
  className?: string;
}

export function WasteBadge({ type, className = '' }: WasteBadgeProps) {
  const config = {
    ORGANIC: { class: 'waste-organic', emoji: '🟢', label: 'Organik' },
    PLASTIC: { class: 'waste-plastic', emoji: '🔵', label: 'Plastik' },
    METAL: { class: 'waste-metal', emoji: '🟡', label: 'Logam' },
    PAPER: { class: 'waste-paper', emoji: '🟤', label: 'Kertas' },
  }[type];

  return (
    <span className={`waste-badge ${config.class} ${className}`}>
      {config.emoji} {config.label}
    </span>
  );
}

interface TreeStageBadgeProps {
  stage: TreeStage;
  className?: string;
}

export function TreeStageBadge({ stage, className = '' }: TreeStageBadgeProps) {
  const config = {
    SEED: { emoji: '🌰', label: 'Biji' },
    SPROUT: { emoji: '🌱', label: 'Kecambah' },
    SMALL: { emoji: '🌿', label: 'Tunas' },
    MEDIUM: { emoji: '🌲', label: 'Pohon Muda' },
    LARGE: { emoji: '🌳', label: 'Pohon Dewasa' },
  }[stage];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium ${className}`}>
      {config.emoji} {config.label}
    </span>
  );
}
