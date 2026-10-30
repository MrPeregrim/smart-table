import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при изменениях формы.
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);

    // Дополнительные шаблоны до таблицы добавляем в обратном порядке,
    // потому что prepend вставляет каждый новый элемент в начало.
    before.slice().reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // Дополнительные шаблоны после таблицы.
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(() => onAction()));
    root.container.addEventListener('submit', event => {
        event.preventDefault();
        onAction(event.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}
