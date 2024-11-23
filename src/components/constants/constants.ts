
export const BUTTONS = [
  { label: 'Статистика OS Doors', url: 'https://rcslabs.ru/ttrp1.json' },
  { label: 'Статистика OS Bombuntu', url: 'https://rcslabs.ru/ttrp2.json' },
  { label: 'Статистика Mibre Office', url: 'https://rcslabs.ru/ttrp3.json' },
  { label: 'Статистика LoWtEx', url: 'https://rcslabs.ru/ttrp4.json' },
  { label: 'Статистика W$ POS', url: 'https://rcslabs.ru/ttrp5.json' }
];

const CONFIG = {
    CHART_HEIGHT: 336,
    COLUMN_MAX_HEIGHT: 265,
    GAP: 60,
    COLUMN_WIDTH: 80,
    ARROW_OFFSET: 62
  };

  const LEGEND_ITEMS = [
    { label: 'Клиентская часть', color: '#4AB6E8' },
    { label: 'Серверная часть', color: '#AA6FAC' },
    { label: 'База данных', color: '#E85498' }
  ];


export default BUTTONS, CONFIG, LEGEND_ITEMS;
