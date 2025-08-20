import React, { useMemo, useState, useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useCombobox, useMultipleSelection } from 'downshift';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './select.module.scss';

export type OptionItem = {
  value: string;
  label: string;
  isNew?: boolean;
  color?: string;
};

interface SelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  options: OptionItem[];
  createPrefix?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  createOption?: (label: string) => Promise<OptionItem>;
  disabled?: boolean;
}

const Select = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options: initialOptions,
  createPrefix = 'Créer :',
  placeholder = 'Tapez pour rechercher ou créer...',
  required = false,
  rules,
  createOption,
  disabled = false,
}: SelectProps<TFieldValues>) => {
  // Validation rules handling
  const validationRules = useMemo(() => {
    if (rules && required) {
      console.warn(
        `Select: Les propriétés 'rules' et 'required' ne peuvent pas être utilisées simultanément pour le champ "${name}". La propriété 'required' sera ignorée.`
      );
    }
    return rules || (required ? { required: 'Ce champ est requis' } : undefined);
  }, [rules, required, name]);

  const { field, fieldState } = useController({
    name,
    control,
    rules: validationRules,
  });

  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Multiple selection setup
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem, selectedItems } =
    useMultipleSelection<OptionItem>({
      selectedItems: field.value || [],
      onSelectedItemsChange: ({ selectedItems: newSelectedItems }) => {
        field.onChange(newSelectedItems || []);
      },
    });

  // Filter options based on input and selected items
  const filteredOptions = useMemo(() => {
    const normalizedInput = inputValue.toLowerCase().trim();

    let filtered = options.filter(item => {
      const isSelected = selectedItems.some(selectedItem => selectedItem.value === item.value);
      const matchesInput = !normalizedInput || item.label.toLowerCase().includes(normalizedInput);
      return !isSelected && matchesInput;
    });

    // Add create option if no matches and input is not empty
    if (normalizedInput && filtered.length === 0 && createOption) {
      filtered = [{ value: `new-${uuid()}`, label: inputValue.trim(), isNew: true }];
    }

    return filtered;
  }, [options, selectedItems, inputValue, createOption]);

  // Handle item selection
  const handleSelectedItemChange = useCallback(
    async (selectedItem: OptionItem | null) => {
      if (!selectedItem) return;

      let itemToAdd = selectedItem;

      if (selectedItem.isNew && createOption) {
        try {
          itemToAdd = await createOption(selectedItem.label);
          setOptions(prev => [...prev, itemToAdd]);
        } catch (error) {
          console.error('Error creating new option:', error);
          return;
        }
      }

      const newSelectedItems = [...(field.value || []), itemToAdd];
      field.onChange(newSelectedItems);
      setInputValue('');
    },
    [field, createOption]
  );

  // Combobox setup
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: filteredOptions,
    itemToString: (item: OptionItem | null) => item?.label || '',
    inputValue,
    selectedItem: null,
    onInputValueChange: ({ inputValue: newValue }) => {
      setInputValue(newValue || '');
    },
    onSelectedItemChange: ({ selectedItem }) => {
      handleSelectedItemChange(selectedItem);
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: false,
            highlightedIndex: state.highlightedIndex,
            inputValue: '',
          };
        case useCombobox.stateChangeTypes.InputChange:
          return {
            ...changes,
            isOpen: true,
          };
        default:
          return changes;
      }
    },
  });

  // Merge refs from React Hook Form and Downshift
  const mergeRefs = useCallback(
    (...refs: any[]) =>
      (element: any) => {
        refs.forEach(ref => {
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        });
      },
    []
  );

  // Get Downshift input props
  const downshiftInputProps = getInputProps({
    ref: mergeRefs(inputRef, field.ref), // Merge ref with React Hook Form ref
    disabled,
  });

  const dropdownProps = getDropdownProps({
    preventKeyAction: isOpen,
  });

  // Handle container click
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (dropdownProps.onClick) {
        dropdownProps.onClick(e);
      }
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
        openMenu();
      }
    },
    [disabled, openMenu]
  );

  const handleRemoveItem = useCallback(
    (e: React.MouseEvent, item: OptionItem) => {
      e.stopPropagation();
      removeSelectedItem(item);
    },
    [removeSelectedItem]
  );

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} {...getLabelProps()}>
          {label}
          {required && !rules && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div
        className={`
          ${styles.inputWrapper} 
          ${fieldState.invalid ? styles.inputError : ''} 
          ${disabled ? styles.disabled : ''}
        `}
        role="button"
        tabIndex={-1}
        {...dropdownProps}
        onClick={handleContainerClick} // override onClick from Downshift (call it from directly from handleContainerClick)
      >
        <div className={styles.selectedItems}>
          {selectedItems.map((selectedItem: OptionItem, index: number) => (
            <span
              key={selectedItem.value}
              className={styles.selectedItem}
              style={selectedItem.color ? { backgroundColor: selectedItem.color } : {}}
              {...getSelectedItemProps({
                selectedItem,
                index,
              })}
            >
              {selectedItem.label}
              {!disabled && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={e => handleRemoveItem(e, selectedItem)}
                  aria-label={`Remove ${selectedItem.label}`}
                >
                  &#10005;
                </button>
              )}
            </span>
          ))}

          <input
            {...downshiftInputProps}
            className={`
              ${styles.inputSearch} 
              ${selectedItems.length === 0 ? styles.placeholder : ''}
            `}
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            value={inputValue}
            data-testid={`select-input-${name}`}
            disabled={disabled}
          />
        </div>

        <button
          type="button"
          className={styles.toggleButton}
          {...getToggleButtonProps()}
          disabled={disabled}
        >
          <span className={styles.arrow}>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>
      </div>

      <ul className={`${styles.menu} ${!isOpen ? styles.hidden : ''}`} {...getMenuProps()}>
        {isOpen && filteredOptions.length > 0
          ? filteredOptions.map((item, index) => (
              <li
                className={`
                ${styles.menuItem} 
                ${highlightedIndex === index ? styles.highlighted : ''} 
                ${item.isNew ? styles.createOption : ''}
              `}
                key={item.value}
                {...getItemProps({ item, index })}
              >
                <span style={item.color ? { backgroundColor: item.color } : {}}>
                  {item.isNew ? `${createPrefix} ` : ''}
                  {item.label}
                </span>
              </li>
            ))
          : isOpen &&
            inputValue &&
            !createOption && <li className={styles.noResults}>Aucun résultat trouvé</li>}
      </ul>

      {fieldState.error?.message && (
        <p className={styles.errorMessage} role="alert">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
};

export default Select;
