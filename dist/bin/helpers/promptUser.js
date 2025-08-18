import inquirer from 'inquirer';
import chalk from 'chalk';

const nextQuestions = [
    {
        type: 'confirm',
        name: 'useTypeScript',
        message: `Would you like to use ${chalk.hex("3D74B6").bold('TypeScript')}?`,
        default: false,
    },
    {
        type: 'confirm',
        name: 'useESLint',
        message: `Would you like to use ${chalk.hex("3D74B6").bold('ESLint')}?`,
        default: false,
    },
    {
        type: 'confirm',
        name: 'useTailwind',
        message: `Would you like to use ${chalk.hex("3D74B6").bold('Tailwind CSS')}?`,
        default: false,
    },
    {
        type: 'confirm',
        name: 'useSrcDirectory',
        message: `Would you like your code inside a ${chalk.hex("3D74B6").bold('\`src/\` directory')}?`,
        default: false,
    },
    {
        type: 'confirm',
        name: 'useAppRouter',
        message: `Would you like to use ${chalk.hex("3D74B6").bold('App Router')}?`,
        default: true,
    },
    {
        type: 'confirm',
        name: 'useTurbopack',
        message: `Would you like to use ${chalk.hex("3D74B6").bold('Turbopack')}?`,
        default: true,
    },
    {
        type: 'confirm',
        name: 'useImportAlias',
        message: `Would you like to customize the ${chalk.hex("3D74B6").bold('import alias')} (\`@/*\` by default)?`,
        default: false,
    },
    {
        type: 'input',
        name: 'useImportAliasValue',
        message: `What ${chalk.hex("3D74B6").bold('import alias')} would you like configured?`,
        default: '@/*',
        when: answers => answers.useImportAlias === true,
    },
];
const packageManagerQuestion = [
    {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: ['npm', 'yarn', 'pnpm'],
        default: 'npm',
    }
];
const commonQuestions = [
    {
        type: 'list',
        name: 'web3',
        message: 'Which Web3 blockchain platform would you like to use?',
        choices: ['Ethereum (eth)', 'Solana (sol)', 'XRP Ledger (xrpl)'],
    },
];

export default async function promptUser(defalutProjectName) {
    const initialQuestions = [
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project named?',
            default: 'my-app',
            when: () => !defalutProjectName
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Which framework would you like to create?',
            choices: ['React (vite)', 'Next.js'],
        },
        {
            type: 'confirm',
            name: 'useRecommended',
            message: 'Use recommended default options optimized for this framework?',
            default: true,
        },
    ];

    const answers = await inquirer.prompt(initialQuestions);

    if (defalutProjectName && !answers.projectName) {
        if (defalutProjectName === '.') {
            answers.projectName = 'my-app';
        } else {
            answers.projectName = defalutProjectName;
        }
    }

    if (answers.framework === 'Next.js') {
        const nextAnswers = await inquirer.prompt(nextQuestions);
        Object.assign(answers, nextAnswers);
    }

    const commonAnswer = await inquirer.prompt(commonQuestions);
    const pkgManagerAnswer = await inquirer.prompt(packageManagerQuestion);
    Object.assign(answers, commonAnswer, pkgManagerAnswer);

    return answers;
}
