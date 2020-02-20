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

import { browser } from 'protractor';
import { LoginPage, StringUtil, UploadActions, ViewerPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { MonacoExtensionPage } from '../../pages/adf/demo-shell/monaco-extension.page';
import CONSTANTS = require('../../util/constants');
import { FileModel } from '../../models/ACS/file.model';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let site;
    const acsUser = new AcsUserModel();
    const monacoExtensionPage = new MonacoExtensionPage();

    let jsFileUploaded;
    const jsFileInfo = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.JS.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.JS.file_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: acsUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        jsFileUploaded = await uploadActions.uploadFile(jsFileInfo.location, jsFileInfo.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        await uploadActions.deleteFileOrFolder(jsFileUploaded.entry.id);
    });

    describe('Viewer extension', () => {

        it('[C297698] Should be able to add an extension for code editor viewer', async () => {
            await navigationBarPage.clickAboutButton();

            await monacoExtensionPage.checkMonacoPluginIsDisplayed();

            await navigationBarPage.clickContentServicesButton();

            await contentServicesPage.waitForTableBody();
            await contentServicesPage.checkContentIsDisplayed(jsFileInfo.name);
            await contentServicesPage.doubleClickRow(jsFileInfo.name);

            await viewerPage.checkCodeViewerIsDisplayed();
        });
    });
});
