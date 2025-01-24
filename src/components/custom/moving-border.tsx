import React, { useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface MovingBorderWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export function MovingBorderWrapper({
  borderRadius = '1.75rem',
  children,
  as: Component = 'div',
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: MovingBorderWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Component
      className={cn(
        'bg-transparent relative text-xl p-[1px] overflow-hidden ',
        containerClassName,
        isHovered ? 'shadow-sm shadow-sky-600' : '',
      )}
      style={{
        borderRadius: borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder
          duration={duration}
          rx="30%"
          ry="30%"
          isHovered={isHovered}
        >
          <div
            className={cn(
              'h-40 w-40 transition-colors duration-300 opacity-[0.8] bg-[radial-gradient(var(--sky-100)_40%,transparent_60%)]',
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <motion.div
        className="absolute inset-0 border border-sky-600"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={{
          clipPath: isHovered ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
        }}
        transition={{ duration: 1, ease: 'linear' }}
      />

      <div
        className={cn(
          'relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl flex items-center justify-center w-full h-full',
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  isHovered,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (!isHovered) {
      const length = pathRef.current?.getTotalLength();
      if (length) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute w-full h-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
