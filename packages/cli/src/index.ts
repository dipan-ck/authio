import { defineCommand, runMain } from 'citty';
import { generate } from './commands/generate.js';

const main = defineCommand({
   meta: {
      name: 'Swift Auth CLI',
      description: 'A CLI to make your swift auth integration easier',
   },
   subCommands: {
      generate: generate,
   },
});

runMain(main);
