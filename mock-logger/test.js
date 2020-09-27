// let arr = Array(2^40).fill("some string")
// const used = process.memoryUsage().heapUsed / 1024 / 1024
// console.log(`The script uses approximately ${used} MB`)

// 'use strict';
// import { nanoid } from 'nanoid'

// const list = [];

// setInterval(() => {
//     const record = new MyRecord();
//     list.push(record);
// }, 1);

// function MyRecord() {
//     var x = nanoid(1024*1024)
//     this.name = x.repeat(10);
//     this.id = x.repeat(10);
//     this.account = x.repeat(1);
// }

// setInterval(() => {
//     console.log(process.memoryUsage())
// }, 5000);

// const v8 = require('v8');
// const totalHeapSize = v8.getHeapStatistics().total_available_size;
// const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
// console.log('totalHeapSizeGb: ', totalHeapSizeGb);

import {DYAS_AGO,GAME_COUNT} from './lib/config'

console.log(GAME_COUNT)

