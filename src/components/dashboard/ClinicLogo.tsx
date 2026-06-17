import type { Clinic } from '../../types/dashboard';

interface ClinicLogoProps {
  clinic: Clinic;
  size?: 'sm' | 'md';
  showName?: boolean;
  collapsed?: boolean;
  variant?: 'dark' | 'light';
}

const sizeMap = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
};

export function ClinicLogo({
  clinic,
  size = 'md',
  showName = true,
  collapsed = false,
  variant = 'dark',
}: ClinicLogoProps) {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
      {clinic.logo_url ? (
        <img
          src={clinic.logo_url}
          alt=""
          className={`${sizeMap[size]} shrink-0 rounded-xl object-cover`}
        />
      ) : (
        <span
          className={`inline-flex ${sizeMap[size]} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25`}
          aria-hidden="true"
        >
          {clinic.logo_initials}
        </span>
      )}

      {showName && !collapsed ? (
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-bold ${
              isLight ? 'text-navy' : 'text-white/90'
            }`}
          >
            {clinic.name}
          </p>
          {isLight ? (
            <p className="truncate text-[11px] text-slate-500">Hair Transplant Clinic</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
