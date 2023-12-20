/**
 *  Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as AWS from 'aws-sdk';
import * as emailValidator from 'email-validator';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import { throttlingBackOff } from '@aws-accelerator/utils';

import * as t from './common-types';
import { OrganizationConfig } from './organization-config';
import { DeploymentTargets } from './common-types';

/**
 * Accounts configuration items.
 */
export class AccountsConfigTypes {
  static readonly accountConfig = t.interface({
    name: t.nonEmptyString,
    description: t.optional(t.nonEmptyString),
    email: t.nonEmptyString,
    organizationalUnit: t.optional(t.nonEmptyString),
  });

  static readonly govCloudAccountConfig = t.interface({
    name: t.nonEmptyString,
    description: t.optional(t.nonEmptyString),
    email: t.nonEmptyString,
    organizationalUnit: t.optional(t.nonEmptyString),
    enableGovCloud: t.optional(t.boolean),
  });

  static readonly accountIdConfig = t.interface({
    email: t.nonEmptyString,
    accountId: t.nonEmptyString,
  });

  static readonly accountsConfig = t.interface({
    mandatoryAccounts: t.array(t.union([this.accountConfig, this.govCloudAccountConfig])),
    workloadAccounts: t.array(t.union([this.accountConfig, this.govCloudAccountConfig])),
    accountIds: t.optional(t.array(this.accountIdConfig)),
  });
}

export class AccountIdConfig implements t.TypeOf<typeof AccountsConfigTypes.accountIdConfig> {
  readonly email: string = '';
  readonly accountId: string = '';
}

/**
 * {@link AccountsConfig} / {@link AccountConfig}
 *
 * Account configuration
 *
 * @example
 * ```
 * - name: Workload01
 *   description: Workload account 01
 *   email: example-email+workload01@example.com
 *   organizationalUnit: Workloads
 * ```
 */
export class AccountConfig implements t.TypeOf<typeof AccountsConfigTypes.accountConfig> {
  /**
   * The friendly name that is assigned to the account for reference within the Accelerator. The name will be used to reference
   * this account in other configuration files and not to lookup the account in AWS.
   *
   * For pre-existing accounts this does not need to match the AWS account name.
   *
   * When creating new accounts with the Accelerator, this name will be used as the AWS account name.
   *
   * The name should not contain any spaces as this isn't supported by the Accelerator.
   */
  readonly name: string = '';
  /**
   * The description is to used to provide more information about the account.
   * This value is not used when creating accounts.
   */
  readonly description: string = '';
  /**
   * The email address of the owner to assign to the account. The email address
   * must not already be associated with another AWS account. You must use a
   * valid email address.
   * The address must be a minimum of 6 and a maximum of 64 characters long.
   * All characters must be 7-bit ASCII characters
   * There must be one and only one @ symbol, which separates the local name from the domain name.
   * The local name can’t contain any of the following characters: whitespace, ” ‘ ( ) < > [ ] : ; , | % &
   * The local name can’t begin with a dot (.)
   * The domain name can consist of only the characters [a-z],[A-Z],[0-9], hyphen (-), or dot (.)
   * The domain name can’t begin or end with a hyphen (-) or dot (.)
   * The domain name must contain at least one dot
   */
  readonly email: string = '';
  /**
   * The friendly name for the Organizational Unit that this account
   * is a member of.
   * This Organizational Unit must exist in the organization-config.yaml file.
   */
  readonly organizationalUnit: string = '';
}

/**
 * *{@link AccountsConfig} / {@link GovCloudAccountConfig}
 *
 * GovCloud Account configuration
 * Used instead of the account configuration in the commercial
 * partition when creating GovCloud partition linked accounts.
 *
 * ```
 * - name: Workload01
 *   description: Workload account 01
 *   email: example-email+workload01@example.com
 *   organizationalUnit: Workloads
 *   enableGovCloud: true
 * ```
 */
export class GovCloudAccountConfig implements t.TypeOf<typeof AccountsConfigTypes.govCloudAccountConfig> {
  /**
   * The friendly name that is assigned to the account for reference within the Accelerator. The name will be used to reference
   * this account in other configuration files and not to lookup the account in AWS.
   *
   * For pre-existing accounts this does not need to match the AWS account name.
   *
   * When creating new accounts with the Accelerator, this name will be used as the AWS account name.
   *
   * The name should not contain any spaces as this isn't supported by the Accelerator.
   */
  readonly name: string = '';
  /**
   * The description is to used to provide more information about the account.
   * This value is not used when creating accounts.
   */
  readonly description: string = '';
  /**
   * The email address of the owner to assign to the account. The email address
   * must not already be associated with another AWS account. You must use a
   * valid email address.
   * The address must be a minimum of 6 and a maximum of 64 characters long.
   * All characters must be 7-bit ASCII characters
   * There must be one and only one @ symbol, which separates the local name from the domain name.
   * The local name can’t contain any of the following characters: whitespace, ” ‘ ( ) < > [ ] : ; , | % &
   * The local name can’t begin with a dot (.)
   * The domain name can consist of only the characters [a-z],[A-Z],[0-9], hyphen (-), or dot (.)
   * The domain name can’t begin or end with a hyphen (-) or dot (.)
   * The domain name must contain at least one dot
   */
  readonly email: string = '';
  /**
   * The friendly name for the Organizational Unit that this account
   * is a member of.
   * This Organizational Unit must exist in the organization-config.yaml file.
   */
  readonly organizationalUnit: string = '';
  /**
   * Indicates whether or not a GovCloud partition account
   * should be created.
   */
  readonly enableGovCloud: boolean | undefined = undefined;
}
/**
 *
 */
export class AccountsConfig implements t.TypeOf<typeof AccountsConfigTypes.accountsConfig> {
  static readonly FILENAME = 'accounts-config.yaml';
  static readonly MANAGEMENT_ACCOUNT = 'Management';
  static readonly LOG_ARCHIVE_ACCOUNT = 'LogArchive';
  static readonly AUDIT_ACCOUNT = 'Audit';

  readonly mandatoryAccounts: AccountConfig[] | GovCloudAccountConfig[] = [];

  readonly workloadAccounts: AccountConfig[] | GovCloudAccountConfig[] = [];

  public isGovCloudAccount(account: AccountConfig | GovCloudAccountConfig) {
    return AccountsConfigTypes.govCloudAccountConfig.is(account);
  }

  public anyGovCloudAccounts(): boolean {
    for (const account of this.workloadAccounts) {
      if (this.isGovCloudAccount(account)) {
        return true;
      }
    }
    return false;
  }

  public isGovCloudEnabled(account: AccountConfig | GovCloudAccountConfig) {
    if (AccountsConfigTypes.govCloudAccountConfig.is(account)) {
      return account.enableGovCloud;
    }
    return false;
  }

  /**
   * Optionally provide a list of AWS Account IDs to bypass the usage of the
   * AWS Organizations Client lookup. This is not a readonly member since we
   * will initialize it with values if it is not provided
   */
  public accountIds: AccountIdConfig[] | undefined = undefined;

  /**
   *
   * @param props
   * @param values
   * @param validateConfig
   */
  constructor(
    props: { managementAccountEmail: string; logArchiveAccountEmail: string; auditAccountEmail: string },
    values?: t.TypeOf<typeof AccountsConfigTypes.accountsConfig>,
    configDir?: string,
    validateConfig?: boolean,
  ) {
    const errors: string[] = [];
    const ouIdNames: string[] = ['Root'];

    if (values) {
      if (configDir && validateConfig) {
        //
        // Get list of OU ID names from organization config file
        this.getOuIdNames(configDir, ouIdNames);

        //
        // Validate OU name for account
        this.validateAccountOrganizationalUnit(values, ouIdNames, errors);

        //
        // Verify mandatory account names did not change
        //
        this.validateMandatoryAccountNames(values, errors);

        //
        // Verify account names are unique and name without space
        this.validateAccountNames(values, errors);

        //
        // Email validation
        //
        this.validateEmails(values, errors);
      }

      Object.assign(this, values);
    } else {
      this.mandatoryAccounts = [
        {
          name: AccountsConfig.MANAGEMENT_ACCOUNT,
          description:
            'The management (primary) account. Do not change the name field for this mandatory account. Note, the account name key does not need to match the AWS account name.',
          email: props.managementAccountEmail,
          organizationalUnit: 'Root',
        },
        {
          name: AccountsConfig.LOG_ARCHIVE_ACCOUNT,
          description:
            'The log archive account. Do not change the name field for this mandatory account. Note, the account name key does not need to match the AWS account name.',
          email: props.logArchiveAccountEmail,
          organizationalUnit: 'Security',
        },
        {
          name: AccountsConfig.AUDIT_ACCOUNT,
          description:
            'The security audit account (also referred to as the audit account). Do not change the name field for this mandatory account. Note, the account name key does not need to match the AWS account name.',
          email: props.auditAccountEmail,
          organizationalUnit: 'Security',
        },
      ];
    }

    if (errors.length) {
      throw new Error(`${AccountsConfig.FILENAME} has ${errors.length} issues: ${errors.join(' ')}`);
    }
  }

  /**
   * Function to validate email formats, default and duplicate email checks
   * @param values
   */
  private validateEmails(values: t.TypeOf<typeof AccountsConfigTypes.accountsConfig>, errors: string[]) {
    const emails = [...values.mandatoryAccounts, ...values.workloadAccounts].map(item => item.email);
    const defaultEmails = ['management-account@example.com', 'log-archive@example.com', 'audit@example.com'];

    //
    // validate email format
    //
    emails.forEach(item => {
      if (!emailValidator.validate(item)) {
        errors.push(`Invalid email ${item}.`);
      }
    });

    //
    // default email check
    //
    defaultEmails.forEach(item => {
      if (emails.indexOf(item) !== -1) {
        errors.push(`Default email (${item}) found.`);
      }
    });

    if (new Set(emails).size !== emails.length) {
      errors.push(`Duplicate emails defined [${emails}].`);
    }
  }

  /**
   * Function to verify account names are unique and name without space
   * @param values
   */
  private validateAccountNames(values: t.TypeOf<typeof AccountsConfigTypes.accountsConfig>, errors: string[]) {
    const accountNames = [...values.mandatoryAccounts, ...values.workloadAccounts].map(item => item.name);
    if (new Set(accountNames).size !== accountNames.length) {
      errors.push(`Duplicate account names defined [${accountNames}].`);
    }

    for (const account of [...values.mandatoryAccounts, ...values.workloadAccounts]) {
      if (account.name.indexOf(' ') > 0) {
        errors.push(`Account name (${account.name}) found with spaces. Please remove spaces and retry the pipeline.`);
      }
    }
  }

  /**
   * Function to verify mandatory account names did not change
   * @param values
   */
  private validateMandatoryAccountNames(values: t.TypeOf<typeof AccountsConfigTypes.accountsConfig>, errors: string[]) {
    for (const accountName of [
      AccountsConfig.MANAGEMENT_ACCOUNT,
      AccountsConfig.AUDIT_ACCOUNT,
      AccountsConfig.LOG_ARCHIVE_ACCOUNT,
    ]) {
      if (!values.mandatoryAccounts.find(item => item.name === accountName)) {
        errors.push(`Unable to find mandatory account with name ${accountName}.`);
      }
    }
  }

  /**
   * Function to validate existence of account deployment target OUs
   * Make sure deployment target OUs are part of Organization config file
   * @param values
   */
  private validateAccountOrganizationalUnit(
    values: t.TypeOf<typeof AccountsConfigTypes.accountsConfig>,
    ouIdNames: string[],
    errors: string[],
  ) {
    for (const account of [...values.mandatoryAccounts, ...values.workloadAccounts] ?? []) {
      if (account.organizationalUnit) {
        if (ouIdNames.indexOf(account.organizationalUnit) === -1) {
          errors.push(
            `Deployment target OU ${account.organizationalUnit} for account ${account.name} not exists in organization-config.yaml file.`,
          );
        }
      }
    }
  }

  /**
   * Prepare list of OU ids from organization config file
   * @param configDir
   */
  private getOuIdNames(configDir: string, ouIdNames: string[]) {
    for (const organizationalUnit of OrganizationConfig.load(configDir).organizationalUnits) {
      ouIdNames.push(organizationalUnit.name);
    }
  }

  // Helper function to add an account id to the list
  private _addAccountId(ids: string[], accountId: string) {
    if (!ids.includes(accountId)) {
      ids.push(accountId);
    }
  }

  /**
   *
   * @param dir
   * @param validateConfig
   * @returns
   */
  static load(dir: string, validateConfig?: boolean): AccountsConfig {
    const buffer = fs.readFileSync(path.join(dir, AccountsConfig.FILENAME), 'utf8');
    const values = t.parse(AccountsConfigTypes.accountsConfig, yaml.load(buffer));

    const managementAccountEmail =
      values.mandatoryAccounts.find(value => value.name == AccountsConfig.MANAGEMENT_ACCOUNT)?.email ||
      '<management-account>@example.com <----- UPDATE EMAIL ADDRESS';
    const logArchiveAccountEmail =
      values.mandatoryAccounts.find(value => value.name == AccountsConfig.LOG_ARCHIVE_ACCOUNT)?.email ||
      '<log-archive>@example.com  <----- UPDATE EMAIL ADDRESS';
    const auditAccountEmail =
      values.mandatoryAccounts.find(value => value.name == AccountsConfig.AUDIT_ACCOUNT)?.email ||
      '<audit>@example.com  <----- UPDATE EMAIL ADDRESS';

    return new AccountsConfig(
      {
        managementAccountEmail,
        logArchiveAccountEmail,
        auditAccountEmail,
      },
      values,
      dir,
      validateConfig,
    );
  }

  /**
   * Loads account ids by utilizing the organizations client if account ids are
   * not provided in the config.
   */
  public async loadAccountIds(partition: string): Promise<void> {
    if (this.accountIds === undefined) {
      this.accountIds = [];
    }
    if (this.accountIds.length == 0) {
      let organizationsClient: AWS.Organizations;
      if (partition === 'aws-us-gov') {
        organizationsClient = new AWS.Organizations({ region: 'us-gov-west-1' });
      } else if (partition === 'aws-cn') {
        organizationsClient = new AWS.Organizations({ region: 'cn-northwest-1' });
      } else {
        organizationsClient = new AWS.Organizations({ region: 'us-east-1' });
      }

      let nextToken: string | undefined = undefined;
      do {
        const page = await throttlingBackOff(() =>
          organizationsClient.listAccounts({ NextToken: nextToken }).promise(),
        );
        page.Accounts?.forEach(item => {
          if (item.Email && item.Id) {
            this.accountIds?.push({ email: item.Email, accountId: item.Id });
          }
        });
        nextToken = page.NextToken;
      } while (nextToken);
    }
  }

  public getAccountId(name: string): string {
    const email = this.getAccount(name).email;
    const accountId = this.accountIds?.find(item => item.email === email)?.accountId;
    if (accountId) {
      return accountId;
    }
    throw new Error(`Account ID not found for ${name}. \
     Validate that the emails in the parameter ManagementAccountEmail \
     of the AWSAccelerator-InstallerStack and account configs (accounts-config.yaml) \
     match the correct account emails shown in AWS Organizations.`);
  }

  public getAccountIds(): string[] {
    return this.accountIds?.flatMap(item => item.accountId) ?? [];
  }

  public getAccount(name: string): AccountConfig {
    const value = [...this.mandatoryAccounts, ...this.workloadAccounts].find(item => item.name == name);
    if (value) {
      return value;
    }
    throw new Error(`Account name not found for ${name}. \
     Validate that the emails in the parameter ManagementAccountEmail \
     of the AWSAccelerator-InstallerStack and account configs (accounts-config.yaml) \
     match the correct account emails shown in AWS Organizations.`);
  }

  public containsAccount(name: string): boolean {
    const value = [...this.mandatoryAccounts, ...this.workloadAccounts].find(item => item.name == name);
    if (value) {
      return true;
    }

    return false;
  }

  public getAccountIdsFromDeploymentTarget(deploymentTargets: DeploymentTargets): string[] {
    const accountIds: string[] = [];

    for (const ou of deploymentTargets.organizationalUnits ?? []) {
      // debug: processing ou
      if (ou === 'Root') {
        for (const account of this.accountIds ?? []) {
          // debug: accountId
          this._addAccountId(accountIds, account.accountId);
        }
      } else {
        for (const account of [...this.mandatoryAccounts, ...this.workloadAccounts]) {
          if (ou === account.organizationalUnit) {
            const accountId = this.getAccountId(account.name);
            this._addAccountId(accountIds, accountId);
          }
        }
      }
    }

    for (const account of deploymentTargets.accounts ?? []) {
      const accountId = this.getAccountId(account);
      this._addAccountId(accountIds, accountId);
    }

    const excludedAccountIds = this.getExcludedAccountIds(deploymentTargets);
    const filteredAccountIds = accountIds.filter(item => !excludedAccountIds.includes(item));

    return filteredAccountIds;
  }

  public getExcludedAccountIds(deploymentTargets: DeploymentTargets): string[] {
    const accountIds: string[] = [];

    if (deploymentTargets.excludedAccounts) {
      deploymentTargets.excludedAccounts.forEach(account => this._addAccountId(accountIds, this.getAccountId(account)));
    }

    return accountIds;
  }

  public getManagementAccount(): AccountConfig {
    return this.getAccount(AccountsConfig.MANAGEMENT_ACCOUNT);
  }

  public getLogArchiveAccount(): AccountConfig {
    return this.getAccount(AccountsConfig.LOG_ARCHIVE_ACCOUNT);
  }

  public getAuditAccount(): AccountConfig {
    return this.getAccount(AccountsConfig.AUDIT_ACCOUNT);
  }

  public getManagementAccountId(): string {
    return this.getAccountId(AccountsConfig.MANAGEMENT_ACCOUNT);
  }

  public getLogArchiveAccountId(): string {
    return this.getAccountId(AccountsConfig.LOG_ARCHIVE_ACCOUNT);
  }

  public getAuditAccountId(): string {
    return this.getAccountId(AccountsConfig.AUDIT_ACCOUNT);
  }
}
