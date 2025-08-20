import * as vscode from 'vscode';
import { EventEmitter } from 'vscode';


const outputChannel = vscode.window.createOutputChannel('Tree View Issues');

class Node {
	readonly name: string;
	isCollapsed: boolean;
	readonly nodes: Node[] = [];

	constructor(name: string, isCollapsed: boolean, nodes: readonly Node[]) {
		this.name = name;
		this.isCollapsed = isCollapsed;
		this.nodes.push(...nodes);
	}

	toString(): string {
		return `Node{name="${this.name}", isCollapsed=${this.isCollapsed}, nodes=${this.nodes.length}}`;
	}
}

const rootNodes: readonly Node[] = [
	new Node('Fruit', true, [
		new Node('Apple', true, []),
		new Node('Banana', true, []),
		new Node('Grape', true, []),
	]),
	new Node('Animal', true, [
		new Node('Dog', true, []),
		new Node('Cat', true, []),
		new Node('Bird', true, [])
	]),
	new Node('Planet', true, [
		new Node('Earth', true, []),
		new Node('Mars', true, []),
		new Node('Venus', true, []),
	])
];

export function activate(context: vscode.ExtensionContext) {
	const nodeTreeDataProvider = new NodeTreeDataProvider();
	const treeView = vscode.window.createTreeView('treeviewissues', {
		treeDataProvider: nodeTreeDataProvider,
		canSelectMany: true,
	});
	treeView.onDidChangeSelection(event => {
		outputChannel.appendLine(`Selection changed. Size=${event.selection.length}`);
		outputChannel.show(true);
		vscode.commands.executeCommand('setContext', 'treeviewissues.selectedNodeCount', event.selection.length);
	});
	context.subscriptions.push(treeView);

	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandForAnyNumberOfSelectedNodes', (focusedNode) => {
		outputChannel.appendLine(`Hello from "Command For Any Number Of Selected Nodes". focusedNode=${focusedNode}`);
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandForExactlyOneSelectedNode', (focusedNode) => {
		outputChannel.appendLine(`Hello from "Command For Exactly One Selected Node". focusedNode=${focusedNode}`);
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.commandForOneOrMoreSelectedNodes', (focusedNode) => {
		outputChannel.appendLine(`Hello from "Command For One Or More Selected Nodes". focusedNode=${focusedNode}`);
		outputChannel.show(true);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.collapseAllNodes', () => {
		rootNodes.forEach(n => n.isCollapsed = true);
		rootNodes.flatMap(n => n.nodes).forEach(n => n.isCollapsed = true);
		nodeTreeDataProvider.refresh(null);

		outputChannel.appendLine('Collapsed all nodes?');
		outputChannel.show(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('treeviewissues.expandAllNodes', () => {
		rootNodes.forEach(n => n.isCollapsed = false);
		rootNodes.flatMap(n => n.nodes).forEach(n => n.isCollapsed = false);
		nodeTreeDataProvider.refresh(null);

		outputChannel.appendLine('Expanded all nodes?');
		outputChannel.show(true);
	}));
}

class NodeTreeDataProvider implements vscode.TreeDataProvider<Node> {

	private readonly eventEmitter = new EventEmitter<Node|null>();

	onDidChangeTreeData = this.eventEmitter.event;

	refresh(node: Node|null) {
		this.eventEmitter.fire(node);
	}

	getChildren(element?: Node): vscode.ProviderResult<Node[]> {
		if (element) {
			return element.nodes;
		}
		else {
			return [...rootNodes];
		}
	}

	getTreeItem(element: Node): vscode.TreeItem {
		const treeItem = new vscode.TreeItem(element.name);

		if (element.nodes.length >= 1) {
			treeItem.collapsibleState = element.isCollapsed ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.Expanded;
		}
		else {
			treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
		}

		return treeItem;
	}

}
