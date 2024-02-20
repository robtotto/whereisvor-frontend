// Toggle map/list

import { mapContainer, buttonList } from './map.js';
import { gridContainer, buttonMap } from './list.js';

console.log("mapContainer, buttonList" + mapContainer, buttonList);
console.log("gridContainer, buttonMap" + gridContainer, buttonMap);

const toggleView = () => {
    mapContainer.classList.toggle('hide');
    gridContainer.classList.toggle('hide');
  };

gridContainer.classList.add('hide');

buttonList.addEventListener('click', toggleView);
console.log('Button list clicked!')
buttonMap.addEventListener('click', toggleView);
console.log('Button map clicked!')




