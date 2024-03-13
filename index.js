'use strict';
import 'dotenv/config';
import { jwt } from './utils.js';

console.log(jwt(process.env.TOKEN).payload);
