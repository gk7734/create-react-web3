import ora from "ora";
import chalk from "chalk";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "url";
import {copy} from "fs-extra";
import {execa} from "execa";

export default async function createReactApp({projectName, packageManager}) {
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

    const spinner = ora(`Creating React app in ${chalk.yellow.bold(resolve(process.cwd(), projectName))}`).start();
    spinner.color = "blue";

    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const templatePath = resolve(__dirname, '../../templates', 'react-hardhat');
        const targetPath = resolve(process.cwd(), projectName);

        await copy(templatePath, targetPath);

        await execa(cmd, args, {cwd: targetPath, stdio: 'pipe'});
        spinner.succeed(chalk.bold('React app created successfully!'));
    } catch (err) {
        spinner.fail('Create failed!');
        console.error(err);
    }
}
