/*
 * Copyright (C) 2018 David Craven and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { EditorManager } from '@theia/editor/lib/browser';
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import { BaseLanguageClientContribution, Workspace, Languages,
         LanguageClientFactory, Range } from '@theia/languages/lib/browser';
import { RACKET_LANGUAGE_ID, RACKET_LANGUAGE_NAME } from '../common';

// racket/colorize-semantic notification
interface IToken {
    kind: string,
    mode: string,
    range: Range
}

interface IRacketColorize {
    uri: string,
    tokens: IToken[]
}

interface IRacketClientState {
    model: monaco.editor.ITextModel | undefined,
    decorations: string[],
    deltaDecorations: monaco.editor.IModelDeltaDecoration[]
}

function getDecorationClassName(ty: string, mode: string) {
    switch (ty) {
        case 'symbol':
            if (mode == 'scribble') {
                return 'mtk4';
            }
            return 'mtk1';
        case 'keyword':
        case 'hash-colon-keyword':
        case 'other':
            return 'mtk12';
        case 'comment':
        case 'sexp-comment':
            return 'mtk7';
        case 'string':
            return 'mtk5';
        case 'constant':
            return 'mtk6';
        case 'parenthesis':
            return 'mtk10';
        case 'error':
            return 'mtk3';
        case 'no-color':
            return 'mtk1';
        case 'text':
            return 'mtk1'
        // drracket check-syntax
        case 'imported':
            return 'mtk8';
        case 'lexically-bound':
            return 'mtk4';
        case 'free':
            return 'mtk1';
        case 'set!d':
            return 'mtk3';
        default:
            console.log(ty);
            return 'mtk1';
    }
}

@injectable()
export class RacketClientContribution extends BaseLanguageClientContribution {

    readonly id = RACKET_LANGUAGE_ID;
    readonly name = RACKET_LANGUAGE_NAME;

    private state: { [key: string]: IRacketClientState } = {};

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory)
        protected readonly languageClientFactory: LanguageClientFactory,
        @inject(EditorManager)
        protected readonly editorManager: EditorManager
    ) {
        super(workspace, languages, languageClientFactory);

        let languageClient = this.languageClient;
        let state = this.state;

        let getState = (uri: string) => {
            if (!(uri in state)) {
                state[uri] = {
                    model: undefined,
                    decorations: [],
                    deltaDecorations: []
                };
            }
            return state[uri];
        };

        let applyDecorations = (uri: string) => {
            let uriState = getState(uri);
            if (typeof uriState.model !== 'undefined') {
                uriState.decorations =
                    uriState.model.deltaDecorations(uriState.decorations,
                                                    uriState.deltaDecorations);
            }
        };

        // Set decorations when colorize notification is received
        languageClient.then(client => {
            return client.onNotification('racket/colorize', (res: IRacketColorize) => {
                const uriState = getState(res.uri);
                uriState.deltaDecorations =
                    res.tokens.map((token: IToken) => {
                        return {
                            range: new monaco.Range(
                                token.range.start.line + 1,
                                token.range.start.character + 1,
                                token.range.end.line + 1,
                                token.range.end.character + 1
                            ),
                            options: {
                                inlineClassName: getDecorationClassName(
                                    token.kind,
                                    token.mode
                                )
                            }
                        };
                    });
                applyDecorations(res.uri);
            });
        });

        editorManager.onCreated((widget) => {
            if (widget.editor.document.languageId !== RACKET_LANGUAGE_ID) {
                return;
            }
            let editor = (widget.editor as MonacoEditor).getControl();

            // Handle colorization
            getState(editor.getModel().uri.toString()).model = editor.getModel();

            // Handle indent line on enter
            editor.onKeyUp((e) => {
                if (e.keyCode == monaco.KeyCode.Enter) {
                    let position = editor.getPosition();
                    let model = editor.getModel();
                    let uri = model.uri.toString();

                    // Set indents when indents notification is received
                    languageClient.then(client => {
                        return client.sendRequest('racket/indent', {
                            textDocument: { uri },
                            line: position.lineNumber - 1
                        }).then(
                            (res) => {
                                let indentation = res as number;
                                let line = model.getLineContent(position.lineNumber);
                                let trimmed = line.trimLeft();
                                let oldIndentation = line.length - trimmed.length;
                                let positionShift = indentation - oldIndentation;
                                let newText = ' '.repeat(indentation)
                                    + line.trimLeft();
                                let newPosition = editor.getPosition();
                                editor.executeEdits('racket/indents', [
                                    {
                                        range: new monaco.Range(
                                            position.lineNumber,
                                            1,
                                            position.lineNumber,
                                            line.length + 1),
                                        text: newText
                                    }
                                ]);
                                if (newPosition.lineNumber == position.lineNumber) {
                                    editor.setPosition({
                                        lineNumber: newPosition.lineNumber,
                                        column: newPosition.column + positionShift,
                                    });
                                }
                            });
                    });
                }
            });
        });
    }

    protected get globPatterns() {
        return ['**/*.rkt', '**/*.scrbl'];
    }
}
