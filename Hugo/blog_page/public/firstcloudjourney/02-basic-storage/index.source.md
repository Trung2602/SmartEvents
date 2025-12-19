+++
date = '2025-10-11T12:53:29+07:00'
# draft = true
title = 'Basic Storage'
weight = 3
[params]
  menuPre = '<i class="fa-solid fa-warehouse"></i> '
+++


## 1. Type of storage:

### 1.1 Block storage

- Data is stored on a device in **fixed-sized block**.
- Applications and file systems regulate how blocks are accessed, combined and modified.
- Break up data into blocks and then stores those blocks as separate pieces, each with unique identifier.
- They are stored wherever it is most efficient. Thus, it can store those blocks across different systems and each block can be configured to work with different operating systems.

### 1.2 File storage

- File storage is a methodology that help users, applications, and services access data in a shared file system.
- Data is stored in a **hierarchical structure**. This structure is similar to a centralized shared network drive in a company where employees store and access files

### 1.3 Object storage

- Files are stored as **objects** based on attributes and metadata.
- Each object consists of data, metadata and an object key.
- The metadata has information about the data (object size, object purpose and more).
- The object key is the unique identifier of the object. When you update files in object storage, the entire file object is updated, instead of a piece of a file, as in block storage

## 2. Use cases

### 2.1 Block storage: consistent and low-latency performance

- Hosting database instances: SAP HANA. Oracle, SQL,..
- Big data analytics: detach and reattach volumes, resize cluster, persistent, fast storage
- Enterprise applications: high availability and high durability, IOPS

### 2.2 Object storage:

- Disaster recovery
- Data lakes
- Cloud-native applications

## 3. AWS core storage services

| Amazon Elastic Block Store (**EBS**) | Amazon Elastic File System (**EFS**) | Amazon Elastic File System **(S3**) |
| --- | --- | --- |
| - Amazon EBS: scalable, high-performance block-storage service. | - Simple elastic file system, share file data without provisioning or managing storage. | - An object storage service with bucket|
| - Designed for Amazon EC2: create volume and attach to EC2 instances. |- Well suited to support a broad spectrum of use cases: storage for serverless application, web serving and content management, app dev and testing and database backups. | - Bucket is a container for objects |
| - Durable snapshot, 99.99% availability. | - EC2, Containers, AWS lambda, servers mount,… |- data lakes, websites, mobile app, backup and restore, archive, enterprise app, big data|
| - SSD based: General purpose, Provisioned IOPS. 
| - HDD based: Throughput optimized, Cold. |   |    |

## 4. Amazon Simple Storage Solution (S3)

### 4.1 Object storage:

- Objects
- Buckets
- Regions
- Keys

### 4.2 Basic S3 workflow:

- Accept data of all file types
- Less than 5TB

### 4.3 Object-level storage:

- When you store an object in a bucket, the combination of a bucket name, key, and version ID uniquely identifies the objects so that you can interact with that object.

### 4.4 Active and archive storage:

- The two broad categories are active storage and archive storage.
- Active storage is for data that you use all the time. It also includes data that you access less frequently but it is important that the data can be accessed quickly. Ex web static, backup,…
- Archive storage is for data that you rarely access but must be maintained.

## 5. Amazon S3 storage classes

![Screenshot 2025-05-03 at 20.47.35.png](/images/FirstCloudJourney/02-Basic-Storage/Screenshot_2025-05-03_at_20.47.35.png)

| Amazon S3 standard | S3 Standard-Infrequent Access | S3 One Zone-Infrequent Access | S3 Glacier Flexible Retrieval | S3 Glacier Deep Archive | S3 Intelligent-Tiering |
| --- | --- | --- | --- | --- | --- |
| - Default storage class. | - Accessed les frequently but data must be high available upon request | - Accessed les frequently but can be readily recreated if lost | - Archive in 1:5 minutes | - For archive data but are not accessed often | - If you dont know your data access pattern or it is unpredictable |
| - General purpose storage: website and content distribution | --- | --- | - Retrieval few hours | - the default retrieval data time is 12 hours | - Automatically save on storage without operational overhead or impact to performance |
| - Cost effective for frequently accessed data | --- | --- | --- | --- | --- |
| **Use case** | **Use case** | **Use case** | **Use case** | **Use case** | **Use case** |
| - Websites that only include static content | - Backups of your systems | - Storage for cross-Region replication backups from other S3 buckets | - Storage of long term backups or archives for compliance purpose, or for backups that need to be retained for a long period of time | - Archives or datasets that must be retained for compliance purposes | - Unpredictable workloads |
| - Storage for log files that are frequently accessed, reviewed, or have analytics run against them | - Files that are rarely accessed but must be quickly accessed if needed.  | - Off-site storage of copies of on-premises backups, which gives you extra protection for your backups | - Replacement for magnetic tapes stored on-premises or off site | - Long-term data libraries | - Unknown workloads |
| - Storage for application installers, configuration files, and provisioning and deployment tools |  | - Easily replaceable files |  - Digital media asset archive for large media files |  | - Rapidly changing workloads  |

### Case 1: 

A user uploads a video to your application and your application generates a thumbnail preview of the video. Your user agreement permits a user to access the video thumbnail for one year. However, your usage data indicates that most thumbnail previews are not often accessed after 60 days but must be accessed quickly.

> [!NOTE]
> → **Amazon S3 Standard-IA:** using S3-IA gives users quick access to the thumbnail but saves costs. Consider using a lifecycle policy to move the thumbnail into archive storage after 60 days.

### Case 2:

A business wants to implement stronger business continuity practices and keep backups of their data for a long period of time. They do not anticipate needing to access the data often. But they want to be able to have the data within a few hours in the event of disaster recovery.

> [!NOTE]
> → **S3 Glacier Flexible Retrieval:** is a low-cost option for long-term storage. Data can be retrieved in a number of hours with standard retrieval or 1-5 minutes with expedited retrieval.

### Case 3:

A company builds a cloud-native application with Amazon S3 storage for school exams. The application gets some use during the school term but then is used very heavily during the exam season near the end of the term. The application has unpredictable use patterns, and the company is trying to control costs.

> [!NOTE]
> → **S3 Intelligent-Tiering:** should be used when workloads are unpredictable. S3 Intelligent-Tiering will optimize storage costs by automatically moving data to the most cost-effective access tier when access patterns change.

## 6. Amazon S3 costs

![Screenshot 2025-05-03 at 21.27.48.png](/images/FirstCloudJourney/02-Basic-Storage/Screenshot_2025-05-03_at_21.27.48.png)

### 6.1 Amazon EBS key features and benefits

- Data availability: automatically replicated within its AZ. Attach EBS to EC2 instance in same AZ → same hard drive or physical device.
- Data persistence: off-instance storage, pay for the volume usage as long as the data persists. Automatically detach from instance, quick recovery. The volume remains attached throughout the stop-start cycle.
- Data encryption: all EBS volume types support encryption AES-256 and Amazon-managed key infrastructure.
- Data security: EBS volume are presented to you as raw, unformatted block devices. These devices are logical devices that are created on the EBS infrastructure. The Amazon EBS service verifies that the devices are logically empty prior to any use or reuse by a customer.
- Snapshots: back up EBS to S3, snapshots are incremental backups which means that only the blocks on the device that have changed
- Flexibility: which means that you can make changes without service interruptions

### 6.2 Amazon EBS volume types

### SSD:

- General purpose: balance of price and performance suitable for most workloads
    - Transactional workloads
    - Virtual desktops
    - Medium-sized databases
    - Low-latency interactive applications
    - Boot volumes
    - Development and test environments
    
- Provisioned IOPS: high performance for mission-critical, low-latency, or high-throughput workloads
    - Workloads that require sustained IOPS performance.
    - I/O-intensive database workload

### HDD:

- Throughput optimized HDD: low-cost HDD for frequently accessed, throughput-intensive workloads.
    - Big data
    - Data warehouses
    - Log processing
    
- Cold HDD: the lowest-cost HDD design for less frequently accessed workloads.
    - Throughput-oriented storage for data that is infrequently accessed.
    - Scenarios where the lowest storage cost is important.
    

### 6.3 File storage on AWS

- Fully managed: fully managed service, AWS does all (manage files server, storage, updating HW, config sw, performing backups)
- Highly available and durable: 11 9s (99.999 999 999%) durability and 99.99% of availability
- Elastic and scalable: storage capacity is elastic, grows or shrinks..
- Data encryption: AWS key management service (AWS KMS)

### 6.4 Amazon EFS use cases

- Content management
- Media processing workflows
- Shared and home directories
- Database backups
- Developer and application tools
- Big data analytics

## 7. Summary

![Screenshot 2025-05-05 at 22.36.44.png](/images/FirstCloudJourney/02-Basic-Storage/Screenshot_2025-05-05_at_22.36.44.png)

![Screenshot 2025-05-05 at 22.37.18.png](/images/FirstCloudJourney/02-Basic-Storage/Screenshot_2025-05-05_at_22.37.18.png)