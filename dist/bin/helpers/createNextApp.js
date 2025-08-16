import ora from "ora";
import chalk from "chalk";
import { resolve } from "node:path";
import { execa } from "execa";

export default async function createNextApp({
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
                                    }) {
    const args = [];

    // 프로젝트 폴더명 (필수)
    if (projectName) args.push(projectName);

    // 타입스크립트 / 자바스크립트 옵션
    if (useTypeScript) args.push("--ts");
    else args.push("--js");

    if (useESLint) args.push("--eslint");
    if (useTailwind) args.push("--tailwind");
    if (useSrcDirectory) args.push("--src-dir");
    if (useAppRouter) args.push("--app");
    if (useTurbopack) args.push("--turbopack");

    // import alias 옵션 (값 필요)
    if (useImportAlias && useImportAliasValue) {
        args.push("--import-alias", useImportAliasValue);
    }

    args.push("--yes");

    // 패키지 매니저별 실행 커맨드 분기
    let cmd, cmdArgs;
    switch (packageManager) {
        case "npm":
            cmd = "npx";
            cmdArgs = ["create-next-app@latest", ...args];
            break;
        case "yarn":
            cmd = "yarn";
            cmdArgs = ["create", "next-app", ...args];
            break;
        case "pnpm":
            cmd = "pnpm";
            cmdArgs = ["dlx", "create-next-app", ...args];
            break;
        default:
            // 기본값 npm
            cmd = "npx";
            cmdArgs = ["create-next-app@latest", ...args];
    }

    const spinner = ora(
        `Creating Next app in ${chalk.yellow.bold(resolve(process.cwd(), projectName))}`
    ).start();
    spinner.color = "blue";

    try {
        await execa(cmd, cmdArgs, { stdio: "pipe" });
        spinner.succeed("Next.js app created successfully!");
    } catch (err) {
        spinner.fail("Create failed!");
        console.error(err);
    }
}
