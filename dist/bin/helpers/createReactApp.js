import ora from "ora";
import chalk from "chalk";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "url";
import {copy} from "fs-extra";
import {execa} from "execa";
import sleep from "./sleep.js";

export default async function createReactApp({projectName, web3, packageManager}) {
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

    const spinner = ora(`⏳ Creating React app in ${chalk.yellow.bold(resolve(process.cwd(), projectName))}`).start();
    spinner.color = "blue";
    await sleep(2000);

    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        if (web3 === 0 || web3 === 1) {
            const templatePath = resolve(__dirname, '../../templates', `react-hardhat-${web3===0?'eth':'bnb'}`);
            const targetPath = resolve(process.cwd(), projectName);

            await copy(templatePath, targetPath);
            spinner.succeed(chalk.bold("React app copied successfully!"));

            const spinnerBlockchain = ora(`⏳ Installing packages in blockchain folder`).start();
            const blockchainPath = resolve(targetPath, 'blockchain');
            await execa(cmd, args, {cwd: blockchainPath, stdio: 'pipe'});
            spinnerBlockchain.succeed(chalk.green("Installed packages in blockchain folder"));

            const spinnerClient = ora(`⏳ Installing packages in client folder`).start();
            const clientPath = resolve(targetPath, 'client');
            await execa(cmd, args, {cwd: clientPath, stdio: 'pipe'});
            spinnerClient.succeed(chalk.green("Installed packages in client folder"));

            spinner.succeed(chalk.bold("React app created successfully!"));
        }

        if (web3 === 3) {
            const templatePath = resolve(__dirname, '../../templates', `react-xrpl`);
            const targetPath = resolve(process.cwd(), projectName);

            await copy(templatePath, targetPath);
            spinner.succeed(chalk.bold("React app copied successfully!"));

            const spinnerClient = ora(`⏳ Installing packages in xrpl folder`).start();
            await execa(cmd, args, {cwd: targetPath, stdio: 'pipe'});
            spinnerClient.succeed(chalk.green("Installed packages in client folder"));

            spinner.succeed(chalk.bold("React app created successfully!"));
        }
    } catch (err) {
        spinner.fail('Create failed!');
        console.error(err);
    }
}
