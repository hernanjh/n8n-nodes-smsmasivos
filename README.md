# n8n-nodes-smsmasivos

This is an n8n community node. It lets you use [SMS Masivos](https://smsmasivos.com.ar) in your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations organized by resource:

### Resource: SMS

#### Send SMS

Send a single SMS message to a mobile number.

- **Mobile Number**: The recipient's phone number (e.g., 1160330000).
- **Message**: The content of the SMS (max 160 characters).
- **Test Mode**: If enabled, validates the request without sending the SMS.
- **Internal ID**: Optional alphanumeric ID to track the message (max 50 chars).
- **Schedule Date**: Optional date and time to schedule the message (GMT -3). If left empty, sends immediately.

#### Send Bulk SMS

Send multiple SMS messages in a single request (Block Sending).

- **Mobile Number**: Comma, semicolon, or newline separated list of numbers.
- **Message**: Corresponding list of messages, or a single message for all.
- **Internal ID**: Corresponding list of IDs, or a single ID.
- **Test Mode**: Validate without sending.

#### Get Inbound SMS

Retrieve received SMS messages (Inbox).

- **Source Number**: Optional. Filter messages by the sender's phone number.
- **Only Unread**: If true, returns only unread messages.
- **Mark as Read**: If true, marks retrieved messages as read on the server.
- **Include Internal ID**: If true, includes the internal ID associated with the message if available.

### Resource: Utility

#### Get Balance

Retrieve the current account balance (number of credits).

#### Get Sent Count

Retrieve the total number of messages sent by the account.

#### Get Server Date

Get the current date and time from the SMS Masivos server.

#### Check Bulk Status

Check the status of a bulk SMS transmission block.

- **Check By**: Choose how to identify the block:
  - **Internal ID**: Use the internal ID assigned to the block.
  - **Date**: Use the date of the transmission.
- **Only Unread**: If true, returns only unread status reports.
- **Mark as Read**: If true, marks retrieved reports as read.

## Credentials

You need an API Key from SMS Masivos to use this node.

1.  Create a `SMS Masivos API` credential in n8n.
2.  Enter your API Key.

## Compatibility

- n8n v0.1.0+

## License

MIT

## Repository

https://github.com/hernanjh/n8n-nodes-smsmasivos
