#!/usr/bin/env node
const exec = require("child_process").exec;

const promisifyExec = cmd => {
  console.log(cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
};

const main = async () => {
  const deploySettings = JSON.parse(
    await promisifyExec(`netlify deploy --json`)
  );
  const { deploy_url } = deploySettings;

  console.log("Deploy URL:", deploy_url);

  console.log(
    await promisifyExec(`cypress run --config baseUrl='${deploy_url}'`)
  );
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});