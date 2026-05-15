#!/usr/bin/env node

import fs from "node:fs";
import { analyzeDoubleTextRisk, formatReport } from "../src/index.js";

function printHelp() {
  console.log(`double-text-risk

Usage:
  double-text-risk --hours 30 "Just checking if you saw this."
  cat followup.txt | double-text-risk --hours 18 --followups 1
  double-text-risk --file followup.txt --hours 54
  double-text-risk --json --hours 90 --followups 1 "Happy to leave this here if now is bad timing."
`);
}

function parseArgs(argv) {
  const args = [...argv];
  let json = false;
  let file = null;
  let hours = 24;
  let followups = 0;
  const textParts = [];

  while (args.length) {
    const arg = args.shift();
    if (arg === "--help" || arg === "-h") {
      return { help: true };
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--file") {
      file = args.shift();
      continue;
    }
    if (arg === "--hours") {
      hours = Number(args.shift());
      continue;
    }
    if (arg === "--followups") {
      followups = Number(args.shift());
      continue;
    }
    textParts.push(arg);
  }

  return {
    help: false,
    json,
    file,
    hours,
    followups,
    text: textParts.join(" ").trim()
  };
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data.trim()));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  let input = options.text;
  if (options.file) {
    input = fs.readFileSync(options.file, "utf8").trim();
  }
  if (!input) {
    input = await readStdin();
  }
  if (!input) {
    printHelp();
    process.exit(1);
  }

  const result = analyzeDoubleTextRisk(input, {
    hoursSinceLastOutbound: options.hours,
    followUpCount: options.followups
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(formatReport(result));
}

main().catch((error) => {
  console.error(`double-text-risk: ${error.message}`);
  process.exit(1);
});
