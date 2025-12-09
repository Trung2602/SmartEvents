+++
date = '2025-10-01T22:04:59+07:00'
# draft = true
title = 'Reserved Instances Budget'
weight = 6
[params]
  menuPre = '<i class="fa-solid fa-money-bill-trend-up"></i> '
+++

## Overview

In this section, you will learn how to create and configure an AWS Reservation Budget to monitor the utilization and coverage of your Reserved Instances (RIs).

> [!NOTE]
> ℹ️ Information: Reserved Instances provide significant discounts (up to 72%) compared to On-Demand pricing when you commit to a one-year or three-year term for specific AWS resources like EC2 instances, RDS databases, or ElastiCache nodes.


> [!WARNING]
> ⚠️ Warning: This lab is for instructional purposes only. You will not actually purchase a Reserved Instance during this lab since it requires an upfront commitment. The steps below demonstrate the budget creation process without requiring any financial commitment.

## How to start

### 1. Navigate Billing and Cost Management

- Sign in to **AWS Console**
- Search and select service **Billing and Cost Management** in the service search bar

### 2. Navigate to the Budgets section

- In the left navigation pane, select **Budgets**
- Click the **Create budget** button

![Create a budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/01-navigate-budget.png)

---

### 3. Configure Reservation Budget

- Select **Customize (advanced)** for more control over our budget settings
- Under **Budget types**, select **Reservation budget**
- Click **Next**

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/02-choose-reservation-budget.png)

---

### 4. Set up Reservation budget

- Enter a descriptive **Budget name** (e.g., *RI budget*)
- Select a **Period** (Daily, Monthly,...)

- Configure the **Coverage threshold** for your budget

  - Set the percentage threshold that will trigger an alert when your RI coverage falls below this value
  - RI coverage represents the percentage of eligible instance usage that is covered by Reserved Instances

> [!TIP]
> 💡 Pro Tip: A higher coverage threshold (e.g., 80%) will alert you earlier when your workloads aren’t fully covered by RIs, helping you maximize cost savings by purchasing additional RIs when needed.

- Click **Next**

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/03-set-ri-budget.png)

---

- Set  **Budget scope** and **Tags**

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/04-set-tags-ri-budget.png)

---

- Configure your **Alert settings**

    - Add email recipients who should receive the alert notifications
    - Optionally, configure an Amazon SNS topic for additional notification options
  
- Preview and click **Create budget**.

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/05-set-alert-ri-budget.png)

---

- Verify that your budget has been created successfully.

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/04-Reserved-Instances-Budget/06-create-ri-budget-success.png)


> [!INFO]
> ℹ️ Information: AWS Budgets provides two types of RI budgets: RI utilization budgets (tracking how much of your purchased RIs are being used) and RI coverage budgets (tracking what percentage of your eligible usage is covered by RIs). The example above demonstrates an RI coverage budget.

> [!CAUTION]
> 🔒 Security Note: Consider implementing AWS Organizations and consolidated billing to maximize the benefits of Reserved Instances across multiple accounts in your organization.