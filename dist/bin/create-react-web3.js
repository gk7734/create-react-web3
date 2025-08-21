#!/usr/bin/env node

import chalk from 'chalk';
import { createNextApp, createReactApp, promptUser } from "./helpers/index.js";

const defalutProjectName = process.argv[2];

async function main() {
    const {
        framework,
        projectName,
        useTypeScript,
        useESLint,
        useTailwind,
        useSrcDirectory,
        useAppRouter,
        useTurbopack,
        useImportAlias,
        useImportAliasValue,
        web3,
        packageManager
    } = await promptUser(defalutProjectName);

    if (framework === 'Next.js') {
        await createNextApp({
            projectName,
            useTypeScript,
            useESLint,
            useTailwind,
            useSrcDirectory,
            useAppRouter,
            useTurbopack,
            useImportAlias,
            useImportAliasValue,
            packageManager
        });
    } else {
        await createReactApp({ projectName, web3, packageManager });
    }

    console.log(chalk.green.bold('\nDone! 🎉 Project setup is complete.\n'));
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
