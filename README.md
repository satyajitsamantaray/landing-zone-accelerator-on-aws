- [Landing Zone Accelerator on AWS](#landing-zone-accelerator-on-aws)
  - [Included Services, Features, and Configuration References](#included-services-features-and-configuration-references)
    - [Account Configuration](#account-configuration)
    - [Global Configuration](#global-configuration)
    - [Identity and Access Management (IAM) Configuration](#identity-and-access-management-iam-configuration)
    - [Network Configuration](#network-configuration)
    - [AWS Organizations Configuration](#aws-organizations-configuration)
    - [Security Configuration](#security-configuration)
    - [Customization Configuration](#customization-configuration)
    - [Other Services and Features](#other-services-and-features)
  - [Package Structure](#package-structure)
    - [@aws-accelerator/accelerator](#aws-acceleratoraccelerator)
    - [@aws-accelerator/config](#aws-acceleratorconfig)
    - [@aws-accelerator/constructs](#aws-acceleratorconstructs)
    - [@aws-accelerator/installer](#aws-acceleratorinstaller)
    - [@aws-accelerator/ui (future)](#aws-acceleratorui-future)
    - [@aws-accelerator/utils](#aws-acceleratorutils)
    - [@aws-cdk-extensions/cdk-extensions](#aws-cdk-extensionscdk-extensions)
    - [@aws-cdk-extensions/tester](#aws-cdk-extensionstester)
  - [Creating an Installer Stack](#creating-an-installer-stack)
    - [1. Build the Installer stack for deployment](#1-build-the-installer-stack-for-deployment)

# Landing Zone Accelerator on AWS

The Landing Zone Accelerator on AWS solution helps you quickly deploy a secure,
resilient, scalable, and fully automated cloud foundation that accelerates your
readiness for your cloud compliance program. A landing zone is a cloud
environment that offers a recommended starting point, including default
accounts, account structure, network and security layouts, and so forth. From a
landing zone, you can deploy workloads that utilize your solutions and
applications.

The Landing Zone Accelerator (LZA) is architected to align with AWS best
practices and in conformance with multiple, global compliance frameworks. When
used in coordination with services such as AWS Control Tower, the Landing Zone
Accelerator provides a comprehensive no-code solution across 35+ AWS services to
manage and govern a multi-account environment built to support customers with
highly-regulated workloads and complex compliance requirements. The LZA helps
you establish platform readiness with security, compliance, and operational
capabilities.

This solution is provided as an open-source project that is built using the AWS
Cloud Development Kit (CDK). You install directly into your environment giving
you full access to the infrastructure as code (IaC) solution. Through a
simplified set of configuration files, you are able to configure additional
functionality, guardrails and security services (eg. AWS Managed Config Rules,
and AWS SecurityHub), manage your foundational networking topology (eg. VPCs,
Transit Gateways, and Network Firewall), and generate additional workload
accounts using the AWS Control Tower Account Factory.

There are no additional charges or upfront commitments required to use Landing
Zone Accelerator on AWS. You pay only for AWS services enabled in order to set
up your platform and operate your guardrails. This solution can also support
non-standard AWS partitions, including AWS GovCloud (US), and the US Secret and
Top Secret regions.

For an overview and solution deployment guide, please visit
[Landing Zone Accelerator on AWS](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/)

---

IMPORTANT: This solution will not, by itself, make you compliant. It provides
the foundational infrastructure from which additional complementary solutions
can be integrated. The information contained in this solution implementation
guide is not exhaustive. You must be review, evaluate, assess, and approve the
solution in compliance with your organization’s particular security features,
tools, and configurations. It is the sole responsibility of you and your
organization to determine which regulatory requirements are applicable and to
ensure that you comply with all requirements. Although this solution discusses
both the technical and administrative requirements, this solution does not help
you comply with the non-technical administrative requirements.

---

This solution collects anonymous operational metrics to help AWS improve the
quality of features of the solution. For more information, including how to
disable this capability, please see the [implementation guide](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/collection-of-operational-metrics.html).

---

## Included Services, Features, and Configuration References

### Account Configuration
Used to manage all of the AWS accounts within the AWS Organization. Adding a new account configuration to **accounts-config.yaml** will invoke the account creation process from Landing Zone Accelerator on AWS. 

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS Accounts | Account | [AccountsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AccountsConfig) | [AccountConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AccountConfig.html) / [GovCloudAccountConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GovCloudAccountConfig.html) | Define commercial or GovCloud (US) accounts to be deployed by the accelerator. |

### Global Configuration
Used to manage all of the global properties that can be inherited across the AWS Organization. Defined in **global-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS Backup | Backup Vaults | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) | [BackupConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.BackupConfig.html) | Define AWS Backup Vaults that can be used to store backups in accounts across the AWS Organization. |
| AWS Budgets | Budget Reports | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [ReportConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ReportConfig.html) | [BudgetReportConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.BudgetReportConfig.html) | Define Budget report configurations for account(s) and/or organizational unit(s). |
| AWS CloudTrail | Organization and Account Trails | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [LoggingConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.LoggingConfig.html) | [CloudTrailConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CloudTrailConfig.html) | When specified, Organization and/or account-level trails are deployed. | 
| Amazon CloudWatch | Log Group Dynamic Partitioning | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [LoggingConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.LoggingConfig.html) | [CloudWatchLogsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CloudTrailConfig.html) | Custom partition values for CloudWatch Log Groups sent to centralized logging S3 bucket. | 
| AWS Control Tower | Control Tower | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) | [ControlTowerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ControlTowerConfig.html) | It is recommended that AWS Control Tower is enabled, if available, in the desired home region for your environment prior to installing the accelerator. When enabled, the accelerator will integrate with resources and guardrails deployed by AWS Control Tower. |
| AWS Cost and Usage | Cost and Usage Report | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [ReportConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ReportConfig.html) | [CostAndUsageReportConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CostAndUsageReportConfig.html) | Define a global Cost and Usage report configuration for the AWS Organization. |
| Amazon S3 | Lifecycle Rules | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [LoggingConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.LoggingConfig.html) | [AccessLogBucketConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AccessLogBucketConfig.html) / [CentralLogBucketConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralLogBucketConfig.html) | Define global lifecycle rules for S3 access log buckets and the central log bucket deployed by the accelerator. | 
| AWS Systems Manager Session Manager | Session Manager logging configuration | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) / [LoggingConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.LoggingConfig.html) | [SessionManagerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SessionManagerConfig.html) | Define global logging configuration settings for Session Manager. |
AWS SNS Topics | SNS Topics Configuration | [GlobalConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GlobalConfig.html) | [SnsTopicConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SnsTopicConfig.html) | Define SNS topics for notifications.

### Identity and Access Management (IAM) Configuration
Used to manage all of the IAM resources across the AWS Organization. Defined in **iam-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS IAM | Users | [IamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamConfig.html) | [UserSetConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.UserSetConfig.html) | Define IAM users to be deployed to specified account(s) and/or organizational unit(s). | 
| AWS IAM | Groups | [IamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamConfig.html) | [GroupSetConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GroupSetConfig.html) | Define IAM groups to be deployed to specified account(s) and/or organizational unit(s). | 
| AWS IAM | Policies | [IamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamConfig.html) | [PolicySetConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.PolicySetConfig.html) | Define customer-managed IAM policies to be deployed to specified account(s) and/or organizational unit(s). | 
| AWS IAM | Roles | [IamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamConfig.html) | [RoleSetConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.RoleSetConfig.html) | Define customer-managed IAM roles to be deployed to specified account(s) and/or organizational unit(s). | 
| AWS IAM | SAML identity providers | [IamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamConfig.html) | [SamlProviderConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SamlProviderConfig.html) | Define a SAML identity provider to allow federated IAM access to the AWS Organization. | 

### Network Configuration
Used to manage and implement network resources to establish a WAN/LAN architecture to support cloud operations and application workloads in AWS. Defined in **network-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| Delete Default Amazon VPC | Default VPC | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [DefaultVpcsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.DefaultVpcsConfig.html) | If enabled, deletes the default VPC in each account and region managed by the accelerator. |
| AWS Direct Connect | Gateways, virtual interfaces, and gateway associations | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [DxGatewayConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.DxGatewayConfig.html) | Define Direct Connect gateways, virtual interfaces, and Direct Connect Gateway associations. |
| Amazon Elastic Load Balancing | Gateway Load Balancers, endpoint services, and endpoints  | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) / [CentralNetworkServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralNetworkServicesConfig) | [GwlbConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GwlbConfig.html) | Define a centrally-managed Gateway Load Balancer with an associated VPC endpoint service. Define Gateway Load Balancer endpoints that consume the service, allowing for deep packet inspection of workloads. |
| AWS Network Firewall | Network Firewalls, policies, and rule groups | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) / [CentralNetworkServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralNetworkServicesConfig) | [NfwConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NfwConfig.html) | Define centrally-managed firewall rule groups and policies. Define Network Firewall endpoints that consume the policies, allowing for deep packet inspection of workloads. |
| Amazon Route 53 Resolver | Resolver endpoints, rules, DNS firewall rule groups, and query logging configurations | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) / [CentralNetworkServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralNetworkServicesConfig) | [ResolverConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ResolverConfig.html) | Define centrally-managed Resolver endpoints, Resolver rules, DNS firewall rule groups, and query logging configurations. DNS firewall rule groups, Resolver rules, and query logging configurations can be associated to VPCs defined in [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html) / [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html). |
| AWS Site-to-Site VPN | Customer gateways and VPN connections | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [CustomerGatewayConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomerGatewayConfig.html) | Define Customer gateways and VPN connections that terminate on Transit Gateways or Virtual Private Gateways. |
| AWS Transit Gateway | Transit Gateways and Transit Gateway route tables | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [TransitGatewayConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.TransitGatewayConfig.html) | Define Transit Gateways to deploy to a specified account and region in the AWS Organization. |
| AWS Transit Gateway | Transit Gateway peering connections | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [TransitGatewayPeeringConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.TransitGatewayConfig.html) | Create Transit Gateway peering connections between two Transit Gateways defined in [TransitGatewayConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.TransitGatewayPeeringConfig.html). |
| Amazon VPC | Customer-managed prefix lists | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [PrefixListConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.PrefixListConfig.html) | Define customer-managed prefix lists to deploy to account(s) and region(s) in the AWS Organization. Prefix lists can be referenced in place of CIDR ranges in subnet route tables, security groups, and Transit Gateway route tables. |
| Amazon VPC | DHCP options sets | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [DhcpOptsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.DhcpOptsConfig.html) | Define custom DHCP options sets to deploy to account(s) and region(s) in the AWS Organization. DHCP options sets can be used by VPCs defined in [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html) / [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html). |
| Amazon VPC | Flow Logs (global) | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [VpcFlowLogsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcFlowLogsConfig.html) | Define a global VPC flow log configuration for VPCs deployed by the accelerator. VPC-specific flow logs can also be created in [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html) / [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html). |
| Amazon VPC | VPCs, subnets, security groups, NACLs, route tables, NAT Gateways, and VPC endpoints  | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html) | Define VPCs to deploy to a specified account and region in the AWS Organization. |
| Amazon VPC | VPC endpoint policies | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [EndpointPolicyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.EndpointPolicyConfig.html) | Define custom VPC endpoint policies to deploy to account(s) and region(s) in the AWS Organization. Endpoint policies can be used by interface endpoints and/or gateway endpoints defined in [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html) / [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html). |
| Amazon VPC | VPC peering connections | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [VpcPeeringConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcPeeringConfig.html) | Create a peering connection between two VPCs defined in [VpcConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcConfig.html). **NOTE:** Not supported with VPCs deployed using [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html). |
| Amazon VPC IP Address Manager (IPAM) | IPAM pools and scopes  | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) / [CentralNetworkServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralNetworkServicesConfig) | [IpamConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IpamConfig.html) | Enable IPAM delegated administrator and configuration settings for IPAM pools and scopes. **NOTE:** IPAM is required for VPCs and subnets configured to use dynamic IPAM CIDR allocations. |
| Amazon VPC Templates | VPCs, subnets, security groups, NACLs, route tables, NAT Gateways, and VPC endpoints | [NetworkConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkConfig.html) | [VpcTemplatesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.VpcTemplatesConfig.html) | Deploys a standard-sized VPC to multiple defined account(s) and/or organizational unit(s). |

### AWS Organizations Configuration
Used to manage organizational units and policies in the AWS Organization. Defined in **organization-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS Account Quarantine | Quarantine | [OrganizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationConfig.html) | [QuarantineNewAccountsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.QuarantineNewAccountsConfig.html) | If enabled, a Service Control Policy (SCP) is applied to newly-created accounts that denies all API actions from principles outside of the accelerator. This SCP is stripped from the new account when the accelerator completes resource provisioning for the new account. |
| AWS Organizations | Backup Policies | [OrganizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationConfig.html) | [BackupPolicyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.BackupPolicyConfig.html) | Define organizational backup policies to be deployed to account(s) and/or organizational unit(s). |
| AWS Organizations | Organizational Units | [OrganizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationConfig.html) | [OrganizationalUnitConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationalUnitConfig.html) | Define organizational units (OUs) for the AWS Organization. **NOTE:** When using AWS Control Tower, OUs must be registered in the Control Tower console prior to defining them in the configuration. |
| AWS Organizations | Service Control Policies (SCPs) | [OrganizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationConfig.html) | [ServiceControlPolicyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ServiceControlPolicyConfig.html) | Define organizational service control policies to be deployed to account(s) and/or organizational unit(s). |
| AWS Organizations | Tag Policies | [OrganizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.OrganizationConfig.html) | [TaggingPolicyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.TaggingPolicyConfig.html) | Define organizational tag policies to be deployed to account(s) and/or organizational unit(s). |

### Security Configuration
Used to manage configuration of AWS security services. Defined in **security-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS Audit Manager | Audit Manager | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [AuditManagerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AuditManagerConfig.html) | Enable Audit Manager delegated administrator and configuration settings. |
| Amazon CloudWatch | Metrics and Alarms | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) | [CloudWatchConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CloudWatchConfig.html) | Define CloudWatch metrics and alarms to deploy into account(s) and/or organizational unit(s). |
| AWS Config | Config Recorder, Delivery Channel, Rules, and Remediations | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) | [AwsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AwsConfig.html) | Define an AWS Config Recorder, Delivery Channel, and custom and/or managed rule sets to deploy across the AWS Organization. |
| Amazon Detective | Detective | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [DetectiveConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.DetectiveConfig.html) | Enable Detective delegated administrator and configuration settings. **Note:** Requires Amazon GuardDuty to be enabled for at least 48 hours. |
| Amazon EBS | Default Volume Encryption | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [EbsDefaultVolumeEncryptionConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.EbsDefaultVolumeEncryptionConfig.html) | Enable EBS default volume encryption across the AWS Organization. |
| Amazon GuardDuty | GuardDuty | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [GuardDutyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.GuardDutyConfig.html) | Enable GuardDuty delegated administrator and configuration settings. |
| AWS IAM | Access Analyzer | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) | [AccessAnalyzerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AccessAnalyzerConfig.html) | If enabled, IAM Access Analyzer analyzes policies and reports a list of findings for resources that grant public or cross-account access from outside your AWS Organizations in the IAM console and through APIs. |
| AWS IAM | Password Policy | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) | [IamPasswordPolicyConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.IamPasswordPolicyConfig.html) | Define a password policy for IAM users in the AWS Organization. |
| AWS KMS | Customer-Managed Keys | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) | [KeyManagementServiceConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.KeyManagementServiceConfig.html) | Define customer-managed KMS keys to be deployed to account(s) and/or organizational unit(s). |
| Amazon Macie | Macie | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [MacieConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.MacieConfig.html) | Enable Macie delegated administrator and configuration settings. |
| Amazon S3 | S3 Public Access Block | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [S3PublicAccessBlockConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.S3PublicAccessBlockConfig.html) | Enable S3 public access block setting across the AWS Organization. |
| AWS Security Hub | Security Hub | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [SecurityHubConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityHubConfig.html) | Enable Security Hub delegated administrator and configuration settings. |
| Amazon SNS | Subscriptions | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [SnsSubscriptionConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SnsSubscriptionConfig.html) | Configure email subscriptions for security-related SNS notifications. **NOTE:** **DEPRECATED** Use SnsTopicConfig in the global configuration instead.|
| AWS Systems Manager Automation | Automation Documents | [SecurityConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SecurityConfig.html) / [CentralSecurityServicesConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CentralSecurityServicesConfig.html) | [SsmAutomationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.SsmAutomationConfig.html) | Define SSM Automation Documents to be deployed to account(s) and/or organizational unit(s). |

### Customization Configuration
Used to manage configuration of custom applications and CloudFormation stacks. Defined in the optional file **customizations-config.yaml**.

| Service / Feature | Resource | Base Configuration | Service / Feature Configuration | Details |
| --- | --- | --- | --- | --- |
| AWS CloudFormation | Stacks | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [CustomizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationConfig.html) | [CloudFormationStackConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CloudFormationStackConfig.html) | Define custom CloudFormation Stacks. |
| AWS CloudFormation | StackSets | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [CustomizationConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationConfig.html) | [CloudFormationStackSetConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CloudFormationStackSetConfig.html) | Define custom CloudFormation Stacksets. |
| Amazon Elastic Load Balancing | Application Load Balancers | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [AppConfigItem](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AppConfigItem.html) | [ApplicationLoadBalancerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.ApplicationLoadBalancerConfig) | Define an Application Load Balancer to be used for a custom application. |
| Amazon Elastic Load Balancing | Network Load Balancers  | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [AppConfigItem](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AppConfigItem.html) | [NetworkLoadBalancerConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.NetworkLoadBalancerConfig) | Define a Network Load Balancer to be used for a custom application. |
| Amazon Elastic Load Balancing | Target Groups  | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [AppConfigItem](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AppConfigItem.html) | [TargetGroupItemConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.TargetGroupItemConfig) | Define a Target Group to be used with an Elastic Load Balancer. |
| Amazon EC2 | Autoscaling Groups  | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [AppConfigItem](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AppConfigItem.html) | [AutoScalingConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AutoScalingConfig) | Define an autoscaling group to be used for a custom application. |
| Amazon EC2 | Launch Template  | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html) / [AppConfigItem](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.AppConfigItem.html) | [LaunchTemplateConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.LaunchTemplateConfig) | Define a launch template to be used for a custom application. |
| Amazon EC2 | Next-generation firewalls (standalone or autoscaling) and firewall management appliances | [CustomizationsConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.CustomizationsConfig.html)  | [Ec2FirewallConfig](https://awslabs.github.io/landing-zone-accelerator-on-aws/classes/_aws_accelerator_config.Ec2FirewallConfig.html) | Define third-party EC2-based firewall appliances. |


### Other Services and Features
Other mandatory and non-configurable services/features deployed by the solution are described in the [Architecture overview](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/architecture-overview.html) and [Architecture details](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/architecture-details.html) section of the solution [Implementation Guide](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/solution-overview.html).

---
## Package Structure

### @aws-accelerator/accelerator

A CDK Application. The core of the accelerator solution. Contains all the stack
definitions and deployment pipeline for the accelerator. This also includes the
CDK Toolkit orchestration.

### @aws-accelerator/config

A pure typescript library containing modules to manage the accelerator config
files.

### @aws-accelerator/constructs

Contains L2/L3 constructs that have been built to support accelerator actions,
such as creating an AWS Organizational Unit or VPC. These constructs are
intended to be fully reusable, independent of the accelerator, and do not
directly access the accelerator configuration files. Example: CentralLogsBucket,
an S3 bucket that is configured with a CMK with the proper key and bucket
policies to allow services and accounts in the organization to publish logs to
the bucket.

### @aws-accelerator/installer

Contains a CDK Application that defines the accelerator Installer stack.

### @aws-accelerator/ui (future)

A web application that utilizes the aws-ui-components library to present a
console to configure the accelerator

### @aws-accelerator/utils

Contains common utilities and types that are needed by @aws-accelerator/\*
packages. For example, throttling and backoff for AWS SDK calls

### @aws-cdk-extensions/cdk-extensions

Contains L2 constructs that extend the functionality of the CDK repo. The CDK
repo is an actively developed project. As the accelerator team identifies
missing features of the CDK, those features will be initially developed locally
within this repo and submitted to the CDK project as a pull request.

### @aws-cdk-extensions/tester

Accelerator tester CDK app. This package creates AWS Config custom rules for every test cases defined in test case manifest file.

---                                                                                                                                                 |

## Creating an Installer Stack

The Installer Stack, a CDK Application, can be deployed through a CloudFormation template produced by your CLI by
navigating to the directory for the installer and running a CDK synthesis. The template can either be deployed
directly via the AWS CLI or console. Below are the commands for completing the deployment of the Installer stack.

### 1. Build the Installer stack for deployment

- To run the CDK synthesis

```
cd <rootDir>/source/packages/@aws-accelerator/installer
yarn cdk synth
```

- Configure the AWS CLI CloudFormation command for the Installer stack

```
aws cloudformation create-stack --stack-name AWSAccelerator-InstallerStack --template-body file://cdk.out/AWSAccelerator-InstallerStack.template.json \
--parameters ParameterKey=RepositoryName,ParameterValue=<Repository_Name> \
ParameterKey=RepositoryBranchName,ParameterValue=<Branch_Name> \
ParameterKey=AcceleratorQualifier,ParameterValue=<Accelerator_Qualifier> \
ParameterKey=ManagementAccountId,ParameterValue=<Management_Id> \
ParameterKey=ManagementAccountEmail,ParameterValue=<Management_Email> \
ParameterKey=ManagementAccountRoleName,ParameterValue= \
ParameterKey=LogArchiveAccountEmail,ParameterValue=<LogArchive_Email> \
ParameterKey=AuditAccountEmail,ParameterValue=<Audit_Email> \
ParameterKey=EnableApprovalStage,ParameterValue=Yes
ParameterKey=ApprovalStageNotifyEmailList,ParameterValue=comma-delimited-notify-emails
--capabilities CAPABILITY_IAM
```

- Alternate deployment of CloudFormation via AWS console:

```
- Navigate to CloudFormation page in the AWS console
- Select ‘Create Stack’ and from the dropdown pick ‘with new resources (standard)’
- For the prerequisite template, select ‘Template is ready’
- When specifying the template, select ‘Upload a template file’
- Ensure that you select the correct file ‘AWSLandingZoneAccelerator-InstallerStack.template.json’
- Fill out the required parameters in the UI, and create the stack once the parameters are inputted.
```

- Dependencies for the Installer stack

```
- [Node](https://nodejs.org/en/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [Yarn](https://yarnpkg.com/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
```

---

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://www.apache.org/licenses/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
