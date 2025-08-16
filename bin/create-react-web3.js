#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { execa } from 'execa';
import {resolve, dirname} from "node:path";
import { fileURLToPath } from 'url';
import { copy } from 'fs-extra';

async function main() {
    const { framework, projectName, useTypeScript, useESLint, useTailwind, useSrcDirectory, useAppRouter, useTurbopack, useImportAlias, useImportAliasValue, packageManager } = await inquirer.prompt([
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
            name: 'useESLint',
            message: `Would you like to use ${chalk.hex("3D74B6")('ESLint')}?`,
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
            name: 'useImportAlias',
            message: `Would you like to customize the ${chalk.hex("3D74B6")('import alias')} (\`@/*\` by default)?`,
            default: false,
            when: (answers) => answers.framework === 'Next.js',
        },
        {
            type: 'input',
            name: 'useImportAliasValue',
            message: `What ${chalk.hex("3D74B6")('import alias')} would you like configured?`,
            default: '@/*',
            when: (answers) => answers.useImportAlias === true,
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Which package manager do you want to use?',
            choices: ['npm', 'yarn', 'pnpm'],
            default: 'npm',
        },
    ])

    if (framework === 'Next.js') {
        const args = [];

        // 프로젝트 폴더명 (필수)
        if (projectName) args.push(projectName);

        // 타입스크립트 / 자바스크립트 옵션
        if (useTypeScript) args.push('--ts');
        else args.push('--js');

        if (useESLint) args.push('--eslint');
        if (useTailwind) args.push('--tailwind');
        if (useSrcDirectory) args.push('--src-dir');
        if (useAppRouter) args.push('--app');
        if (useTurbopack) args.push('--turbopack');

        // import alias 옵션 (값 필요)
        if (useImportAlias && useImportAliasValue) {
            args.push('--import-alias', useImportAliasValue);
        }
        args.push('--yes');

        // 패키지 매니저별 실행 커맨드 분기
        let cmd, cmdArgs;
        switch (packageManager) {
            case 'npm':
                cmd = 'npx';
                cmdArgs = ['create-next-app@latest', ...args];
                break;
            case 'yarn':
                cmd = 'yarn';
                cmdArgs = ['create', 'next-app', ...args];
                break;
            case 'pnpm':
                cmd = 'pnpm';
                cmdArgs = ['dlx', 'create-next-app', ...args];
                break;
            default:
                // 기본값 npm
                cmd = 'npx';
                cmdArgs = ['create-next-app@latest', ...args];
        }

        const spinner = ora("Creating Next.js app...").start();
        spinner.color = "blue";

        try {
            await execa(cmd, cmdArgs, { stdio: 'pipe' });
            spinner.succeed('Next.js app created successfully!');
        } catch (err) {
            spinner.fail('Create failed!');
        }
    } else {
        let cmd, args;
        switch (packageManager) {
            case 'npm':
                cmd = 'npm';
                args = ['install'];
                break;
            case 'yarn':
                cmd = 'yarn';
                args = [];
                break;
            case 'pnpm':
                cmd = 'pnpm';
                args = ['install'];
                break;
            default:
                cmd = 'npm';
                args = ['install'];
        }

        const spinner = ora("Creating React app...").start();
        spinner.color = "blue";

        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const templatePath = resolve(__dirname, '../templates', 'react');
            const targetPath = resolve(process.cwd(), projectName);

            await copy(templatePath, targetPath);

            await execa(cmd, args, { cwd: targetPath, stdio: 'pipe' });
            spinner.succeed('React app created successfully!');
        } catch (err) {
            spinner.fail('Create failed!');
            console.error(err);
        }
    }
}

main();
