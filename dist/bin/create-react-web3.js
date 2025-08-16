#!/usr/bin/env node

import chalk from 'chalk';
import { createNextApp, createReactApp, promptUser } from "./helpers/index.js";

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
        packageManager
    } = await promptUser();

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
        await createReactApp({ projectName, packageManager });
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
