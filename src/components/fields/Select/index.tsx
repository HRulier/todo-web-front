import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useCombobox, useMultipleSelection } from 'downshift';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import styles from './select.module.scss';

export type OptionItem = {
  value: string;
  label: string;
  isNew?: boolean;
  color?: string;
};

const Select = ({
  label,
  createPrefix = 'Créer :',
  options: initialOptions,
  createOption,
}: {
  label: string;
  createPrefix?: string;
  options: OptionItem[];
  createOption?: (label: string) => Promise<OptionItem>;
}) => {
  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setInputValue] = useState('');

  const {
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  } = useMultipleSelection<OptionItem>();

  const filteredOptions = useMemo(() => {
    let filtered = options
      .filter(item => !selectedItems.some(selectedItem => selectedItem.value === item.value))
      .filter(item => !inputValue || item.label.toLowerCase().includes(inputValue.toLowerCase()));

    if (inputValue && filtered.length === 0) {
      filtered = [{ value: `new-${uuid()}`, label: inputValue, isNew: true }];
    }

    return filtered;
  }, [options, selectedItems, inputValue]);

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
    itemToString(item: OptionItem | null) {
      return item ? item.label : '';
    },
    inputValue,
    selectedItem: null,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || '');
    },
    onSelectedItemChange: async ({ selectedItem }) => {
      if (selectedItem) {
        let newSelectItem = selectedItem;

        if (selectedItem.isNew) {
          newSelectItem = {
            value: `option-${Date.now()}`,
            label: inputValue,
          };

          if (createOption) {
            newSelectItem = await createOption(inputValue);
          }

          setOptions(prev => [...prev, newSelectItem]);
        }

        setSelectedItems([...selectedItems, newSelectItem]);
        setInputValue('');
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;
      if (
        type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
        type === useCombobox.stateChangeTypes.ItemClick
      ) {
        return {
          ...changes,
          isOpen: false,
          highlightedIndex: state.highlightedIndex,
          inputValue: '',
        };
      }
      if (type === useCombobox.stateChangeTypes.InputChange) {
        return {
          ...changes,
          isOpen: true,
        };
      }
      return changes;
    },
  });

  const inputProps = getInputProps({
    ...getDropdownProps({ preventKeyAction: isOpen }),
  });

  return (
    <div className={styles.container}>
      <label className={styles.label} {...getLabelProps()}>
        {label}
      </label>
      <div className={styles.inputWrapper} role="button" onClick={() => openMenu()}>
        <div className={styles.selectedItems}>
          {selectedItems.map((selectedItem: OptionItem) => (
            <span
              key={selectedItem.value}
              className={styles.selectedItem}
              style={selectedItem.color ? { backgroundColor: selectedItem.color } : {}}
              {...getSelectedItemProps({
                selectedItem,
                index: selectedItems.indexOf(selectedItem),
              })}
            >
              {selectedItem.label}
              <button
                type="button"
                className={styles.removeButton}
                onClick={e => {
                  e.stopPropagation();
                  removeSelectedItem(selectedItem);
                }}
                aria-label={`Remove ${selectedItem.label}`}
              >
                &#10005;
              </button>
            </span>
          ))}
          <input
            className={`${styles.inputSearch} ${selectedItems.length === 0 ? styles.placeholder : ''}`}
            placeholder={selectedItems.length === 0 ? 'Tapez pour rechercher ou créer...' : ''}
            {...inputProps}
            value={inputValue}
          />
        </div>
        <button type="button" className={styles.toggleButton} {...getToggleButtonProps()}>
          <span className={styles.arrow}>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>
      </div>
      <ul className={`${styles.menu} ${!isOpen ? styles.hidden : ''}`} {...getMenuProps()}>
        {isOpen &&
          filteredOptions.map((item, index) => (
            <li
              className={`${styles.menuItem} ${highlightedIndex === index ? styles.highlighted : ''} ${item.isNew ? styles.createOption : ''}`}
              key={item.value}
              {...getItemProps({ item, index })}
            >
              <span style={item.color ? { backgroundColor: item.color } : {}}>
                {item.isNew ? `${createPrefix}` : ''} {item.label}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Select;
