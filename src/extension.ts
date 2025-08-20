import * as vscode from 'vscode';


const outputChannel = vscode.window.createOutputChannel('Tree View Issues');

const data: { [key: string]: string[] } = {
	'Fruit': ['Apple', 'Banana', 'Grape'],
	'Animal': ['Dog', 'Cat', 'Bird'],
	'Planet': ['Earth', 'Mars', 'Venus']
};

export function activate(context: vscode.ExtensionContext) {
	const treeView = vscode.window.createTreeView('treeviewissues', {
		treeDataProvider: new StringTreeDataProvider(),
		canSelectMany: true
	});
	treeView.onDidChangeSelection(event => {
		outputChannel.appendLine(`Selection changed. Size=${event.selection.length}`);
		outputChannel.show(true);
		vscode.commands.executeCommand('setContext', 'treeviewissues.selectedTreeItemCount', event.selection.length);
	});
	context.subscriptions.push(treeView);

	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandThatDoesNotRequireASelectedString', (focusedString) => {
		outputChannel.appendLine(`Hello from "Command That Does Not Require A Selected String". focusedString=${focusedString}`);
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandThatRequiresAtLeastOneSelectedString', (focusedString) => {
		outputChannel.appendLine(`Hello from "Command That Requires At Least One Selected String". focusedString=${focusedString}`);
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandThatRequiresExactlyOneSelectedString', (focusedString) => {
		outputChannel.appendLine(`Hello from "Command That Requires Exactly One Selected String". focusedString=${focusedString}`);
		outputChannel.show(true);
	}));
}

export function deactivate() {}


class StringTreeDataProvider implements vscode.TreeDataProvider<string> {

	getChildren(element?: string): vscode.ProviderResult<string[]> {
		if (element) {
			return data[element];
		}
		else {
			return Object.keys(data);
		}
	}

	getTreeItem(element: string): vscode.TreeItem {
		const treeItem = new vscode.TreeItem(element);

		if (Object.hasOwn(data, element)) {
			treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		}
		else {
			treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
		}

		return treeItem;
	}

}
