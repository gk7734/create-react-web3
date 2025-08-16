import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function promptUser() {
    return inquirer.prompt([
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
            message: `Would you like to use ${chalk.hex("3D74B6").bold('TypeScript')}?`,
            default: false,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useESLint',
            message: `Would you like to use ${chalk.hex("3D74B6").bold('ESLint')}?`,
            default: false,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useTailwind',
            message: `Would you like to use ${chalk.hex("3D74B6").bold('Tailwind CSS')}?`,
            default: false,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useSrcDirectory',
            message: `Would you like your code inside a ${chalk.hex("3D74B6").bold('\`src/\` directory')}?`,
            default: false,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useAppRouter',
            message: `Would you like to use ${chalk.hex("3D74B6").bold('App Router')}?`,
            default: true,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useTurbopack',
            message: `Would you like to use ${chalk.hex("3D74B6").bold('Turbopack')}?`,
            default: true,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'confirm',
            name: 'useImportAlias',
            message: `Would you like to customize the ${chalk.hex("3D74B6").bold('import alias')} (\`@/*\` by default)?`,
            default: false,
            when: answers => answers.framework === 'Next.js',
        },
        {
            type: 'input',
            name: 'useImportAliasValue',
            message: `What ${chalk.hex("3D74B6").bold('import alias')} would you like configured?`,
            default: '@/*',
            when: answers => answers.useImportAlias === true,
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Which package manager do you want to use?',
            choices: ['npm', 'yarn', 'pnpm'],
            default: 'npm',
        },
    ]);
}
