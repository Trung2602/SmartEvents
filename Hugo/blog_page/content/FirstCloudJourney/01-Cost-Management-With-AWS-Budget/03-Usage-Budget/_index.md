+++
date = '2025-09-30T12:09:50+07:00'
# draft = true
title = 'Usage Budget'
weight = 5
[params]
  menuPre = '<i class="fa-solid fa-money-bill-trend-up"></i> '
+++

## Overview

In this section, we will learn how to create and configure an AWS Usage Budget to monitor the consumption of specific AWS services based on usage metrics rather than cost.

> [!NOTE]
> While Cost Budgets track your AWS spending in monetary terms, Usage Budgets monitor the actual consumption of AWS resources, such as EC2 compute hours, S3 storage, or data transfer volumes.

## How to start

### 1. Navigate Billing and Cost Management

- Sign in to **AWS Console**
- Search and select service **Billing and Cost Management** in the service search bar

### 2. Navigate to the Budgets section

- In the left navigation pane, select **Budgets**
- Click the **Create budget** button

![Create a budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/01-navigate-budget.png)

### 3. Configure Usage Budget

- Select **Customize (advanced)** for more control over our budget settings
- Under **Budget types**, select **Usage budget**
- Click **Next**

![Configure budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/02-setup-usage-budget.png)

---

### 4. Set up usage budget

- Enter a descriptive **Budget name** (e.g., *Usage budget*)

![Set up budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/03-setup-name-of-usage-budget.png)

---

- For **Budget against**, choose **Usage type groups**
- For **Usage type groups**, select **S3: Data Transfer - Internet (Out)**


![Set up budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/04-setup-type-groups.png)

---

### 5. Configure budget parameters

- Select a **Period** (Daily, Monthly,...)
- Choose a **Budget renewal type** (Recurring or Expiring)
- Select a **Budgeting method** (Fixed or Planned)
- **Enter your budgeted usage amount** (EC2: hours, S3: GB)

![Configure budget parameters](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/05-setup-amount.png)

---

- Review the **Budget scope** settings and fill in **Tags** to manage and click **Next**.

![Configure budget parameters](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/06-setup-scope-tags.png)

---

### 6. Configure budget alert

- In the **Configure alerts** section, click **Add an alert threshold**.

![Configure alert](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/07-setup-alert.png)

---

- Configure your alert settings:
    - Set the **Threshold** percentage
    - Choose **Actual** or **Forecasted** for the alert type
    - Add email recipients who should receive the alert notifications
    - Optionally, configure an Amazon SNS topic for additional notification options

> [!WARNING]
> Usage alerts are based on billing data that updates approximately every 8-12 hours. There may be a delay between when usage occurs and when alerts are triggered.

---

![Configure alert](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/08-setup-alert-2.png)

- After configuring your alert, click **Next**.

---

### 7. Review and create Usage budget

- Click **Create budget**.

![Review and create Usage budget](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/09-review-and-create.png)

---

- You will see a confirmation message that your budget has been successfully created.

![Confirm](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/10-success.png)

---

### 8. Monitor Usage budget health

- After creation, you can monitor your budget’s health in the **Budget details** view

![Monitor](/images/FirstCloudJourney/01-Cost-Management-With-AWS-Budget/03-Usage-Budget/11-budget-health.png)

> [!TIP]
> 💡 **Pro Tip**: Regularly review your usage patterns in the Budget history to identify trends and optimize your resource allocation. Consider setting up multiple usage budgets for different services to gain comprehensive visibility into your AWS consumption.

> [!CAUTION]
> 🔒 **Security Note**: Ensure that only authorized personnel have access to budget information, as it can reveal details about your infrastructure scale and resource allocation.

