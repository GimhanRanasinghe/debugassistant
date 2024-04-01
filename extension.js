// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "jimmy-debugger" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('jimmy-debugger.helloWorld', function () {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from jimmy-debugger!');
// 	});

// 	context.subscriptions.push(disposable);
// }
let printCounter = 0;

function activate(context) {
	let printCounter = context.workspaceState.get('printCounter') || 0;
    let disposable = vscode.commands.registerCommand('extension.insertPrintStatement', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            const line = editor.document.lineAt(position.line);
            const insertionPosition = new vscode.Position(position.line, line.text.length);
            const languageId = editor.document.languageId;
            let printStatement = `"debugger" - ${printCounter}`;
			printCounter++;
            switch (languageId) {
				case 'javascript':
				case 'typescript':
					printStatement = `\nconsole.log(${printStatement});`;
					break;
				case 'python':
					printStatement = `\nprint(${printStatement})`;
					break;
				case 'java':
					printStatement = `\nSystem.out.println(${printStatement});`;
					break;
				case 'csharp':
					printStatement = `\nConsole.WriteLine(${printStatement});`;
					break;
				case 'cpp':
					printStatement = `\nstd::cout << ${printStatement} << std::endl;`;
					break;
				case 'ruby':
					printStatement = `\nputs ${printStatement}`;
					break;
				// Add cases for other file extensions as needed
				default:
					// Default print statement
					printStatement = `\nconsole.log(${printStatement});`;
			}

            editor.edit(editBuilder => {
                editBuilder.insert(insertionPosition, printStatement);
            });
        }
    });

	let disposableReset = vscode.commands.registerCommand('extension.resetPrintCounter', () => {
        printCounter = 0;
        context.workspaceState.update('printCounter', printCounter);
        vscode.window.showInformationMessage('Print counter has been reset.');
    });

	let disposableDeleteAllPrints = vscode.commands.registerCommand('extension.deleteAllPrintStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const printRegex = /console\.log\("debugger" - \d+\);|print\("debugger" - \d+\)/g;
            let edits = [];
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                const matches = line.text.match(printRegex);
                if (matches) {
                    // Delete the entire line where the print statement is found
                    const lineRange = new vscode.Range(i, 0, i, line.range.end.character);
                    const edit = new vscode.TextEdit(lineRange, '');
                    edits.push(edit);
                }
            }
            editor.edit(editBuilder => {
                edits.forEach(edit => {
                    editBuilder.replace(edit.range, edit.newText);
                });
            });
        }
    });


    context.subscriptions.push(disposable);
	context.subscriptions.push(disposableReset);
	context.subscriptions.push(disposableDeleteAllPrints);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
