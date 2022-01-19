import React, { useState, useEffect } from 'react';
import {
    AccessibilityEventType,
    checkEventIsClickOrEnterPress,
    cnCreate,
    detectTouch,
    filterDataAttrs,
    IFilterDataAttrs,
} from '@megafon/ui-helpers';
import CheckedIcon from '@megafon/ui-icons/system-16-checked_16.svg';
import * as PropTypes from 'prop-types';
import './Checkbox.less';

const CHANGE_KEY = 'change';

export interface ICheckboxProps extends IFilterDataAttrs {
    /** Цвет чекбокса */
    color?: 'dark' | 'light';
    /** Дополнительный класс корневого элемента */
    className?: string;
    /** Дополнительные классы для внутренних элементов */
    classes?: {
        inner?: string;
        icon?: string;
    };
    /** Размер текста */
    fontSize?: 'regular' | 'small';
    /** Имя компонента в DOM */
    name?: string;
    /** Значение чекбокса */
    value?: string;
    /** Управление состоянием вкл/выкл компонента */
    checked?: boolean;
    /** Управление возможностью взаимодействия с компонентом */
    disabled?: boolean;
    /** Отобразить компонент в состоянии ошибки */
    error?: boolean;
    /** Дополнительный контент справа */
    extraContent?: JSX.Element[] | Element[] | JSX.Element | Element | string;
    children: JSX.Element[] | Element[] | JSX.Element | Element | string;
    /** Обработчик изменения значения */
    onChange?: (checked: boolean) => void;
}

const cn = cnCreate('mfui-checkbox');
const Checkbox: React.FC<ICheckboxProps> = ({
    className,
    fontSize = 'regular',
    name,
    color = 'dark',
    value,
    checked = false,
    disabled,
    error,
    children,
    extraContent,
    dataAttrs,
    classes,
    onChange,
}) => {
    const isTouch: boolean = detectTouch();

    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(isChecked);
    }, [isChecked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | AccessibilityEventType): void => {
        if (checkEventIsClickOrEnterPress(e) || e.type === CHANGE_KEY) {
            setIsChecked(!isChecked);
            onChange && onChange(!isChecked);
        }
    };

    return (
        <div
            className={cn(
                '',
                {
                    'font-size': fontSize,
                    color,
                    checked: isChecked,
                    disabled,
                    error,
                },
                className,
            )}
            {...filterDataAttrs(dataAttrs)}
        >
            <div className={cn('inner', [classes?.inner])}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={cn('label', { 'no-touch': !isTouch })}>
                    <input
                        className={cn('input')}
                        type="checkbox"
                        tabIndex={-1}
                        name={name}
                        value={value}
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div
                        tabIndex={0}
                        role="checkbox"
                        aria-checked={isChecked}
                        className={cn('custom-input', [classes?.icon])}
                        onKeyDown={handleChange}
                    >
                        <CheckedIcon className={cn('icon')} />
                    </div>
                    {children}
                </label>
                {extraContent && <span className={cn('extra-content')}>{extraContent}</span>}
            </div>
        </div>
    );
};

Checkbox.propTypes = {
    className: PropTypes.string,
    fontSize: PropTypes.oneOf(['regular', 'small']),
    color: PropTypes.oneOf(['dark', 'light']),
    name: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element.isRequired),
        PropTypes.element,
        PropTypes.string,
    ]).isRequired,
    extraContent: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element.isRequired),
        PropTypes.element,
        PropTypes.string,
    ]),
    dataAttrs: PropTypes.objectOf(PropTypes.string.isRequired),
    onChange: PropTypes.func,
};

export default Checkbox;
