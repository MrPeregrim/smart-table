import {createComparison, defaultRules} from "../lib/compare.js";

// Компаратор использует стандартные правила сравнения.
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (!select) return;

        select.append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';
            state[field] = '';
        }

        // Два поля формы образуют единый диапазон для поля total.
        const filterState = {...state};
        filterState.total = [
            filterState.totalFrom === '' ? '' : Number(filterState.totalFrom),
            filterState.totalTo === '' ? '' : Number(filterState.totalTo)
        ];
        delete filterState.totalFrom;
        delete filterState.totalTo;

        return data.filter(row => compare(row, filterState));
    };
}
