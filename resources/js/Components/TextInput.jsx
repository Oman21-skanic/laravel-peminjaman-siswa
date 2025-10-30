import { forwardRef } from 'react';

const TextInput = forwardRef(({
    type = 'text',
    className = '',
    isFocused = false,
    ...props
}, ref) => {
    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                className
            }
            ref={(input) => {
                if (input && isFocused) {
                    input.focus();
                }
                if (typeof ref === 'function') {
                    ref(input);
                } else if (ref) {
                    ref.current = input;
                }
            }}
        />
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
