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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-demo-error',
    styleUrls: ['./demo-error.component.scss'],
    templateUrl: './demo-error.component.html'
})
export class DemoErrorComponent implements OnInit {

    errorCode: string = '';

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.errorCode = params['id'];
                }
            });
        }
    }

    onReportIssue() {
        this.router.navigate(['/report-issue']);
    }

    onReturnButton() {
        this.router.navigate(['/']);
    }

}
