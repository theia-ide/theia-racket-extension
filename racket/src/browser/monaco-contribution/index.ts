/*
 * Copyright (C) 2018 David Craven and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { RACKET_LANGUAGE_ID, RACKET_LANGUAGE_NAME } from '../../common';
import { configuration, monarchLanguage } from './racket-monaco-language';

monaco.languages.register({
    id: RACKET_LANGUAGE_ID,
    extensions: ['.rkt', '.scrbl'],
    aliases: [RACKET_LANGUAGE_NAME, 'racket'],
    mimetypes: ['text/x-racket-source', 'text/x-racket'],
});

monaco.languages.onLanguage(RACKET_LANGUAGE_ID, () => {
    monaco.languages.setLanguageConfiguration(RACKET_LANGUAGE_ID, configuration);
    monaco.languages.setMonarchTokensProvider(RACKET_LANGUAGE_ID, monarchLanguage);
});
