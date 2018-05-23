/*
 * Copyright (C) 2018 David Craven and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export const configuration: monaco.languages.LanguageConfiguration = {
    wordPattern: /(?:(?:;(?:.)*|[\s\+\*\(\)\[\]]|"(?:(?:\\"|[^"]))*"))+/g,
    brackets: [['(', ')'], ['{', '}'], ['[', ']']],
    autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '\"', close: '\"', notIn: ['string'] }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
    ],
    indentationRules: {
        // Never match
        decreaseIndentPattern: /.^/,
        increaseIndentPattern: /.^/
    },
    onEnterRules: [
        {
            // Always match
            beforeText: /[^]?/,
            action: {
                indentAction: monaco.languages.IndentAction.None,
                appendText: ''
            },
        }
    ]
};

export const monarchLanguage = <monaco.languages.IMonarchLanguage>{
    defaultToken: '',
    tokenPostfix: '.racket',

    tokenizer: {}
};
