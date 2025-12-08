+++
date = '2025-09-29T23:06:32+07:00'
# draft = true
title = 'Cost Budget'
weight = 4
[params]
  menuPre = '<i class="fa-solid fa-money-bill-trend-up"></i> '
+++

## Overview

In this session, we will learn how to create and configure an AWS Cost Budget to monitor and manage our AWS spending effectively.

> [!NOTE]
> Cost Budgets are the most common type of AWS Budget, allowing you to set thresholds for your AWS spending and receive alerts when costs exceed or are forecasted to exceed your defined limits.

## How to start

### 1. Navigate Billing and Cost Management

- Sign in to **AWS Console**
- Search and select service **Billing and Cost Management** in the service search bar

### 2. Navigate to the Budgets section

- In the left navigation pane, select **Budgets**
- Click the **Create budget** button

![Create a budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/1-create-budget.png)

### 3. Configure Budget

- Select **Customize (advanced)** for more control over our budget settings
- Under **Budget types**, select **Cost budget**
- Click **Next**

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/2-choose-budget-type.png)

---

### 4. Set up budget

- Enter a descriptive **Budget name** (e.g., *Monthly*)

![Set up budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/3-step2-detail.png)

- For **Period**, select the appropriate time interval:

    - **Daily** for day-to-day monitoring
    - **Monthly** for month-to-month tracking (most common)
    - **Quarterly** for quarterly oversight
    - **Annually** for yearly budget management

- Under **Budget renewal type**:

    - Select **Recurring budget** if you want this budget to continue indefinitely
    - Select **Expiring budget** if you need a one-time budget for a specific timeframe
    > Note that all time zones are in UTC
**
- In the **Specify your monthly budget** section:

    - Choose **Fixed** to set the same budget amount for each period
    - Choose **Monthly Budget Planning** to set different amounts for each period
    - Enter your **Budgeted amount** in your preferred currency

![Set up budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/4-budget-amount.png)

---

- For **Budget scope**, select **All AWS services** to monitor your entire AWS spending, then click **Next**.

![Set up budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/5-budget-amount2.png)

---

### 5. Tags

- We enter some **tags** with **key** and **value** to _filter and manage resource_
- Click **Next**

![Tags](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/6-tag.png)

---

### 6. Configure Alert

- In the **Configure alerts** section, click **Add an alert threshold**, then click **Next**.

![Alert](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/7-alert.png)

---

### 7. Configure your alert settings

- Set the **threshold** percentage (e.g., 80% of actual or forecasted spend)
- Add email recipients who should receive notifications
- Optionally, configure an Amazon SNS topic for programmatic notifications
- Click **Next**

![Threshold](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/8-threshold.png)

---

### 8. Review the budget actions settings

- Review the budget actions settings and click **Next**.

> [!NOTE]
> Budget actions allow you to configure automated responses when a budget threshold is reached, such as applying an IAM policy or targeting specific EC2 or RDS instances.

![Review](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/9-review.png)

---

- Click **Create budget**

![Review](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/10-review2.png)

---

### 9. Verify that your budget has been created successfully

> [!WARNING]
> AWS Budgets relies on billing data that updates approximately every 8-12 hours. There may be a delay between when costs are incurred and when alerts are triggered. For the most critical workloads, consider setting conservative thresholds to account for this delay.

![Confirm](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/11-confirm.png)

---

![Confirm detail](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/02-Cost-Budget/12-view-detail.png)

