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
        choices: [
            { name: 'Ethereum (eth)', value: 0 },
            { name: 'BNB (bnb)', value: 1 },
            { name: 'Solana (sol) - In Development', value: 2 },
            { name: 'XRP Ledger (xrpl)', value: 3 },
        ],
    },
    {
        type: 'list',
        name: 'example',
        message: 'Which example would you like to use?',
        choices: [
            'No example (smart fresh)',
            'Use example template',
        ],
        default: 'Use example template',
    },
];

export default async function promptUser(defaultProjectName) {
    const initialQuestions = [
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project named?',
            default: 'my-app',
            when: () => !defaultProjectName
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Which framework would you like to create?',
            choices: ['React (vite)', 'Next.js - In Development'],
        },
    ];

    const answers = await inquirer.prompt(initialQuestions);

    if (defaultProjectName && !answers.projectName) {
        answers.projectName = defaultProjectName === '.' ? 'my-app' : defaultProjectName;
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
