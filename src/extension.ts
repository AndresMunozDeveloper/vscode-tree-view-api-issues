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
		vscode.commands.executeCommand('setContext', 'treeviewissues.selectedTreeItemCount', event.selection.length);
	});
	context.subscriptions.push(treeView);

	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandForMultipleTreeItems', () => {
		outputChannel.appendLine('Hello from Command for multiple tree items');
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandForASingleTreeItem', () => {
		outputChannel.appendLine('Hello from Command for a single tree item');
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
