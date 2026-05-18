#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createNextApp, createReactApp, promptUser } from "./helpers/index.js";

const defaultProjectName = process.argv[2];

/** Purple brand gradient (deep violet → purple → lavender). */
const brandGradient = gradient(['#6d28d9', '#a855f7', '#d8b4fe']);

/**
 * Prints the gradient ASCII banner shown when the CLI starts.
 * The figlet art spells "Web3" (34 cols wide) so it fits virtually any
 * terminal; only genuinely tiny terminals skip the art entirely.
 */
function printBanner() {
    const columns = process.stdout.columns || 80;
    console.log();
    if (columns >= 38) {
        const art = figlet.textSync('Web3', { font: 'ANSI Shadow' })
            .split('\n')
            .map((line) => '  ' + line)
            .join('\n');
        console.log(brandGradient.multiline(art));
    }
    console.log(brandGradient('  create-react-web3'));
    console.log(chalk.dim('  ⚡ Scaffold a React + Web3 project in seconds') + '\n');
}

async function main() {
    printBanner();

    const { framework, projectName, web3, example, packageManager } =
        await promptUser(defaultProjectName);

    if (framework === 'Next.js') {
        await createNextApp({ projectName, web3, example, packageManager });
    } else {
        await createReactApp({ projectName, web3, example, packageManager });
    }
}

main().catch((err) => {
    if (
        err instanceof Error &&
        (
            err.name === 'ExitPromptError' ||
            err.message?.toLowerCase().includes('sigint') ||
            err.message?.toLowerCase().includes('cancel')
        )
    ) {
        console.log(chalk.yellow.bold('\n⚠️ Execution was cancelled by the user. Exiting gracefully. ✋'));
        process.exit(0);
    }
    console.error(chalk.red('An unexpected error occurred:'), err);
    process.exit(1);
});
