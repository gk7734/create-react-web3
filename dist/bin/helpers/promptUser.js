import inquirer from 'inquirer';

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
            choices: ['React (vite)', 'Next.js'],
        },
    ];

    const answers = await inquirer.prompt(initialQuestions);

    if (defaultProjectName && !answers.projectName) {
        answers.projectName = defaultProjectName === '.' ? 'my-app' : defaultProjectName;
    }

    const commonAnswer = await inquirer.prompt(commonQuestions);
    const pkgManagerAnswer = await inquirer.prompt(packageManagerQuestion);
    Object.assign(answers, commonAnswer, pkgManagerAnswer);

    return answers;
}
