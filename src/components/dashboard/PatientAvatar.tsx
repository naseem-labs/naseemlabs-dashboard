interface PatientAvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function PatientAvatar({
  initials,
  size = 'md',
  className = '',
}: PatientAvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
