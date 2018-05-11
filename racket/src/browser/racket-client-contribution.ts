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
         LanguageClientFactory,
         TextEdit, Position } from '@theia/languages/lib/browser';
import { RACKET_LANGUAGE_ID, RACKET_LANGUAGE_NAME } from '../common';

@injectable()
export class RacketClientContribution extends BaseLanguageClientContribution {

    readonly id = RACKET_LANGUAGE_ID;
    readonly name = RACKET_LANGUAGE_NAME;

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

        editorManager.onCreated((widget) => {
            if (widget.editor.document.languageId !== RACKET_LANGUAGE_ID) {
                return;
            }
            let editor = (widget.editor as MonacoEditor).getControl();
            editor.onKeyUp((e) => {
                if (e.keyCode == monaco.KeyCode.Enter) {
                    return languageClient.then(client => {
                        return client.sendRequest('racket/indentLine', {
                            textDocument: {
                                uri: editor.getModel().uri.toString()
                            },
                            line: editor.getPosition().lineNumber - 1
                        }).then(
                            (res) => {
                                let {edit, cursor} = res as {
                                    edit: TextEdit,
                                    cursor: Position
                                };
                                editor.executeEdits('racket/indentLine', [
                                    {
                                        range: new monaco.Range(
                                            edit.range.start.line + 1,
                                            edit.range.start.character + 1,
                                            edit.range.end.line + 1,
                                            edit.range.end.character + 1),
                                        text: edit.newText
                                    }
                                ]);
                                editor.setPosition({
                                    lineNumber: cursor.line + 1,
                                    column: cursor.character + 1
                                });
                            },
                            (error) => {
                                console.error(error);
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
