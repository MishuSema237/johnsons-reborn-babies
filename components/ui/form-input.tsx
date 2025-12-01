import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export function FormInput({
  label,
  required,
  error,
  helpText,
  className = "",
  endIcon,
  ...props
}: FormInputProps & { endIcon?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="text-sm font-medium text-gray-700 block mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          className={`w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all ${endIcon ? "pr-12" : ""
            } ${className}`}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {endIcon}
          </div>
        )}
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export function FormTextarea({
  label,
  required,
  error,
  helpText,
  className = "",
  ...props
}: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="text-sm font-medium text-gray-700 block mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base resize-y focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
}

export function FormSelect({
  label,
  required,
  error,
  options,
  className = "",
  ...props
}: FormSelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="text-sm font-medium text-gray-700 block mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface RadioOptionProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function RadioOption({ label, ...props }: RadioOptionProps) {
  return (
    <div className="flex items-center mb-2">
      <input
        type="radio"
        className="w-4 h-4 border border-gray-300 rounded-full mr-2 cursor-pointer appearance-none checked:bg-pink-500 checked:border-pink-500 relative checked:before:content-[''] checked:before:block checked:before:w-1.5 checked:before:h-1.5 checked:before:bg-white checked:before:rounded-full checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 transition-all"
        {...props}
      />
      <label
        htmlFor={props.id}
        className="text-base text-gray-700 mb-0 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}

