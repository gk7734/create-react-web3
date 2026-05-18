import ora from "ora";
import chalk from "chalk";
import boxen from "boxen";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "fs-extra";
import { execa } from "execa";
import { EXAMPLE_NONE } from "./createReactApp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Maps the `web3` answer from promptUser to a bundled Next.js template, the
 * sub-folders that need a dependency install after copying, and the minimal
 * page component used for a "smart fresh" (no example) project.
 *
 * `freshApp` is resolved against `templates/_fresh`; `appFile` is the
 * destination, relative to the generated project root.
 */
const TEMPLATES = {
    0: { name: "next-hardhat-eth", installDirs: ["blockchain", "client"], appFile: "client/src/app/page.tsx", freshApp: "next-evm/page.tsx" },
    1: { name: "next-hardhat-bnb", installDirs: ["blockchain", "client"], appFile: "client/src/app/page.tsx", freshApp: "next-evm/page.tsx" },
    3: { name: "next-xrpl", installDirs: ["."], appFile: "src/app/page.tsx", freshApp: "next-xrpl/page.tsx" },
};

function getPackageManagerCommand(packageManager) {
    switch (packageManager) {
        case "yarn":
            return { cmd: "yarn", args: [] };
        case "pnpm":
            return { cmd: "pnpm", args: ["install"] };
        case "npm":
        default:
            return { cmd: "npm", args: ["install"] };
    }
}

function getDevCommand(packageManager) {
    switch (packageManager) {
        case "yarn":
            return "yarn dev";
        case "pnpm":
            return "pnpm dev";
        case "npm":
        default:
            return "npm run dev";
    }
}

/** Prints the boxed "next steps" guide tailored to the chosen template. */
function printNextSteps({ projectName, template, packageManager }) {
    const dev = getDevCommand(packageManager);
    const lines = [
        chalk.bold("Get started"),
        "",
        `  ${chalk.cyan("cd")} ${projectName}`,
    ];

    if (template.installDirs.includes("blockchain")) {
        lines.push(
            "",
            chalk.bold.magenta("Blockchain"),
            `  ${chalk.cyan("cd blockchain")}`,
            `  ${chalk.cyan("npx hardhat compile")}`,
            "",
            chalk.bold.magenta("Frontend"),
            `  ${chalk.cyan("cd client")}`,
            `  ${chalk.cyan(dev)}`,
        );
    } else {
        lines.push("", `  ${chalk.cyan(dev)}`);
    }

    console.log(boxen(lines.join("\n"), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: "round",
        borderColor: "magenta",
        title: "Next steps",
        titleAlignment: "center",
    }));
}

export default async function createNextApp({ projectName, web3, example, packageManager }) {
    // Solana (web3 === 2) has no template yet — fail loudly instead of
    // silently doing nothing and reporting success.
    if (web3 === 2) {
        console.log(chalk.yellow.bold("\n⚠️ The Solana template is not available yet. Please choose another platform."));
        process.exit(0);
    }

    const template = TEMPLATES[web3];
    if (!template) {
        throw new Error(`Unsupported Web3 platform selected (web3=${web3}).`);
    }

    const { cmd, args } = getPackageManagerCommand(packageManager);
    const targetPath = resolve(process.cwd(), projectName);
    const templatePath = resolve(__dirname, "../../templates", template.name);

    const totalSteps = 1 + template.installDirs.length;
    let step = 0;
    const tag = () => chalk.dim(`[${++step}/${totalSteps}]`);

    console.log(chalk.bold(`\n📦 Creating your Next.js app in ${chalk.yellow(targetPath)}\n`));

    let activeSpinner = null;
    try {
        // Step 1 — copy the template (and swap in the fresh page if requested).
        activeSpinner = ora({ text: `${tag()} Copying template files`, color: "cyan" }).start();
        await copy(templatePath, targetPath);
        if (example === EXAMPLE_NONE) {
            const freshAppPath = resolve(__dirname, "../../templates/_fresh", template.freshApp);
            await copy(freshAppPath, resolve(targetPath, template.appFile));
            activeSpinner.succeed(chalk.green("Template files copied ") + chalk.dim("(smart fresh — example removed)"));
        } else {
            activeSpinner.succeed(chalk.green("Template files copied"));
        }
        activeSpinner = null;

        // Steps 2..N — install dependencies in each sub-folder.
        for (const dir of template.installDirs) {
            const label = dir === "." ? "project" : `${dir} folder`;
            activeSpinner = ora({ text: `${tag()} Installing packages — ${label}`, color: "cyan" }).start();
            await execa(cmd, args, { cwd: resolve(targetPath, dir), stdio: "pipe" });
            activeSpinner.succeed(chalk.green(`Installed packages — ${label}`));
            activeSpinner = null;
        }

        console.log("\n" + chalk.green.bold("✔ Next.js app created successfully!"));
        printNextSteps({ projectName, template, packageManager });
    } catch (err) {
        if (activeSpinner) activeSpinner.fail(chalk.red("Create failed!"));
        throw err;
    }
}
