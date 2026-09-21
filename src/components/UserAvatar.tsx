type Props = {
  initial: string;
  color: string;
  size?: 'mini' | 'default' | 'large';
};

export default function UserAvatar({ initial, color, size = 'default' }: Props) {
  const sizeClass = size === 'mini' ? 'avatar mini' : size === 'large' ? 'avatar avatar-large' : 'avatar';
  return <span className={sizeClass} style={{ backgroundColor: color }}>{initial}</span>;
}
