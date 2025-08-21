import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getDefaultDimensions = () => {
    switch (variant) {
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'rectangular':
        return { width: '100%', height: '200px' };
      case 'text':
      default:
        return { width: '100%', height: '20px' };
    }
  };

  const defaultDimensions = getDefaultDimensions();
  const style = {
    width: width || defaultDimensions.width,
    height: height || defaultDimensions.height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width, // Last line is shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

export default LoadingSkeleton;

// Preset skeleton components
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card ${className}`}>
    <LoadingSkeleton variant="rectangular" height="200px" className="mb-4" />
    <LoadingSkeleton variant="text" height="24px" className="mb-2" />
    <LoadingSkeleton variant="text" lines={2} className="mb-4" />
    <div className="flex justify-between items-center">
      <LoadingSkeleton variant="text" width="100px" />
      <LoadingSkeleton variant="rectangular" width="80px" height="32px" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-4 ${className}`}>
    <LoadingSkeleton variant="circular" width="60px" height="60px" />
    <div className="flex-1">
      <LoadingSkeleton variant="text" height="20px" width="150px" className="mb-2" />
      <LoadingSkeleton variant="text" height="16px" width="200px" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4, 
  className = '' 
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <LoadingSkeleton variant="text" />
      </td>
    ))}
  </tr>
);