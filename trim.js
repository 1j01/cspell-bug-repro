// Load cspell.json and remove words iteratively, to simplify the bug repro case.
// Usage: node trim.js

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const cspellJson = require('./cspell.json');

const BUG_TEST_COMMAND = "cspell-cli lint ."
const BUG_OUTPUT = "TypeError";
const COMMIT_COMMAND = 'git add cspell.json && git commit -m "Simplify bug repro case"';
const COMMIT_INTERVAL = 1000 * 60;
const RANDOM = false;

let lastOutput = null;
function bugTest() {
	const output = child_process.spawnSync(BUG_TEST_COMMAND, { encoding: 'utf8', shell: true });
	lastOutput = output;
	return output.stdout.includes(BUG_OUTPUT);
}

let lastCommitTime = 0;
function saveJson(best) {
	const json = JSON.stringify(cspellJson, null, "\t");
	const filename = best ? 'cspell.best-so-far.json' : 'cspell.json';
	fs.writeFileSync(path.join(__dirname, filename), json);
	if (best && Date.now() - lastCommitTime > COMMIT_INTERVAL) {
		lastCommitTime = Date.now();
		child_process.execSync(COMMIT_COMMAND, { encoding: 'utf8' });
	}
}

let index = -1;
let maybeDone = false;
function trim() {
	const words = cspellJson.words;
	const originalWords = words.slice();
	if (RANDOM) {
		index = Math.floor(Math.random() * words.length);
	} else {
		index -= 1;
		if (index < 0) {
			if (maybeDone) {
				console.log('Word list minimized. There may be a smaller repro, but removing any one word does not reproduce the bug.');
				process.exit(0);
			}
			index = words.length - 1;
			maybeDone = true;
		}
	}
	words.splice(index, 1);
	saveJson();
	if (bugTest()) {
		maybeDone = false;
		console.log('Bug reproduced without word:', originalWords[index]);
		// Avoids losing the best-so-far version if the script is interrupted
		// while testing removing a word, when it doesn't reproduce the bug without it.
		// Still have to manually copy cspell.best-so-far.json to cspell.json
		saveJson(true);
	} else {
		console.log('Bug not reproduced without word:', originalWords[index]);
		words.splice(index, 0, originalWords[index]);
		saveJson();
	}
}

async function iterativelyTrim() {
	while (true) {
		trim();
		await new Promise(resolve => setTimeout(resolve, 10));
	}
}

if (bugTest()) {
	console.log('Bug reproduced initially');
} else {
	console.error('Bug not reproduced initially.\n\nstderr:\n', lastOutput.stderr, '\n\nstdout:\n', lastOutput.stdout);
	process.exit(1);
}
iterativelyTrim();