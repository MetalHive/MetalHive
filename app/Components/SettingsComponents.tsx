import React from 'react';

interface SettingsCardProps {
    children: React.ReactNode;
    className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl border border-[#ececec] p-6 ${className}`}>
            {children}
        </div>
    );
};

interface SettingsSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-[#17181a] mb-1">{title}</h2>
                {description && (
                    <p className="text-sm text-[#737780]">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
};

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    value,
    onChange,
    showToggle = true,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div>
            <label className="block text-sm font-medium text-[#17181a] mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227] pr-12"
                    {...props}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737780] hover:text-[#17181a]"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, ...props }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-[#17181a] mb-2">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                {...props}
            />
        </div>
    );
};

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
    variant = 'primary',
    isLoading = false,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-6 py-3 font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyles = variant === 'primary'
        ? 'bg-[#C9A227] text-white hover:bg-[#b08f1f]'
        : 'border border-[#ececec] text-[#17181a] hover:bg-gray-50';

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};
