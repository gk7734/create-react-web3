#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import * as execa from 'execa';

async function main() {
    const { framework, projectName  } = await inquirer.prompt([
        {
            type: 'list',
            name: 'framework',
            message: 'Which framework would you like to create?',
            choices: ['React (vite)', 'Next.js'],
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Please enter the project name:',
            default: 'my-app',
        },
        {
            type: 'confirm',
            name: 'useTypeScript',
            message: `Would you like to use ${chalk.hex("3D74B6")('TypeScript')}?`,
            default: false,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useTailwind',
            message: `Would you like to use ${chalk.hex("3D74B6")('Tailwind CSS')}?`,
            default: false,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useSrcDirectory',
            message: `Would you like your code inside a ${chalk.hex("3D74B6")('\`src/\` directory')}?`,
            default: false,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useAppRouter',
            message: `Would you like to use ${chalk.hex("3D74B6")('App Router')}?`,
            default: true,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useTurbopack',
            message: `Would you like to use ${chalk.hex("3D74B6")('Turbopack')}?`,
            default: true,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useImportAlias ',
            message: `Would you like to customize the ${chalk.hex("3D74B6")('import alias')} (\`@/*\` by default)?`,
            default: false,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Which package manager do you want to use?',
            choices: ['npm', 'yarn', 'pnpm'],
            default: 'npm',
        },
    ])
}

main();
