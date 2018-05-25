/*
 * Copyright (C) 2018 David Craven and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable } from 'inversify';
import { BaseLanguageServerContribution,
         IConnection } from '@theia/languages/lib/node';
import { RACKET_LANGUAGE_ID, RACKET_LANGUAGE_NAME } from '../common';

@injectable()
export class RacketContribution extends BaseLanguageServerContribution {

    readonly id = RACKET_LANGUAGE_ID;
    readonly name = RACKET_LANGUAGE_NAME;

    start(clientConnection: IConnection): void {
        const command = 'racket-language-server';
        const serverConnection =
            this.createProcessStreamConnection(command, []);
        this.forward(clientConnection, serverConnection);
    }

    protected onDidFailSpawnProcess(error: Error): void {
        super.onDidFailSpawnProcess(error);
        const message =
            'Error starting racket language server.\n' +
            'Please make sure it is installed on your system.\n' +
            'Use the following command:\n' +
            '> raco pkg install racket-language-server\n';
        console.error(message);
    }
}
