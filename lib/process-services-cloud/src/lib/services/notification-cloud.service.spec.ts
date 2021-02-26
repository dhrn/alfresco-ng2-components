/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed, async } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationCloudService } from './notification-cloud.service';
import { Apollo } from 'apollo-angular';

describe('NotificationCloudService', () => {
    let service: NotificationCloudService;
    let apollo: Apollo;
    let apolloCreateSpy;
    let apolloSubscribeSpy;
    const useMock = {
        subscribe() {}
    };

    const queryMock = `
        subscription {
            engineEvents(eventType: [
                MY_EVENT
            ]) {
                eventType
                entity
            }
        }
    `;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(async(() => {
        service = TestBed.inject(NotificationCloudService);
        apollo = TestBed.inject(Apollo);

        service.appsListening = [];
        apolloCreateSpy = spyOn(apollo, 'createNamed');
        apolloSubscribeSpy = spyOn(apollo, 'use').and.returnValue(useMock);
    }));

    it('should not create more than one websocket per app if it was already created', () => {
        service.makeGQLQuery('myAppName', queryMock);
        expect(service.appsListening.length).toBe(1);
        expect(service.appsListening[0]).toBe('myAppName');

        service.makeGQLQuery('myAppName', queryMock);
        expect(service.appsListening.length).toBe(1);
        expect(service.appsListening[0]).toBe('myAppName');

        expect(apolloCreateSpy).toHaveBeenCalledTimes(1);
        expect(apolloSubscribeSpy).toHaveBeenCalledTimes(2);
    });

    it('should create new websocket if it is subscribing to new app', () => {
        service.makeGQLQuery('myAppName', queryMock);
        expect(service.appsListening.length).toBe(1);
        expect(service.appsListening[0]).toBe('myAppName');

        service.makeGQLQuery('myOtherAppName', queryMock);
        expect(service.appsListening.length).toBe(2);
        expect(service.appsListening[1]).toBe('myOtherAppName');

        expect(apolloCreateSpy).toHaveBeenCalledTimes(2);
        expect(apolloSubscribeSpy).toHaveBeenCalledTimes(2);
    });
});
