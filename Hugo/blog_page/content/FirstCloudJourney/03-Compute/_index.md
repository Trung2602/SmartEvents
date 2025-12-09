+++
date = '2025-10-11T23:54:47+07:00'
# draft = true
title = 'Compute'
weight = 4
[params]
  menuPre = '<i class="fa-solid fa-server"></i> '
+++

## 1. What is computing?

### 1.1 Components

**CPU**:

- Runs and processes the instructions that it is given

**RAM:**

- Stores data that the computer needs to carry out processing tasks
- Temporary storage

**Hard drive:**

- Long-term storage
- Stores the boot files and files that you create

**Network performance**: Measured by

- Bandwidth: the amount of data that can be sent over a specified time
- Latency: How long it takes the data to travel

### 1.2 Benefits of cloud computing

**Save on costs**:

- No upfront costs
- Pay for only what you use
- No data centers to maintain

**Scalable**:

- Scale up or down as needs change
- No need to guess capacity
- Provision resources as needed

**Reliable**:

- Reliable services
- Build for fault tolerance
- Application integrity

## 2. Computing methods

### 2.1 Instances

- An instance, or virtual machine, is a computing resource in the cloud. It works like a traditional on-premises server. It can support workloads such as web hosting, applications, databases, authentication services, and anything else a server can do.
- You choose the operating system (OS), CPU, memory, storage and other components, and in a few minutes, your instance is ready to use.
- As soon as you’re done, you can stop or terminate the instances. You’re not locked in or stuck with servers that you don’t need or want.
- You can treat instances as temporary and disposable computing resources, free from the inflexibility and constraints of a fixed and finite IT infrastructure.
    
### 2.2 Instance use cases:
    
- Hosting environment
- Development and testing environments
- Backup and disaster recovery

### 2.3 Containers

- Containers are method of OS virtualization that you can use to run an application and its dependencies in resource-isolated processes. By using containers, you can package an application’s code, configurations, and dependencies into simple building blocks that deliver environmental consistency, operational efficiency, developer productivity, and version control.
- Containers are smaller than virtual machines and do not contain an entire operating system. Instead, containers share a virtualized OS and run as resource-isolated processes, which ensure quick, reliable, and consistent deployments. Containers hold everything that the software needs to run, such as libraries, system tools, code, and the runtime.
    
### 2.4 Container use cases:
    
- Building microservices architecture
- Video rendering services
- Quick development and deployment

### 2.5 Serverless

- Serverless computing gives you the ability to run code without provisioning or managing servers. Serverless computing features automatic scaling, built-in high availability, and a pay-for-use billing model to increase agility and optimize costs.
- Serverless also eliminates infrastructure management tasks like capacity provisioning and patching, so you can focus on writing code that servers your customers.
    
### 2.6 Serverless use cases

- File processing
- Web applications
- Mobile backends
- Cron jobs (scheduled computing tasks)

### 2.7 Hybrid

- In a hybrid deployment, cloud-based resources are connected to on-premises infrastructure. You might want to use this approach in a number of situations. For example, you have legacy applications that are better maintained on premises, or government regulations require your business to keep certain records on premises.
- For example, suppose that a company wants to use cloud services that can automate batch data processing and analytics. However, the company has several legacy applications that are more suitable on premises and will not be migrated to the cloud. With a hybrid deployment, the company could keep the legacy applications on premises while benefiting from the data and analytics services that run in the cloud.
    
### 2.8 Hybrid use cases:

- Legacy applications
- Company regulatory requirements
- Government regulatory requirements

## 3. AWS computing services

![Screenshot 2025-05-06 at 11.00.15.png](/images/FirstCloudJourney/03-Compute/Screenshot_2025-05-06_at_11.00.15.png)

### 3.1. Amazon EC2

- Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure and resized compute capacity in the cloud. You can use it to provision virtual servers that are called Amazon EC2 instances, which can handle almost any computing need.
- With EC2 you can do the following:
    - Provision and launch one or more EC2 instances in minutes.
    - Stop or shutdown EC2 instances when you finish running a workload.
    - Pay for only the compute time that you use when running an instance.

### 3.2. AWS Lambda

- AWS lambda is a serverless compute service that helps you run code without provisioning or managing servers. You pay for only the compute time you consume, and you incur no charges when your code isn’t running.
- With Lambda, you can run code for virtually any type of application or backend service, all with zero administration. You need only to upload your code, and Lambda manages everything required to run and scale your code with high availability. You can set up your code to automatically launch from other AWS services or call it directly from any web or mobile app.

### 3.3. Amazon ECS

- Amazon Elastic Container Service (Amazon ECS) is a highly scalable and high-preformance container management system. It helps customers create new containers and manage them across EC2 instances. Amazon ECS supports Docker containers. Docker is a software platform that packages software (such as applications) into containers.
- To manage your containers, you must install an open-source Amazon ECS container agent on your EC2 instances. This agent is referred to as a container instance. You can run this agent on both Linux and Windows Amazon Machine Images (AMIs). Amazon ECS uses API calls to control Docker-enabled applications.

### 3.4. Amazon EKS

- Amazon Elastic Kubernetes Service (Amazon EKS) provides the flexibility to start, run, and scale Kubernetes applications in the AWS Cloud or on premises. Kubernetes is an open-source platform for managing containerized applications. It is portable and extensible.
- With Amazon EKS, you can provide highly available and secure clusters. It automates patching, node provisioning, and updates.

### 3.5. AWS Fargate

- AWS Fragate is a serverless compute engine for containers. It supports both Amazon ECS and Amazon EKS architectures. Fargate allocates the right amount of compute, which reduces the need to manage EC2 instances, cluster capacity, and scaling.

### 3.6. AWS Elastic Beanstalk

- AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications. You can upload your code, and Elastic Beanstalk automatically handles the deployments, from capacity provisioning, load balancing, auto-scaling to application health monitoring. At the same time, you retain full control over the AWS resources powering your application and can access the underlying resources at any time.
- There’s no additional charge for Elastic Beanstalk; you pay for only the AWS resources needed to store and run your applications.